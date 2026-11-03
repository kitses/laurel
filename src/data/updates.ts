export interface Update {
	date: string;
	text: string;
}

export const updates: Update[] = [
	{
		date: "2026-11-03",
		text: "move to bun for portability",
	},
	{
		date: "2026-10-09",
		text: "move to pnpm because deno died",
	},
	{
		date: "2026-05-14",
		text: "overhaul website layout",
	},
].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
