const nav = document.querySelector<HTMLElement>("main.homepage #navcontainer");
const scrollTimelineSupported =
	CSS.supports("animation-timeline", "scroll(root block)") &&
	CSS.supports("animation-range", "normal");

if (nav && !scrollTimelineSupported) {
	const fontSize = Number.parseFloat(getComputedStyle(nav).fontSize);
	const rangeStart = 35 * fontSize - 128;
	const rangeEnd = 35 * fontSize - 24;

	const updateProgress = () => {
		const fraction = (window.scrollY - rangeStart) / (rangeEnd - rangeStart);
		const progress = Math.min(1, Math.max(0, fraction));
		nav.style.setProperty("--homepage-nav-progress", String(progress));
	};

	window.addEventListener("scroll", updateProgress, { passive: true });
	updateProgress();
}
