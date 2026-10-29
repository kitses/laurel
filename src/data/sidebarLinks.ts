export interface SidebarLink {
	href: string;
	icon: string;
	label: string;
	rel?: string;
}

export const sidebarLinks: SidebarLink[] = [
	{
		href: "https://soundcloud.com/x5t",
		icon: "/assets/img/icons/soundcloud.png",
		label: "SoundCloud",
	},
	{
		href: "https://x.com/v0idsea",
		icon: "/assets/img/icons/twitter.svg",
		label: "Twitter",
	},
	{
		href: "https://last.fm/user/flttr",
		icon: "/assets/img/icons/lastfm.svg",
		label: "last.fm",
	},
	{
		href: "https://bandcamp.com/faggots",
		icon: "/assets/img/icons/bandcamp.svg",
		label: "Bandcamp",
	},
	{
		href: "https://github.com/kitses",
		icon: "/assets/img/icons/github.svg",
		label: "GitHub",
	},
	{
		href: "https://bsky.app/profile/did:plc:3a2h6y4tkr3joxwbtner5sve",
		icon: "/assets/img/icons/bluesky.svg",
		label: "Bluesky",
	},
	{
		href: "https://chitter.xyz/@i",
		icon: "/assets/img/icons/activitypub.svg",
		label: "ActivityPub",
		rel: "me",
	},
	{
		href: "https://llia.atabook.org/",
		icon: "/assets/img/icons/atabook.svg",
		label: "Guestbook",
	},
];
