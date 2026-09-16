import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

type Mode = "guitar" | "drums";

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
  return (
    <div className="grid sm:grid-cols-2 gap-4 max-w-xl mx-auto mb-10">
      <button
        onClick={() => setMode("guitar")}
        className={
          "text-left rounded-2xl border-2 p-5 transition " +
          (mode === "guitar" ? "border-rl-orange bg-rl-orange/10" : "border-rl-line hover:border-rl-orange/60")
        }
      >
        <div className="text-2xl mb-1">🎸</div>
        <div className="rl-display text-xl">RIFF LAB12</div>
        <div className="text-xs text-rl-muted">Электро и акустическая гитара</div>
      </button>
      <button
        onClick={() => setMode("drums")}
        className={
          "text-left rounded-2xl border-2 p-5 transition " +
          (mode === "drums" ? "border-rl-red bg-rl-red/10" : "border-rl-line hover:border-rl-red/60")
        }
      >
        <div className="text-2xl mb-1">🥁</div>
        <div className="rl-display text-xl">DRUM LAB12</div>
        <div className="text-xs text-rl-muted">Ударная установка</div>
      </button>
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

const SOCIALS: Array<[string, string]> = [
  ["riff_lab12", "https://www.instagram.com/riff_lab12"],
  ["drum_lab12", "https://www.instagram.com/drum_lab12"],
];

export default function Landing() {
  const [mode, setMode] = useState<Mode>("guitar");
  const g = mode === "guitar";
  const eqHref = g ? "#guitar-equipment" : "#drum-equipment";
  const igHandle = g ? "riff_lab12" : "drum_lab12";
  const igUrl = "https://www.instagram.com/" + igHandle;
  const tone = g ? "orange" : "red";
  const NAV: Array<[string, string]> = [
    ["#programs", "Программа"],
    [eqHref, "Оборудование"],
    ["#team", "Преподаватель"],
    ["#pricing", "Цены"],
    ["#contact", "Контакты"],
  ];
  return (
    <main className="rl-body bg-rl-bg text-rl-ink overflow-x-hidden">
      <header className={"fixed top-0 inset-x-0 z-50 backdrop-blur bg-rl-bg/80 border-b h-14 md:h-16 overflow-hidden " + (g ? "border-rl-line" : "border-rl-red/30")}>
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-full flex items-center justify-between">
          <span className="rl-display text-base md:text-lg tracking-widest whitespace-nowrap flex-shrink-0">
            RIFF<span className="text-rl-orange">LAB12</span>{" "}
            <span className="text-rl-muted text-base">×</span> DRUM<span className="text-rl-red">LAB12</span>
          </span>
          <nav className="hidden md:flex gap-6 rl-mono text-xs text-rl-muted">
            {NAV.map(([h, l]) => (
              <a key={l} href={h} className={"hover:" + (g ? "text-rl-orange" : "text-rl-red")}>
                {l}
              </a>
            ))}
          </nav>
          <CTA href="#contact" tone={tone} className="max-h-9 py-1 px-3 text-[11px] md:text-xs font-bold leading-tight uppercase rounded-full flex-shrink-0">
            Пробное занятие
          </CTA>
        </div>
      </header>

      <section className="relative pt-40 pb-24 px-6 overflow-hidden min-h-[85vh] flex items-center">
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
          style={{ borderColor: "var(--color-rl-red)" }}
        />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <Kicker tone={tone}>Гродно · Студия гитары и ударных</Kicker>
          <h1 className="rl-display text-2xl sm:text-4xl md:text-6xl leading-tight tracking-tight font-black mb-6">
            Куда сбежать в конце дня,
            <br />
            чтобы найти себя?
          </h1>
          <p className="text-rl-muted text-lg mb-8 max-w-xl mx-auto">
            Индивидуальные занятия для взрослых и детей от 10 лет, на топовых инструментах — свои
            везти не нужно. Выбери, с чего начать:
          </p>
          <Picker mode={mode} setMode={setMode} />
          <div className="flex gap-4 justify-center flex-wrap">
            <CTA href="#contact" tone={tone}>
              Записаться на пробное
            </CTA>
            <CTA href="#programs" ghost>
              Смотреть программу
            </CTA>
          </div>
        </div>
      </section>

      <section className="border-y border-rl-line bg-rl-panel">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            ["1 на 1", "Индивидуально с преподавателем"],
            ["10+ лет", "Взрослым и детям"],
            ["60 минут", "Одно занятие"],
            ["0 багажа", "Инструмент и комбик — наши"],
          ].map(([a, b]) => (
            <Reveal key={a}>
              <div className={"rl-display text-3xl " + (g ? "text-rl-orange" : "text-rl-red")}>{a}</div>
              <div className="text-sm text-rl-muted mt-1">{b}</div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="programs" className="max-w-6xl mx-auto px-6 py-24">
        {g ? (
          <Reveal>
            <div id="guitar" className="grid md:grid-cols-2 gap-12 items-center scroll-mt-24">
              <div>
                <Kicker>Riff Lab12 · Гитара</Kicker>
                <h2 className="rl-display text-2xl sm:text-3xl md:text-4xl mb-4">Электро и акустика, с нуля</h2>
                <p className="text-rl-muted mb-4">
                  Обучение — это удовольствие, а не усталость ещё до занятия. Приезжаешь в студию,
                  берёшь со стойки отстроенную гитару и подключаешься к комбику.
                </p>
                <ul className="rl-mono text-xs text-rl-muted grid grid-cols-2 gap-2">
                  {["Постановка рук", "Звукоизвлечение", "Ноты и гаммы", "Аккорды и риффы", "Беглость пальцев", "Игра с динамикой"].map(
                    (t) => (
                      <li key={t} className="border border-rl-line rounded px-3 py-2">
                        {t}
                      </li>
                    ),
                  )}
                </ul>
              </div>
              <div id="guitar-equipment" className="rounded-2xl bg-rl-panel border border-rl-line p-8 scroll-mt-24">
                <div className="rl-mono text-xs text-rl-orange mb-2">Инструмент студии</div>
                <div className="rl-display text-2xl mb-1">Jet JS-400 MBK R Black</div>
                <p className="text-sm text-rl-muted">
                  Stratocaster · мензура 25.5&quot; · гриф Modern C, обожжённый клён · 2×Ceramic (H-H)
                </p>
                <div className="rl-mono text-xs text-rl-orange mt-6 mb-2">Комбоусилитель</div>
                <div className="rl-display text-2xl mb-1">NUX Mighty 20W-MKII</div>
                <p className="text-sm text-rl-muted">20 Вт · 18 эффектов · Bluetooth · 4 канала</p>
              </div>
            </div>
          </Reveal>
        ) : (
          <Reveal>
            <div id="drums" className="grid md:grid-cols-2 gap-12 items-center scroll-mt-24">
              <div id="drum-equipment" className="rounded-2xl bg-rl-panel border border-rl-line p-8 md:order-2 scroll-mt-24">
                <div className="rl-mono text-xs text-rl-red mb-2">Инструмент студии</div>
                <div className="rl-display text-2xl mb-1">Pearl Roadshow + Arborea</div>
                <p className="text-sm text-rl-muted">Полная установка + тарелки Paiste Color Sound 900</p>
                <div className="rl-mono text-xs text-rl-red mt-6 mb-2">Аренда Drum Room</div>
                <p className="text-sm text-rl-muted">1ч — 20 р · 2ч — 40 р · 4ч — 80 р</p>
              </div>
              <div className="md:order-1">
                <div className="flex items-center gap-4 mb-1">
                  <div className="rl-hit">
                    <span className="pulse" />
                    <span className="pulse d2" />
                    <span className="dot" />
                  </div>
                  <div className="rl-eq">
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
                <Kicker>
                  <span className="text-rl-red">Drum Lab12 · Ударные</span>
                </Kicker>
                <h2 className="rl-display text-2xl sm:text-3xl md:text-4xl mb-4">Не просто бить в барабаны</h2>
                <p className="text-rl-muted mb-4">
                  Мечтаешь сесть за установку и задать свой ритм? Учим чувствовать музыку, а не
                  заучивать удары — с первого занятия.
                </p>
                <ul className="rl-mono text-xs text-rl-muted grid grid-cols-2 gap-2">
                  {["Работа рук и ног", "Грув и тайминг", "Динамика игры", "Заглушение", "Чтение ритма", "Игра под трек"].map(
                    (t) => (
                      <li key={t} className="border border-rl-line rounded px-3 py-2">
                        {t}
                      </li>
                    ),
                  )}
                </ul>
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
              "Поступить в муз. учебные заведения",
              "Построить карьеру музыканта",
              "Переключаться от рутины после работы",
            ].map((t, i) => (
              <li key={t} className="flex gap-5 items-start">
                <span className={"rl-display text-3xl w-10 " + (g ? "text-rl-orange" : "text-rl-red")}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="pt-1">{t}</span>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      <section id="team" className="max-w-2xl mx-auto px-6 py-24">
        <Reveal>
          <Kicker tone={tone}>Преподаватель</Kicker>
          <h2 className="rl-display text-2xl sm:text-3xl md:text-4xl mb-10">С кем вы будете заниматься</h2>
          {g ? (
            <div className="rounded-2xl border border-rl-line p-8">
              <div className="rl-mono text-xs text-rl-orange mb-3">Гитара · Riff Lab12</div>
              <p className="text-sm text-rl-muted leading-relaxed">
                Индивидуальные занятия на электро и акустической гитаре для взрослых и детей, уровень
                с нуля. Записаться — Telegram @riff_arina или директ Instagram.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-rl-line p-8">
              <div className="rl-mono text-xs text-rl-red mb-3">Ударные · Drum Lab12</div>
              <p className="text-sm text-rl-muted leading-relaxed">
                Гродненский гос. колледж искусств, факультет «Музыкальное искусство», специальность
                «Искусство эстрады». На ударных с 13 лет, преподаёт с 2018. Экс-барабанщица
                кавер-группы «Хит Хантер», сессионный и студийный барабанщик.
              </p>
            </div>
          )}
        </Reveal>
      </section>

      <section id="pricing" className="bg-rl-panel border-y border-rl-line py-24 px-6">
        <Reveal className="max-w-md mx-auto">
          <Kicker tone={tone}>Цены</Kicker>
          <h2 className="rl-display text-2xl sm:text-3xl md:text-4xl mb-10">Абонемент на 1 месяц</h2>
          <div className={"rounded-2xl border p-8 " + (g ? "border-rl-orange" : "border-rl-red")}>
            <div className="rl-display text-2xl mb-4">{g ? "Guitar Lessons" : "Drum Lessons"}</div>
            {(g
              ? [
                  ["1 час · пробное", "55 р."],
                  ["4ч/мес · 1х в неделю", "200 р./мес"],
                  ["8ч/мес · 2х в неделю", "380 р./мес"],
                ]
              : [
                  ["1 час · пробное", "50 р."],
                  ["4ч/мес · 1х в неделю", "180 р./мес"],
                  ["8ч/мес · 2х в неделю", "340 р./мес"],
                ]
            ).map(([a, b]) => (
              <div key={a} className="flex justify-between py-3 border-t border-rl-line text-sm">
                <span className="text-rl-muted">{a}</span>
                <span className="rl-mono">{b}</span>
              </div>
            ))}
            <p className="text-xs text-rl-muted mt-4">Занятие = 60 минут, индивидуально.</p>
          </div>
          <p className="text-xs text-rl-muted mt-6 text-center">
            Точные слоты — в директ Instagram или Telegram.
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
            <CTA href={igUrl} ext ghost>
              Instagram @{igHandle}
            </CTA>
          </div>
          <p className="rl-mono text-xs text-rl-muted">
            {SOCIALS.map(([h, u], i) => (
              <span key={h}>
                {i > 0 && " · "}
                <a href={u} target="_blank" rel="noopener noreferrer" className="hover:text-rl-ink">
                  instagram @{h}
                </a>
              </span>
            ))}
            {" · "}
            <a href="https://t.me/riff_arina" target="_blank" rel="noopener noreferrer" className="hover:text-rl-ink">
              telegram @riff_arina
            </a>
            {" · "}
            <a
              href="https://www.tiktok.com/@drum_lab12"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-rl-ink"
            >
              tiktok @drum_lab12
            </a>
          </p>
        </Reveal>
      </section>

      <footer className="border-t border-rl-line py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="rl-display text-lg">
            RIFF<span className="text-rl-orange">LAB12</span> × DRUM<span className="text-rl-red">LAB12</span>
          </span>
          <p className="text-xs text-rl-muted">
            © 2026 Riff Lab12 · Drum Lab12. Студии гитары и ударных, Гродно.
          </p>
        </div>
      </footer>
    </main>
  );
}