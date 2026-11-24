import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { isDeepStrictEqual } from "node:util";
import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import { parse as parseYaml } from "yaml";
import {
	type DocumentSource,
	documentRecord,
	documentRkeys,
	documentUri,
	publicationRecord,
	publicationUri,
	standardSite,
} from "../src/lib/standardSite";

const POSTS_DIRECTORY = "src/content/posts";
const PDS = process.env.ATPROTO_PDS ?? "https://selfhosted.social";
const IDENTIFIER =
	process.env.ATPROTO_IDENTIFIER ?? new URL(standardSite.url).hostname;
const APP_PASSWORD = process.env.ATPROTO_APP_PASSWORD;
const DRY_RUN = process.argv.includes("--dry-run");

function htmlToText(html: string): string {
	const namedEntities: Record<string, string> = {
		amp: "&",
		apos: "'",
		gt: ">",
		lt: "<",
		nbsp: " ",
		quot: '"',
	};
	return html
		.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, " ")
		.replace(/<\/(?:p|div|li|h[1-6]|blockquote|pre|tr)>/gi, "\n\n")
		.replace(/<br\s*\/?>/gi, "\n")
		.replace(/<[^>]+>/g, "")
		.replace(/&(#\d+|#x[\da-f]+|[a-z]+);/gi, (match, entity: string) => {
			if (entity.startsWith("#")) {
				const code =
					entity[1]?.toLowerCase() === "x"
						? Number.parseInt(entity.slice(2), 16)
						: Number.parseInt(entity.slice(1), 10);
				return Number.isNaN(code) ? match : String.fromCodePoint(code);
			}
			return namedEntities[entity.toLowerCase()] ?? match;
		})
		.replace(/[ \t]+\n/g, "\n")
		.replace(/\n{3,}/g, "\n\n")
		.trim();
}

function frontmatterString(
	data: Record<string, unknown>,
	field: string,
	file: string,
): string {
	const value = data[field];
	if (typeof value !== "string" || value.trim() === "") {
		throw new Error(
			`${file}: frontmatter "${field}" must be a non-empty string`,
		);
	}
	return value;
}

async function readPosts(): Promise<DocumentSource[]> {
	const processor = await createMarkdownProcessor({
		smartypants: false,
		syntaxHighlight: false,
	});
	const files = (await readdir(POSTS_DIRECTORY))
		.filter((name) => name.endsWith(".md"))
		.sort();
	const posts = await Promise.all(
		files.map(async (file) => {
			const source = await readFile(join(POSTS_DIRECTORY, file), "utf8");
			const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(source);
			if (!frontmatter) throw new Error(`${file}: missing frontmatter`);
			const data = parseYaml(frontmatter[1]) as Record<string, unknown> | null;
			if (!data) throw new Error(`${file}: empty frontmatter`);
			const date = new Date(String(data.date));
			if (Number.isNaN(date.getTime())) {
				throw new Error(`${file}: frontmatter "date" is not a valid date`);
			}
			const { code } = await processor.render(
				source.slice(frontmatter[0].length),
			);
			return {
				id: file.slice(0, -3),
				title: frontmatterString(data, "title", file),
				description: frontmatterString(data, "description", file),
				date,
				textContent: htmlToText(code),
			};
		}),
	);
	return posts.sort((a, b) => a.date.getTime() - b.date.getTime());
}

async function xrpc(path: string, init: RequestInit = {}): Promise<unknown> {
	const response = await fetch(`${PDS}/xrpc/${path}`, init);
	const text = await response.text();
	let body: unknown = null;
	try {
		body = text ? JSON.parse(text) : null;
	} catch {
		body = text;
	}
	if (!response.ok) {
		const message =
			body && typeof body === "object" && "message" in body
				? String(body.message)
				: response.statusText;
		throw new Error(`${path}: ${response.status} ${message}`);
	}
	return body;
}

async function getExistingRecord(
	collection: string,
	rkey: string,
): Promise<{ value: unknown } | null> {
	const url = new URL(`${PDS}/xrpc/com.atproto.repo.getRecord`);
	url.searchParams.set("repo", standardSite.did);
	url.searchParams.set("collection", collection);
	url.searchParams.set("rkey", rkey);
	const response = await fetch(url);
	if (response.status === 400) {
		const body = (await response.json()) as { error?: string };
		if (body.error === "RecordNotFound") return null;
		throw new Error(
			`getRecord ${collection}/${rkey}: ${body.error ?? response.statusText}`,
		);
	}
	if (!response.ok) {
		throw new Error(
			`getRecord ${collection}/${rkey}: ${response.status} ${response.statusText}`,
		);
	}
	return (await response.json()) as { value: unknown };
}

async function putRecord(
	collection: string,
	rkey: string,
	record: unknown,
	accessJwt: string,
): Promise<"created" | "updated" | "unchanged"> {
	const existing = await getExistingRecord(collection, rkey);
	if (existing && isDeepStrictEqual(existing.value, record)) return "unchanged";
	await xrpc("com.atproto.repo.putRecord", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${accessJwt}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			repo: standardSite.did,
			collection,
			rkey,
			record,
		}),
	});
	return existing ? "updated" : "created";
}

async function login(): Promise<string> {
	if (!APP_PASSWORD) {
		throw new Error(
			"Set ATPROTO_APP_PASSWORD to an app password for the account.",
		);
	}
	const session = (await xrpc("com.atproto.server.createSession", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ identifier: IDENTIFIER, password: APP_PASSWORD }),
	})) as { accessJwt: string; did: string };
	if (session.did !== standardSite.did) {
		throw new Error(
			`Signed in as ${session.did}, but the site publishes under ${standardSite.did}.`,
		);
	}
	return session.accessJwt;
}

if (process.argv.includes("--help")) {
	console.log(`Publish the site as site.standard records.

Usage: ATPROTO_APP_PASSWORD=... bun run publish:standardSite [--dry-run]

Environment:
  ATPROTO_APP_PASSWORD  App password for the account (required)
  ATPROTO_IDENTIFIER    Handle or DID to sign in as (default: llia.cc)
  ATPROTO_PDS           PDS base URL (default: https://selfhosted.social)`);
	process.exit(0);
}

const posts = await readPosts();
const rkeys = documentRkeys(posts);
const wellKnown = (
	await readFile("public/.well-known/site.standard.publication", "utf8")
).trim();
if (wellKnown !== publicationUri) {
	throw new Error(
		`public/.well-known/site.standard.publication contains ${wellKnown}, expected ${publicationUri}`,
	);
}

if (DRY_RUN) {
	console.log(
		JSON.stringify(
			{
				publication: {
					rkey: standardSite.publicationRkey,
					record: publicationRecord(),
				},
				documents: posts.map((post) => ({
					rkey: rkeys.get(post.id),
					record: documentRecord(post),
				})),
			},
			null,
			2,
		),
	);
	process.exit(0);
}

const accessJwt = await login();
console.log(
	`publication ${await putRecord("site.standard.publication", standardSite.publicationRkey, publicationRecord(), accessJwt)} ${publicationUri}`,
);
for (const post of posts) {
	const rkey = rkeys.get(post.id);
	if (!rkey) throw new Error(`Missing document key for ${post.id}`);
	const outcome = await putRecord(
		"site.standard.document",
		rkey,
		documentRecord(post),
		accessJwt,
	);
	console.log(`document ${outcome} ${documentUri(rkey)} ${post.id}`);
}
