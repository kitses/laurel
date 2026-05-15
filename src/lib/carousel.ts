import { join } from "node:path";
import { createCanvas, loadImage } from "@napi-rs/canvas";
import { rgb } from "wcag-contrast";

export type CarouselArrowColors = {
	previous: string;
	next: string;
};

const carouselWidth = 840;
const carouselHeight = 525;
const arrowSize = 16;
const arrowInset = 14;
const lightColor = "#EEE";
const darkColor = "#333";

function clamp(value: number, min: number, max: number) {
	return Math.max(min, Math.min(max, value));
}

function getSampleRegion(
	imageWidth: number,
	imageHeight: number,
	side: keyof CarouselArrowColors,
) {
	const scale = Math.max(
		carouselWidth / imageWidth,
		carouselHeight / imageHeight,
	);
	const renderedWidth = imageWidth * scale;
	const renderedHeight = imageHeight * scale;
	const offsetX = (carouselWidth - renderedWidth) / 2;
	const offsetY = (carouselHeight - renderedHeight) / 2;
	const displayX =
		side === "previous" ? arrowInset : carouselWidth - arrowInset - arrowSize;
	const displayY = (carouselHeight - arrowSize) / 2;
	const sourceX = (displayX - offsetX) / scale;
	const sourceY = (displayY - offsetY) / scale;
	const sourceSize = Math.max(1, arrowSize / scale);
	const left = clamp(Math.round(sourceX), 0, imageWidth - 1);
	const top = clamp(Math.round(sourceY), 0, imageHeight - 1);

	return {
		left,
		top,
		width: Math.max(1, Math.min(Math.round(sourceSize), imageWidth - left)),
		height: Math.max(1, Math.min(Math.round(sourceSize), imageHeight - top)),
	};
}

async function getAverageArrowColor(
	featureImage: string,
	side: keyof CarouselArrowColors,
) {
	try {
		const imagePath = join(
			process.cwd(),
			"public",
			featureImage.replace(/^\//, ""),
		);
		const image = await loadImage(imagePath);
		const { width, height } = image;

		if (!width || !height) {
			return lightColor;
		}

		const region = getSampleRegion(width, height, side);
		const canvas = createCanvas(region.width, region.height);
		const ctx = canvas.getContext("2d");
		ctx.drawImage(image, -region.left, -region.top);
		const { data } = ctx.getImageData(0, 0, region.width, region.height);

		let totalR = 0;
		let totalG = 0;
		let totalB = 0;
		const pixelCount = data.length / 4;

		for (let index = 0; index < data.length; index += 4) {
			totalR += data[index];
			totalG += data[index + 1];
			totalB += data[index + 2];
		}

		const averagePixel = [
			Math.round(totalR / pixelCount),
			Math.round(totalG / pixelCount),
			Math.round(totalB / pixelCount),
		];
		const lightContrast = rgb(averagePixel, [238, 238, 238]);
		const darkContrast = rgb(averagePixel, [51, 51, 51]);

		return darkContrast > lightContrast ? darkColor : lightColor;
	} catch {
		return lightColor;
	}
}

export async function getCarouselArrowColors(
	featureImage?: string,
): Promise<CarouselArrowColors> {
	if (!featureImage) {
		return {
			previous: lightColor,
			next: lightColor,
		};
	}

	const [previous, next] = await Promise.all([
		getAverageArrowColor(featureImage, "previous"),
		getAverageArrowColor(featureImage, "next"),
	]);

	return {
		previous,
		next,
	};
}
