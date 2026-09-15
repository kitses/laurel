import { createMarkdownProcessor } from "@astrojs/markdown-remark";
import rehypeExternalLinks from "rehype-external-links";
import { getCollection } from "astro:content";

const xmlEscape = (value: string) =>
	value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;");

export async function GET(context) {
	const processor = await createMarkdownProcessor({
		smartypants: false,
		syntaxHighlight: false,
		rehypePlugins: [
			[rehypeExternalLinks, { rel: ["noopener"], target: false }],
		],
	});
	const posts = (await getCollection("posts")).sort(
		(a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
	);
	const site = context.site;
	const feedUrl = new URL("feed.xml", site);
	const entries = await Promise.all(
		posts.map(async (post) => {
			const url = new URL(`posts/${post.id}`, site);
			const content = await processor.render(post.body ?? "");
			return { post, url, html: content.code };
		}),
	);
	const updated = entries[0]?.post.data.date ?? new Date();

	const xml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
	<title>Laurel</title>
	<subtitle>A plural system of musicians, graphic designers, developers, and creatures.</subtitle>
	<link rel="self" href="${feedUrl}"/>
	<link href="${site}"/>
	<id>${site}</id>
	<updated>${updated.toISOString()}</updated>
${entries
	.map(
		({ post, url, html }) =>
			`	<entry>
		<title>${xmlEscape(post.data.title)}</title>
		<link href="${url}"/>
		<id>${url}</id>
		<published>${post.data.date.toISOString()}</published>
		<updated>${post.data.date.toISOString()}</updated>
		<author>
			<name>${xmlEscape(post.data.author)}</name>
		</author>
		${
			post.data.description
				? `<summary>${xmlEscape(post.data.description)}</summary>`
				: ""
		}
		<content type="html">${xmlEscape(
			`${post.data.feature_image ? `<img src="${new URL(post.data.feature_image, site)}"${post.data.feature_alt ? ` alt="${xmlEscape(post.data.feature_alt)}"` : ""}>` : ""}${html}`,
		)}</content>
	</entry>`,
	)
	.join("\n")}
</feed>`;

	return new Response(xml, {
		headers: { "Content-Type": "application/atom+xml; charset=utf-8" },
	});
}
