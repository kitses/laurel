import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const notices = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/notices" }),
	schema: z.object({
		type: z.enum(["notice", "opus"]).default("notice"),
	}),
});

const posts = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		date: z.coerce.date(),
		author: z.string().optional().default("Laurel"),
		feature_image: z.string().optional(),
		feature_alt: z.string().optional(),
		feature_caption: z.string().optional(),
	}),
});

export const collections = { notices, posts };
