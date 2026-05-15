import type { JSX } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";

type CarouselPost = {
	title: string;
	description: string;
	dateIso: string;
	dateDisplay: string;
	author: string;
	href: string;
	featureImage?: string;
	arrowColors: {
		previous: string;
		next: string;
	};
};

type HomeCarouselProps = {
	posts: CarouselPost[];
};

const advanceMs = 7000;
const transitionMs = 500;

function nextIndex(index: number, total: number) {
	return (index + 1) % total;
}

function previousIndex(index: number, total: number) {
	return (index - 1 + total) % total;
}

export default function HomeCarousel({ posts }: HomeCarouselProps) {
	const [activeIndex, setActiveIndex] = useState(0);
	const [exiting, setExiting] = useState<{
		index: number;
		progress: number;
	} | null>(null);
	const [elapsedMs, setElapsedMs] = useState(0);
	const [hovered, setHovered] = useState(false);
	const [locked, setLocked] = useState(false);

	const activePost = posts[activeIndex];
	const isPaused = hovered || locked;
	const remainingProgress = Math.max(0, 1 - elapsedMs / advanceMs);

	const stateRef = useRef({ activeIndex, elapsedMs });
	stateRef.current = { activeIndex, elapsedMs };

	const transitionTimeoutRef = useRef<number | undefined>(undefined);

	const transitionTo = (index: number, lock = false, dotProgress?: number) => {
		const { activeIndex: currentIdx, elapsedMs: currentElapsed } =
			stateRef.current;

		if (index === currentIdx) {
			if (lock) setLocked(true);
			return;
		}

		clearTimeout(transitionTimeoutRef.current);

		setExiting({
			index: currentIdx,
			progress: dotProgress ?? Math.max(0, 1 - currentElapsed / advanceMs),
		});
		setActiveIndex(index);
		setElapsedMs(0);

		if (lock) setLocked(true);

		transitionTimeoutRef.current = window.setTimeout(() => {
			setExiting(null);
		}, transitionMs);
	};

	useEffect(() => {
		if (posts.length <= 1) return;

		let frame: number;
		let lastTime: number | undefined;

		const tick = (time: number) => {
			if (lastTime === undefined) lastTime = time;
			const delta = time - lastTime;
			lastTime = time;

			if (!isPaused) {
				const { activeIndex: currentIdx, elapsedMs: currentElapsed } =
					stateRef.current;
				const nextElapsed = currentElapsed + delta;

				if (nextElapsed >= advanceMs) {
					transitionTo(nextIndex(currentIdx, posts.length), false, 0);
				} else {
					setElapsedMs(nextElapsed);
				}
			}

			frame = window.requestAnimationFrame(tick);
		};

		frame = window.requestAnimationFrame(tick);

		return () => window.cancelAnimationFrame(frame);
	}, [isPaused, posts.length]);

	useEffect(() => {
		return () => clearTimeout(transitionTimeoutRef.current);
	}, []);

	if (!activePost) return null;

	const moveTo = (index: number) => {
		transitionTo(index, true);
	};

	return (
		<section
			id="carouselcontainer"
			aria-label="Featured posts carousel"
			onMouseLeave={() => {
				setHovered(false);
				setLocked(false);
			}}
		>
			{posts.map((post, index) => (
				<a
					key={post.href}
					className={`carouselslide${
						index === activeIndex ? " is-active" : ""
					}${index === exiting?.index ? " is-exiting" : ""}`}
					href={post.href}
					aria-label={post.title}
					aria-hidden={index !== activeIndex}
					tabIndex={index === activeIndex ? undefined : -1}
				>
					{post.featureImage && (
						<img className="carouselimage" src={post.featureImage} alt="" />
					)}
					<div className="carouselgradient" />
					<div className="carouseltext">
						<p>
							<span className="byline">
								<time dateTime={post.dateIso}>{post.dateDisplay}</time>
								&middot;
								<span>{post.author}</span>
							</span>
						</p>
						<h1>{post.title}</h1>
						<p>{post.description}</p>
					</div>
				</a>
			))}
			{posts.length > 1 && (
				<>
					<button
						className="carouselcontrol carouselcontrolprevious"
						type="button"
						aria-label="Previous post"
						onMouseEnter={() => setHovered(true)}
						onMouseLeave={() => setHovered(false)}
						onClick={() => moveTo(previousIndex(activeIndex, posts.length))}
					>
						<span
							className="carouselcontrolicon"
							style={{
								backgroundColor: activePost.arrowColors.previous,
								maskImage: "url('/assets/img/carousel/backwards.svg')",
								WebkitMaskImage: "url('/assets/img/carousel/backwards.svg')",
							}}
						/>
					</button>
					<button
						className="carouselcontrol carouselcontrolnext"
						type="button"
						aria-label="Next post"
						onMouseEnter={() => setHovered(true)}
						onMouseLeave={() => setHovered(false)}
						onClick={() => moveTo(nextIndex(activeIndex, posts.length))}
					>
						<span
							className="carouselcontrolicon"
							style={{
								backgroundColor: activePost.arrowColors.next,
								maskImage: "url('/assets/img/carousel/forwards.svg')",
								WebkitMaskImage: "url('/assets/img/carousel/forwards.svg')",
							}}
						/>
					</button>
					<nav className="carouseldots" aria-label="Carousel position">
						{posts.map((post, index) => (
							<button
								key={post.href}
								className={`carouseldot${
									index === activeIndex ? " is-active" : ""
								}${index === exiting?.index ? " is-exiting" : ""}`}
								type="button"
								aria-label={`Show ${post.title}`}
								aria-current={index === activeIndex}
								onClick={() => moveTo(index)}
							>
								<span
									className="carouseldotprogress"
									style={
										{
											"--carousel-progress":
												index === activeIndex
													? remainingProgress
													: (exiting?.progress ?? 0),
										} as JSX.CSSProperties
									}
								/>
							</button>
						))}
					</nav>
				</>
			)}
		</section>
	);
}
