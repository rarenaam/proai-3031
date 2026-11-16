import { lazy, Suspense, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowUpRight, Pause, Play } from "lucide-react";
import type { CinematicState } from "./watch-scene";
const WatchScene = lazy(() => import("./watch-scene"));

gsap.registerPlugin(ScrollTrigger);
// Keep cinematic time aligned with elapsed time, even after a slow first GPU frame.
gsap.ticker.lagSmoothing(0);
export default function CinematicHero({
  paused,
  reduced,
  onPause,
}: {
  paused: boolean;
  reduced: boolean;
  onPause: () => void;
}) {
  const section = useRef<HTMLElement>(null);
  const state = useRef<CinematicState>({ progress: 0, paused, reduced });
  const [chapter, setChapter] = useState(0);
  const chapterRef = useRef(0);
  state.current.paused = paused;
  state.current.reduced = reduced;
  useEffect(() => {
    const root = section.current!;
    const ctx = gsap.context(() => {
      const chapters = gsap.utils.toArray<HTMLElement>(".hero-chapter", root);
      const transition = { progress: 0 };
      const timeline = gsap.timeline({ paused: true });
      timeline.to(transition, { progress: 1, duration: 1, ease: "none" }, 0);
      chapters.forEach((el, i) => {
        gsap.set(el, { autoAlpha: i === 0 ? 1 : 0, y: i === 0 ? 0 : 45 });
        if (i > 0)
          timeline.fromTo(
            el,
            { autoAlpha: 0, y: 45 },
            { autoAlpha: 1, y: 0, duration: 0.045, ease: "power2.out" },
            i * 0.2 - 0.035,
          );
        if (i < 4)
          timeline.to(
            el,
            { autoAlpha: 0, y: -35, duration: 0.055, ease: "power2.in" },
            i * 0.2 + 0.135,
          );
      });
      if (!reduced) {
        const update = () => {
          state.current.progress = transition.progress;
          const next = Math.min(4, Math.floor(transition.progress * 5));
          if (next !== chapterRef.current) {
            chapterRef.current = next;
            setChapter(next);
          }
        };
        timeline.eventCallback("onUpdate", update);
        ScrollTrigger.create({
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            if (!state.current.paused)
              gsap.to(timeline, {
                progress: self.progress,
                duration: 0.65,
                ease: "power2.out",
                overwrite: true,
              });
          },
        });
        gsap.from(".hero-initial-line", {
          yPercent: 110,
          stagger: 0.14,
          duration: 1.5,
          ease: "power3.out",
          delay: 0.25,
        });
        gsap.from(".hero-note", { opacity: 0, y: 10, duration: 1, delay: 1 });
      }
    }, root);
    return () => ctx.revert();
  }, [reduced]);
  return (
    <section
      className={`hero-scroll ${reduced ? "reduced" : ""}`}
      ref={section}
      id="home"
      aria-label="A cinematic journey into a mechanical watch"
    >
      <div className="hero-stage">
        <Suspense
          fallback={
            <div className="scene-loading">
              <span />
              ENTERING THE WORLD OF MERIDIAN
            </div>
          }
        >
          <WatchScene state={state} />
        </Suspense>
        <div className="hero-shade" />
        <div className="hero-grain" />
        <div className="hero-topline">
          <span className="eyebrow">
            <i /> INDEPENDENT MINDS. EXCEPTIONAL TIMEPIECES.
          </span>
          <span className="coordinate">51°30′26″ N &nbsp; 00°07′39″ W</span>
        </div>
        <div className="hero-copy">
          <article className="hero-chapter">
            <span className="chapter-eyebrow">THE MERIDIAN PERSPECTIVE — 01</span>
            <h1>
              <span className="line-mask">
                <span className="hero-initial-line">Not just time.</span>
              </span>
              <span className="line-mask">
                <em className="hero-initial-line">A world within.</em>
              </span>
            </h1>
            <p className="hero-note">
              Extraordinary watches. Thoughtfully chosen.
              <br />
              For those who see beyond the dial.
            </p>
            <a className="text-link hero-note" href="#collection">
              Explore the collection <ArrowUpRight size={17} />
            </a>
          </article>
          <article className="hero-chapter">
            <span className="chapter-eyebrow">BENEATH THE SURFACE — 02</span>
            <h2>
              Every detail.
              <br />
              <em>A discovery.</em>
            </h2>
            <p>
              Move closer. There is an entire universe
              <br />
              working quietly beneath the surface.
            </p>
          </article>
          <article className="hero-chapter">
            <span className="chapter-eyebrow">THE ART OF PRECISION — 03</span>
            <h2>
              Many parts.
              <br />
              <em>One purpose.</em>
            </h2>
            <p>
              A choreography of gears, springs, and intention.
              <br />
              Complexity, working in perfect harmony.
            </p>
          </article>
          <article className="hero-chapter">
            <span className="chapter-eyebrow">COMING INTO FOCUS — 04</span>
            <h2>
              Precision,
              <br />
              <em>made personal.</em>
            </h2>
            <p>
              Not simply a mechanism. A companion.
              <br />
              Something that becomes part of your story.
            </p>
          </article>
          <article className="hero-chapter">
            <span className="chapter-eyebrow">FIND YOUR MERIDIAN — 05</span>
            <h2>
              Your time.
              <br />
              <em>Your world.</em>
            </h2>
            <p>
              Considered design. Lasting character.
              <br />
              Discover the timepiece that feels like you.
            </p>
            <a className="text-link" href="#collection">
              Find your watch <ArrowDown size={16} />
            </a>
          </article>
        </div>
        <div className="watch-annotation">
          <span className="annotation-line" />
          <span>
            THE ORIGIN / 01
            <br />
            <small>AUTOMATIC · 40 MM</small>
          </span>
        </div>
        <div className="hero-bottom">
          <a
            href="#journey-start"
            className="scroll-cue"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({
                top: reduced
                  ? document.querySelector("#collection")!.getBoundingClientRect().top +
                    window.scrollY
                  : window.innerHeight * 0.9,
                behavior: reduced ? "instant" : "smooth",
              });
            }}
          >
            <span className="scroll-arrow">
              <ArrowDown size={18} />
            </span>
            <span>
              SCROLL TO DISCOVER
              <br />
              <small>A journey into time</small>
            </span>
          </a>
          <div className="chapter-progress">
            <span>0{chapter + 1}</span>
            <div className="progress-ticks">
              {[0, 1, 2, 3, 4].map((i) => (
                <span key={i} className={i <= chapter ? "active" : ""} />
              ))}
            </div>
            <span className="muted">05</span>
          </div>
          <button
            onClick={onPause}
            className="motion-control"
            aria-label={paused ? "Resume animations" : "Pause animations"}
            aria-pressed={paused}
          >
            {paused ? <Play size={13} /> : <Pause size={13} />}{" "}
            {paused ? "MOTION PAUSED" : "MOTION ON"}
          </button>
        </div>
        <div className="hero-vertical-label">MECHANICAL BY NATURE. HUMAN BY DESIGN.</div>
      </div>
    </section>
  );
}
