export const standardSite = {
	did: "did:plc:3a2h6y4tkr3joxwbtner5sve",
	publicationRkey: "3n32pxwt7k222",
	url: "https://llia.cc",
	name: "Laurel",
	description:
		"A plural system of musicians, graphic designers, developers, and creatures.",
} as const;

export const publicationUri = `at://${standardSite.did}/site.standard.publication/${standardSite.publicationRkey}`;

const TID_ALPHABET = "234567abcdefghijklmnopqrstuvwxyz";

function encodeBase32(value: number): string {
	let encoded = "";
	for (
		let remaining = value;
		remaining > 0;
		remaining = Math.floor(remaining / 32)
	) {
		encoded = TID_ALPHABET[remaining % 32] + encoded;
	}
	return encoded || TID_ALPHABET[0];
}

function rkeyForDate(date: Date): string {
	return (
		encodeBase32(date.getTime() * 1000).padStart(11, TID_ALPHABET[0]) +
		TID_ALPHABET[0].repeat(2)
	);
}

export function documentRkeys(
	posts: { id: string; date: Date }[],
): Map<string, string> {
	const dates = new Map<number, string>();
	const rkeys = new Map<string, string>();
	for (const post of posts) {
		const time = post.date.getTime();
		const other = dates.get(time);
		if (other !== undefined) {
			throw new Error(
				`Posts "${other}" and "${post.id}" share the publication date ${post.date.toISOString()}; document keys are derived from that date, so give one of them a distinct date.`,
			);
		}
		dates.set(time, post.id);
		rkeys.set(post.id, rkeyForDate(post.date));
	}
	return rkeys;
}

export function documentUri(rkey: string): string {
	return `at://${standardSite.did}/site.standard.document/${rkey}`;
}

export interface BlobRef {
	$type: "blob";
	ref: { $link: string };
	mimeType: string;
	size: number;
}

export interface DocumentSource {
	id: string;
	title: string;
	description: string;
	date: Date;
	coverImage: string | null;
	textContent: string;
}

export function publicationRecord(icon?: BlobRef) {
	return {
		$type: "site.standard.publication",
		url: standardSite.url,
		...(icon ? { icon } : {}),
		name: standardSite.name,
		description: standardSite.description,
		preferences: { showInDiscover: true },
		basicTheme: {
			$type: "site.standard.theme.basic",
			background: {
				$type: "site.standard.theme.color#rgb",
				r: 238,
				g: 238,
				b: 238,
			},
			foreground: {
				$type: "site.standard.theme.color#rgb",
				r: 34,
				g: 34,
				b: 34,
			},
			accent: {
				$type: "site.standard.theme.color#rgb",
				r: 51,
				g: 51,
				b: 51,
			},
			accentForeground: {
				$type: "site.standard.theme.color#rgb",
				r: 238,
				g: 238,
				b: 238,
			},
		},
	};
}

export function documentRecord(post: DocumentSource, coverImage?: BlobRef) {
	return {
		$type: "site.standard.document",
		site: publicationUri,
		path: `/posts/${post.id}/`,
		title: post.title,
		description: post.description,
		...(coverImage ? { coverImage } : {}),
		publishedAt: post.date.toISOString(),
		textContent: post.textContent,
	};
}
