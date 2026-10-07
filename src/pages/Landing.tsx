import { forwardRef, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { ComponentType, CSSProperties, MouseEvent as ReactMouseEvent, ReactNode, RefObject } from "react";
import jetImg from "../assets/JET.png";
import guitarTeacherImg from "../assets/teacher_riff.jpg";
import teacherDrumImg from "../assets/drum_teacher.png";
import drumSide from "../assets/Drum_studio_side.png";
import drumPng from "../assets/drum_png.png";

type Mode = "guitar" | "drums";
type Tone = "orange" | "red";
type SocialName = "instagram" | "telegram" | "tiktok";

/* ─────────────────────────────────────────────────────────────
 * ТОНЫ (оранжевый / красный)
 *
 * Tailwind ищет классы в исходниках как ГОТОВЫЕ строки. Склейка вида
 * "hover:" + "text-rl-orange" ему не видна, и такой класс может не попасть
 * в CSS. Поэтому все цветовые варианты лежат здесь целыми строками,
 * а в компонентах мы только берём TONE[tone].что-то.
 * ───────────────────────────────────────────────────────────── */
type ToneKey =
  | "text"
  | "bg"
  | "bgSoft"
  | "border"
  | "hoverText"
  | "hoverBorder"
  | "shadowSoft"
  | "cta"
  | "floatingCta"
  | "digit"
  | "groupHoverDigit"
  | "stepOpenCard"
  | "stepGlow"
  | "cordGlow"
  | "cssVar";

const TONE: Record<Tone, Record<ToneKey, string>> = {
  orange: {
    text: "text-rl-orange",
    bg: "bg-rl-orange",
    bgSoft: "bg-rl-orange/10",
    border: "border-rl-orange",
    hoverText: "hover:text-rl-orange",
    hoverBorder: "hover:border-rl-orange",
    shadowSoft: "shadow-rl-orange/20",
    cta: "bg-rl-orange text-rl-bg hover:brightness-110",
    floatingCta: "bg-rl-orange text-rl-bg shadow-rl-orange/20 border border-rl-orange/50",
    digit: "text-rl-orange/15",
    groupHoverDigit: "group-hover:text-rl-orange/15",
    stepOpenCard: "border-rl-orange/50 shadow-[0_4px_20px_rgba(255,122,0,0.08)]",
    // блик (светлая внутренняя тень) на «раскалённом металле»
    stepGlow: "shadow-[0_0_15px_rgba(255,122,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.3)]",
    cordGlow: "0 0 10px rgba(255,122,0,0.5)",
    cssVar: "var(--color-rl-orange)",
  },
  red: {
    text: "text-rl-red",
    bg: "bg-rl-red",
    bgSoft: "bg-rl-red/10",
    border: "border-rl-red",
    hoverText: "hover:text-rl-red",
    hoverBorder: "hover:border-rl-red",
    shadowSoft: "shadow-rl-red/20",
    cta: "bg-rl-red text-rl-bg hover:brightness-110",
    floatingCta: "bg-rl-red text-rl-bg shadow-rl-red/20 border border-rl-red/50",
    digit: "text-rl-red/15",
    groupHoverDigit: "group-hover:text-rl-red/15",
    stepOpenCard: "border-rl-red/50 shadow-[0_4px_20px_rgba(230,57,70,0.08)]",
    stepGlow: "shadow-[0_0_15px_rgba(230,57,70,0.6),inset_0_2px_4px_rgba(255,255,255,0.3)]",
    cordGlow: "0 0 10px rgba(230,57,70,0.5)",
    cssVar: "var(--color-rl-red)",
  },
};

// ─── Позиционирование инструмента в секции PRICING
const PRICING_ART = {
  // guitar: в вёрстке не используется (гитара рисуется компонентом PricingGuitar, настройки в PRICING_GUITAR);
  // запись оставлена, чтобы тип ModeConfig["pricing"]["art"] не менялся
  guitar: {
    src: jetImg,
    alt: "Guitar",
    marginTop: "-14rem", // ← ВЫШЕ/НИЖЕ (мобилка)  минус = выше
    marginTopSm: "-10rem", // ← ВЫШЕ/НИЖЕ (десктоп)
    marginBottom: "-4rem",
    marginBottomSm: "-4rem",
    shiftX: -10, // ← ВЛЕВО/ВПРАВО (мобилка)   минус = влево
    shiftXSm: 16, // ← ВЛЕВО/ВПРАВО (десктоп)
    width: "130vw", // ← ШИРИНА (мобилка)
    widthSm: "95%",
    maxWidth: "850px",
    rotate: 60, // ← ПОВОРОТ в градусах
    scale: 0.89, // ← РАЗМЕР (1 = 100%)
  },
  drums: {
    src: drumPng,
    alt: "Drums",
    marginTop: "-9rem",
    marginTopSm: "-7rem",
    marginBottom: "-1rem",
    marginBottomSm: "-2.5rem",
    shiftX: 0,
    shiftXSm: -24,
    width: "130vw",
    widthSm: "95%",
    maxWidth: "850px",
    rotate: 0,
    scale: 0.8,
  },
};

/* ─────────────────────────────────────────────────────────────
 * ХУКИ
 * ───────────────────────────────────────────────────────────── */

/** Подписка на media query через useSyncExternalStore (реагирует на resize / смену настроек). */
function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false, // значение на сервере
  );
}

/* ─────────────────────────────────────────────────────────────
 * МЕЛКИЕ КОМПОНЕНТЫ
 * ───────────────────────────────────────────────────────────── */

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

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
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
      // threshold: 0 + отрицательный отступ снизу = «сработать, когда верх блока
      // зашёл в экран на ~80px». Проценты высоты (threshold: 0.15) для высоких
      // блоков вроде секции программы срабатывали слишком поздно.
      { threshold: 0, rootMargin: "0px 0px -80px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className}>
      <div
        className={"transition-all duration-700 ease-out " + (shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")}
        style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
      >
        {children}
      </div>
    </div>
  );
}

function Kicker({ children, tone = "orange" }: { children: ReactNode; tone?: Tone }) {
  return <p className={"rl-mono text-xs mb-3 " + TONE[tone].text}>{children}</p>;
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
  tone?: Tone;
  className?: string;
}) {
  const t = TONE[tone];
  const style = ghost ? "border border-rl-line text-rl-ink " + t.hoverBorder : t.cta;
  return (
    <a
      href={href}
      target={ext ? "_blank" : undefined}
      rel={ext ? "noopener noreferrer" : undefined}
      className={"rl-mono text-xs px-6 py-3 rounded-full inline-block transition hover:scale-105 " + style + " " + className}
    >
      {children}
    </a>
  );
}

/* ─────────────────────────────────────────────────────────────
 * ПРАЙС
 * ───────────────────────────────────────────────────────────── */

type PriceRowData = {
  n: string;
  unit: string;
  label: string;
  note?: string;
  price: string;
  save?: string;
  highlight?: boolean;
};

function PriceRow({ n, unit, label, note, price, save, highlight }: PriceRowData) {
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
        <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
          <path d="M1 1L5 5L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* 2: Название и Описание */}
      <div className={"flex flex-col justify-center leading-tight " + textColor}>
        <span className="text-xs sm:text-sm font-bold uppercase tracking-widest">{label}</span>
        {note && <span className="text-xs sm:text-sm font-black uppercase tracking-widest">{note}</span>}
      </div>

      {/* Разделитель */}
      <div className={arrowColor}>
        <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
          <path d="M1 1L5 5L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* 3: Цена и Экономия (текст по левому краю, фиксированная ширина) */}
      <div className="shrink-0 w-[100px] sm:w-[130px] text-left">
        <div className={"text-sm sm:text-base font-bold " + (highlight ? "text-[#4DB8FF]" : textColor)}>{price}</div>
        {save && <div className={"text-[10px] sm:text-xs mt-1 font-medium " + textColor}>Вы экономите {save}</div>}
      </div>
    </div>
  );
}

type PracticeData = {
  title: string;
  subtitle: string;
  price?: { value: string; per: string };
  rows?: PriceRowData[];
  schedule?: { title: string; lines: [string, string][] };
  noteTitle: string;
  noteText: string;
  noteUppercase?: boolean;
};

/** Блок «самостоятельная практика» под таблицей цен (у гитары — цена + расписание, у ударных — свои тарифы). */
function PracticeBlock({ data, tone }: { data: PracticeData; tone: Tone }) {
  const note = (
    <div className={"border-l-2 border-[#1A1A1A]/40 pl-4 " + (data.schedule ? "flex flex-col justify-center" : "mt-2")}>
      <p className="text-xs text-[#1A1A1A] font-black uppercase tracking-wider mb-1">{data.noteTitle}</p>
      <p className={"text-xs text-[#1A1A1A]/80 font-medium" + (data.noteUppercase ? " uppercase" : "")}>{data.noteText}</p>
    </div>
  );

  return (
    <div className="bg-[#1A1A1A]/5 border-t border-[#1A1A1A]/30 p-6 sm:p-8 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="rl-display text-2xl sm:text-3xl text-[#1A1A1A] font-black uppercase tracking-tight">{data.title}</h3>
          <p className="text-[#1A1A1A] text-xs font-bold uppercase tracking-widest mt-1">{data.subtitle}</p>
        </div>
        {data.price && (
          <div className="flex items-baseline gap-2 shrink-0">
            <span className="rl-display text-4xl sm:text-5xl font-black text-[#1A1A1A]">
              {data.price.value}
              <span className="text-2xl">р.</span>
            </span>
            <span className="text-sm font-bold uppercase tracking-wider text-[#1A1A1A]/80">{data.price.per}</span>
          </div>
        )}
      </div>

      {data.rows && (
        <div className="flex flex-col w-full border-t border-[#1A1A1A]/30 mt-2">
          {data.rows.map((r) => (
            <PriceRow key={r.n + r.label} {...r} />
          ))}
        </div>
      )}

      {data.schedule ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
          <div className="border-l-2 border-[#1A1A1A]/40 pl-4">
            <p className="text-xs font-black text-[#1A1A1A] uppercase tracking-wider mb-2">{data.schedule.title}</p>
            <ul className="text-xs text-[#1A1A1A] font-medium space-y-1.5">
              {data.schedule.lines.map(([day, hours]) => (
                <li key={day}>
                  <span className="font-bold">{day}:</span> {hours}
                </li>
              ))}
            </ul>
          </div>
          {note}
        </div>
      ) : (
        note
      )}

      <a
        href="#contact"
        className={
          "mt-2 w-full sm:w-auto self-start border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] " +
          TONE[tone].hoverText +
          " transition-colors rl-mono text-xs px-6 py-3 rounded-full uppercase tracking-wider text-center"
        }
      >
        Запись в директ
      </a>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
 * ПРЕПОДАВАТЕЛЬ
 * ───────────────────────────────────────────────────────────── */

/**
 * Пропуск «ALL ACCESS».
 *
 * Одна карточка на всё время жизни страницы (не пересоздаётся), но выход проигрывается КАЖДЫЙ раз:
 *  • при первом появлении в экране;
 *  • при каждой смене студии (старый пропуск улетает, новый вылетает);
 *  • когда пролистала мимо и вернулась к блоку.
 *
 * Выход: пропуск вылетает сбоку с 3D-поворотом и размытием, врезается в место с перелётом
 * и отскоком. В момент удара: вспышка свечения, две ударные волны, россыпь искр и лёгкая тряска.
 * Потом фото «проявляется» из ч/б, по карточке проходит сканер, и строки данных появляются,
 * когда до них доходит луч. Гитара вылетает слева, барабаны справа.
 *
 * Анимируются только opacity, transform и filter. При prefers-reduced-motion показывается готовый статичный пропуск.
 */
const PASS = {
  tilt: -2, // deg, лёгкий наклон в покое
  flyDur: 0.95, // сек, длительность вылета
  impact: 0.57, // сек, момент удара (вспышка, волны, искры). Совпадает с ~60% вылета
  swapOut: 260, // мс, как быстро улетает старый пропуск при смене студии
  sparks: 26, // сколько искр
  sparkDist: [90, 260], // px, дальность полёта искр (от, до)
  shake: 5, // px, сила тряски в момент удара (0 = выключить)
  scan: { delay: 0.85, dur: 1.1 }, // сек: когда стартует и сколько идёт линия сканера (после приземления)
  develop: { delay: 0.65, dur: 1.2 }, // сек: когда начинает и сколько «проявляется» фото
};

// ключевые кадры: вылет дублируется под двумя именами (a/b), чтобы анимация перезапускалась на том же элементе
const passFly = (n: string) => `
@keyframes ${n} {
  0% {
    opacity: 0;
    filter: blur(10px) brightness(1.8);
    transform: perspective(1000px) translate3d(calc(var(--dir) * min(300px, 55vw)), 150px, -320px)
      rotateY(calc(var(--dir) * -70deg)) rotateZ(calc(var(--dir) * 18deg)) scale(0.55);
  }
  40% { opacity: 1; }
  60% {
    opacity: 1;
    filter: blur(0) brightness(1.15);
    transform: perspective(1000px) translate3d(calc(var(--dir) * -12px), -12px, 0)
      rotateY(calc(var(--dir) * 7deg)) rotateZ(calc(var(--tilt) * 1deg - 3deg)) scale(1.09);
  }
  78% {
    filter: blur(0) brightness(1);
    transform: perspective(1000px) translate3d(0, 6px, 0)
      rotateY(calc(var(--dir) * -2deg)) rotateZ(calc(var(--tilt) * 1deg + 1deg)) scale(0.985);
  }
  100% {
    opacity: 1;
    filter: blur(0) brightness(1);
    transform: perspective(1000px) translate3d(0, 0, 0) rotateY(0deg) rotateZ(calc(var(--tilt) * 1deg)) scale(1);
  }
}`;

const passShake = (n: string, px: number) => `
@keyframes ${n} {
  0% { transform: translate3d(0, 0, 0); }
  20% { transform: translate3d(${px}px, ${-px}px, 0); }
  40% { transform: translate3d(${-px}px, ${px * 0.6}px, 0); }
  60% { transform: translate3d(${px * 0.5}px, ${px * 0.3}px, 0); }
  80% { transform: translate3d(${-px * 0.3}px, 0, 0); }
  100% { transform: translate3d(0, 0, 0); }
}`;

const PASS_KEYFRAMES = `
${passFly("rl-pass-fly-a")}
${passFly("rl-pass-fly-b")}
${passShake("rl-pass-shake-a", PASS.shake)}
${passShake("rl-pass-shake-b", PASS.shake)}
@keyframes rl-pass-out {
  to {
    opacity: 0;
    filter: blur(6px);
    transform: translate3d(calc(var(--dir) * -1 * min(260px, 45vw)), 30px, 0)
      rotate(calc(var(--dir) * -12deg)) scale(0.8);
  }
}
@keyframes rl-pass-scan {
  from { transform: translateY(-100%); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  to { transform: translateY(0); opacity: 0; }
}
@keyframes rl-pass-flash {
  from { opacity: 0; }
  20% { opacity: 0.95; }
  to { opacity: 0; }
}
@keyframes rl-pass-ring {
  from { opacity: 0.9; transform: scale(1); }
  to { opacity: 0; transform: scale(var(--s, 1.4)); }
}
@keyframes rl-pass-spark {
  from { opacity: 1; transform: translate(-50%, -50%) translate(0, 0) scale(1); }
  70% { opacity: 1; }
  to { opacity: 0; transform: translate(-50%, -50%) translate(var(--dx), var(--dy)) scale(0.15); }
}`;

type PassData = { photo: string; role: string; fields: [string, string][]; tone: Tone };

function TeacherPass({
  photo,
  role,
  tone,
  fields,
  color = false,
}: {
  photo: string;
  role: string;
  tone: Tone;
  fields: [string, string][];
  color?: boolean;
}) {
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timers = useRef<number[]>([]);
  const armed = useRef(true); // можно проиграть выход заново (блок успел уйти из экрана)
  // static: всё видно сразу (reduced-motion, до JS); pre: ждём появления в экране; run: показан
  const [phase, setPhase] = useState<"static" | "pre" | "run">("static");
  // то, что сейчас нарисовано. Отстаёт от пропсов, пока старый пропуск улетает
  const [shown, setShown] = useState<PassData>({ photo, role, fields, tone });
  const [leaving, setLeaving] = useState(false);
  const [revealed, setRevealed] = useState(false); // фото проявлено, строки и подпись показаны
  const [playId, setPlayId] = useState(0); // номер проигрывания выхода (0 = ещё не было)

  const t = TONE[shown.tone];
  const dir = tone === "orange" ? -1 : 1; // гитара летит слева, барабаны справа
  const ab = playId % 2 ? "a" : "b";

  // запустить выход заново (опционально сразу с новым содержимым)
  const play = useCallback((next?: PassData) => {
    if (next) setShown(next);
    setLeaving(false);
    setRevealed(false);
    setPlayId((n) => n + 1);
    timers.current.push(window.setTimeout(() => setRevealed(true), 60));
  }, []);

  // до первой отрисовки прячем карточку, чтобы не мигнуло
  useIsoLayoutEffect(() => {
    setPhase(reduceMotion ? "static" : "pre");
  }, [reduceMotion]);

  // выход при появлении в экране: и в первый раз, и после того как ушла из блока и вернулась
  useEffect(() => {
    if (reduceMotion) return;
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (!armed.current) return;
          armed.current = false;
          setPhase("run");
          play();
        } else {
          armed.current = true;
        }
      },
      { threshold: 0, rootMargin: "0px 0px -80px 0px" },
    );
    io.observe(root);
    return () => io.disconnect();
  }, [reduceMotion, play]);

  // смена студии: старый пропуск улетает, потом подставляем новое и вылетает новый
  useEffect(() => {
    if (photo === shown.photo && role === shown.role) {
      setLeaving(false); // быстро переключили туда-обратно: просто остаёмся
      return;
    }
    const next: PassData = { photo, role, fields, tone };
    if (reduceMotion || phase !== "run") {
      setShown(next); // ещё не показан или без анимации: меняем сразу
      return;
    }
    setLeaving(true);
    const id = window.setTimeout(() => play(next), PASS.swapOut);
    return () => window.clearTimeout(id);
  }, [photo, role, fields, tone, shown.photo, shown.role, phase, reduceMotion, play]);

  useEffect(
    () => () => {
      timers.current.forEach(window.clearTimeout);
    },
    [],
  );

  // искры: новый набор на каждое проигрывание. Стартуют с краёв карточки и летят наружу
  const sparks = useMemo(() => {
    if (!playId) return [];
    return Array.from({ length: PASS.sparks }, () => {
      const a = Math.random() * Math.PI * 2;
      const cx = Math.cos(a);
      const cy = Math.sin(a);
      const dist = PASS.sparkDist[0] + Math.random() * (PASS.sparkDist[1] - PASS.sparkDist[0]);
      return {
        x: 50 + Math.max(-50, Math.min(50, cx * 70)),
        y: 50 + Math.max(-50, Math.min(50, cy * 70)),
        dx: cx * dist,
        dy: cy * dist + 40 + Math.random() * 40, // чуть падают вниз, как настоящие искры
        size: 2 + Math.random() * 4,
        dur: 0.55 + Math.random() * 0.55,
        delay: Math.random() * 0.06,
        hot: Math.random() < 0.35, // часть искр белая, раскалённая
      };
    });
  }, [playId]);

  const anim = phase !== "static";
  const hidden = phase === "pre";
  const fx = phase === "run" && !leaving && playId > 0;

  // строки данных появляются, когда до них доходит линия сканера: считаем по положению строки в карточке
  useIsoLayoutEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const h = card.offsetHeight || 1;
    rowRefs.current.forEach((row) => {
      if (!row) return;
      if (!revealed) {
        row.style.transitionDelay = "0s";
        return;
      }
      const f = Math.max(0, Math.min(1, (row.offsetTop + row.offsetHeight / 2) / h));
      row.style.transitionDelay = `${(PASS.scan.delay + PASS.scan.dur * f).toFixed(2)}s`;
    });
  }, [revealed, shown]);

  const flyStyle: CSSProperties = !anim
    ? { transform: `rotate(${PASS.tilt}deg)` }
    : hidden
      ? { opacity: 0, transform: `rotate(${PASS.tilt}deg)` }
      : leaving
        ? { animation: `rl-pass-out ${PASS.swapOut}ms cubic-bezier(0.5, 0, 1, 0.6) both` }
        : { animation: `rl-pass-fly-${ab} ${PASS.flyDur}s cubic-bezier(0.2, 0.8, 0.3, 1) both` };

  const rowCls = "flex justify-between gap-3 text-xs rl-mono transition-[opacity,transform] duration-300 ";

  return (
    <div
      ref={rootRef}
      className="relative mx-auto max-w-sm"
      style={{ "--c": t.cssVar, "--dir": dir, "--tilt": PASS.tilt } as CSSProperties}
    >
      {anim && <style>{PASS_KEYFRAMES}</style>}

      {/* тряска в момент удара */}
      <div style={fx && PASS.shake > 0 ? { animation: `rl-pass-shake-${ab} 0.35s ease-out ${PASS.impact}s both` } : undefined}>
        <div style={{ ...flyStyle, willChange: anim ? "transform, opacity, filter" : undefined }}>
          <div
            ref={cardRef}
            className={"relative rounded-3xl border-2 bg-rl-card p-2 shadow-2xl transition-colors duration-500 " + t.border}
          >
            {/* Вспышка свечения в момент удара */}
            {fx && (
              <div
                key={playId}
                aria-hidden="true"
                className="absolute -inset-1 rounded-[28px] pointer-events-none"
                style={{
                  boxShadow: "0 0 70px 12px var(--c)",
                  animation: `rl-pass-flash 0.9s ease-out ${PASS.impact - 0.05}s both`,
                }}
              />
            )}

            <div className="rounded-2xl overflow-hidden bg-rl-card">
              <div className="aspect-[3/4] relative">
                <img
                  src={shown.photo}
                  alt={shown.role}
                  className={"w-full h-full object-cover " + (color ? "" : "grayscale")}
                />
                {/* «Проявление»: тёмная ч/б копия поверх цветного фото плавно растворяется (только opacity) */}
                {color && anim && (
                  <img
                    src={shown.photo}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover grayscale brightness-75 contrast-125 transition-opacity ease-out"
                    style={{
                      opacity: revealed ? 0 : 1,
                      transitionDuration: revealed ? `${PASS.develop.dur}s` : "0s",
                      transitionDelay: revealed ? `${PASS.develop.delay}s` : "0s",
                    }}
                  />
                )}
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-rl-card to-transparent" />
              </div>
              <div className="p-5">
                <div
                  className={"rl-mono text-[10px] mb-3 tracking-widest transition-opacity duration-300 " + t.text}
                  style={{
                    opacity: anim && !revealed ? 0 : 1,
                    transitionDelay: revealed ? `${PASS.impact}s` : "0s",
                  }}
                >
                  ALL ACCESS · {shown.role}
                </div>
                <div className="space-y-2 border-t border-rl-line pt-3">
                  {shown.fields.map(([k, v], i) => (
                    <div
                      key={k}
                      ref={(el) => {
                        rowRefs.current[i] = el;
                      }}
                      className={rowCls + (anim && !revealed ? "opacity-0 translate-y-1.5" : "opacity-100 translate-y-0")}
                    >
                      <span className="text-rl-muted shrink-0">{k}</span>
                      <span className="text-right">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Сканер: проход сверху вниз после приземления. Слой высотой в карточку едет от -100% до 0, линия на его нижнем краю */}
            {fx && revealed && (
              <div aria-hidden="true" className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none z-20">
                <div
                  key={playId}
                  className="absolute inset-0"
                  style={{ animation: `rl-pass-scan ${PASS.scan.dur}s ${PASS.scan.delay}s linear both`, opacity: 0 }}
                >
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(to bottom, transparent 70%, var(--c) 100%)", opacity: 0.18 }}
                  />
                  <div
                    className="absolute inset-x-0 bottom-0"
                    style={{ height: 2, background: "var(--c)", boxShadow: "0 0 16px 3px var(--c)" }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Эффекты удара живут вне качающейся карточки: ударные волны и искры от краёв пропуска */}
      {fx && (
        <div key={playId} aria-hidden="true" className="absolute inset-0 pointer-events-none z-30">
          <div
            className="absolute inset-0 rounded-3xl"
            style={
              {
                border: "2px solid var(--c)",
                "--s": 1.35,
                animation: `rl-pass-ring 0.75s ease-out ${PASS.impact}s both`,
              } as CSSProperties
            }
          />
          <div
            className="absolute inset-0 rounded-3xl"
            style={
              {
                border: "1px solid var(--c)",
                "--s": 1.75,
                animation: `rl-pass-ring 0.95s ease-out ${PASS.impact + 0.08}s both`,
              } as CSSProperties
            }
          />
          {sparks.map((s, i) => (
            <span
              key={i}
              className="absolute rounded-full"
              style={
                {
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  width: s.size,
                  height: s.size,
                  background: s.hot ? "#fff" : "var(--c)",
                  boxShadow: s.hot ? "0 0 8px 2px rgba(255,255,255,0.9)" : "0 0 8px 2px var(--c)",
                  "--dx": `${s.dx.toFixed(1)}px`,
                  "--dy": `${s.dy.toFixed(1)}px`,
                  animation: `rl-pass-spark ${s.dur.toFixed(2)}s cubic-bezier(0.1, 0.7, 0.3, 1) ${(PASS.impact + s.delay).toFixed(2)}s both`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
 * БАРАБАН В ПРАЙСЕ
 * ───────────────────────────────────────────────────────────── */

/**
 * Малый барабан в секции PRICING (режим «барабаны»). Без звука.
 *
 *  1. Падение. Барабан «падает с камеры»: летит сверху, уменьшаясь, бьётся о шов секции,
 *     подпрыгивает и успокаивается. В момент удара: вспышка, три ударные волны, россыпь осколков.
 *     Проигрывается КАЖДЫЙ раз: при смене студии на барабаны и когда вернулась к блоку после скролла.
 *  2. Пульс. Дальше он «дышит» в ритм 4/4: лёгкий толчок на каждую долю, акцент на первой
 *     плюс тонкое кольцо раз в такт.
 *  3. Удар по клику. Тап или клик по барабану: он вдавливается от точки касания, подпрыгивает,
 *     по нему расходится кольцо и разлетаются осколки. Работает и с клавиатуры (Enter / Space).
 *
 * Слои transform независимы (падение → удар → пульс → картинка), поэтому не мешают друг другу.
 * Волны красные на красном фоне не видны, поэтому белые и тёмные. Тень (drop-shadow) стоит на самой
 * картинке: так браузер кэширует её и не пересчитывает каждый кадр. При prefers-reduced-motion
 * показывается обычная картинка.
 */
const DRUM = {
  circle: 0.86, // доля ширины картинки, которую занимает корпус (кликабельная зона и волны). Подгони, если мимо
  dropFrom: 520, // px, с какой высоты начинает падать
  dropDur: 1.1, // сек
  impactAt: 0.52, // доля падения, когда барабан бьётся (совпадает с ключевым кадром 52%)
  beat: 2, // сек, один такт 4/4 (120 bpm)
  bigSparks: 14, // осколки при падении
  hitSparks: 8, // осколки при клике
  dark: "#1A1A1A",
  light: "#fff",
};

const drumDrop = (n: string) => `
@keyframes ${n} {
  0% { transform: translate3d(0, -${DRUM.dropFrom}px, 0) scale(1.7) rotate(-14deg); animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45); }
  52% { transform: translate3d(0, 0, 0) scale(1) rotate(2deg); animation-timing-function: cubic-bezier(0.2, 0.7, 0.3, 1); }
  66% { transform: translate3d(0, 0, 0) scale(1.1) rotate(-1deg); animation-timing-function: ease-in-out; }
  80% { transform: translate3d(0, 0, 0) scale(0.975) rotate(0.5deg); animation-timing-function: ease-in-out; }
  91% { transform: translate3d(0, 0, 0) scale(1.015) rotate(0deg); animation-timing-function: ease-in-out; }
  100% { transform: translate3d(0, 0, 0) scale(1) rotate(0deg); }
}`;
const drumFade = (n: string) => `@keyframes ${n} { from { opacity: 0; } to { opacity: 1; } }`;
const drumHit = (n: string) => `
@keyframes ${n} {
  0% { transform: translate3d(0, 0, 0) scale(1) rotate(0deg); }
  22% { transform: translate3d(var(--hx), var(--hy), 0) scale(0.93) rotate(var(--hr)); }
  60% { transform: translate3d(0, 0, 0) scale(1.04) rotate(0deg); }
  100% { transform: translate3d(0, 0, 0) scale(1) rotate(0deg); }
}`;
const drumIdle = (n: string) => `
@keyframes ${n} {
  0%, 100% { transform: scale(1.035); }
  12% { transform: scale(1); }
  25% { transform: scale(1.015); }
  37% { transform: scale(1); }
  50% { transform: scale(1.02); }
  62% { transform: scale(1); }
  75% { transform: scale(1.015); }
  87% { transform: scale(1); }
}`;
const drumPulse = (n: string) => `
@keyframes ${n} {
  0% { opacity: 0.4; transform: scale(1); }
  35% { opacity: 0; transform: scale(1.22); }
  100% { opacity: 0; transform: scale(1.22); }
}`;

const DRUM_KEYFRAMES = `
${drumDrop("rl-drum-drop-a")}
${drumDrop("rl-drum-drop-b")}
${drumFade("rl-drum-fade-a")}
${drumFade("rl-drum-fade-b")}
${drumHit("rl-drum-hit-a")}
${drumHit("rl-drum-hit-b")}
${drumIdle("rl-drum-idle-a")}
${drumIdle("rl-drum-idle-b")}
${drumPulse("rl-drum-pulse-a")}
${drumPulse("rl-drum-pulse-b")}
@keyframes rl-drum-ring {
  from { opacity: 0.9; transform: scale(1); }
  to { opacity: 0; transform: scale(var(--s, 1.6)); }
}
@keyframes rl-drum-flash {
  from { opacity: 0.85; transform: scale(0.7); }
  to { opacity: 0; transform: scale(1.35); }
}
@keyframes rl-drum-spark {
  from { opacity: 1; transform: translate(-50%, -50%) translate(0, 0) scale(1); }
  70% { opacity: 1; }
  to { opacity: 0; transform: translate(-50%, -50%) translate(var(--dx), var(--dy)) scale(0.2); }
}`;

/** Осколки: стартуют с кромки барабана и летят наружу, чуть падая вниз. */
function drumBurst(n: number, dist: [number, number], rim: number) {
  return Array.from({ length: n }, () => {
    const a = Math.random() * Math.PI * 2;
    const d = dist[0] + Math.random() * (dist[1] - dist[0]);
    return {
      x: 50 + Math.cos(a) * rim * 50,
      y: 50 + Math.sin(a) * rim * 50,
      dx: Math.cos(a) * d,
      dy: Math.sin(a) * d + 30 + Math.random() * 40,
      size: 4 + Math.random() * 6,
      dur: 0.6 + Math.random() * 0.5,
      delay: Math.random() * 0.05,
      light: Math.random() < 0.5,
    };
  });
}

function PricingDrum({ src, alt, rotate, scale }: { src: string; alt: string; rotate: number; scale: number }) {
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const rootRef = useRef<HTMLDivElement>(null);
  const armed = useRef(true); // можно проиграть падение заново (блок успел уйти из экрана)
  // static: просто картинка (reduced-motion, до JS); pre: ждём появления; run: показан
  const [phase, setPhase] = useState<"static" | "pre" | "run">("static");
  const [playId, setPlayId] = useState(0);
  const [visible, setVisible] = useState(false); // пульс крутится только пока барабан в экране
  const [hit, setHit] = useState<{ id: number; hx: number; hy: number; hr: number } | null>(null);

  const ab = playId % 2 ? "a" : "b";
  const hab = (hit?.id ?? 0) % 2 ? "a" : "b";
  const impact = DRUM.dropDur * DRUM.impactAt;
  const size = `${DRUM.circle * scale * 100}%`; // корпус с учётом scale картинки

  useIsoLayoutEffect(() => {
    setPhase(reduceMotion ? "static" : "pre");
  }, [reduceMotion]);

  // блок с ref рисуется только после первого перехода из static в pre, поэтому следим и за animated:
  // иначе наблюдатель подпишется на пустой ref и барабан навсегда останется прозрачным
  const animated = phase !== "static";

  // падение при появлении в экране: и в первый раз, и после того как ушла из блока и вернулась
  useEffect(() => {
    if (reduceMotion || !animated) return;
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setVisible(e.isIntersecting);
        if (e.isIntersecting) {
          if (!armed.current) return;
          armed.current = false;
          setPhase("run");
          setPlayId((n) => n + 1);
        } else {
          armed.current = true;
        }
      },
      { threshold: 0.3, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(root);
    return () => io.disconnect();
  }, [reduceMotion, animated]);

  const bigBurst = useMemo(() => (playId ? drumBurst(DRUM.bigSparks, [160, 380], DRUM.circle * scale) : []), [playId, scale]);
  const hitBurst = useMemo(() => (hit ? drumBurst(DRUM.hitSparks, [70, 190], DRUM.circle * scale) : []), [hit, scale]);

  const onHit = (ev: ReactMouseEvent<HTMLButtonElement>) => {
    const r = ev.currentTarget.getBoundingClientRect();
    const kb = ev.detail === 0; // с клавиатуры координат нет: бьём в центр
    const c = (v: number) => Math.max(-1, Math.min(1, v));
    const dx = kb ? 0 : c((ev.clientX - (r.left + r.width / 2)) / (r.width / 2));
    const dy = kb ? 0 : c((ev.clientY - (r.top + r.height / 2)) / (r.height / 2));
    // вдавливается от точки касания: уходит в противоположную сторону и чуть кренится
    setHit((h) => ({ id: (h?.id ?? 0) + 1, hx: -dx * 10, hy: -dy * 10, hr: dx * 3 }));
  };

  if (phase === "static") {
    return (
      <img
        src={src}
        alt={alt}
        className="w-full h-auto object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.4)]"
        style={{ transform: `rotate(${rotate}deg) scale(${scale})` }}
      />
    );
  }

  const run = phase === "run";
  const play = visible ? "running" : "paused";
  const circle: CSSProperties = { width: size, aspectRatio: "1", borderRadius: "50%" };

  return (
    <div ref={rootRef} className="relative">
      <style>{DRUM_KEYFRAMES}</style>

      {/* 1. падение */}
      <div
        style={{
          opacity: run ? undefined : 0,
          willChange: "transform, opacity",
          animation: run
            ? `rl-drum-drop-${ab} ${DRUM.dropDur}s both, rl-drum-fade-${ab} 0.14s ease-out both`
            : undefined,
        }}
      >
        {/* 2. удар по клику */}
        <div
          style={
            {
              "--hx": `${hit?.hx ?? 0}px`,
              "--hy": `${hit?.hy ?? 0}px`,
              "--hr": `${hit?.hr ?? 0}deg`,
              animation: hit ? `rl-drum-hit-${hab} 0.36s ease-out both` : undefined,
            } as CSSProperties
          }
        >
          {/* 3. пульс в ритм 4/4: стартует, когда барабан уже успокоился */}
          <div
            style={{
              animation: run ? `rl-drum-idle-${ab} ${DRUM.beat}s ease-in-out ${DRUM.dropDur + 0.1}s infinite` : undefined,
              animationPlayState: play,
            }}
          >
            <img
              src={src}
              alt={alt}
              className="w-full h-auto object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.4)]"
              style={{ transform: `rotate(${rotate}deg) scale(${scale})` }}
            />
          </div>
        </div>
      </div>

      {/* Удар о шов: вспышка, три волны, осколки. Живут вне барабана, чтобы не прыгать вместе с ним */}
      {run && playId > 0 && (
        <div key={playId} aria-hidden="true" className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div
            className="absolute"
            style={{
              ...circle,
              background: "radial-gradient(circle, rgba(255,255,255,0.9), rgba(255,255,255,0) 65%)",
              animation: `rl-drum-flash 0.5s ease-out ${impact}s both`,
            }}
          />
          {(
            [
              { border: `3px solid ${DRUM.light}`, s: 1.55, dur: 0.8, delay: 0 },
              { border: `2px solid ${DRUM.dark}`, s: 1.85, dur: 1.0, delay: 0.1 },
              { border: `1px solid ${DRUM.light}`, s: 2.2, dur: 1.2, delay: 0.2 },
            ] as const
          ).map((r, i) => (
            <div
              key={i}
              className="absolute"
              style={
                {
                  ...circle,
                  border: r.border,
                  "--s": r.s,
                  animation: `rl-drum-ring ${r.dur}s ease-out ${(impact + r.delay).toFixed(2)}s both`,
                } as CSSProperties
              }
            />
          ))}
          {bigBurst.map((s, i) => (
            <span
              key={i}
              className="absolute rounded-full"
              style={
                {
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  width: s.size,
                  height: s.size,
                  background: s.light ? DRUM.light : DRUM.dark,
                  "--dx": `${s.dx.toFixed(1)}px`,
                  "--dy": `${s.dy.toFixed(1)}px`,
                  animation: `rl-drum-spark ${s.dur.toFixed(2)}s cubic-bezier(0.1, 0.7, 0.3, 1) ${(impact + s.delay).toFixed(2)}s both`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      )}

      {/* Раз в такт: тонкое кольцо, пока барабан в экране */}
      {run && (
        <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div
            style={{
              ...circle,
              border: `2px solid ${DRUM.light}`,
              animation: `rl-drum-pulse-${ab} ${DRUM.beat}s ease-out ${DRUM.dropDur + 0.1}s infinite`,
              animationPlayState: play,
            }}
          />
        </div>
      )}

      {/* Реакция на клик: кольцо и осколки (перезапускаются на каждый удар) */}
      {hit && (
        <div key={hit.id} aria-hidden="true" className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div
            className="absolute"
            style={
              {
                ...circle,
                border: `3px solid ${DRUM.light}`,
                "--s": 1.3,
                animation: "rl-drum-ring 0.5s ease-out both",
              } as CSSProperties
            }
          />
          {hitBurst.map((s, i) => (
            <span
              key={i}
              className="absolute rounded-full"
              style={
                {
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  width: s.size * 0.75,
                  height: s.size * 0.75,
                  background: s.light ? DRUM.light : DRUM.dark,
                  "--dx": `${s.dx.toFixed(1)}px`,
                  "--dy": `${s.dy.toFixed(1)}px`,
                  animation: `rl-drum-spark ${s.dur.toFixed(2)}s cubic-bezier(0.1, 0.7, 0.3, 1) ${s.delay.toFixed(2)}s both`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      )}

      {/* Невидимая кнопка ровно по корпусу: родитель с pointer-events-none, поэтому клик ловит только круг */}
      {run && (
        <button
          type="button"
          onClick={onHit}
          aria-label="Ударить в барабан"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-auto cursor-pointer bg-transparent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white [-webkit-tap-highlight-color:transparent]"
          style={circle}
        />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
 * ПРОГРАММА (аккордеон)
 * ───────────────────────────────────────────────────────────── */

type Group = { title: string; items: string[] };

const GUITAR_PROGRAM: Group[] = [
  {
    title: "Постановка базы",
    items: ["Вступление", "Строение гитары", "Постановка левой руки", "Постановка правой руки"],
  },
  {
    title: "Техника игры",
    items: [
      "Звукоизвлечение. Игра пальцами",
      "Звукоизвлечение. Заглушение струн",
      "Звукоизвлечение. Игра медиатором",
      "Упражнения для беглости пальцев",
    ],
  },
  {
    title: "Ритм и теория",
    items: [
      "Ноты",
      "Гаммы",
      "Метроном для самостоятельных занятий",
      "Ритм. Длительности нот",
      "Упражнения с ускорением",
      "Упражнения для игры с медиатором",
      "Взаимодействие с барабанщиком. Ритмические рисунки",
    ],
  },
  {
    title: "Практика",
    items: ["Аккорды", "Практика", "Обыгровки аккордов", "Гитарные фишки", "Практика всех изученных навыков"],
  },
];

const DRUM_PROGRAM: Group[] = [
  {
    title: "Постановка базы",
    items: ["Вступление", "Строение установки", "Посадка и хват палочек", "Постановка рук и ног"],
  },
  {
    title: "Техника игры",
    items: [
      "Одиночные удары",
      "Работа ногой на бас-барабане",
      "Открытый и закрытый хай-хэт",
      "Упражнения на независимость рук и ног",
    ],
  },
  {
    title: "Ритм и теория",
    items: [
      "Длительности нот",
      "Метроном для самостоятельных занятий",
      "Основные ритмические рисунки",
      "Размеры 4/4, 3/4, 6/8",
      "Синкопы и акценты",
      "Взаимодействие с другими инструментами",
    ],
  },
  {
    title: "Практика",
    items: ["Заполнения (филлы)", "Динамика и грув", "Разбор песен", "Игра под трек", "Практика всех изученных навыков"],
  },
];

const ProgramStep = forwardRef<
  HTMLDivElement,
  {
    index: number;
    total: number;
    group: Group;
    tone: Tone;
    isOpen: boolean;
    isPassed: boolean;
    onToggle: () => void;
  }
>(function ProgramStep({ index, total, group, tone, isOpen, isPassed, onToggle }, ref) {
  const t = TONE[tone];
  const isLast = index === total - 1;
  const isReached = isOpen || isPassed;
  const lineFilled = isPassed;
  const panelId = `program-panel-${tone}-${index}`;

  return (
    <div ref={ref} className="flex gap-4 scroll-mt-20 md:scroll-mt-28 group/step">
      {/* Степ-индикатор: эстетика гранж-заклёпок (studs) */}
      <div className="flex flex-col items-center pt-1.5">
        <div className="relative">
          <span
            className={
              // rl-display для акцентных широких шрифтов (Monument / Druk / Unbounded)
              "relative z-10 shrink-0 w-11 h-11 rounded-full flex items-center justify-center rl-display text-[15px] border transition-all duration-500 ease-out " +
              (isReached
                ? t.bg + " border-transparent text-rl-bg scale-110 " + t.stepGlow
                : "bg-gradient-to-br from-[#2A2A2A] to-[#111] border-[#333] text-[#666] shadow-[inset_0_3px_6px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.05)] group-hover/step:text-[#888]")
            }
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          {/* Пульсирующая «неоновая пыль» только для открытого этапа */}
          {isOpen && (
            <span className={"absolute inset-0 z-0 rounded-full animate-ping motion-reduce:animate-none opacity-30 " + t.bg} />
          )}
        </div>

        {/* Линия: имитация глубокого шнура */}
        {!isLast && (
          <div className="relative w-[4px] flex-1 my-2 rounded-full bg-[#1A1A1A] shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)] overflow-hidden">
            <div
              className={"absolute inset-x-0 top-0 rounded-full transition-[height] duration-500 ease-in-out " + t.bg}
              style={{
                height: lineFilled ? "100%" : "0%",
                boxShadow: lineFilled ? t.cordGlow : "none",
              }}
            />
          </div>
        )}
      </div>

      {/* Карточка этапа программы */}
      <div
        className={
          "flex-1 bg-rl-card border rounded-2xl overflow-hidden mb-5 transition-all duration-300 " +
          (isOpen ? t.stepOpenCard : "border-rl-line hover:border-rl-line/80")
        }
      >
        <button
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="w-full flex items-center justify-between px-6 py-5 text-left"
        >
          <span className={"rl-display text-xl transition-colors duration-300 " + (isOpen ? t.text : "text-rl-ink")}>
            {group.title}
          </span>
          <span
            aria-hidden="true"
            className={"rl-mono text-2xl transition-transform duration-300 " + t.text + (isOpen ? " rotate-45" : "")}
          >
            +
          </span>
        </button>
        <div id={panelId} className={"grid transition-all duration-300 ease-out " + (isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
          <div className="overflow-hidden">
            <ul className="px-6 pb-6 space-y-3 border-t border-rl-line/50 pt-5">
              {group.items.map((it) => (
                <li key={it} className="text-sm text-rl-muted flex gap-3 items-start leading-snug">
                  <span className={"shrink-0 mt-0.5 " + t.text}>—</span>
                  {it}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
});

function Accordion({ groups, tone = "orange" }: { groups: Group[]; tone?: Tone }) {
  const [open, setOpen] = useState<number | null>(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleToggle = (i: number) => {
    if (scrollTimer.current) clearTimeout(scrollTimer.current);
    setOpen((prev) => {
      const next = prev === i ? null : i;
      if (next !== null) {
        scrollTimer.current = setTimeout(() => {
          stepRefs.current[next]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 320);
      }
      return next;
    });
  };

  useEffect(() => {
    return () => {
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
    };
  }, []);

  return (
    <div>
      {groups.map((g, i) => (
        <ProgramStep
          key={g.title}
          ref={(el) => {
            stepRefs.current[i] = el;
          }}
          index={i}
          total={groups.length}
          group={g}
          tone={tone}
          isOpen={open === i}
          isPassed={open !== null && i < open}
          onToggle={() => handleToggle(i)}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
 * «ШЕСТЬ ПРИЧИН»
 * ───────────────────────────────────────────────────────────── */

const REASONS = [
  "Играть для себя и с друзьями",
  "Играть в группе, выступать, писать треки",
  "Создать свой коллектив",
  "Поступить в музыкальное учебное заведение",
  "Построить карьеру музыканта",
  "Переключаться от рутины после работы",
];

function ReasonCard({ index, text, tone }: { index: number; text: string; tone: Tone }) {
  const t = TONE[tone];
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia("(max-width: 639px)");
    let obs: IntersectionObserver | null = null;

    const setup = () => {
      obs?.disconnect();
      if (!mq.matches) {
        // На планшете/десктопе подсветка работает через hover, JS-подсветка не нужна
        setActive(false);
        return;
      }
      obs = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), {
        threshold: 0,
        // Узкая полоса в центре экрана — карточка «активна», только когда проходит через неё
        rootMargin: "-42% 0px -42% 0px",
      });
      obs.observe(el);
    };

    setup();
    mq.addEventListener("change", setup);
    return () => {
      obs?.disconnect();
      mq.removeEventListener("change", setup);
    };
  }, []);

  return (
    <Reveal delay={index * 90}>
      <div
        ref={ref}
        className={
          "group relative rounded-2xl border bg-rl-card p-6 h-full overflow-hidden " +
          "transition-all duration-300 ease-out hover:-translate-y-1.5 " +
          t.hoverBorder +
          " " +
          (active ? t.border + " -translate-y-1.5" : "border-rl-line")
        }
      >
        {/* Огромная полупрозрачная цифра-фон */}
        <span
          className={
            "rl-display absolute -right-3 -top-7 text-[6.5rem] font-black leading-none select-none " +
            "transition-colors duration-300 " +
            t.groupHoverDigit +
            " " +
            (active ? t.digit : "text-rl-muted/10")
          }
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="relative z-10 flex flex-col h-full">
          <div
            className={
              "rl-display w-10 h-10 rounded-full flex items-center justify-center text-sm font-black mb-6 " +
              "text-rl-bg transition-transform duration-300 group-hover:scale-110 " +
              (active ? "scale-110 " : "") +
              t.bg
            }
          >
            {index + 1}
          </div>
          <p className="text-lg font-bold leading-snug">{text}</p>
        </div>

        {/* Растущая полоса снизу при наведении / подсветке на мобиле */}
        <span
          className={
            "absolute bottom-0 left-0 h-1 transition-all duration-500 ease-out group-hover:w-full " +
            (active ? "w-full " : "w-0 ") +
            t.bg
          }
        />
      </div>
    </Reveal>
  );
}

/* ─────────────────────────────────────────────────────────────
 * ВИЗУАЛЫ ОБОРУДОВАНИЯ
 * ───────────────────────────────────────────────────────────── */

/**
 * Гитара в секции оборудования: «выходит из-за края на сцену».
 * Одна история, две раскладки (общий движок и общие слои, разная геометрия):
 *  - мобила и планшет (<1024px): GuitarStageImage. Гитара висит за текстом справа
 *  - десктоп (≥1024px): GuitarDesktopScene. Сцена закреплена, слева текст, справа колонка гитары
 *
 * Сценарий, всё привязано к скроллу (без таймеров):
 *  1. Сначала гитара у правого края экрана, наполовину за ним: расфокус, приглушена,
 *     чуть ближе к камере (крупнее), наклонена к центру. За ней тёплая подсветка от края.
 *  2. Потом выходит на сцену: уезжает к своему месту, наводится фокус, по глянцу
 *     пробегает блик, она выпрямляется, чуть «перелетает» и ложится в лёгкий наклон
 *     вправо. Одновременно загорается свет.
 *  3. Дальше живёт: покачивание, дыхание света, искры, медленный доворот.
 *
 * Плавность:
 *  - значения не прыгают за пальцем/колесом, а «догоняют» его с лёгкой инерцией (smooth):
 *    Safari отдаёт scroll-события с запозданием, а колесо мыши идёт шагами;
 *    с инерцией ступеньки не видны
 *  - путь растянут, кривые мягкие на обоих концах (нет рывка на старте)
 *  - только дешёвые для GPU свойства: transform и opacity. Размытие статичное,
 *    блик едет через transform, без mix-blend-mode, perspective и анимации background
 *
 * В CSS-переменные пишется без setState (React страницу не перерисовывает):
 *   --s  0..1  путь от правого края к своему месту
 *   --f  0..1  фокус: размытая копия уходит, чёткая проявляется
 *   --p  0..1  свет: луч, ореол, пятно на полу, контур, искры
 *   --r  deg   наклон
 *   --shift px насколько гитара сдвинута вправо в начале (считается из ширины экрана)
 */
const GUITAR_STAGE = {
  // ── геометрия сцены
  slot: "min(78svh, 600px)", // высота зоны под текстом И высота прилипшего блока (одно и то же)
  top: "calc((100svh - min(78svh, 600px)) / 2)", // где гитара «прилипает»: по центру экрана
  box: 0.42, // ширина/высота кадра. PNG квадратный, берём центральную полосу
  extra: 1, // сколько ещё «высот сцены» гитара остаётся прилипшей, чтобы путь был длиннее (0 = рывком)
  settle: 1.4, // длина перелёта в высотах сцены (больше = дольше и плавнее)
  tMax: 1.6, // докуда идёт доворот после посадки (1 = сразу стоп)
  smooth: 0.1, // сек, инерция: больше = плавнее и «тяжелее», меньше = отзывчивее (0.05–0.2)
  // ── начало: у правого края
  pinEdge: 0.94, // где центр гитары в начале, как доля ширины экрана. 1 = ровно на краю (видна половина)
  pinScale: 1.22, // крупнее = ближе к камере
  pinBlur: 9, // px, расфокус
  pinOpacity: 0.6, // яркость в начале (на мобиле гитара за текстом, чтобы не мешать читать)
  pinGlow: 0.22, // тёплая подсветка от правого края за гитарой (0 = выключить)
  pinGlowShape: "55% 42%", // размер подсветки: ширина высота
  // ── наклон
  from: -12, // deg, в начале гитара наклонена верхом к центру (минус = влево)
  to: 4, // deg, лёгкий наклон вправо, в который она «ложится»
  bump: 2.6, // deg, мягкий «перелёт» через положение to перед тем как лечь (0 = без)
  drift: 2.5, // deg, медленный доворот вправо после посадки
  // ── свет и жизнь
  idle: true, // покачивание + дыхание света
  sparks: true, // искры
  glowRgb: "255,122,0", // оранжевый из палитры сайта
  lightRgb: "255,178,110", // искры: светлые, тёплые
  beamRgb: "255,130,30", // луч: насыщенный оранжевый, как ореол (светлый тон на тёмном фоне выглядит серым пятном)
  beam: 0.2, // яркость луча (0 = выключить)
  beamSwing: 0.55, // насколько луч качается вслед за гитарой
  halo: 0.32, // яркость ореола
  pool: 0.5, // яркость пятна на полу
  rim: 0.6, // яркость контурной подсветки
  rimSize: 14, // px
  gloss: 0.7, // яркость блика, пробегающего по гитаре при выходе (0 = выключить)
};

type StageCfg = typeof GUITAR_STAGE;

/**
 * Десктоп: те же параметры, что на мобиле, кроме геометрии.
 * Сцена закреплена по центру экрана (с учётом шапки 64px) и держится extra·slot пикселей скролла.
 */
const GUITAR_STAGE_DESKTOP: StageCfg = {
  ...GUITAR_STAGE,
  slot: "min(76svh, 680px)",
  top: "calc(64px + (100svh - 64px - min(76svh, 680px)) / 2)",
  extra: 1.5, // чуть дольше закреплена: на десктопе колесо мыши шагает крупнее
  settle: 1.15, // путь ≈ 1.15 высоты сцены; перед ним небольшая пауза, чтобы успеть увидеть начальный кадр
  smooth: 0.12,
  pinEdge: 0.985, // у самого края: видна примерно половина
  pinScale: 1.3,
  pinBlur: 10,
  pinOpacity: 0.55,
  pinGlow: 0.25,
  pinGlowShape: "26% 55%",
};

/** Строки сетки секции на мобиле: текст + зона под гитару (с запасом на длинный путь) */
const stageRows = (reduce: boolean) =>
  `auto calc(${GUITAR_STAGE.slot} * ${reduce ? 1 : 1 + GUITAR_STAGE.extra})`;

// Искры: x, % слева; s, px; d и t, сек (задержка и длительность); dx, px вбок; dy, svh вверх
const EMBERS = [
  { x: 36, s: 3, d: 0, t: 7, dx: -14, dy: -38 },
  { x: 44, s: 2, d: 1.6, t: 8.5, dx: 10, dy: -46 },
  { x: 52, s: 4, d: 3.1, t: 9, dx: -8, dy: -34 },
  { x: 58, s: 2, d: 0.8, t: 7.5, dx: 16, dy: -42 },
  { x: 41, s: 2, d: 4.4, t: 8, dx: -18, dy: -50 },
  { x: 63, s: 3, d: 2.4, t: 9.5, dx: 12, dy: -36 },
  { x: 48, s: 2, d: 5.6, t: 7, dx: 6, dy: -52 },
  { x: 55, s: 3, d: 6.3, t: 8.8, dx: -12, dy: -40 },
];

const STAGE_KEYFRAMES = `
@keyframes rl-sway { from { transform: rotate(-0.5deg); } to { transform: rotate(0.6deg); } }
@keyframes rl-breathe { from { opacity: 0.75; } to { opacity: 1; } }
@keyframes rl-ember {
  0% { transform: translate(0, 0) scale(1); opacity: 0; }
  12% { opacity: 0.9; }
  100% { transform: translate(var(--dx), var(--dy)) scale(0.4); opacity: 0; }
}`;

const STAGE_IMG = { objectFit: "cover", maxWidth: "none" } as const;
const STAGE_MASK = {
  WebkitMaskImage: `url(${jetImg})`,
  maskImage: `url(${jetImg})`,
  WebkitMaskSize: "cover",
  maskSize: "cover",
  WebkitMaskPosition: "center",
  maskPosition: "center",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
} as const;

// useLayoutEffect, чтобы первый кадр сразу был в правильной позиции (без вспышки по центру)
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Движок: считает прогресс по положению на экране и пишет его в CSS-переменные корня.
 *  root  внешний блок, по его нижней границе считается прогресс
 *  stage прилипающий (sticky) блок: его высота и top нужны для расчёта
 *  slot  элемент, в центре которого гитара должна оказаться в конце (на мобиле = stage)
 */
function useGuitarStageProgress(
  cfg: StageCfg,
  rootRef: RefObject<HTMLElement | null>,
  stageRef: RefObject<HTMLElement | null>,
  slotRef: RefObject<HTMLElement | null>,
  reduceMotion: boolean,
) {
  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const slot = slotRef.current;
    if (!root || !stage || !slot) return;
    if (reduceMotion) {
      // без анимации: сразу готовый кадр
      for (const k of ["--s", "--f", "--p"]) root.style.setProperty(k, "1");
      root.style.setProperty("--r", String(cfg.to));
      return;
    }
    const clamp = (x: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, x));
    const smooth = (x: number) => {
      const v = clamp(x);
      return v * v * (3 - 2 * v); // нулевая скорость на обоих концах: нет рывка на старте и остановки
    };

    let h = 0; // высота прилипшего блока, px
    let stickTop = 0; // на каком расстоянии от верха экрана он прилипает, px

    // Сырой прогресс от положения на экране.
    // 0 пока блок прилип и идёт «пауза», 1 в момент, когда sticky отпускает сцену
    const computeT = () => {
      const d = h * cfg.settle;
      const bottom = root.getBoundingClientRect().bottom;
      return clamp((stickTop + h + d - bottom) / d, 0, cfg.tMax);
    };

    const render = (t: number) => {
      const tt = Math.min(1, t);
      const S = smooth(tt);
      const F = smooth((tt - 0.12) / 0.7); // фокус наводится в середине пути
      const P = smooth((tt - 0.4) / 0.6); // свет загорается к посадке
      // мягкий «перелёт»: колокол sin² с нулевой скоростью на концах
      const bump = cfg.bump * Math.pow(Math.sin(Math.PI * clamp((tt - 0.55) / 0.45)), 2);
      const drift = cfg.drift * smooth((t - 1) / (cfg.tMax - 1));
      root.style.setProperty("--s", S.toFixed(4));
      root.style.setProperty("--f", F.toFixed(4));
      root.style.setProperty("--p", P.toFixed(4));
      root.style.setProperty("--r", (cfg.from + (cfg.to - cfg.from) * S + bump + drift).toFixed(2));
    };

    // Инерция: текущее значение догоняет целевое по экспоненте (не зависит от частоты кадров)
    let target = 0;
    let cur = 0;
    let last = 0;
    let raf = 0;
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;
      cur += (target - cur) * (1 - Math.exp(-dt / cfg.smooth));
      if (Math.abs(target - cur) < 0.0004) {
        cur = target;
        raf = 0;
      } else {
        raf = requestAnimationFrame(tick);
      }
      render(cur);
    };
    const onScroll = () => {
      target = computeT();
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    const measure = () => {
      h = stage.offsetHeight;
      const top = parseFloat(getComputedStyle(stage).top);
      stickTop = Number.isFinite(top) ? top : (window.innerHeight - h) / 2;
      // на сколько сдвинуть гитару вправо, чтобы её центр оказался у pinEdge·ширины экрана
      const vw = document.documentElement.clientWidth;
      const r = slot.getBoundingClientRect();
      root.style.setProperty("--shift", `${(cfg.pinEdge * vw - (r.left + r.width / 2)).toFixed(1)}px`);
      target = cur = computeT(); // без «догонялок» на старте и после ресайза
      render(cur);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [cfg, reduceMotion, rootRef, stageRef, slotRef]);
}

/** Тёплая подсветка от правого края экрана: гитара «за кулисой». Гаснет по мере выхода. */
function PinGlow({ cfg }: { cfg: StageCfg }) {
  if (cfg.pinGlow <= 0) return null;
  return (
    <div
      className="absolute inset-0"
      style={{
        opacity: "calc(1 - var(--s, 0))",
        background: `radial-gradient(ellipse ${cfg.pinGlowShape} at 100% 50%, rgba(${cfg.glowRgb},${cfg.pinGlow}), transparent 70%)`,
      }}
    />
  );
}

/**
 * Один «слой» гитары: фото + блик внутри одного контейнера.
 * Их два: размытый (виден в начале) и чёткий (проявляется при фокусе).
 * Блик лежит внутри слоя, поэтому на размытой гитаре он тоже размыт, а на чёткой резкий.
 * Размытие статичное, между слоями идёт кроссфейд по opacity. Размытый слой уходит
 * позже, чем проявляется чёткий, поэтому посередине получается мягкое свечение.
 */
function GuitarLayer({ cfg, blurred }: { cfg: StageCfg; blurred?: boolean }) {
  return (
    <div
      className="absolute inset-0"
      style={{
        opacity: blurred ? "calc(1 - var(--f, 0) * var(--f, 0))" : "var(--f, 0)",
        filter: blurred ? `blur(${cfg.pinBlur}px) brightness(1.35)` : undefined,
        willChange: "opacity", // отдельный слой: Safari не перерисовывает размытие, а только меняет прозрачность
      }}
    >
      <img
        src={jetImg}
        alt={blurred ? "" : "Электрогитара Jet в студии Riff Lab12"}
        aria-hidden={blurred ? true : undefined}
        className="absolute inset-0 w-full h-full"
        style={STAGE_IMG}
      />
      {cfg.gloss > 0 && (
        // Маска по форме гитары статичная, а полоса света ЕДЕТ через transform
        // (анимация background-position под маской это перерисовка на каждом кадре).
        // Видна в основном посередине пути (bell: 4·s·(1−s))
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ ...STAGE_MASK, opacity: `calc(${cfg.gloss} * 4 * var(--s, 0) * (1 - var(--s, 0)))` }}
        >
          <div
            className="absolute top-0 bottom-0 left-0 will-change-transform"
            style={{
              width: "70%",
              transform: "translate3d(calc(136% - 229% * var(--s, 0)), 0, 0) skewX(-14deg)",
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 35%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.3) 65%, transparent 100%)",
            }}
          />
        </div>
      )}
    </div>
  );
}

/**
 * Всё, что рисуется в «слоте» гитары: луч, ореол, пятно на полу, сама гитара, искры.
 * Родитель должен быть relative и иметь высоту; размеры считаются от него.
 */
function GuitarStageView({ cfg, alive }: { cfg: StageCfg; alive: boolean }) {
  const S = "var(--s, 0)";
  const P = "var(--p, 0)";
  const R = "var(--r, 0)";
  return (
    <>
      {/* Луч прожектора. Снаружи только transform и opacity (дёшево, свой слой),
          внутри статичное размытие: Safari кэширует его и не перерисовывает на каждом кадре */}
      {cfg.beam > 0 && (
        <div
          className="absolute inset-0 will-change-transform"
          style={{
            opacity: P,
            transformOrigin: "50% 0%",
            transform: `rotate(calc(${R} * ${cfg.beamSwing}deg))`,
          }}
        >
          <div className="absolute inset-0" style={{ filter: "blur(20px)" }}>
            <div
              className="absolute inset-0"
              style={{
                clipPath: "polygon(34% 0, 66% 0, 98% 100%, 2% 100%)",
                // не с максимума, а с нуля: иначе узкая верхушка конуса даёт яркое пятно над грифом
                background: `linear-gradient(to bottom, rgba(${cfg.beamRgb},0) 0%, rgba(${cfg.beamRgb},${cfg.beam}) 28%, transparent 88%)`,
              }}
            />
          </div>
        </div>
      )}

      {/* Ореол за гитарой: снаружи включение, внутри «дыхание» */}
      {cfg.halo > 0 && (
        <div className="absolute inset-0" style={{ opacity: P }}>
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 60% 48% at 50% 52%, rgba(${cfg.glowRgb},${cfg.halo}), transparent 70%)`,
              animation: alive && cfg.idle ? "rl-breathe 5s ease-in-out infinite alternate" : undefined,
            }}
          />
        </div>
      )}

      {/* Световое пятно на полу */}
      {cfg.pool > 0 && (
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            bottom: "-1.5%",
            width: "78%",
            height: "9%",
            opacity: P,
            filter: "blur(10px)",
            background: `radial-gradient(ellipse at center, rgba(${cfg.glowRgb},${cfg.pool}), transparent 70%)`,
          }}
        />
      )}

      {/* Сама гитара. Пивот у основания: она опирается на пол и клонится, а не крутится вокруг центра.
          Только 2D-трансформации (без perspective/rotateY): они стабильно идут на GPU */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="relative will-change-transform"
          style={{
            height: "100%",
            aspectRatio: cfg.box,
            opacity: `calc(${cfg.pinOpacity} + ${1 - cfg.pinOpacity} * ${S})`,
            transformOrigin: "50% 100%",
            transform:
              `translate3d(calc((1 - ${S}) * var(--shift, 0px)), 0, 0) ` +
              `rotate(calc(${R} * 1deg)) ` +
              `scale(calc(1 + ${cfg.pinScale - 1} * (1 - ${S})))`,
          }}
        >
          {/* Внутренний слой: едва заметное «живое» покачивание */}
          <div
            className="absolute inset-0 will-change-transform"
            style={{
              transformOrigin: "50% 100%",
              animation: alive && cfg.idle ? "rl-sway 6s ease-in-out infinite alternate" : undefined,
            }}
          >
            {/* Контурная подсветка: копия с готовым свечением, проявляется к посадке (p²) */}
            {cfg.rim > 0 && (
              <img
                src={jetImg}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full"
                style={{
                  ...STAGE_IMG,
                  opacity: `calc(${P} * ${P})`,
                  filter: `drop-shadow(0 0 ${cfg.rimSize}px rgba(${cfg.glowRgb},${cfg.rim}))`,
                  willChange: "opacity",
                }}
              />
            )}
            <GuitarLayer cfg={cfg} blurred />
            <GuitarLayer cfg={cfg} />
          </div>
        </div>
      </div>

      {/* Искры: редкие, мелкие, поднимаются от пола вдоль гитары, пока горит свет */}
      {alive && cfg.sparks && (
        <div className="absolute inset-0 overflow-hidden" style={{ opacity: P }}>
          {EMBERS.map((e, i) => (
            <span
              key={i}
              className="absolute rounded-full"
              style={
                {
                  left: `${e.x}%`,
                  bottom: "8%",
                  width: e.s,
                  height: e.s,
                  background: `rgb(${cfg.lightRgb})`,
                  boxShadow: `0 0 ${e.s * 3}px rgba(${cfg.glowRgb},0.9)`,
                  opacity: 0,
                  "--dx": `${e.dx}px`,
                  "--dy": `${e.dy}svh`,
                  animation: `rl-ember ${e.t}s ${e.d}s linear infinite`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      )}
    </>
  );
}

/** Мобила и планшет: гитара за текстом справа, дальше выходит на сцену под текстом. */
function GuitarStageImage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const g = GUITAR_STAGE;
  const alive = !reduceMotion;
  useGuitarStageProgress(g, rootRef, stageRef, stageRef, reduceMotion);

  return (
    // Занимает обе строки сетки (текст + зона), лежит под текстом (z-0).
    // -mx-6 компенсирует padding секции, overflow-x-clip обрезает гитару по краю экрана
    // (clip, а не hidden: hidden сломал бы sticky)
    <div
      ref={rootRef}
      className="relative z-0 self-stretch -mx-6 overflow-x-clip pointer-events-none"
      style={{ gridColumn: 1, gridRow: "1 / span 2" }}
    >
      {alive && <style>{STAGE_KEYFRAMES}</style>}

      {/* sticky: пока идёт текст (и ещё чуть-чуть после), блок стоит на месте, в конце контейнера
          его отпускает в зону под текстом. При reduced-motion без sticky: просто лежит в зоне */}
      <div
        ref={stageRef}
        style={
          reduceMotion
            ? { position: "absolute", left: 0, right: 0, bottom: 0, height: g.slot }
            : { position: "sticky", top: g.top, height: g.slot }
        }
      >
        <PinGlow cfg={g} />
        <GuitarStageView cfg={g} alive={alive} />
      </div>
    </div>
  );
}

/**
 * Десктоп (≥1024px): закреплённая сцена на всю ширину экрана. Слева текст, справа колонка гитары.
 * Пока сцена закреплена, гитара выходит с правого края экрана в свою колонку.
 * Текст приходит как children, чтобы не дублировать разметку.
 */
function GuitarDesktopScene({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const g = GUITAR_STAGE_DESKTOP;
  const alive = !reduceMotion;
  useGuitarStageProgress(g, rootRef, stageRef, slotRef, reduceMotion);

  return (
    // На всю ширину экрана (гитара выезжает из-за края экрана, а не из-за края колонки).
    // Горизонтальный скролл не появится: корневой <main> обрезает overflow-x
    <div
      ref={rootRef}
      className="relative"
      style={{
        width: "100vw",
        marginLeft: "calc(50% - 50vw)",
        // высота = сцена + запас скролла, пока она закреплена (при reduced-motion без запаса)
        height: reduceMotion ? undefined : `calc(${g.slot} * ${1 + g.extra})`,
      }}
    >
      {alive && <style>{STAGE_KEYFRAMES}</style>}
      <div
        ref={stageRef}
        style={
          reduceMotion
            ? { position: "relative", height: g.slot }
            : { position: "sticky", top: g.top, height: g.slot }
        }
      >
        <PinGlow cfg={g} />
        <div className="relative max-w-6xl mx-auto px-6 h-full grid grid-cols-2 gap-12 items-center">
          <div className="relative z-10">{children}</div>
          <div ref={slotRef} className="relative h-full pointer-events-none">
            <GuitarStageView cfg={g} alive={alive} />
          </div>
        </div>
      </div>
    </div>
  );
}

function GuitarTiltImage() {
  // Десктоп (≥1024px) рисуется сценой GuitarDesktopScene прямо из Landing; сюда попадают мобила и планшет
  return <GuitarStageImage />;
}

/**
 * Гитара в прайсе: «ложится» на оранжевый постер.
 *
 * Раньше: фото повёрнуто на 60° и шире экрана (130vw), кузов обрезан, положение подобрано
 * магическими отступами, анимации нет, поэтому выглядело случайно.
 *
 * Теперь:
 *  - гитара целиком в кадре, лежит наискосок (угол to: 0 = стоит, 90 = лежит горизонтально),
 *    головка уходит вправо-вверх и выступает над швом секции в чёрную зону: оранжевое дерево
 *    на чёрном, а корпус уже на оранжевом. Шов пересекается намеренно, а не «как получилось»
 *  - угол можно менять одной цифрой (to): положение, выступ головки над швом, место под гитарой и
 *    свечение считаются от него сами (см. геометрию ниже), ничего подгонять руками не надо
 *  - по скроллу она «падает» на плоскость и ложится: чуть крупнее → обычный размер, наклон
 *    доходит до финального с лёгким перелётом и возвращается, тень стягивается к ней и темнеет
 *    (глубина), по матовому корпусу один раз проходит блик
 *  - потом едва заметно покачивается
 *
 * Всё считается от положения на экране и пишется в CSS-переменные без setState; инерция как в
 * секции оборудования. Анимируются только transform и opacity.
 *   --t  0..1  прогресс «посадки»
 *   --r  deg   наклон (плюс = верх гитары вправо)
 */
const PRICING_GUITAR = {
  size: "min(100vw, 600px)", // сторона квадрата JET.png
  // ── геометрия силуэта в JET.png, доли стороны квадрата (снято с фото). Нужна только для расчёта места
  len: 0.93, // длина гитары вдоль оси; ось проходит через центр квадрата
  headW: 0.06, // ширина головки
  bodyW: 0.33, // ширина корпуса в самом широком месте
  bodyHorn: 0, // где «рога» корпуса: на сколько ниже центра квадрата вдоль оси (у этого фото ровно на уровне центра)
  bodyR: 0.12, // скругление нижней части корпуса
  // ── положение
  aboveMax: "clamp(56px, 18vw, 72px)", // на сколько макушка головки МОЖЕТ выступать над швом. Выше нельзя: там кнопка «Записаться к преподавателю»
  bodyMargin: "10px", // чёрный корпус не должен заходить на чёрный фон: он всегда ниже шва минимум на столько.
  // Поэтому чем горизонтальнее гитара, тем меньше выступает головка, а при ~75° гитара уже целиком на оранжевом
  gap: "28px", // отступ от низа гитары до заголовка «Guitar Lessons»
  // ── угол и посадка
  from: 44, // deg в начале (меньше to = гитара «падает» и ложится; больше to = «оседает» вверх)
  to: 60, // deg в конце. 0 = стоит, 90 = лежит горизонтально (плюс = головка вправо). Разумно 50–68
  bump: 2.5, // deg, «касание»: чуть проходит финальный угол и возвращается (0 = без)
  scale: 1.06, // в начале чуть крупнее (ближе к камере), к концу садится на плоскость
  start: 0.9, // доля высоты экрана: верх блока вошёл снизу, анимация началась
  end: 0.3, // верх блока дошёл сюда, анимация закончена (больше разница = дольше)
  smooth: 0.1, // сек, инерция
  // тень: смещение px и прозрачность в конце (near) и в начале (far, гитара «выше» над плоскостью)
  shadowNear: { dx: 18, dy: 26, o: 0.4 },
  shadowFar: { dx: 40, dy: 58, o: 0.18 },
  shadowBlur: 14, // px
  gloss: 0.5, // яркость блика (0 = выключить)
  bloom: 0.4, // яркость тёплого свечения за гитарой на оранжевом (0 = выключить)
  idle: true, // покачивание
};

/**
 * Геометрия при финальном угле: сколько гитара занимает от центра квадрата вверх, вниз и в стороны
 * (доли size). Модель: головка + корпус как прямоугольник со скруглённым низом.
 * Положение считается так, чтобы головка выступала над швом на aboveMax, но корпус при этом
 * оставался на оранжевом (иначе чёрное на чёрном пропадает).
 */
const PG = PRICING_GUITAR;
const PG_RAD = (PG.to * Math.PI) / 180;
const PG_SIN = Math.abs(Math.sin(PG_RAD));
const PG_COS = Math.abs(Math.cos(PG_RAD));
const PG_HEAD_UP = (PG.len / 2) * PG_COS + (PG.headW / 2) * PG_SIN; // макушка головки
const PG_BODY_UP = Math.max(0, (PG.bodyW / 2) * PG_SIN - PG.bodyHorn * PG_COS); // верхний «рог» корпуса
const PG_DOWN = Math.max(
  (PG.len / 2) * PG_COS, // нижний торец
  (PG.len / 2 - PG.bodyR) * PG_COS + (PG.bodyW / 2 - PG.bodyR) * PG_SIN + PG.bodyR, // скруглённый низ корпуса
);
const PG_LEFT = Math.max(
  (PG.len / 2) * PG_SIN,
  (PG.len / 2 - PG.bodyR) * PG_SIN + (PG.bodyW / 2 - PG.bodyR) * PG_COS + PG.bodyR,
);
const PG_RIGHT = (PG.len / 2) * PG_SIN + (PG.headW / 2) * PG_COS;
/** Сдвиг по горизонтали, чтобы силуэт стоял по центру (он несимметричен: слева корпус, справа головка) */
const PG_SHIFT = (PG_LEFT - PG_RIGHT) / 2;

/** Расстояние от шва вниз до центра квадрата */
const PG_CY = `max(calc(${PG_HEAD_UP} * ${PG.size} - ${PG.aboveMax}), calc(${PG_BODY_UP} * ${PG.size} + ${PG.bodyMargin}))`;
/** Высота места под гитарой в потоке: от шва до заголовка (гитара лежит absolute, поэтому нужна «распорка») */
const PRICING_GUITAR_SPACER = `calc(${PG_CY} + ${PG_DOWN} * ${PG.size} + ${PG.gap})`;
/** Где в квадрате проходит шов секции (от верха квадрата вниз) */
const PG_SEAM_Y = `calc(0.5 * ${PG.size} - ${PG_CY})`;

function PricingGuitar() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const g = PRICING_GUITAR;
  const alive = !reduceMotion;

  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (reduceMotion) {
      root.style.setProperty("--t", "1");
      root.style.setProperty("--r", String(g.to));
      return;
    }
    const clamp = (x: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, x));
    const smooth = (x: number) => {
      const v = clamp(x);
      return v * v * (3 - 2 * v);
    };
    const render = (t: number) => {
      const T = smooth(t);
      const bump = g.bump * Math.pow(Math.sin(Math.PI * clamp((t - 0.55) / 0.45)), 2);
      root.style.setProperty("--t", T.toFixed(4));
      root.style.setProperty("--r", (g.from + (g.to - g.from) * T + bump).toFixed(2));
    };
    const computeT = () => {
      const vh = window.innerHeight;
      const top = root.getBoundingClientRect().top;
      return clamp((vh * g.start - top) / (vh * (g.start - g.end)));
    };

    // Инерция: значение догоняет цель по экспоненте (не зависит от частоты кадров)
    let target = computeT();
    let cur = target;
    let last = 0;
    let raf = 0;
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;
      cur += (target - cur) * (1 - Math.exp(-dt / g.smooth));
      if (Math.abs(target - cur) < 0.0004) {
        cur = target;
        raf = 0;
      } else {
        raf = requestAnimationFrame(tick);
      }
      render(cur);
    };
    const onScroll = () => {
      target = computeT();
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    const onResize = () => {
      target = cur = computeT();
      render(cur);
    };
    render(cur);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduceMotion, g.start, g.end, g.from, g.to, g.bump, g.smooth]);

  // Значения по умолчанию в var() = финальное состояние: без JS и до первого кадра гитара уже на месте
  const T = "var(--t, 1)";
  const R = `var(--r, ${g.to})`;
  const far = `(1 - ${T})`;
  const sh = (near: number, farV: number) => `calc(${near}px + ${farV - near}px * ${far})`;
  const sc = `scale(calc(1 + ${g.scale - 1} * ${far}))`;

  return (
    // absolute от верха секции (= шва): положение не зависит от паддингов, а головка выступает вверх на above
    <div
      ref={rootRef}
      className="absolute inset-x-0 mx-auto pointer-events-none z-10"
      style={{
        width: g.size,
        height: g.size,
        top: `calc(-1 * ${PG_SEAM_Y})`,
        transform: `translateX(calc(${PG_SHIFT} * ${g.size}))`,
      }}
    >
      {alive && <style>{STAGE_KEYFRAMES}</style>}

      {/* Тёплое свечение за гитарой («студийный свет»). Начинается ровно на шве и идёт вниз до заголовка,
          поэтому на чёрную зону выше не заходит (светлый тон на чёрном выглядел бы серым пятном).
          Центр свечения = центр гитары, он зависит от угла */}
      {g.bloom > 0 && (
        <div
          className="absolute"
          style={{
            left: "-30%",
            right: "-30%",
            top: PG_SEAM_Y,
            height: PRICING_GUITAR_SPACER,
            opacity: `calc(0.5 + 0.5 * ${T})`,
            background: `radial-gradient(ellipse 40% 80% at 50% ${PG_CY}, rgba(255,205,140,${g.bloom}), transparent 70%)`,
          }}
        />
      )}

      {/* Тень на плоскости: чёрный силуэт, статичное размытие. Едет по transform, свет всегда сверху-слева */}
      <img
        src={jetImg}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full will-change-transform"
        style={{
          ...STAGE_IMG,
          filter: `brightness(0) blur(${g.shadowBlur}px)`,
          opacity: `calc(${g.shadowNear.o} + ${g.shadowFar.o - g.shadowNear.o} * ${far})`,
          transform:
            `translate3d(${sh(g.shadowNear.dx, g.shadowFar.dx)}, ${sh(g.shadowNear.dy, g.shadowFar.dy)}, 0) ` +
            `rotate(calc(${R} * 1deg)) ${sc}`,
        }}
      />

      {/* Гитара */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{ transform: `rotate(calc(${R} * 1deg)) ${sc}` }}
      >
        <div
          className="absolute inset-0"
          style={{ animation: alive && g.idle ? "rl-sway 6s ease-in-out infinite alternate" : undefined }}
        >
          <img src={jetImg} alt="Электрогитара Jet" className="absolute inset-0 w-full h-full" style={STAGE_IMG} />
          {g.gloss > 0 && (
            // Маска по форме гитары статичная, полоса света едет через transform; видна в середине пути
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ ...STAGE_MASK, opacity: `calc(${g.gloss} * 4 * ${T} * (1 - ${T}))` }}
            >
              <div
                className="absolute top-0 bottom-0 left-0 will-change-transform"
                style={{
                  width: "70%",
                  transform: `translate3d(calc(136% - 229% * ${T}), 0, 0) skewX(-14deg)`,
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 35%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.3) 65%, transparent 100%)",
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DrumSideImage() {
  return (
    <div className="relative flex items-center justify-center overflow-hidden min-h-[450px] group">
      <img
        src={drumSide}
        alt="Ударная установка Pearl Roadshow"
        className="relative z-10 max-h-[420px] w-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-transform duration-700 group-hover:scale-105 group-hover:-rotate-1"
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
 * КОНФИГ РЕЖИМОВ
 *
 * Всё, что отличается между гитарой и ударными, лежит здесь.
 * Сама страница (Landing) одинаковая — она просто мапится по MODES[mode].
 * Поменять цену / текст / преподавателя = поправить одно место.
 * ───────────────────────────────────────────────────────────── */

type GearItem = { label: string; name: string; text: string };

type ModeConfig = {
  tone: Tone;
  logoPrefix: string;
  igHandle: string;
  picker: { label: string; desc: string; Icon: typeof GuitarIcon };
  programSection: { kicker: string; title: string; text: string };
  program: Group[];
  gear: { id: string; items: GearItem[]; Visual: ComponentType };
  reasonsText: string;
  teacher: {
    photo: string;
    role: string;
    kicker: string;
    quote: string;
    fields: [string, string][];
    ctaHref: string;
  };
  pricing: {
    word: string;
    art: (typeof PRICING_ART)[Mode];
    rows: PriceRowData[];
    practice: PracticeData;
  };
};

const MODES: Record<Mode, ModeConfig> = {
  guitar: {
    tone: "orange",
    logoPrefix: "RIFF",
    igHandle: "riff_lab12",
    picker: { label: "RIFF LAB12", desc: "Электрогитара и акустика", Icon: GuitarIcon },
    programSection: {
      kicker: "Riff Lab12 · Гитара",
      title: "Электро и акустика, с нуля",
      text:
        "Обучение — это удовольствие, а не усталость ещё до занятия. Приезжаешь в студию, берёшь " +
        "со стойки отстроенную гитару и подключаешься к комбику.",
    },
    program: GUITAR_PROGRAM,
    gear: {
      id: "guitar-equipment",
      Visual: GuitarTiltImage,
      items: [
        {
          label: "ИНСТРУМЕНТ",
          name: "Jet JS-400 MBK R Black",
          text: 'Современный Stratocaster с мензурой 25.5", эргономичным грифом из обожжённого клёна и мощными керамическими датчиками (H-H).',
        },
        {
          label: "ЗВУК И ЭФФЕКТЫ",
          name: "NUX Mighty 20W-MKII",
          text: "Мощный комбик на 20 Вт с поддержкой Bluetooth, 4 каналами и 18 встроенными эффектами. Никаких лишних проводов и долгих настроек.",
        },
      ],
    },
    reasonsText: "От первого аккорда до сцены — выбери свою причину или собери их все.",
    teacher: {
      photo: guitarTeacherImg,
      role: "RIFF LAB12",
      kicker: "Преподаватель · Арина",
      quote: "«Гитара — честная конкуренция со стрессом»",
      fields: [
        ["Опыт", "Преподаю с 20XX года"], // Замени на реальный год Арины
        ["Образование", "X"], // Замени на образование Арины
        ["Стаж", "На гитаре с XX лет"], // Замени на возраст/стаж
        ["Проекты", "X"], // Замени на проекты Арины
      ],
      ctaHref: "https://t.me/riff_arina",
    },
    pricing: {
      word: "Guitar",
      art: PRICING_ART.guitar,
      rows: [
        { n: "1", unit: "ЧАС", label: "ПРОБНОЕ", note: "РАЗОВОЕ", price: "55р.", highlight: true },
        { n: "4", unit: "ЧАСА", label: "ОДИН РАЗ", note: "В НЕДЕЛЮ", price: "200р. в месяц", save: "20р." },
        { n: "8", unit: "ЧАСОВ", label: "ДВА РАЗА", note: "В НЕДЕЛЮ", price: "380р. в месяц", save: "60р." },
      ],
      practice: {
        title: "Самостоятельная практика",
        subtitle: "На электрогитаре в студии",
        price: { value: "15", per: "/ 60 мин" },
        schedule: {
          title: "Доступное время (каждую неделю):",
          lines: [
            ["Среда", "09:00 – 20:00"],
            ["Остальные дни", "09:00 – 13:00"],
          ],
        },
        noteTitle: "* Только для учеников студии",
        noteText: "Один или два раза в неделю — оптимально для результата!",
      },
    },
  },

  drums: {
    tone: "red",
    logoPrefix: "DRUM",
    igHandle: "drum_lab12",
    picker: { label: "DRUM LAB12", desc: "Ударная установка", Icon: DrumIcon },
    programSection: {
      kicker: "Drum Lab12 · Ударные",
      title: "Не просто бить в барабаны",
      text:
        "Мечтаешь сесть за установку и задать свой ритм? Учим чувствовать музыку, а не заучивать " +
        "удары — с первого занятия.",
    },
    program: DRUM_PROGRAM,
    gear: {
      id: "drum-equipment",
      Visual: DrumSideImage,
      items: [
        {
          label: "ИНСТРУМЕНТ",
          name: "Pearl Roadshow + Arborea",
          text: "Полная установка, готова к игре с первой минуты.",
        },
        {
          label: "ТАРЕЛКИ",
          name: "Paiste Color Sound 900",
          text: "Свои тарелки возить не нужно.",
        },
      ],
    },
    reasonsText: "От первого ритма до сцены — выбери свою причину или собери их все.",
    teacher: {
      photo: teacherDrumImg,
      role: "DRUM LAB12",
      kicker: "Преподаватель · Анастасия",
      quote: "«Успех случается с теми, кто пробует»",
      fields: [
        ["Опыт", "Преподаю с 2018 года"],
        ["Образование", "ГГКИ (Искусство эстрады)"],
        ["Стаж", "На ударных с 13 лет"],
        ["Проекты", "Сессионный барабанщик"],
      ],
      ctaHref: "https://www.instagram.com/drum_lab12",
    },
    pricing: {
      word: "Drum",
      art: PRICING_ART.drums,
      rows: [
        { n: "1", unit: "ЧАС", label: "РАЗОВОЕ", note: "ПРОБНОЕ", price: "50р.", highlight: true },
        { n: "4", unit: "ЧАСА", label: "ОДИН РАЗ", note: "В НЕДЕЛЮ", price: "180р. в месяц", save: "20р." },
        { n: "8", unit: "ЧАСОВ", label: "ДВА РАЗА", note: "В НЕДЕЛЮ", price: "340р. в месяц", save: "60р." },
      ],
      practice: {
        title: "DRUM ROOM",
        subtitle: "Практика / Ударная установка + тарелки",
        rows: [
          { n: "1", unit: "ЧАС", label: "ОДИН РАЗ", note: "В НЕДЕЛЮ", price: "15р." },
          { n: "2", unit: "ЧАСА", label: "ОДИН РАЗ", note: "В НЕДЕЛЮ", price: "20р." },
          { n: "4", unit: "ЧАСА", label: "ДВА РАЗА", note: "В НЕДЕЛЮ", price: "30р." },
        ],
        noteTitle: "* Услуга только для учеников студии!",
        noteText: "Включает установку и тарелки",
        noteUppercase: true,
      },
    },
  },
};

const MODE_ORDER: Mode[] = ["guitar", "drums"];

/* ─────────────────────────────────────────────────────────────
 * ПРОЧИЕ ДАННЫЕ
 * ───────────────────────────────────────────────────────────── */

const STATS: Array<[string, string]> = [
  ["1 на 1", "Индивидуально с преподавателем"],
  ["60 минут", "Одно занятие"],
  ["от 10 лет", "Взрослым и детям"],
  ["0 багажа", "Инструмент и комбик — наши"],
];

// Сгруппировано по бренду (не по платформе), чтобы два значка Instagram
// не стояли подряд без объяснения — Riff и Drum разнесены и у каждого
// свой фирменный цвет вместо общего hover от текущего режима.
// Админ студии: один на обе студии (Riff Lab12 и Drum Lab12), поэтому не зависит от режима
const ADMIN_TG = "sergey_lab12";
const ADMIN_TG_URL = "https://t.me/" + ADMIN_TG;

const SOCIAL_LINKS: Array<{ icon: SocialName; label: string; href: string; tone: Tone }> = [
  { icon: "instagram", label: "Instagram Riff Lab12", href: "https://www.instagram.com/riff_lab12", tone: "orange" },
  { icon: "telegram", label: "Telegram @riff_arina", href: "https://t.me/riff_arina", tone: "orange" },
  { icon: "instagram", label: "Instagram Drum Lab12", href: "https://www.instagram.com/drum_lab12", tone: "red" },
  { icon: "tiktok", label: "TikTok @drum_lab12", href: "https://www.tiktok.com/@drum_lab12", tone: "red" },
];

/* ─────────────────────────────────────────────────────────────
 * СТРАНИЦА
 * ───────────────────────────────────────────────────────────── */

export default function Landing() {
  const [mode, setMode] = useState<Mode>("guitar");
  const [showCta, setShowCta] = useState(false);

  const m = MODES[mode];
  const t = TONE[m.tone];
  const Visual = m.gear.Visual;
  const igUrl = "https://www.instagram.com/" + m.igHandle;

  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const isLg = useMediaQuery("(min-width: 1024px)");
  const guitarStage = !isLg && mode === "guitar"; // мобила и планшет: гитара за текстом, потом под ним
  const guitarScene = isLg && mode === "guitar"; // десктоп: закреплённая сцена, слева текст, справа гитара

  useEffect(() => {
    const onScroll = () => {
      const pastHero = window.scrollY > window.innerHeight * 0.9;
      const teamEl = document.getElementById("team");
      const reachedTeam = teamEl ? teamEl.getBoundingClientRect().top < window.innerHeight * 0.6 : false;
      setShowCta(pastHero && !reachedTeam);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const NAV: Array<[string, string]> = [
    ["#programs", "Программа"],
    ["#" + m.gear.id, "Оборудование"],
    ["#team", "Преподаватель"],
    ["#pricing", "Прайс"],
    ["#contact", "Контакты"],
  ];

  const art = m.pricing.art;

  // Текстовый блок оборудования: один и тот же в сетке (мобила/планшет) и в десктопной сцене
  const gearText = (
    <>
    <div className={"rl-mono text-xs mb-3 tracking-widest uppercase " + t.text}>Студийный сетап</div>
    <h2 className="rl-display text-3xl sm:text-4xl mb-10">Всё готово для игры с первой минуты</h2>

    <div className="space-y-8">
      {m.gear.items.map((it, i) => (
        <div key={it.name} className="flex gap-4 sm:gap-6 items-start">
          <span className="rl-display text-4xl text-rl-muted/40 w-[4.25rem] shrink-0">{String(i + 1).padStart(2, "0")}</span>
          <div>
            <div className={"rl-mono text-xs mb-1 " + t.text}>{it.label}</div>
            <h3 className="rl-display text-xl mb-2">{it.name}</h3>
            <p className="text-sm text-rl-muted leading-relaxed">{it.text}</p>
          </div>
        </div>
      ))}
    </div>
    </>
  );

  return (
    <main className="rl-body bg-rl-bg text-rl-ink overflow-x-clip">
      {/* ─── Шапка ─── */}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur bg-rl-bg/80 border-b border-rl-line h-11 md:h-16 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-full flex items-center justify-between gap-3">
          {/* Лого: на мобильных — только активный бренд, на ПК — всегда оба */}
          <span className="rl-display text-xs sm:text-base md:text-lg tracking-tight sm:tracking-widest whitespace-nowrap flex-shrink-0">
            <span className="sm:hidden">
              {m.logoPrefix}
              <span className={t.text}>LAB12</span>
            </span>
            <span className="hidden sm:inline">
              RIFF<span className={TONE.orange.text}>LAB12</span> <span className="text-rl-muted">×</span> DRUM
              <span className={TONE.red.text}>LAB12</span>
            </span>
          </span>

          <nav className="hidden md:flex gap-6 rl-mono text-xs text-rl-muted">
            {NAV.map(([h, l]) => (
              <a key={l} href={h} className={t.hoverText}>
                {l}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* ─── Hero ─── */}
      <section className="relative pt-24 sm:pt-32 md:pt-40 pb-16 sm:pb-20 md:pb-24 px-6 overflow-hidden min-h-[85vh] flex items-center">
        {reduceMotion ? (
          <img
            className="absolute inset-0 w-full h-full object-cover opacity-45"
            src={`${import.meta.env.BASE_URL}media/hero-poster.png`}
            alt=""
          />
        ) : (
          <video
            className="absolute inset-0 w-full h-full object-cover opacity-45"
            src={`${import.meta.env.BASE_URL}media/hero.mp4`}
            poster={`${import.meta.env.BASE_URL}media/hero-poster.png`}
            autoPlay
            muted
            loop
            playsInline
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-rl-bg/40 via-rl-bg/70 to-rl-bg" />
        <div className="rl-ring w-[520px] h-[520px] -top-40 -right-40" style={{ borderColor: t.cssVar }} />
        <div className="rl-ring w-[320px] h-[320px] top-20 -right-10" style={{ borderColor: t.cssVar }} />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <Kicker tone={m.tone}>Гродно · Студия гитары и ударных</Kicker>
          <h1 className="rl-display text-[clamp(36px,9vw,64px)] leading-[1.05] tracking-tight font-black mb-6">
            Куда сбежать в конце дня,
            <br />
            чтобы найти себя?
          </h1>
          <p className="text-rl-muted text-[clamp(16px,2.2vw,17px)] leading-relaxed max-w-xl mx-auto mb-6 sm:mb-8">
            Приходите в студию со свежей головой, а не с тяжёлым чехлом!
            <br />
            Инструменты для наших учеников уже в студии.
          </p>

          {/* Выбор режима */}
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 max-w-xl mx-auto mb-6 sm:mb-10">
            {MODE_ORDER.map((key) => {
              const cfg = MODES[key];
              const ct = TONE[cfg.tone];
              const active = mode === key;
              const { Icon } = cfg.picker;
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
                      ? ct.border + " " + ct.bgSoft + " shadow-lg " + ct.shadowSoft
                      : "border-rl-line bg-rl-bg/20 opacity-50 grayscale hover:opacity-80 hover:grayscale-0")
                  }
                >
                  <Icon className={"w-7 h-7 sm:w-8 sm:h-8 mb-2 " + (active ? ct.text : "text-rl-muted")} />
                  <div className="rl-display text-lg sm:text-xl mb-0.5">{cfg.picker.label}</div>
                  <div className="text-xs text-rl-muted">{cfg.picker.desc}</div>
                  {active && <span className={"absolute top-4 right-4 w-2 h-2 rounded-full " + ct.bg} />}
                </button>
              );
            })}
          </div>

          <div className="flex justify-center">
            <CTA href="#contact" tone={m.tone} className="text-center">
              Записаться на пробное
            </CTA>
          </div>
        </div>
      </section>

      {/* ─── Цифры ─── */}
      <section className="border-y border-rl-line bg-rl-panel">
        {/* Мобильные: бегущая строка (при reduced-motion — обычная горизонтальная прокрутка) */}
        <div className="md:hidden relative overflow-hidden motion-reduce:overflow-x-auto py-8">
          {/* затемнение по краям */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 z-10 bg-gradient-to-r from-rl-panel to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 z-10 bg-gradient-to-l from-rl-panel to-transparent" />

          <div className="flex w-max rl-marquee motion-reduce:[animation:none]">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex shrink-0" aria-hidden={dup === 1}>
                {STATS.map(([a, b]) => (
                  <div key={a + dup} className="flex flex-col items-center px-8 shrink-0">
                    <div className={"rl-display text-2xl leading-none whitespace-nowrap " + t.text}>{a}</div>
                    <div className="text-xs text-rl-muted mt-1 whitespace-nowrap">{b}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Десктоп: сетка */}
        <div className="hidden md:block max-w-6xl mx-auto px-6 py-10">
          <div className="grid grid-cols-4 gap-8 text-center">
            {STATS.map(([a, b]) => (
              <Reveal key={a}>
                <div className={"rl-display text-3xl leading-none " + t.text}>{a}</div>
                <div className="text-sm text-rl-muted mt-1">{b}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Программа + оборудование ─── */}
      <section id="programs" className="max-w-6xl mx-auto px-6 py-24">
        <Reveal>
          <div id={mode} className="scroll-mt-24">
            <div className="mb-16">
              <Kicker tone={m.tone}>{m.programSection.kicker}</Kicker>
              <h2 className="rl-display text-4xl mb-4">{m.programSection.title}</h2>
              <p className="text-rl-muted mb-8 max-w-2xl">{m.programSection.text}</p>
              {/* key={mode}: при смене режима аккордеон создаётся заново и открывается на первом этапе */}
              <Accordion key={mode} groups={m.program} tone={m.tone} />
            </div>

            {guitarScene ? (
              <div id={m.gear.id} className="scroll-mt-24 py-12">
                <GuitarDesktopScene>{gearText}</GuitarDesktopScene>
              </div>
            ) : (
              <div
                id={m.gear.id}
                className={
                  "grid grid-cols-1 lg:grid-cols-2 items-center scroll-mt-24 py-12 " +
                  (guitarStage ? "gap-x-12" : "gap-12")
                }
                // на мобиле: строка 1 = текст, строка 2 = «посадочная зона» для гитары
                style={guitarStage ? { gridTemplateRows: stageRows(reduceMotion) } : undefined}
              >
                <div
                  className={"flex flex-col justify-center " + (guitarStage ? "relative z-10 pb-6" : "")}
                  style={guitarStage ? { gridColumn: 1, gridRow: 1 } : undefined}
                >
                  {gearText}
                </div>

                <Visual />
              </div>
            )}
          </div>
        </Reveal>
      </section>

      {/* ─── Шесть причин ─── */}
      <section className="relative bg-rl-panel border-y border-rl-line py-24 px-6 overflow-hidden">
        {/* Гигантская фоновая цифра для атмосферы */}
        <span
          className={
            "rl-display pointer-events-none select-none absolute -top-10 -left-6 sm:left-2 text-[13rem] sm:text-[18rem] font-black leading-none opacity-[0.05] " +
            t.text
          }
        >
          6
        </span>

        <div className="max-w-5xl mx-auto relative z-10">
          <Reveal>
            <Kicker tone={m.tone}>Что вы получите</Kicker>
            <h2 className="rl-display text-3xl sm:text-4xl md:text-5xl mb-3">Шесть причин начать</h2>
            <p className="text-rl-muted mb-12 max-w-xl">{m.reasonsText}</p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {REASONS.map((text, i) => (
              <ReasonCard key={text} index={i} text={text} tone={m.tone} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Преподаватель ─── */}
      <section id="team" className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-[380px_1fr] gap-12 lg:gap-16 items-center">
          {/* у пропуска свой выход (вылетает с ударом), поэтому он вне Reveal. БЕЗ key: карточка одна, выход проигрывается заново сам */}
          <TeacherPass
            photo={m.teacher.photo}
            role={m.teacher.role}
            tone={m.tone}
            color
            fields={m.teacher.fields}
          />
          <Reveal key={mode} delay={250}>
            <div>
              <Kicker tone={m.tone}>{m.teacher.kicker}</Kicker>
              <p className="rl-display text-3xl md:text-4xl leading-tight mb-6">{m.teacher.quote}</p>

              <CTA href={m.teacher.ctaHref} ext tone={m.tone}>
                Записаться к преподавателю
              </CTA>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Прайс ─── */}
      <section
        id="pricing"
        className={"relative pt-4 sm:pt-10 pb-24 px-6 overflow-visible transition-colors duration-700 " + t.bg}
        // у гитары верхний отступ задаёт распорка под ней (гитара absolute от шва)
        style={mode === "guitar" ? { paddingTop: 0 } : undefined}
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

        {/* Инструмент — визуально пересекает границу секций */}
        {mode === "guitar" ? (
          <>
            <PricingGuitar />
            <div aria-hidden="true" style={{ height: PRICING_GUITAR_SPACER }} />
          </>
        ) : (
        <div className="max-w-3xl mx-auto relative z-10 flex flex-col items-center">
          <div
            className="pointer-events-none z-10"
            style={{
              width: isDesktop ? art.widthSm : art.width,
              maxWidth: art.maxWidth,
              marginTop: isDesktop ? art.marginTopSm : art.marginTop,
              marginBottom: isDesktop ? art.marginBottomSm : art.marginBottom,
              transform: `translateX(${isDesktop ? art.shiftXSm : art.shiftX}px)`,
            }}
          >
            <PricingDrum src={art.src} alt={art.alt} rotate={art.rotate} scale={art.scale} />
          </div>
        </div>
        )}

        <Reveal className="max-w-3xl mx-auto relative z-10 flex flex-col items-center">
          {/* Заголовок */}
          <div className="text-center mb-10 relative z-0">
            <h2 className="rl-display text-[3.5rem] sm:text-[6rem] leading-[0.85] text-[#1A1A1A] font-black uppercase tracking-tighter">
              {m.pricing.word}
              <br />
              Lessons
            </h2>

            <p className="text-[#1A1A1A] text-xs sm:text-sm font-bold uppercase tracking-widest mt-6 mb-2">
              Абонементы на 1 месяц обучения
            </p>
          </div>

          {/* Таблица цен */}
          <div className="border border-[#1A1A1A]/30 bg-transparent flex flex-col w-full relative z-20">
            {m.pricing.rows.map((r) => (
              <PriceRow key={r.n + r.label + r.note} {...r} />
            ))}
            <PracticeBlock data={m.pricing.practice} tone={m.tone} />
          </div>

          <p className="text-xs text-[#1A1A1A] font-medium mt-6 text-center tracking-wide relative z-20">
            Время одного занятия = 60 минут
          </p>
        </Reveal>
      </section>

      {/* ─── Контакты ─── */}
      <section id="contact" className="max-w-4xl mx-auto px-6 py-24 text-center">
        <Reveal>
          <Kicker tone={m.tone}>Гродно, Беларусь</Kicker>
          <p className="rl-mono text-xs text-rl-muted mt-2 mb-6 tracking-wider uppercase">ул. Горького, 91</p>
          <h2 className="rl-display text-2xl sm:text-4xl md:text-5xl mb-8">Записывайся на пробное занятие</h2>
          <div className="flex gap-4 justify-center flex-wrap mb-8">
            <CTA href={igUrl} ext tone={m.tone}>
              <span className="inline-flex items-center justify-center gap-2">
                <SocialIcon name="instagram" className="w-4 h-4 shrink-0" />
                Написать в директ · @{m.igHandle}
              </span>
            </CTA>
            {/* Второй способ записаться: контурная кнопка, чтобы не конкурировать с основной */}
            <CTA href={ADMIN_TG_URL} ext ghost tone={m.tone}>
              <span className="inline-flex items-center justify-center gap-2">
                <SocialIcon name="telegram" className="w-4 h-4 shrink-0" />
                Написать в Telegram · @{ADMIN_TG}
              </span>
            </CTA>
          </div>
          <p className="rl-mono text-xs text-rl-muted mb-3">
            <span className={TONE.orange.text}>Riff Lab12</span>
            {"  ·  "}
            <span className={TONE.red.text}>Drum Lab12</span>
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
                  className={"text-rl-muted transition-colors " + TONE[s.tone].hoverText}
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
            "w-full max-w-[320px] flex items-center justify-center py-4 px-6 rl-mono text-xs font-bold tracking-widest uppercase rounded-full " +
            "shadow-2xl transition-all duration-300 active:scale-95 " +
            t.floatingCta
          }
        >
          Записаться на пробное
        </a>
      </div>

      <footer className="border-t border-rl-line py-6 md:py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-center items-center gap-2 md:gap-4">
          <p className="text-[10px] sm:text-xs text-rl-muted text-center">
            © 2026 Riff Lab12 · Drum Lab12. Студия гитары и ударных, Гродно, ул. Горького, 91.
          </p>
        </div>
      </footer>
    </main>
  );
}