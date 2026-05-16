export interface Update {
	date: string;
	text: string;
}

export const updates: Update[] = [
	{
		date: "2025-05-14",
		text: "overhaul website layout",
	},
	{
		date: "2025-04-26",
		text: "move to a dedicated domain and off of nekoweb",
	},
	{
		date: "2025-11-05",
		text: "move to deno for building and remove github link due to obsolescence",
	},
];
