import { defineConfig, passthroughImageService } from "astro/config";
import rehypeExternalLinks from "rehype-external-links";
import compress from "astro-compress";
import mdx from "@astrojs/mdx";
import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
	compressHTML: false,
	image: {
		service: passthroughImageService(),
	},
	integrations: [
		mdx(),
		preact(),
		compress({
			Image: false,
			SVG: false,
			HTML: {
				collapseWhitespace: true,
			},
		}),
	],
	markdown: {
		smartypants: false,
		syntaxHighlight: false,
		rehypePlugins: [
			[rehypeExternalLinks, { rel: ["noopener"], target: false }],
		],
	},
});
