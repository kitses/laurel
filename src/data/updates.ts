export interface Update {
	date: string;
	text: string;
}

export const updates: Update[] = [
	{
		date: "2026-10-09",
		text: "move to pnpm because deno died",
	},
	{
		date: "2026-05-14",
		text: "overhaul website layout",
	},
	{
		date: "2025-11-05",
		text: "move to deno for building and remove github link due to obsolescence",
	},
];
