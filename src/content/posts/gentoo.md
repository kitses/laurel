---
title: Grievances with Gentoo
description: Riffing on about ideology unhealthily.
author: Aerith Frye
date: 2026-09-07
feature_image: /assets/img/feature/gentoo.avif
---
We have a "storied" experience with Linux, starting with whatever was box-standard at the start of `CURRENT_DECADE`, and currently with Fedora. One of those distributions was Gentoo, a (now mostly) source-based distribution initially released in 2002 by known weed-smoker and crashout _Daniel Robbins_.

The idea was novel, concerning the small breadth of programs available and the relative speed of computers at the time: the prospect that you can compile software with settings meant for your hardware for a speed gain. This also inadvertently includes being able to easily support ISAs other than x86, within the Gentoo project (the "Project")'s available resources.

This advantage, however, has largely disappeared with the sub-recent technological advancements in CPUs and the compilers that build what runs on them, because it isn't <2015 anymore.

Between programmatic inefficiency, compilers, and raw speed, the gap is actively, and rapidly, closing\*, because all things are temporary solutions in the moment, regardless of one's faith or active reversal of progress.


<span class="note">
<span class="mono">*</span> <a href="https://www.phoronix.com/news/GCC-x86-Generic-Mispredict">One Line x86 Change To GCC Compiler Nets +12% Benchmark Win For Modern Intel/AMD CPUs</a> (Phoronix)
<br><span class="mono">*</span> <a href="https://www.phoronix.com/news/Linux-6.19-X86_NATIVE_CPU">Linux 6.19 Kernel Benchmarks With X86_NATIVE_CPU Optimization</a> (Phoronix)
<br><span class="mono">*</span> <a href="https://www.phoronix.com/news/Linux-5.19-O3-March-Native">Benchmarking The Linux 5.19 Kernel Built With "-O3 -march=native"</a> (Phoronix)
</span>

# Dependency Hell Is Real

It is widely known that installing libraries and developer tools by hand (or more aptly, with your time) is incredibly frustrating. Source-based distributions do not help this in the slightest, though this is inherent. As we've always been the exploratory type, we suffered from this quite hard, much of our time and disk space being spent wrestling with anything that we wanted to install pulling in everything that we never fathomed compiling. Binary packages do little to fix this, since they are spread quite thinly, even after [2023](https://www.gentoo.org/news/2023/12/29/Gentoo-binary.html).

Watching those compile lines fly across your screen is mesmerizing, until you snap back to reality and realize how much time you're wasting for such an inconsequential gain.

Attempting to save face, we installed Nix (specifically [Lix](https://lix.systems/)). While this did rectify the problem to an extent, attempting to use graphical applications on a non-NixOS system without [nixGL](https://github.com/nix-community/nixGL) is a misnomer. Thus, Nix only exaggerated the time we were willing to waste on this. No elaboration will be given, since Nix is a can of worms in progress, as we have more room to finagle with it now.

## Unmask Every Package Ever

For every niche thing that we desire to install, there is a large chance that we have to [unmask](https://wiki.gentoo.org/wiki/Knowledge_Base:Unmasking_a_package) it, considering that most of these packages have their versions in testing, even after a year or so. Due to how Portage works ([ebuilds](https://wiki.gentoo.org/wiki/Ebuild) and such), how the Project tests packages is predominantly manual, ergo community effort. This gets hairy fast considering the amount of software available in the distribution, and human hands heal no silicon wounds easily.

If I got told the number of atoms the average Gentoo user has in their `package.accept_keywords`, I would, likely, not be surprised in the slightest.

# Frankensystem

A sysadmin is fundamentally driven by an immeasurable amount of lust to maintain a \*nix system, even putting their computer and mental state in harm's way to get what they want. Gentoo caters to this due to the aforementioned, and will happily birth dysfunctional systems that take months to maintain and years to `-avuDN @world` once the time comes, because this is nerd LEGO.

What I have failed to mention is that Gentoo is fundamentally a meta-distribution, with the fact that both distro and user are what shapes the system they install, stage3 and all. And retroactively, regretfully, because if one thing in their Rube Goldberg castle breaks, everything is soon to follow from the top-down. USE flags make this even more of a problem, as even one small change to a package's set can trip over, or possibly ruin one's delicately crafted setup in one emerge. Any of the means that the user has demanded Portage to build is only instant gratification, and what causes the rest.

# Ludditism

This is, unfortunately, the main thesis of this blog post.

The Gentoo Project and their chosen git forge, Codeberg, have an utter hatred and fundamental misunderstanding of how language models work, to the point of [banning](https://projects.gentoo.org/council/meeting-logs/20240414-summary.txt) and [incorrectly satirizing](https://www.gentoo.org/news/2026/04/01/forums-upgrade.html) them:

> \[…\] However, we have been working on implementing AI <span class="note italic">[sic]</span> features utilised via the Discourse API, which will scrape the internet for our old forums content (and more!), and post them for us in our new home. Due to this, viewing new posts will include old posts as well for the next few years or so, depending on how much of the old forums are backed up via the Internet Archive and similar archival sites. We have reasonably high hopes that many threads will appear exactly as they used to **(after all, AI** <span class="note italic">[iterum sic]</span> **can only regurgitate what already existed…) <span class="note italic">[actual belief]</span>**.

> - Two motions regarding _"artificial intelligence"_ and _Large Language Models_ (LLMs) were voted on among Codeberg e.V. members and passed.
> - We are promising to not use any of your data to train LLM and explain what the planned Terms of Use change mean for 'vibe-coded' projects.
> - We believe that LLMs endanger the free/libre software ecosystem as a whole.

And, then:

> It is expressly forbidden to contribute to Gentoo any content that has been created with the assistance of Natural Language Processing artificial intelligence tools. This motion can be revisited <span class="note italic">[are you sure?]</span>, should a case be made for such a tool that does not pose copyright, ethical\[,\] and quality concerns.

Under a petty extension of their poor wording, what falls under an NLP AI under the Project's wording can consist of:

- Spell checkers and grammar checkers with neural models (LanguageTool, Grammarly, the average phone keyboard).
- Predictive text (the average phone keyboard).
- Machine translation (Google Translate, DeepL, Kagi Translate).
- Any use of a search engine to help with debugging (Google, DuckDuckGo, Kagi).
- Voice dictation (ASR/NLU).

Thus, they have additionally banned an entire category of mathematics and software by way of a copyright policy wearing a technology ban catsuit.

> **Quality concerns.** Popular LLMs are really great at generating plausibly looking, but meaningless <span class="note italic">[how so?]</span> content. They are capable of providing good assistance if you are careful enough, but we can't really rely on that. At this point, they pose both the risk of lowering the quality of Gentoo projects, and of requiring an unfair human effort from developers and users to review contributions and detect the mistakes resulting from the use of AI.

They are not "stochastic parrots", "content stealers", "regurgitators", and such, and I reject every notion that attempts to prescribe these memes as fact, even when rebutted, concerning modern language models. For how much these people religiously inquire about quality (deadest), "soul" (unkillable), and the lack of an "actual reasoning process" (what's your thought process like?), I am surprised these human feather-brains haven't stochastically burnt their ethos to a crisp yet, considering the rapid progress concerning them.

It is a valid conversation to not allow them due to member burden or potential code quality, but it falls apart when there is a limited number of people that can contribute code to the core Project in the first place. Even more so, LLM-assisted tooling would serve to empower the project if used by that small pool wisely, but they wouldn't be able to regardless, because of the Project members and community they've cultivated.

But such is the nature of proselytization:

> **Ethical concerns.** The business side of AI boom <span class="note italic">[sic]</span> is creating serious ethical concerns. Among them:
> - Commercial AI projects are frequently indulging in blatant copyright violations to train their models. <span class="note italic">[the only actual argument here, if by little]</span>
> - Their operations are causing concerns about the huge use of energy and water. <span class="note italic">[you need citations that are based on **actual numbers** (see last paragraph)]</span>
> - The advertising and use of AI models has caused a significant harm to employees and reduction of service quality. <span class="note italic">[how does this pertain to the Project meaningfully?]</span>
> - LLMs have been empowering all kinds of spam and scam efforts. <span class="note italic">[ditto]</span>

We begin to grow ever-distant from "FLOSS" as a whole, because how do you proceed to promote "free knowledge" while simultaneously preaching copyright law and the abhorrent act of "stealing work", because you've decided to make AI your political polarizer? I do not have the want of abolishing copyright law, nor the erasure of human labour, but how many times will you repeat this rhetoric until you start alienating the people you wish to "empower"?

Language models are, fundamentally, given a large enough set, melting pots of their training data, and will never output or "regurgitate" a full body of work in daily use near-verbatim if it isn't already a substantially popular work. Source code isn't substantially popular, and does not stay static.

As well, they and Codeberg have provided little evidence for their statement of energy and water use that compare against other sectors. If they eventually do, I suspect it will have been chosen to validate their opinion, with little mention of others that contradict it. Any other ethical claims they and Codeberg have made do not pertain to their projects, and not accepting contributions from language models on the basis of them will not slow or stop them, because those are jobs for regulation.

Yet, they argue all of this when their main course is a distribution of a kernel that [already uses language models](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/log/?qt=grep&q=Assisted-by%3A) to assist with development. Under their stated stance, this; their beloved kernel supposedly committing copyright infringement; affects their bottom line.

People in this space frequently manage to confound the use and development of anything AI-related with ideological impurity, "class traitor"-ism, and such, to the argument and "benefit" to whom/why/what. For all the militarism they have expressed toward unfree software, they now believe it is rational to huff-and-puff about AI and harass users of it under the guise of "direct action" instead of actually helping or tackling the core problem: the lack of openness from model vendors and the technology surrounding them.

I don't think this can be answered or solved with a remotely straight face, because it'll end up as a tortured projection of any grievances they have with late-stage capitalism. This would likely have better chances as a political lobbying campaign rather than ideological soft-balling.

## Security

Vulnerabilities are being found at an unprecedented rate and quality due to the advent of agentic tools such as [AISLE](https://aisle.com/), Codex, and frontier models such as [GLM-5.3](https://z.ai/blog/glm-5.3), [Kimi K3](https://www.kimi.ai/blog/kimi-k3), and, more recently, [GPT-6 Astra](https://openai.com/index/gpt-6-astra/). Used by a human operator, if one of these finds an exploitable vulnerability in something like Portage, which is then responsibly disclosed to the Project with a LLM-generated fix included, they wouldn't be able to include it verbatim\* because of their own policy, possibly opening up an infinite can of worms for the distribution's users.

For this reason, we outright refuse to use any Linux distribution that prohibits the use of language models in development, for bad omens would certainly be running amok in the current day.

<span class="note"><span class="mono">*</span> This must be tested in practice before I can consider my own words as dogma, like how copyright licences are conjecture until proven in court. Yet, how one ensnares themselves so badly that it gets me to write -that- is confuzzling enough.</span>

# To Distrohop

Right, with that vent out of the way…

We started using Gentoo Linux as a means to end our distrohopping. Before this, we were novices using EndeavourOS, which, as with any other Arch derivative, turned out to be complete scouse, and whatever we used before that has been, thankfully, lost to time. At that point, we were quite offish about binary-based distributions, seeing the constant breakage that occurred with them; only partially corroborated by `pacman` being sloppy with its operations, because the actual problem is that distro being hemorrhage-edge.

With that twisted worldview, we thought it'd quell all of our problems; to which it evidently didn't; so we took a 180° turn and started using Debian instead in early-`CURRENT_YEAR`. And then, being scared that language models would once again be banned in [2026's vote 002](https://www.debian.org/vote/2026/vote_002) (they were not), and because we didn't want outdated libraries for our development anymore, we are now currently using Fedora.

---

Nothing is learned, gained, or lost, for every canary used to divine this coalmine, because we'll be sick if we have to breathe its air again. I am not grateful, nor do I beg for the manual labour of these bastard computer-touchers, for it would be just as saccharine if we stopped using Linux, started living in the woods, and blamed all of our problems on some random big-name like rms.

I'm too sure of myself, aren't I.
