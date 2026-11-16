import { useEffect, useRef, useState, type FormEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  ArrowRight,
  Plus,
  X,
  Menu,
  Pause,
  Play,
  Download,
  Check,
  ChevronDown,
} from "lucide-react";
import CinematicHero from "../components/cinematic-hero";
import WatchArt from "../components/watch-art";
import Craft from "../components/craft";

gsap.registerPlugin(ScrollTrigger);
const watches = [
  {
    id: "origin",
    name: "The Origin",
    subtitle: "THE EVERYDAY EXTRAORDINARY",
    category: "Everyday",
    color: "olive",
    strap: "steel",
    price: 1450,
    size: "40 mm",
    reserve: "72 hours",
    water: "100 m",
    description:
      "Quietly distinctive. An olive sunray dial, a sculpted steel case, and an automatic movement. A considered companion for the everyday.",
    reference: "M-01 / OLIVE",
  },
  {
    id: "chapter",
    name: "The Chapter",
    subtitle: "ELEGANCE, WITHOUT EFFORT",
    category: "Dress",
    color: "ivory",
    strap: "leather",
    price: 1250,
    size: "38 mm",
    reserve: "48 hours",
    water: "50 m",
    description:
      "A warm ivory dial meets a supple leather strap. Understated proportions and clean lines — for moments that ask for a little more intention.",
    reference: "M-02 / IVORY",
  },
  {
    id: "depth",
    name: "The Depth",
    subtitle: "BEYOND THE FAMILIAR",
    category: "Sport",
    color: "black",
    strap: "steel",
    price: 1850,
    size: "42 mm",
    reserve: "72 hours",
    water: "200 m",
    description:
      "A deep charcoal dial and robust steel bracelet give this sport-inspired concept its purposeful character. Made for a life outside the ordinary.",
    reference: "M-03 / CHARCOAL",
  },
];
type Watch = (typeof watches)[number];
const currency = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

function Dialog({
  children,
  title,
  onClose,
}: {
  children: React.ReactNode;
  title: string;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const last = document.activeElement as HTMLElement;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.querySelector<HTMLElement>("button, input")?.focus();
    function key(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const focusables = Array.from(
          ref.current!.querySelectorAll<HTMLElement>(
            "button:not([disabled]),input,select,textarea,a[href]",
          ),
        );
        const first = focusables[0],
          end = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          end?.focus();
        } else if (!e.shiftKey && document.activeElement === end) {
          e.preventDefault();
          first?.focus();
        }
      }
    }
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", key);
      last?.focus();
    };
  }, [onClose]);
  return (
    <div className="modal-overlay">
      <dialog open className="modal" ref={ref} aria-modal="true" aria-label={title}>
        <button className="modal-close" aria-label="Close dialog" onClick={onClose}>
          <X size={22} />
        </button>
        {children}
      </dialog>
    </div>
  );
}

function Inquiry({ initial, onClose }: { initial: string; onClose: () => void }) {
  const [summary, setSummary] = useState("");
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setSummary(
      `MERIDIAN — Concept watch inquiry\n\nName: ${data.get("name")}\nEmail: ${data.get("email")}\nInterest: ${data.get("watch")}\n\n${data.get("message")}\n\nThis request was prepared locally in the Meridian concept website. It has not been sent. Models, specifications and prices are illustrative, not real inventory.`,
    );
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([summary], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "meridian-inquiry.txt";
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <Dialog title="Prepare a watch inquiry" onClose={onClose}>
      <div className="inquiry-content">
        <span className="eyebrow accent">YOUR NEXT CHAPTER</span>
        <h2>
          Let’s talk <em>time.</em>
        </h2>
        {summary ? (
          <div className="inquiry-success">
            <Check size={34} />
            <h3>Your inquiry is ready.</h3>
            <p>
              This is a concept shop, so your request hasn’t been sent. Download your summary to
              keep the details.
            </p>
            <button className="solid-button" onClick={download}>
              Download inquiry <Download size={16} />
            </button>
            <button className="text-link" onClick={() => setSummary("")}>
              Edit request <ArrowRight size={15} />
            </button>
          </div>
        ) : (
          <>
            <p>
              Tell us what caught your eye. We’ll help you put your preferences into a considered
              request.
            </p>
            <form onSubmit={submit}>
              <div className="form-row">
                <label>
                  Your name
                  <input
                    name="name"
                    aria-label="Your name"
                    placeholder="Full name"
                    autoComplete="name"
                    required
                    maxLength={100}
                  />
                </label>
                <label>
                  Email address
                  <input
                    name="email"
                    aria-label="Email address"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    maxLength={200}
                  />
                </label>
              </div>
              <label>
                I’m interested in
                <select name="watch" defaultValue={initial}>
                  <option value="Finding my first Meridian">Finding my first Meridian</option>
                  {watches.map((w) => (
                    <option key={w.id}>{w.name}</option>
                  ))}
                </select>
              </label>
              <label>
                A little about what you’re looking for
                <textarea
                  name="message"
                  aria-label="A little about what you’re looking for"
                  placeholder="Style, wrist size, occasion — anything you’d like us to know."
                  rows={3}
                  maxLength={3000}
                />
              </label>
              <p className="form-disclaimer">
                Demo only. Your details stay in this browser and are not sent or saved to a server.
              </p>
              <button className="solid-button" type="submit">
                Prepare inquiry <ArrowUpRight size={17} />
              </button>
            </form>
          </>
        )}
      </div>
    </Dialog>
  );
}

export default function MeridianPage() {
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [filter, setFilter] = useState("All timepieces");
  const [selected, setSelected] = useState<Watch | null>(null);
  const [inquiry, setInquiry] = useState<string | null>(null);
  const [menu, setMenu] = useState(false);
  const page = useRef<HTMLDivElement>(null);
  const story = useRef<HTMLElement>(null);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(m.matches);
    m.addEventListener("change", update);
    return () => m.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    const media = gsap.matchMedia();
    if (!reduced) {
      media.add("(min-width: 800px)", () => {
        const track = page.current!.querySelector<HTMLElement>(".stories-track")!;
        const tween = gsap.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth + 64),
          ease: "none",
          scrollTrigger: {
            trigger: story.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        return () => {
          tween.kill();
        };
      });
    }
    const ctx = gsap.context(() => {
      if (!reduced) {
        gsap.utils
          .toArray<HTMLElement>(".reveal-heading")
          .forEach((el) =>
            gsap.from(el, {
              y: 60,
              opacity: 0.25,
              duration: 1.15,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 90%",
                toggleActions: "play none none none",
              },
            }),
          );
        gsap.to(".about-word", {
          xPercent: -13,
          ease: "none",
          scrollTrigger: {
            trigger: ".about-section",
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      }
    }, page);
    return () => {
      media.revert();
      ctx.revert();
    };
  }, [reduced]);
  useEffect(() => {
    gsap.globalTimeline.paused(paused);
    page.current?.classList.toggle("motion-paused", paused);
    const tweens = ScrollTrigger.getAll().filter(
      (t) => t.vars.trigger === story.current || t.vars.trigger === ".about-section",
    );
    for (const t of tweens) {
      if (paused) t.disable(false);
      else t.enable(false);
    }
    return () => {
      gsap.globalTimeline.paused(false);
    };
  }, [paused]);
  const visible = watches.filter((w) => filter === "All timepieces" || w.category === filter);
  const closeSelected = useRef(() => setSelected(null)).current;
  const closeInquiry = useRef(() => setInquiry(null)).current;
  const openInquiry = (name = "Finding my first Meridian") => {
    setSelected(null);
    setInquiry(name);
    setMenu(false);
  };
  return (
    <div
      ref={page}
      className={`meridian-page ${reduced ? "reduced-motion" : ""} ${paused ? "motion-paused" : ""}`}
    >
      <a className="skip-link" href="#collection">
        Skip animation and explore watches
      </a>
      <header className="site-header">
        <a className="wordmark" href="#home" aria-label="Meridian home">
          M<span className="wordmark-cross">E</span>RIDIAN<span className="wordmark-dot">.</span>
        </a>
        <nav className={menu ? "main-nav open" : "main-nav"} aria-label="Main navigation">
          <a onClick={() => setMenu(false)} href="#collection">
            The collection
          </a>
          <a onClick={() => setMenu(false)} href="#craft">
            The craft
          </a>
          <a onClick={() => setMenu(false)} href="#about">
            Our perspective
          </a>
          <button className="nav-inquiry" onClick={() => openInquiry()}>
            Find your timepiece <ArrowUpRight size={15} />
          </button>
        </nav>
        <button
          className="mobile-menu"
          aria-label={menu ? "Close navigation" : "Open navigation"}
          aria-expanded={menu}
          onClick={() => setMenu(!menu)}
        >
          {menu ? <X size={23} /> : <Menu size={23} />}
        </button>
      </header>
      <main>
        <CinematicHero paused={paused} reduced={reduced} onPause={() => setPaused(!paused)} />
        <div className="manifesto-strip">
          <span>NOT MORE WATCHES.</span>
          <span>
            More <em>meaning.</em>
          </span>
          <span>
            THE MERIDIAN WAY <ArrowUpRight size={15} />
          </span>
        </div>
        <section className="collection-section" id="collection">
          <div className="section-topline">
            <span className="eyebrow">01 / THE COLLECTION</span>
            <span className="eyebrow">CONSIDERED. NOT COMPROMISED.</span>
          </div>
          <div className="collection-heading">
            <h2 className="reveal-heading">
              Find your
              <br />
              <em>kind of time.</em>
            </h2>
            <div>
              <p>
                A small collection. A world of character.
                <br />
                Timepieces chosen for how they look,
                <br />
                how they work, and how they make you feel.
              </p>
              <span className="concept-note">Concept models · Illustrative USD pricing</span>
            </div>
          </div>
          <div className="collection-tools">
            <fieldset className="filters" aria-label="Filter watches">
              {["All timepieces", "Everyday", "Dress", "Sport"].map((f) => (
                <button
                  key={f}
                  aria-pressed={filter === f}
                  className={filter === f ? "active" : ""}
                  onClick={() => setFilter(f)}
                >
                  {f}
                  {f === "All timepieces" && <sup>03</sup>}
                </button>
              ))}
            </fieldset>
            <span className="collection-count" aria-live="polite">
              {String(visible.length).padStart(2, "0")} TIMEPIECES <ChevronDown size={13} />
            </span>
          </div>
          <div className="watch-grid">
            {visible.map((w) => (
              <article className="watch-card" key={w.id}>
                <button
                  className="watch-image"
                  aria-label={`Explore ${w.name}`}
                  onClick={() => setSelected(w)}
                >
                  <span className="product-ref">{w.reference}</span>
                  <WatchArt
                    color={w.color}
                    strap={w.strap}
                    label={`${w.name} — ${w.color} dial, ${w.strap} strap concept`}
                  />
                  <span className="product-category">{w.category.toUpperCase()} / AUTOMATIC</span>
                  <span className="product-open">
                    <Plus size={18} />
                  </span>
                </button>
                <div className="product-info">
                  <div>
                    <span className="eyebrow">{w.subtitle}</span>
                    <h3>
                      <button onClick={() => setSelected(w)}>{w.name}</button>
                    </h3>
                  </div>
                  <span className="product-price">
                    {currency(w.price)}
                    <small>USD · CONCEPT</small>
                  </span>
                </div>
              </article>
            ))}
          </div>
          <div className="collection-foot">
            <span>Different expressions. The same attention to detail.</span>
            <button className="text-link" onClick={() => openInquiry()}>
              Need a little guidance? <ArrowUpRight size={16} />
            </button>
          </div>
        </section>
        <Craft />
        <section className="stories-scroll" ref={story} id="stories">
          <div className="stories-stage">
            <div className="stories-heading">
              <div>
                <span className="eyebrow">03 / MOMENTS & PERSPECTIVES</span>
                <h2>
                  Life, <em>well timed.</em>
                </h2>
              </div>
              <span className="stories-instruction">
                THREE STORIES. ENDLESS POSSIBILITIES. <ArrowRight size={20} />
              </span>
            </div>
            <div className="stories-track">
              {[
                {
                  title: "The everyday, elevated.",
                  tag: "01 / A QUIET CONFIDENCE",
                  image: "/images/wrist.jpg",
                  copy: "The meeting. The morning coffee. The long way home. Character lives in the moments between.",
                  position: "50% 50%",
                },
                {
                  title: "A different kind of gold.",
                  tag: "02 / THE ART OF WARMTH",
                  image: "/images/gold.jpg",
                  copy: "Light on metal. Warmth on the wrist. A reminder that the smallest details can change everything.",
                  position: "50% 50%",
                },
                {
                  title: "After the light fades.",
                  tag: "03 / BEYOND THE ORDINARY",
                  image: "/images/detail.jpg",
                  copy: "Some objects ask for a closer look. An evening spent discovering what lies beneath the surface.",
                  position: "50% 50%",
                },
              ].map((s, i) => (
                <article className="story-card" key={s.tag}>
                  <img
                    loading="lazy"
                    src={s.image}
                    alt={
                      i === 0
                        ? "Editorial photograph of a steel watch on a wrist"
                        : i === 1
                          ? "Editorial close-up of a golden watch dial"
                          : "Editorial photograph of a chronograph in low light"
                    }
                    style={{ objectPosition: s.position }}
                  />
                  <div className="story-image-shade" />
                  <span className="story-label">{s.tag}</span>
                  <div className="story-copy">
                    <h3>{s.title}</h3>
                    <p>{s.copy}</p>
                    <button
                      onClick={() => {
                        setFilter(i === 0 ? "Everyday" : i === 1 ? "Dress" : "Sport");
                        document
                          .querySelector("#collection")
                          ?.scrollIntoView({ behavior: reduced ? "instant" : "smooth" });
                      }}
                      className="text-link"
                    >
                      Explore the mood <ArrowUpRight size={17} />
                    </button>
                  </div>
                  <span className="story-photo-note">
                    EDITORIAL INSPIRATION · NOT SHOP INVENTORY
                  </span>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section id="about" className="about-section">
          <div className="about-word" aria-hidden="true">
            A matter of <em>perspective.</em>
          </div>
          <div className="about-layout">
            <span className="eyebrow">04 / OUR PERSPECTIVE</span>
            <div className="about-copy">
              <h2>
                Time is personal.
                <br />
                <em>So are we.</em>
              </h2>
              <p>
                Meridian is a concept for a different kind of watch shop. Not a catalogue of
                everything. A considered edit of things that mean something.
              </p>
              <p>
                We believe a timepiece should be understood, not just admired. That good design
                lasts longer than a trend. And that finding the right watch should feel like a
                conversation, not a transaction.
              </p>
              <button className="text-link" onClick={() => openInquiry()}>
                Start a conversation <ArrowUpRight size={17} />
              </button>
            </div>
            <div className="about-seal" aria-hidden="true">
              <div>MERIDIAN</div>
              <span>M</span>
              <small>OBJECTS OF TIME</small>
            </div>
          </div>
        </section>
        <section className="contact-section" id="contact">
          <span className="eyebrow">THE NEXT CHAPTER IS YOURS</span>
          <div>
            <h2>
              Make time for
              <br />
              <em>something extraordinary.</em>
            </h2>
            <button
              className="contact-circle"
              onClick={() => openInquiry()}
              aria-label="Start a watch inquiry"
            >
              <ArrowUpRight size={46} />
            </button>
          </div>
          <p>Find your watch. Find your perspective.</p>
        </section>
      </main>
      <footer className="site-footer">
        <a className="wordmark" href="#home">
          MERIDIAN.
        </a>
        <span>INDEPENDENT SPIRIT. TIMELESS PERSPECTIVE.</span>
        <div>
          <button className="footer-motion" onClick={() => setPaused(!paused)}>
            {paused ? <Play size={12} /> : <Pause size={12} />}{" "}
            {paused ? "Resume motion" : "Pause motion"}
          </button>
          <a href="#home">Back to the beginning ↑</a>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Meridian · A fictional watch boutique concept</span>
          <span>
            Illustrative models & prices. No checkout. Editorial photography via Unsplash.
          </span>
        </div>
      </footer>
      <button
        className="global-motion"
        onClick={() => setPaused(!paused)}
        aria-label={paused ? "Resume all animations" : "Pause all animations"}
        aria-pressed={paused}
      >
        {paused ? <Play size={12} /> : <Pause size={12} />}
        <span>{paused ? "MOTION PAUSED" : "MOTION ON"}</span>
      </button>
      {selected && (
        <Dialog title={selected.name} onClose={closeSelected}>
          <div className="product-modal-art">
            <WatchArt color={selected.color} strap={selected.strap} label={selected.name} />
          </div>
          <div className="product-modal-copy">
            <span className="eyebrow accent">{selected.reference}</span>
            <h2>{selected.name}</h2>
            <p>{selected.description}</p>
            <dl>
              <div>
                <dt>Case diameter</dt>
                <dd>{selected.size}</dd>
              </div>
              <div>
                <dt>Movement</dt>
                <dd>Automatic</dd>
              </div>
              <div>
                <dt>Power reserve</dt>
                <dd>{selected.reserve}</dd>
              </div>
              <div>
                <dt>Water resistance</dt>
                <dd>{selected.water}</dd>
              </div>
              <div>
                <dt>Strap</dt>
                <dd>{selected.strap === "steel" ? "Steel bracelet" : "Leather strap"}</dd>
              </div>
            </dl>
            <div className="modal-price">
              {currency(selected.price)} <span>USD · ILLUSTRATIVE</span>
            </div>
            <button className="solid-button" onClick={() => openInquiry(selected.name)}>
              Inquire about this watch <ArrowUpRight size={16} />
            </button>
            <small className="modal-disclaimer">
              Concept model. Specifications and pricing are illustrative; this item is not available
              for purchase.
            </small>
          </div>
        </Dialog>
      )}
      {inquiry !== null && <Inquiry initial={inquiry} onClose={closeInquiry} />}
    </div>
  );
}
