import { defineConfig, passthroughImageService } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import rehypeExternalLinks from "rehype-external-links";
import compress from "astro-compress";
import mdx from "@astrojs/mdx";
import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
	site: "https://llia.cc",
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
				"html-minifier-terser": {
					collapseWhitespace: true,
				},
			},
		}),
	],
	markdown: {
		syntaxHighlight: false,
		processor: unified({
			smartypants: false,
			rehypePlugins: [
				[rehypeExternalLinks, { rel: ["noopener"], target: false }],
			],
		}),
	},
});
