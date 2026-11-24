import { readFile } from "node:fs/promises";
import { extname } from "node:path";
import { createCanvas, loadImage } from "@napi-rs/canvas";

const ICON_SIZE = 512;
const ICON_PADDING = 48;
const ICON_BACKGROUND = "#EEE";
const COVER_SCALE = 0.75;
const COVER_QUALITY = 60;

export interface RenderedImage {
	mimeType: "image/png" | "image/avif";
	data: Buffer;
	width: number;
	height: number;
}

async function loadSource(source: string, width: number) {
	if (extname(source).toLowerCase() !== ".svg") return loadImage(source);
	const svg = await readFile(source, "utf8");
	return loadImage(
		Buffer.from(
			svg.replace(
				/<svg\b([^>]*)>/,
				(_, attributes: string) =>
					`<svg${attributes.replace(/\s(?:width|height)="[^"]*"/g, "")} width="${width}">`,
			),
		),
	);
}

export async function publicationIcon(source: string): Promise<RenderedImage> {
	const content = ICON_SIZE - ICON_PADDING * 2;
	const image = await loadSource(source, content);
	const scale = Math.min(content / image.width, content / image.height);
	const width = Math.round(image.width * scale);
	const height = Math.round(image.height * scale);
	const canvas = createCanvas(ICON_SIZE, ICON_SIZE);
	const context = canvas.getContext("2d");
	context.fillStyle = ICON_BACKGROUND;
	context.fillRect(0, 0, ICON_SIZE, ICON_SIZE);
	context.drawImage(
		image,
		(ICON_SIZE - width) / 2,
		(ICON_SIZE - height) / 2,
		width,
		height,
	);
	return {
		mimeType: "image/png",
		data: await canvas.encode("png"),
		width: ICON_SIZE,
		height: ICON_SIZE,
	};
}

export async function documentCoverImage(
	source: string,
): Promise<RenderedImage> {
	const image = await loadImage(source);
	const width = Math.round(image.width * COVER_SCALE);
	const height = Math.round(image.height * COVER_SCALE);
	const canvas = createCanvas(width, height);
	const context = canvas.getContext("2d");
	context.drawImage(image, 0, 0, width, height);
	return {
		mimeType: "image/avif",
		data: await canvas.encode("avif", COVER_QUALITY),
		width,
		height,
	};
}
