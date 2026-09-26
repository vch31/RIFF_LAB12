import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import jetImg from '../assets/JET.png';

import guitarTeacherImg from '../assets/teacher_riff.jpg';
import teacherDrumImg from '../assets/drum_teacher.png';
import drumSide  from '../assets/Drum_studio_side.png';



type Mode = "guitar" | "drums";

type SocialName = "instagram" | "telegram" | "tiktok";

function SocialIcon({ name, className }: { name: SocialName; className?: string }) {
  if (name === "instagram") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (name === "telegram") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M21.5 3.5 2.7 10.9c-1 .4-1 1.7.1 2l4.4 1.4 1.7 5.3c.2.7 1.1.9 1.6.3l2.5-2.7 4.6 3.4c.7.5 1.7.1 1.9-.7l3.4-15.4c.2-.9-.7-1.6-1.4-1z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M16.5 3c.3 1.9 1.5 3.4 3.5 3.8v2.7c-1.3 0-2.5-.4-3.5-1.1v6.6c0 3-2.4 5.4-5.4 5.4S5.7 18 5.7 15s2.4-5.4 5.4-5.4c.3 0 .6 0 .9.1v2.8a2.6 2.6 0 1 0 1.8 2.5V3h2.7z" />
    </svg>
  );
}

function PriceRow({
  n, unit, label, note, price, save, highlight
}: {
  n: string; unit: string; label: string; note?: string;
  price: string; save?: string; highlight?: boolean;
}) {
  const textColor = highlight ? "text-white" : "text-[#1A1A1A]";
  const arrowColor = highlight ? "text-gray-500" : "text-[#1A1A1A]/40";

  return (
    <div
      className={
        "grid grid-cols-[auto_auto_1fr_auto_auto] items-center gap-3 sm:gap-6 px-4 sm:px-8 py-5 sm:py-6 transition-colors " +
        (highlight ? "bg-[#1A1A1A]" : "bg-transparent border-t border-[#1A1A1A]/30")
      }
    >
      {/* 1: Цифра и Единица */}
      <div className={"flex items-baseline gap-2 shrink-0 w-16 sm:w-24 " + textColor}>
        <span className="rl-display text-4xl sm:text-5xl font-black leading-none">{n}</span>
        <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">{unit}</span>
      </div>

      {/* Разделитель */}
      <div className={arrowColor}>
        <svg width="6" height="10" viewBox="0 0 6 10" fill="none"><path d="M1 1L5 5L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>

      {/* 2: Название и Описание */}
      <div className={"flex flex-col justify-center leading-tight " + textColor}>
        <span className="text-xs sm:text-sm font-bold uppercase tracking-widest">{label}</span>
        {note && <span className="text-xs sm:text-sm font-black uppercase tracking-widest">{note}</span>}
      </div>

      {/* Разделитель */}
      <div className={arrowColor}>
        <svg width="6" height="10" viewBox="0 0 6 10" fill="none"><path d="M1 1L5 5L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>

      {/* 3: Цена и Экономия */}
      <div className="text-right shrink-0">
        <div className={"text-sm sm:text-base font-bold " + (highlight ? "text-[#4DB8FF]" : textColor)}>
          {price}
        </div>
        {save && (
          <div className={"text-[10px] sm:text-xs mt-1 font-medium " + textColor}>
            Вы экономите {save}
          </div>
        )}
      </div>
    </div>
  );
}

function GuitarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M14 3L21 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="14" cy="3" r="1.4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9.5 8.5L15.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="7" cy="17" r="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="7" cy="17" r="1.6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function DrumIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <ellipse cx="12" cy="7" rx="8" ry="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 7v6c0 1.66 3.58 3 8 3s8-1.34 8-3V7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 3l2 3M17 3l-2 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function TeacherPass({
  photo,
  role,
  tone,
  fields,
  color = false,
}: {
  photo: string;
  role: string;
  tone: "orange" | "red";
  fields: [string, string][];
  color?: boolean;
}) {
  const border = tone === "red" ? "border-rl-red" : "border-rl-orange";
  const text = tone === "red" ? "text-rl-red" : "text-rl-orange";
  return (
    <div className={"relative mx-auto max-w-sm rotate-[-3deg] rounded-3xl border-2 bg-rl-card p-2 shadow-2xl " + border}>
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-rl-bg border-2 border-rl-line z-10" />
      <div className="rounded-2xl overflow-hidden bg-rl-card">
        <div className="aspect-[3/4] relative">
          <img
            src={photo}
            alt={role}
            className={"w-full h-full object-cover " + (color ? "" : "grayscale")}
          />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-rl-card to-transparent" />
        </div>
        <div className="p-5">
          <div className={"rl-mono text-[10px] mb-3 tracking-widest " + text}>ALL ACCESS · {role}</div>
          <div className="space-y-1.5 border-t border-rl-line pt-3">
            {fields.map(([k, v]) => (
              <div key={k} className="flex justify-between text-xs rl-mono">
                <span className="text-rl-muted">{k}</span>
                <span>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function GearImage({ items }: { items: { label: string; src: string }[] }) {
  const [tab, setTab] = useState(0);
  return (
    <div className="rounded-2xl bg-rl-card border border-rl-line overflow-hidden">
      <div className="aspect-[4/5] flex items-center justify-center p-10 bg-gradient-to-b from-rl-card to-black">
        <img src={items[tab].src} alt={items[tab].label} className="max-h-full max-w-full object-contain drop-shadow-2xl" />
      </div>
      <div className="flex border-t border-rl-line">
        {items.map((it, i) => (
          <button
            key={it.label}
            onClick={() => setTab(i)}
            className={"flex-1 rl-mono text-xs py-3 transition " + (i === tab ? "text-rl-orange bg-white/5" : "text-rl-muted hover:text-rl-ink")}
          >
            {it.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className}>
      <div
        className={"transition-all duration-700 ease-out " + (shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * Отслеживает, насколько секция прошла через центр экрана, и возвращает
 * прогресс -1..1 (−1 когда элемент ещё внизу экрана, 0 в центре, +1 когда
 * уже выше центра). Используется для лёгкого 3D-поворота/параллакса
 * картинки при скролле, без завязки на общий scrollY страницы.
 */
function useScrollTilt(range = 0.7) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const centerOffset = rect.top + rect.height / 2 - vh / 2;
      const p = centerOffset / (vh * range);
      setProgress(Math.max(-1, Math.min(1, p)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [range]);
  return { ref, progress };
}

const GUITAR_PROGRAM = [
  {
    title: "Постановка базы",
    items: ["Вступление", "Строение гитары", "Постановка левой руки", "Постановка правой руки"],
  },
  {
    title: "Техника игры",
    items: ["Звукоизвлечение. Игра пальцами", "Звукоизвлечение. Заглушение струн", "Звукоизвлечение. Игра медиатором", "Упражнения для беглости пальцев"],
  },
  {
    title: "Ритм и теория",
    items: ["Ноты", "Гаммы", "Метроном для самостоятельных занятий", "Ритм. Длительности нот", "Упражнения с ускорением", "Упражнения для игры с медиатором", "Взаимодействие с барабанщиком. Ритмические рисунки"],
  },
  {
    title: "Практика",
    items: ["Аккорды", "Практика", "Обыгровки аккордов", "Гитарные фишки", "Практика всех изученных навыков"],
  },
];

const DRUM_PROGRAM = [
  {
    title: "Постановка базы",
    items: ["Вступление", "Строение установки", "Посадка и хват палочек", "Постановка рук и ног"],
  },
  {
    title: "Техника игры",
    items: ["Одиночные удары", "Работа ногой на бас-барабане", "Открытый и закрытый хай-хэт", "Упражнения на независимость рук и ног"],
  },
  {
    title: "Ритм и теория",
    items: ["Длительности нот", "Метроном для самостоятельных занятий", "Основные ритмические рисунки", "Размеры 4/4, 3/4, 6/8", "Синкопы и акценты", "Взаимодействие с другими инструментами"],
  },
  {
    title: "Практика",
    items: ["Заполнения (филлы)", "Динамика и грув", "Разбор песен", "Игра под трек", "Практика всех изученных навыков"],
  },
];

function Accordion({ groups, tone = "orange" }: { groups: { title: string; items: string[] }[]; tone?: "orange" | "red" }) {
  const [open, setOpen] = useState<number | null>(0);
  const accent = tone === "red" ? "text-rl-red" : "text-rl-orange";
  return (
    <div className="space-y-3">
      {groups.map((g, i) => {
        const isOpen = open === i;
        return (
          <div key={g.title} className="bg-rl-card border border-rl-line rounded-2xl overflow-hidden">
            <button onClick={() => setOpen(isOpen ? null : i)} className="w-full flex items-center justify-between px-6 py-5 text-left">
              <span className="flex items-center gap-3">
                <span className={"rl-mono text-xs " + accent}>{String(i + 1).padStart(2, "0")}</span>
                <span className="rl-display text-xl">{g.title}</span>
              </span>
              <span className={"rl-mono text-lg transition-transform duration-300 " + accent + (isOpen ? " rotate-45" : "")}>+</span>
            </button>
            <div className={"grid transition-all duration-300 ease-out " + (isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
              <div className="overflow-hidden">
                <ul className="px-6 pb-5 space-y-2 border-t border-rl-line pt-4">
                  {g.items.map((it) => (
                    <li key={it} className="text-sm text-rl-muted flex gap-3">
                      <span className={"shrink-0 " + accent}>—</span>{it}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Kicker({ children, tone }: { children: ReactNode; tone?: "orange" | "red" }) {
  const c = tone === "red" ? "text-rl-red" : "text-rl-orange";
  return <p className={"rl-mono text-xs " + c + " mb-3"}>{children}</p>;
}

function CTA({
  children,
  href,
  ghost = false,
  ext = false,
  tone = "orange",
  className = "",
}: {
  children: ReactNode;
  href: string;
  ghost?: boolean;
  ext?: boolean;
  tone?: "orange" | "red";
  className?: string;
}) {
  const solid =
    tone === "red" ? "bg-rl-red text-rl-bg hover:brightness-110" : "bg-rl-orange text-rl-bg hover:brightness-110";
  const ghostHover = tone === "red" ? "hover:border-rl-red" : "hover:border-rl-orange";
  const g = "border border-rl-line text-rl-ink " + ghostHover;
  return (
    <a
      href={href}
      target={ext ? "_blank" : undefined}
      rel={ext ? "noopener noreferrer" : undefined}
      className={"rl-mono text-xs px-6 py-3 rounded-full inline-block transition hover:scale-105 " + (ghost ? g : solid) + " " + className}
    >
      {children}
    </a>
  );
}

function Picker({ mode, setMode }: { mode: Mode; setMode: (m: Mode) => void }) {
  const cards: { key: Mode; label: string; desc: string; Icon: typeof GuitarIcon; tone: "orange" | "red" }[] = [
    { key: "guitar", label: "RIFF LAB12", desc: "Электро и акустическая гитара", Icon: GuitarIcon, tone: "orange" },
    { key: "drums", label: "DRUM LAB12", desc: "Ударная установка", Icon: DrumIcon, tone: "red" },
  ];
  return (
    <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 max-w-xl mx-auto mb-6 sm:mb-10">
      {cards.map(({ key, label, desc, Icon, tone }) => {
        const active = mode === key;
        const border = tone === "red" ? "border-rl-red" : "border-rl-orange";
        const text = tone === "red" ? "text-rl-red" : "text-rl-orange";
        const shadow = tone === "red" ? "shadow-rl-red/20" : "shadow-rl-orange/20";
        const activeBg = tone === "red" ? "bg-rl-red/10" : "bg-rl-orange/10";
        const dot = tone === "red" ? "bg-rl-red" : "bg-rl-orange";
        return (
          <button
            key={key}
            type="button"
            onClick={() => setMode(key)}
            aria-pressed={active}
            className={
              "group relative text-left rounded-2xl border-2 p-4 sm:p-5 cursor-pointer select-none " +
              "backdrop-blur-sm transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-rl-bg " +
              (active
                ? border + " " + activeBg + " shadow-lg " + shadow
                : "border-rl-line bg-rl-bg/20 opacity-50 grayscale hover:opacity-80 hover:grayscale-0")
            }
          >
            <Icon className={"w-7 h-7 sm:w-8 sm:h-8 mb-2 " + (active ? text : "text-rl-muted")} />
            <div className="rl-display text-lg sm:text-xl mb-0.5">{label}</div>
            <div className="text-xs text-rl-muted">{desc}</div>
            {active && <span className={"absolute top-4 right-4 w-2 h-2 rounded-full " + dot} />}
          </button>
        );
      })}
    </div>
  );
}

function Pill({ mode, setMode }: { mode: Mode; setMode: (m: Mode) => void }) {
  return (
    <div className="inline-flex rounded-full border border-rl-line p-1 bg-rl-panel/70 mb-10">
      <button
        onClick={() => setMode("guitar")}
        className={
          "rl-mono text-xs px-4 py-2 rounded-full transition " +
          (mode === "guitar" ? "bg-rl-orange text-rl-bg" : "text-rl-muted hover:text-rl-ink")
        }
      >
        🎸 Riff Lab12
      </button>
      <button
        onClick={() => setMode("drums")}
        className={
          "rl-mono text-xs px-4 py-2 rounded-full transition " +
          (mode === "drums" ? "bg-rl-red text-rl-bg" : "text-rl-muted hover:text-rl-ink")
        }
      >
        🥁 Drum Lab12
      </button>
    </div>
  );
}

// Сгруппировано по бренду (не по платформе), чтобы два значка Instagram
// не стояли подряд без объяснения — Riff и Drum разнесены и у каждого
// свой фирменный цвет вместо общего hover от текущего режима.
const SOCIAL_LINKS: Array<{ icon: SocialName; label: string; href: string; tone: "orange" | "red" }> = [
  { icon: "instagram", label: "Instagram Riff Lab12", href: "https://www.instagram.com/riff_lab12", tone: "orange" },
  { icon: "telegram", label: "Telegram @riff_arina", href: "https://t.me/riff_arina", tone: "orange" },
  { icon: "instagram", label: "Instagram Drum Lab12", href: "https://www.instagram.com/drum_lab12", tone: "red" },
  { icon: "tiktok", label: "TikTok @drum_lab12", href: "https://www.tiktok.com/@drum_lab12", tone: "red" },
];

export default function Landing() {
  const [mode, setMode] = useState<Mode>("guitar");
  const [showCta, setShowCta] = useState(false);
  const g = mode === "guitar";
  const { ref: guitarTiltRef, progress: guitarTilt } = useScrollTilt();

  useEffect(() => {
    const onScroll = () => {
      const pastHero = window.scrollY > window.innerHeight * 0.9;
      const hideNear = (id: string) => {
        const el = document.getElementById(id);
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight * 0.6 && rect.bottom > window.innerHeight * 0.1;
      };
      setShowCta(pastHero && !hideNear("contact") && !hideNear("team"));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  const eqHref = g ? "#guitar-equipment" : "#drum-equipment";
  const igHandle = g ? "riff_lab12" : "drum_lab12";
  const igUrl = "https://www.instagram.com/" + igHandle;
  const tone = g ? "orange" : "red";
  const NAV: Array<[string, string]> = [
    ["#programs", "Программа"],
    [eqHref, "Оборудование"],
    ["#team", "Преподаватель"],
    ["#pricing", "Прайс"],
    ["#contact", "Контакты"],
  ];
  return (
    <main className="rl-body bg-rl-bg text-rl-ink overflow-x-hidden">
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur bg-rl-bg/80 border-b border-rl-line h-11 md:h-16 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 md:px-8 h-full flex items-center justify-between gap-3">

        {/* Лого: на мобильных — только активный бренд, на ПК — всегда оба */}
        <span className="rl-display text-xs sm:text-base md:text-lg tracking-tight sm:tracking-widest whitespace-nowrap flex-shrink-0">
          <span className="sm:hidden">
            {g ? (
              <>RIFF<span className="text-rl-orange">LAB12</span></>
            ) : (
              <>DRUM<span className="text-rl-red">LAB12</span></>
            )}
          </span>
          <span className="hidden sm:inline">
            RIFF<span className="text-rl-orange">LAB12</span>{" "}
            <span className="text-rl-muted">×</span> DRUM<span className="text-rl-red">LAB12</span>
          </span>
        </span>

        <nav className="hidden md:flex gap-6 rl-mono text-xs text-rl-muted">
          {NAV.map(([h, l]) => (
            <a key={l} href={h} className={"hover:" + (g ? "text-rl-orange" : "text-rl-red")}>
              {l}
            </a>
          ))}
        </nav>
      </div>
    </header>

      <section className="relative pt-24 sm:pt-32 md:pt-40 pb-16 sm:pb-20 md:pb-24 px-6 overflow-hidden min-h-[85vh] flex items-center">
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-45"
          src={`${import.meta.env.BASE_URL}media/hero.mp4`}
          poster={`${import.meta.env.BASE_URL}media/hero-poster.png`}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-b from-rl-bg/40 via-rl-bg/70 to-rl-bg" />
        <div className="rl-ring w-[520px] h-[520px] -top-40 -right-40" style={{ borderColor: g ? "var(--color-rl-orange)" : "var(--color-rl-red)" }} />
        <div
          className="rl-ring w-[320px] h-[320px] top-20 -right-10"
          style={{ borderColor: g ? "var(--color-rl-orange)" : "var(--color-rl-red)" }}
        />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <Kicker tone={tone}>Гродно · Студия гитары и ударных</Kicker>
            <h1 className="rl-display text-[clamp(36px,9vw,64px)] leading-[1.05] tracking-tight font-black mb-6">
              Куда сбежать в конце дня,
              <br />
              чтобы найти себя?
            </h1>
            <p className="text-rl-muted text-[clamp(16px,2.2vw,17px)] leading-relaxed max-w-xl mx-auto mb-6 sm:mb-8">
              Приходите в студию со свежей головой, а не с тяжёлым чехлом!<br />
              Инструменты для наших учеников уже в студии.
            </p>
          <p className="rl-mono text-sm mt-5 sm:mt-8 mb-3 sm:mb-4 tracking-widest">
            <span className="text-rl-orange">Выбери,</span>{" "}
            <span className="text-rl-red">с чего начать</span>
          </p>
          <Picker mode={mode} setMode={setMode} />
            <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-xl mx-auto">
              <CTA href="#contact" tone={tone} className="text-center">
                Записаться на пробное
              </CTA>
              <CTA href="#programs" ghost tone={tone} className="text-center">
                Смотреть программу
              </CTA>
            </div>
        </div>
      </section>

<section className="border-y border-rl-line bg-rl-panel">
  {(() => {
    const STATS: Array<[string, string]> = [
      ["1 на 1", "Индивидуально с преподавателем"],
      ["60 минут", "Одно занятие"],
      ["от 10 лет", "Взрослым и детям"],
      ["0 багажа", "Инструмент и комбик — наши"],
    ];
    const accent = g ? "text-rl-orange" : "text-rl-red";

    return (
      <>
        {/* ─── Мобильные: бегущая строка ─── */}
        <div className="md:hidden relative overflow-hidden py-8">
          {/* затемнение по краям */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 z-10 bg-gradient-to-r from-rl-panel to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 z-10 bg-gradient-to-l from-rl-panel to-transparent" />

          <div className="flex w-max rl-marquee">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex shrink-0" aria-hidden={dup === 1}>
                {STATS.map(([a, b]) => (
                  <div key={a + dup} className="flex flex-col items-center px-8 shrink-0">
                    <div className={"rl-display text-2xl leading-none whitespace-nowrap " + accent}>
                      {a}
                    </div>
                    <div className="text-xs text-rl-muted mt-1 whitespace-nowrap">{b}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ─── Десктоп: сетка ─── */}
        <div className="hidden md:block max-w-6xl mx-auto px-6 py-10">
          <div className="grid grid-cols-4 gap-8 text-center">
            {STATS.map(([a, b]) => (
              <Reveal key={a}>
                <div className={"rl-display text-3xl leading-none " + accent}>{a}</div>
                <div className="text-sm text-rl-muted mt-1">{b}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </>
    );
  })()}
</section>


<section id="programs" className="max-w-6xl mx-auto px-6 py-24">
        {g ? (
          <Reveal>
            <div id="guitar" className="scroll-mt-24">
              <div className="mb-16">
                <Kicker>Riff Lab12 · Гитара</Kicker>
                <h2 className="rl-display text-4xl mb-4">Электро и акустика, с нуля</h2>
                <p className="text-rl-muted mb-8 max-w-2xl">
                  Обучение — это удовольствие, а не усталость ещё до занятия. Приезжаешь в студию, берёшь
                  со стойки отстроенную гитару и подключаешься к комбику.
                </p>
                <Accordion groups={GUITAR_PROGRAM} />
              </div>

              <div id="guitar-equipment" className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center scroll-mt-24 py-12">
                <div className="flex flex-col justify-center">
                  <div className="rl-mono text-xs text-rl-orange mb-3 tracking-widest uppercase">Студийный сетап</div>
                  <h2 className="rl-display text-3xl sm:text-4xl mb-10">Всё готово для игры с первой минуты</h2>

                  <div className="space-y-8">
                    <div className="flex gap-6 items-start">
                      <span className="rl-display text-4xl text-rl-muted/40">01</span>
                      <div>
                        <div className="rl-mono text-xs text-rl-orange mb-1">ИНСТРУМЕНТ</div>
                        <h3 className="rl-display text-xl mb-2">Jet JS-400 MBK R Black</h3>
                        <p className="text-sm text-rl-muted leading-relaxed">
                          Современный Stratocaster с мензурой 25.5", эргономичным грифом из обожжённого клёна и мощными керамическими датчиками (H-H).
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-6 items-start">
                      <span className="rl-display text-4xl text-rl-muted/40">02</span>
                      <div>
                        <div className="rl-mono text-xs text-rl-orange mb-1">ЗВУК И ЭФФЕКТЫ</div>
                        <h3 className="rl-display text-xl mb-2">NUX Mighty 20W-MKII</h3>
                        <p className="text-sm text-rl-muted leading-relaxed">
                          Мощный комбик на 20 Вт с поддержкой Bluetooth, 4 каналами и 18 встроенными эффектами. Никаких лишних проводов и долгих настроек.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  ref={guitarTiltRef}
                  className="relative flex items-center justify-center min-h-[380px] sm:min-h-[520px] lg:min-h-[560px]"
                >
                  <img
                    src={jetImg}
                    alt="Электрогитара Jet в студии Riff Lab12"
                    className="relative z-10 max-h-[400px] sm:max-h-[560px] lg:max-h-[620px] w-auto object-contain drop-shadow-[0_30px_70px_rgba(0,0,0,0.85)] transition-transform duration-300 ease-out will-change-transform"
                    style={{
                      transform:
                        `scale(1.35) ` +
                        `translateX(${8 + guitarTilt * 10}%) ` +
                        `rotateY(${guitarTilt * -22}deg) ` +
                        `rotateX(${guitarTilt * 6}deg) ` +
                        `translateY(${guitarTilt * -18}px)`,
                    }}
                  />
                </div>
              </div>

            </div>
          </Reveal>
        ) : (

            <Reveal>
              <div id="drums" className="scroll-mt-24">
                <div className="relative mb-16">

                  <div className="relative">
                    <Kicker tone="red">Drum Lab12 · Ударные</Kicker>
                    <h2 className="rl-display text-4xl mb-4">Не просто бить в барабаны</h2>
                    <p className="text-rl-muted mb-8 max-w-2xl">
                      Мечтаешь сесть за установку и задать свой ритм? Учим чувствовать музыку, а не заучивать
                      удары — с первого занятия.
                    </p>
                    <Accordion groups={DRUM_PROGRAM} tone="red" />
                  </div>
                </div>

                <div id="drum-equipment" className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center scroll-mt-24 py-12">
                  <div className="flex flex-col justify-center">
                    <div className="rl-mono text-xs text-rl-red mb-3 tracking-widest uppercase">Студийный сетап</div>
                    <h2 className="rl-display text-3xl sm:text-4xl mb-10">Всё готово для игры с первой минуты</h2>

                    <div className="space-y-8">
                      <div className="flex gap-6 items-start">
                        <span className="rl-display text-4xl text-rl-muted/40">01</span>
                        <div>
                          <div className="rl-mono text-xs text-rl-red mb-1">ИНСТРУМЕНТ</div>
                          <h3 className="rl-display text-xl mb-2">Pearl Roadshow + Arborea</h3>
                          <p className="text-sm text-rl-muted leading-relaxed">
                            Полная установка, готова к игре с первой минуты.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-6 items-start">
                        <span className="rl-display text-4xl text-rl-muted/40">02</span>
                        <div>
                          <div className="rl-mono text-xs text-rl-red mb-1">ТАРЕЛКИ</div>
                          <h3 className="rl-display text-xl mb-2">Paiste Color Sound 900</h3>
                          <p className="text-sm text-rl-muted leading-relaxed">
                            Свои тарелки возить не нужно.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-6 items-start">
                        <span className="rl-display text-4xl text-rl-muted/40">03</span>
                        <div>
                          <div className="rl-mono text-xs text-rl-red mb-1">АРЕНДА DRUM ROOM</div>
                          <h3 className="rl-display text-xl mb-2">Почасовая аренда</h3>
                          <p className="text-sm text-rl-muted leading-relaxed">
                            1ч — 20 р · 2ч — 40 р · 4ч — 80 р
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative flex items-center justify-center overflow-hidden min-h-[450px] group">
                    <img
                      src={drumSide}
                      alt="Ударная установка Pearl Roadshow"
                      className="relative z-10 max-h-[420px] w-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-transform duration-700 group-hover:scale-105 group-hover:-rotate-1"
                    />
                  </div>
                </div>
              </div>
          </Reveal>
        )}
      </section>

      <section className="bg-rl-panel border-y border-rl-line py-24 px-6">
        <Reveal className="max-w-3xl mx-auto">
          <Kicker tone={tone}>Что вы получите</Kicker>
          <h2 className="rl-display text-2xl sm:text-3xl md:text-4xl mb-10">Шесть причин начать</h2>
            <ol className="space-y-5">
              {[
                "Играть для себя и с друзьями",
                "Играть в группе, выступать, писать треки",
                "Создать свой коллектив",
                "Поступить в музыкальное учебное заведение",
                "Построить карьеру музыканта",
                "Переключаться от рутины после работы",
              ].map((t, i) => (
                <li key={t} className="flex gap-5 items-start">
                  <span
                    className={
                      "rl-display text-3xl w-12 text-right shrink-0 tabular-nums " +
                      (g ? "text-rl-orange" : "text-rl-red")
                    }
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="pt-1 text-left flex-1">{t}</span>
                </li>
              ))}
            </ol>
        </Reveal>
      </section>

<section id="team" className="max-w-6xl mx-auto px-6 py-24">
  <Reveal key={mode}>
    {g ? (
      <div className="grid lg:grid-cols-[380px_1fr] gap-12 lg:gap-16 items-center">
        <TeacherPass
          photo={guitarTeacherImg}
          role="RIFF LAB12"
          tone="orange"
          color
          fields={[
            ["Опыт", "Преподаю с 20XX года"], // Замени на реальный год Арины
            ["Образование", "X"], // Замени на образование Арины
            ["Стаж", "На гитаре с XX лет"], // Замени на возраст/стаж
            ["Проекты", "X"], // Замени на проекты Арины
          ]}
        />
        <div>
          <Kicker tone="orange">Преподаватель · Гитара</Kicker>
          <p className="rl-display text-3xl md:text-4xl leading-tight mb-6">
            «Гитара — честная конкуренция со стрессом»
          </p>

          <CTA href="https://t.me/riff_arina" ext tone="orange">
            Записаться к преподавателю
          </CTA>
        </div>
      </div>
    ) : (
      <div className="grid lg:grid-cols-[380px_1fr] gap-12 lg:gap-16 items-center">
        <TeacherPass
          photo={teacherDrumImg}
          role="DRUM LAB12"
          tone="red"
          color
          fields={[
            ["Опыт", "Преподаю с 2018 года"],
            ["Образование", "ГГКИ (Искусство эстрады)"],
            ["Стаж", "На ударных с 13 лет"],
            ["Проекты", "Сессионный барабанщик"],
          ]}
        />
        <div>
          <Kicker tone="red">Преподаватель · Ударные</Kicker>
          <p className="rl-display text-3xl md:text-4xl leading-tight mb-6">
            «Успех случается с теми, кто пробует»
          </p>

          <CTA href={igUrl} ext tone="red">
            Записаться к преподавателю
          </CTA>
        </div>
      </div>
    )}
  </Reveal>
</section>


<section
  id="pricing"
className={
  "relative pt-8 sm:pt-12 pb-24 px-6 overflow-visible transition-colors duration-700 " +
  (g ? "bg-[#FF7A00]" : "bg-[#E63946]")
}
>
  {/* Декоративные линии фона (струны) */}
  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 z-0">
    <svg
      className="absolute w-[150%] sm:w-full h-[150%] sm:h-full left-[-25%] sm:left-0 top-[-25%] sm:top-0"
      viewBox="0 0 1000 800"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <path d="M-100 400 C 300 -100, 700 900, 1100 400" stroke="#1A1A1A" strokeWidth="1" />
      <path d="M-100 500 C 400 0, 600 1000, 1100 500" stroke="#1A1A1A" strokeWidth="1" />
      <path d="M-100 300 C 200 800, 800 0, 1100 300" stroke="#1A1A1A" strokeWidth="1" />
    </svg>
  </div>

  <Reveal className="max-w-3xl mx-auto relative z-10 flex flex-col items-center">

    {/* Инструмент — визуально пересекает границу секций */}
    <div
      className={
        "w-[130%] sm:w-[95%] max-w-[850px] pointer-events-none z-10 " +
        "drop-shadow-[0_20px_30px_rgba(0,0,0,0.4)] " +
        "-mt-28 sm:-mt-40 -mb-6 sm:-mb-16"
      }
    >
      <img
        src={g ? jetImg : drumSide}
        alt={g ? "Guitar" : "Drums"}
        className={
          "w-full h-auto object-contain transform " +
          (g ? "-rotate-[75deg]" : "")
        }
      />
    </div>

    {/* Заголовок */}
    <div className="text-center mb-10 relative z-0">
      <h2 className="rl-display text-[3.5rem] sm:text-[6rem] leading-[0.85] text-[#1A1A1A] font-black uppercase tracking-tighter">
        {g ? "Guitar" : "Drum"}
        <br />
        Lessons
      </h2>

      <p className="text-[#1A1A1A] text-xs sm:text-sm font-bold uppercase tracking-widest mt-6 mb-2">
        Абонементы на 1 месяц обучения
      </p>
    </div>

    {/* Таблица цен */}
    <div className="border border-[#1A1A1A]/30 bg-transparent flex flex-col w-full relative z-20">
      {g ? (
        <>
          <PriceRow
            n="1"
            unit="ЧАС"
            label="ПРОБНОЕ"
            note="РАЗОВОЕ"
            price="55р."
            highlight
          />
          <PriceRow
            n="4"
            unit="ЧАСА"
            label="ОДИН РАЗ"
            note="В НЕДЕЛЮ"
            price="200р. в месяц"
            save="20р."
          />
          <PriceRow
            n="8"
            unit="ЧАСОВ"
            label="ДВА РАЗА"
            note="В НЕДЕЛЮ"
            price="380р. в месяц"
            save="60р."
          />
        </>
      ) : (
        <>
          <PriceRow
            n="1"
            unit="ЧАС"
            label="РАЗОВОЕ"
            note="ПРОБНОЕ"
            price="50р."
            highlight
          />
          <PriceRow
            n="4"
            unit="ЧАСА"
            label="ОДИН РАЗ"
            note="В НЕДЕЛЮ"
            price="180р. в месяц"
            save="20р."
          />
          <PriceRow
            n="8"
            unit="ЧАСОВ"
            label="ДВА РАЗА"
            note="В НЕДЕЛЮ"
            price="340р. в месяц"
            save="60р."
          />
        </>
      )}
    </div>

    <p className="text-xs text-[#1A1A1A] font-medium mt-6 text-center tracking-wide relative z-20">
      Время одного занятия = 60 минут
    </p>
  </Reveal>
</section>
      
      <section id="contact" className="max-w-4xl mx-auto px-6 py-24 text-center">
        <Reveal>
          <Kicker tone={tone}>Гродно, Беларусь</Kicker>
          <h2 className="rl-display text-2xl sm:text-4xl md:text-5xl mb-8">Записывайся на пробное занятие</h2>
          <div className="flex gap-4 justify-center flex-wrap mb-8">
            <CTA href={igUrl} ext tone={tone}>
              Написать в директ
            </CTA>
            <CTA href={igUrl} ext ghost tone={tone}>
              Instagram @{igHandle}
            </CTA>
          </div>
          <p className="rl-mono text-xs text-rl-muted mb-3">
            <span className="text-rl-orange">Riff Lab12</span>
            {"  ·  "}
            <span className="text-rl-red">Drum Lab12</span>
          </p>
          <div className="flex gap-6 justify-center items-center">
            {SOCIAL_LINKS.map((s, i) => (
              <span key={s.href} className="flex items-center gap-6">
                {i === 2 && <span className="w-px h-6 bg-rl-line" aria-hidden="true" />}
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  className={
                    "text-rl-muted transition-colors " +
                    (s.tone === "orange" ? "hover:text-rl-orange" : "hover:text-rl-red")
                  }
                >
                  <SocialIcon name={s.icon} className="w-7 h-7" />
                </a>
              </span>
            ))}
          </div>
        </Reveal>
      </section>

{/* ─── Плавающая кнопка только на мобильных ─── */}
<div
  className={
    "fixed bottom-6 inset-x-0 z-50 flex justify-center px-6 md:hidden transition-all duration-500 ease-out motion-reduce:transition-none " +
    (showCta ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none")
  }
>
  <a
    href="#contact"
    className={
      "flex items-center justify-center py-4 px-8 font-heading text-[15px] font-black tracking-wider uppercase rounded-2xl " +
      "backdrop-blur-xl transition-all duration-300 active:scale-95 " +
      (g
        ? "bg-[#1A1A1A]/80 border border-[#FF7A00] text-[#FF7A00] shadow-[0_8px_32px_rgba(255,122,0,0.35)]"
        : "bg-[#1A1A1A]/80 border border-[#E63946] text-[#E63946] shadow-[0_8px_32px_rgba(230,57,70,0.35)]")
    }
  >
    Записаться на пробное
  </a>
</div>

<footer className="border-t border-rl-line py-6 md:py-4 px-6">
  <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4">
    <span className="rl-display text-[1rem] sm:text-lg text-rl-muted opacity-40 transition-opacity hover:opacity-100">
      RIFFLAB12 × DRUMLAB12
    </span>
    <p className="text-[10px] sm:text-xs text-rl-muted text-center md:text-right">
      © 2026 Riff Lab12 · Drum Lab12. Студии гитары и ударных, Гродно.
    </p>
  </div>
</footer>
    </main>
  );
}