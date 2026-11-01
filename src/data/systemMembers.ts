export interface SystemMember {
	url: string;
	displayName: string;
	icon: string;
	species: string;
	website: string;
}

export const systemMembers: SystemMember[] = [
	{
		url: "https://flora.llia.cc",
		displayName: "Flora Novak",
		icon: "/assets/img/laurelae/flora.avif",
		species: "Glaceon, Avali",
		website: "flora.llia.cc",
	},
	{
		url: "https://elle.llia.cc",
		displayName: "Elle Gamble",
		icon: "/assets/img/laurelae/elle.svg",
		species: "Glaceon, Fox",
		website: "elle.llia.cc",
	},
	{
		url: "https://elle.llia.cc/luca",
		displayName: "Luca Sīlot",
		icon: "/assets/img/laurelae/luca.svg",
		species: "Serval",
		website: "elle.llia.cc/luca",
	},
];
