import type { CollectionEntry } from "astro:content";

export type NoticeEntry = CollectionEntry<"notices">;

const MONTH_NAMES = [
	"jan",
	"feb",
	"mar",
	"apr",
	"may",
	"jun",
	"jul",
	"aug",
	"sep",
	"oct",
	"nov",
	"dec",
];

function getDateFromNoticeId(noticeId: string): Date {
	const dateMatch = noticeId.match(/(?:^|\/)(\d{4}-\d{2}-\d{2})(?:$|\.)/);

	if (!dateMatch) {
		throw new Error(`notice "${noticeId}" isn't a YYYY-MM-DD date.`);
	}

	return new Date(`${dateMatch[1]}T00:00:00.000Z`);
}

export function ordinal(number: number): string {
	const suffixes = ["th", "st", "nd", "rd"];
	const remainder = number % 100;

	return (
		number +
		(suffixes[(remainder - 20) % 10] || suffixes[remainder] || suffixes[0])
	);
}

export function formatDate(noticeDate: Date): string {
	const monthName = MONTH_NAMES[noticeDate.getUTCMonth()];
	const monthDate = noticeDate.getUTCDate();
	const shortYear = String(noticeDate.getUTCFullYear()).slice(-2);

	return `${monthName}${monthDate}/${shortYear}`;
}

export interface DecoratedNotice {
	post: NoticeEntry;
	type: "notice" | "opus" | "event";
	displayDate: string;
	prefix?: string;
	first?: boolean;
}

export function decorateNotices(noticePosts: NoticeEntry[]): DecoratedNotice[] {
	let noticeCount = 0;

	return noticePosts
		.map((postEntry) => ({
			postEntry,
			noticeType: postEntry.data.type || "notice",
			parsedDate: getDateFromNoticeId(postEntry.id),
		}))
		.sort(
			(first, second) =>
				first.parsedDate.getTime() - second.parsedDate.getTime(),
		)
		.map(({ postEntry, noticeType, parsedDate }, index, array) => {
			const decoratedNotice: DecoratedNotice = {
				post: postEntry,
				type: noticeType as "notice" | "opus" | "event",
				displayDate: formatDate(parsedDate),
			};

			if (noticeType === "notice") {
				noticeCount++;
				decoratedNotice.prefix = ordinal(noticeCount);
			} else if (noticeType === "opus") {
				const nextPost = array[index + 1];
				decoratedNotice.first = (nextPost?.noticeType || "notice") !== "opus";
			}

			return decoratedNotice;
		})
		.reverse();
}
