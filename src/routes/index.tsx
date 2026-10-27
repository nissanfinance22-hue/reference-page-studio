import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRight, BookOpen, Brain, CheckCircle2, ChevronLeft, ChevronRight, ClipboardCheck,
  FolderOpen, HeartPulse, Printer, ShoppingCart, Smartphone, X, Bone, ShieldPlus,
  Pill, Bandage, UserRound, Siren, Baby, FileText, GraduationCap, Zap, Lock, Headset, HeartHandshake,
} from "lucide-react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import capa from "@/assets/CAPA.png.asset.json";
import boxKit from "@/assets/box_kit_enfermaria.png.asset.json";
import card03 from "@/assets/03_card.png.asset.json";
import pln02 from "@/assets/PLN_02.png.asset.json";
import funil from "@/assets/plr_funil.png.asset.json";

// Asset paths are served by Lovable, not by external hosts such as Vercel.
const assetUrl = (asset: { url: string }) =>
  new URL(asset.url, "https://reference-prompt-studio.lovable.app").href;

/* ===== CONFIGURAÇÃO DA OFERTA — preencha com dados reais ===== */
const CHECKOUT_URL = "https://pay.cakto.com.br/47qiz8f_1248754";
const PRICE: { de?: string; por?: string; parcelas?: string } = { de: "R$ 57,90", por: "R$ 17,90" };
// Preencha com a DATA/HORA REAL de encerramento (ISO com fuso, por exemplo 2026-11-01T23:59:59-03:00).
// Sem prazo real, o contador de 24 horas não é exibido. Não reinicia a cada visita.
const PROMO_END_AT = "";
const BONUS: { nome: string; descricao: string }[] = []; // bônus reais
type ExampleComment = { titulo: string; texto: string };
const EXAMPLE_COMMENTS: ExampleComment[] = [
  {
    "titulo": "Exemplo ilustrativo 01",
    "texto": "Gostaria de revisar sinais vitais com ilustrações e explicações curtas."
  },
  {
    "titulo": "Exemplo ilustrativo 02",
    "texto": "Ter os assuntos divididos por categoria pode facilitar a organização."
  },
  {
    "titulo": "Exemplo ilustrativo 03",
    "texto": "Uma folha visual ajuda a localizar rapidamente o tema que quero revisar."
  },
  {
    "titulo": "Exemplo ilustrativo 04",
    "texto": "Acho prático conseguir estudar pelo celular nos intervalos."
  },
  {
    "titulo": "Exemplo ilustrativo 05",
    "texto": "Ter opção de imprimir os cards pode ajudar na preparação para provas."
  },
  {
    "titulo": "Exemplo ilustrativo 06",
    "texto": "Prefiro esquemas coloridos para relembrar os conceitos."
  },
  {
    "titulo": "Exemplo ilustrativo 07",
    "texto": "Uma coleção por assunto pode tornar a revisão mais direcionada."
  },
  {
    "titulo": "Exemplo ilustrativo 08",
    "texto": "Gosto de materiais que apresentam informações de forma objetiva."
  },
  {
    "titulo": "Exemplo ilustrativo 09",
    "texto": "Ver exemplos ilustrados ajuda a conectar teoria e prática."
  },
  {
    "titulo": "Exemplo ilustrativo 10",
    "texto": "É bom ter uma opção de estudo que não dependa de vídeo."
  },
  {
    "titulo": "Exemplo ilustrativo 11",
    "texto": "A organização do conteúdo faz diferença para criar rotina."
  },
  {
    "titulo": "Exemplo ilustrativo 12",
    "texto": "Os temas de biossegurança são importantes na minha revisão."
  },
  {
    "titulo": "Exemplo ilustrativo 13",
    "texto": "Gostaria de revisar anatomia com imagens e legendas."
  },
  {
    "titulo": "Exemplo ilustrativo 14",
    "texto": "Praticar questões visuais parece uma forma interessante de aprender."
  },
  {
    "titulo": "Exemplo ilustrativo 15",
    "texto": "A possibilidade de imprimir me permite montar fichas de estudo."
  },
  {
    "titulo": "Exemplo ilustrativo 16",
    "texto": "É útil consultar conteúdos essenciais antes de um estágio."
  },
  {
    "titulo": "Exemplo ilustrativo 17",
    "texto": "Um PDF organizado pode ajudar a revisar de onde estiver."
  },
  {
    "titulo": "Exemplo ilustrativo 18",
    "texto": "Prefiro revisar um assunto de cada vez para manter o foco."
  },
  {
    "titulo": "Exemplo ilustrativo 19",
    "texto": "Cards ilustrados podem deixar o processo de estudo mais agradável."
  },
  {
    "titulo": "Exemplo ilustrativo 20",
    "texto": "É interessante ter os tópicos de enfermagem reunidos num só material."
  }
];
// Fotos genéricas de banco para teste visual. Nenhum rosto representa comprador ou autor do comentário.
const DEMO_NAMES = ["Camila M.","Juliana F.","Rafael A.","Fernanda S.","Patrícia L.","Lucas R.","Renata C.","Bruno P.","Amanda V.","Bianca N.","André S.","Larissa G.","Matheus B.","Vanessa C.","Marina T.","Gabriel P.","Isabela D.","Daniel S.","Paula C.","Carolina R."] as const;
const DEMO_PHOTOS = [
  "https://randomuser.me/api/portraits/women/44.jpg",
  "https://randomuser.me/api/portraits/women/21.jpg",
  "https://randomuser.me/api/portraits/men/32.jpg",
  "https://randomuser.me/api/portraits/women/68.jpg",
  "https://randomuser.me/api/portraits/women/55.jpg",
  "https://randomuser.me/api/portraits/men/12.jpg",
  "https://randomuser.me/api/portraits/women/14.jpg",
  "https://randomuser.me/api/portraits/men/63.jpg",
  "https://randomuser.me/api/portraits/women/35.jpg",
  "https://randomuser.me/api/portraits/women/72.jpg",
  "https://randomuser.me/api/portraits/men/37.jpg",
  "https://randomuser.me/api/portraits/women/47.jpg",
  "https://randomuser.me/api/portraits/men/70.jpg",
  "https://randomuser.me/api/portraits/women/52.jpg",
  "https://randomuser.me/api/portraits/women/64.jpg",
  "https://randomuser.me/api/portraits/men/47.jpg",
  "https://randomuser.me/api/portraits/women/30.jpg",
  "https://randomuser.me/api/portraits/men/44.jpg",
  "https://randomuser.me/api/portraits/women/79.jpg",
  "https://randomuser.me/api/portraits/women/61.jpg",
] as const;
// Estes 20 textos são exemplos de layout, NÃO são depoimentos de compradores.
// Substitua por depoimentos reais com autorização antes de apresentar como prova social.
/* ============================================================= */

const TITLE = "Enfermagem Visual — Kit com 200 Cards Ilustrativos";
const DESC = "Estude Enfermagem de forma visual: 200 cards ilustrativos em 10 categorias, em PDF para consultar no celular ou imprimir.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: assetUrl(capa) },
      { name: "twitter:image", content: assetUrl(capa) },
    ],
  }),
  component: Index,
});

const slides = [
  { src: assetUrl(card03), alt: "Página de cards de Sinais Vitais" },
  { src: assetUrl(capa), alt: "Capa do kit Enfermagem Visual" },
  { src: assetUrl(funil), alt: "Cards impressos sobre a mesa de estudo" },
  { src: assetUrl(pln02), alt: "Estudantes revisando com os cards" },
];

const categorias = [
  { n: "Sinais vitais", i: HeartPulse },
  { n: "Anatomia e fisiologia", i: Bone },
  { n: "Biossegurança", i: ShieldPlus },
  { n: "Administração de medicamentos", i: Pill },
  { n: "Curativos e cuidados com feridas", i: Bandage },
  { n: "Cuidados básicos ao paciente", i: UserRound },
  { n: "Urgência e emergência", i: Siren },
  { n: "Saúde da mulher, criança e pessoa idosa", i: Baby },
  { n: "Ética, registros e segurança do paciente", i: FileText },
  { n: "Revisão para provas e estágios", i: GraduationCap },
];

function CTA({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const href = CHECKOUT_URL || "#comprar";
  return (
    <a
      href={href}
      {...(CHECKOUT_URL ? { target: "_blank", rel: "noopener" } : {})}
      className={`btn-cta inline-flex items-center justify-center gap-3 rounded-full px-7 py-4 font-display text-base font-bold uppercase tracking-wide sm:text-lg ${className}`}
    >
      <ShoppingCart className="h-5 w-5 shrink-0" />
      {children}
      <ArrowRight className="h-5 w-5 shrink-0" />
    </a>
  );
}

function Carousel() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [zoom, setZoom] = useState(false);
  const touch = useRef<number | null>(null);
  const go = useCallback((d: number) => setI((p) => (p + d + slides.length) % slides.length), []);
  useEffect(() => {
    if (paused || zoom) return;
    const t = setInterval(() => go(1), 4500);
    return () => clearInterval(t);
  }, [paused, zoom, go]);
  const stop = () => setPaused(true);

  return (
    <div>
      <div
        className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
        onTouchStart={(e) => { stop(); touch.current = e.touches[0]?.clientX ?? 0; }}
        onTouchEnd={(e) => {
          if (touch.current === null) return;
          const dx = (e.changedTouches[0]?.clientX ?? 0) - touch.current;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
          touch.current = null;
        }}
      >
        <div className="flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${i * 100}%)` }}>
          {slides.map((s) => (
            <button key={s.src} onClick={() => { stop(); setZoom(true); }} className="aspect-[4/3] w-full shrink-0 cursor-zoom-in bg-muted">
              <img src={s.src} alt={s.alt} className="h-full w-full object-contain" loading="lazy" />
            </button>
          ))}
        </div>
        {[-1, 1].map((d) => (
          <button
            key={d}
            aria-label={d < 0 ? "Anterior" : "Próximo"}
            onClick={() => { stop(); go(d); }}
            className={`absolute top-1/2 -translate-y-1/2 ${d < 0 ? "left-3" : "right-3"} grid h-11 w-11 place-items-center rounded-full bg-secondary/80 text-secondary-foreground backdrop-blur transition hover:bg-secondary`}
          >
            {d < 0 ? <ChevronLeft /> : <ChevronRight />}
          </button>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-4 gap-3">
        {slides.map((s, k) => (
          <button
            key={s.src}
            onClick={() => { stop(); setI(k); }}
            className={`aspect-square overflow-hidden rounded-xl border-2 transition ${k === i ? "border-primary shadow-glow" : "border-border opacity-60 hover:opacity-100"}`}
          >
            <img src={s.src} alt="" className="h-full w-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>
      {zoom && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/90 p-4" onClick={() => setZoom(false)}>
          <button aria-label="Fechar" className="absolute right-4 top-4 rounded-full bg-card p-2 text-foreground"><X /></button>
          <img src={slides[i]!.src} alt={slides[i]!.alt} className="max-h-full max-w-full rounded-xl object-contain" />
        </div>
      )}
    </div>
  );
}


function PromoCountdown() {
  const [remaining, setRemaining] = useState<number | null>(null);
  useEffect(() => {
    if (!PROMO_END_AT) return;
    const deadline = new Date(PROMO_END_AT).getTime();
    if (!Number.isFinite(deadline)) return;
    const update = () => setRemaining(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);
  if (remaining === null) return null;
  if (remaining <= 0) return <p className="mt-3 text-sm font-bold text-destructive">Prazo desta campanha encerrado. Confira a oferta atual no checkout.</p>;
  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;
  const two = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="mt-4 rounded-xl bg-secondary px-4 py-3 text-secondary-foreground">
      <p className="text-xs font-bold">Esta campanha termina em</p>
      <p role="timer" aria-label="Tempo restante da oferta" className="mt-1 font-display text-2xl font-bold tabular-nums">{two(hours)}:{two(minutes)}:{two(seconds)}</p>
    </div>
  );
}

function ExampleCommentsCarousel() {
  const [position, setPosition] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setPosition((n) => (n + 1) % EXAMPLE_COMMENTS.length), 5500);
    return () => clearInterval(interval);
  }, []);
  const visible = [0, 1, 2].map((offset) => ({
    ...EXAMPLE_COMMENTS[(position + offset) % EXAMPLE_COMMENTS.length]!,
    number: (position + offset) % EXAMPLE_COMMENTS.length + 1,
  }));
  const move = (offset: number) => setPosition((n) => (n + offset + EXAMPLE_COMMENTS.length) % EXAMPLE_COMMENTS.length);
  return (
    <section className="bg-muted py-16" aria-label="Comentários de demonstração">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-secondary sm:text-3xl">RELATOS SOBRE A ROTINA DE ESTUDOS</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Um espaço preparado para futuras avaliações e experiências de estudo.</p>
          </div>
          <div className="flex gap-2">
            <button type="button" aria-label="Comentário anterior" onClick={() => move(-1)} className="grid h-11 w-11 place-items-center rounded-full border border-border bg-card text-secondary hover:border-primary"><ChevronLeft /></button>
            <button type="button" aria-label="Próximo comentário" onClick={() => move(1)} className="grid h-11 w-11 place-items-center rounded-full border border-border bg-card text-secondary hover:border-primary"><ChevronRight /></button>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {visible.map((item, i) => (
            <article key={item.number} className={`rounded-2xl border border-border bg-card p-6 shadow-soft ${i > 0 ? "hidden md:block" : ""}`}>
              <div className="mb-4 flex items-center gap-3">
                <img src={DEMO_PHOTOS[(item.number - 1) % DEMO_PHOTOS.length]} alt="Foto de perfil de banco de imagens para demonstração" className="h-12 w-12 rounded-full border-2 border-primary/20 object-cover" loading="lazy" referrerPolicy="no-referrer" />
                <div>
                  <p className="font-bold text-secondary">{DEMO_NAMES[(item.number - 1) % DEMO_NAMES.length]}</p>
                  
                </div>
              </div>
              <p className="min-h-16 text-sm leading-relaxed text-foreground">“{item.texto}”</p>
            </article>
          ))}
        </div>
        <p className="mt-4 text-right text-xs text-muted-foreground">Prévia do layout: fotos e comentários são fictícios, ainda sem avaliações reais de clientes.</p>
      </div>
    </section>
  );
}


function PurchaseGallery() {
  const images = [
    { src: assetUrl(boxKit), alt: "Box premium Enfermagem Visual com 200 cards ilustrativos" },
    { src: "/images/cards-caseiros.webp", alt: "Cards ilustrativos do kit organizados sobre uma mesa de casa" },
  ];
  const [active, setActive] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setActive((n) => (n + 1) % images.length), 5500);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="relative mx-auto w-full max-w-[360px]">
      <div className="relative h-[180px] overflow-hidden rounded-xl bg-muted sm:h-[195px]">
        {images.map((photo, i) => (
          <img key={photo.src} src={photo.src} alt={photo.alt} loading={i === 0 ? "eager" : "lazy"}
            className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-700 ${i === active ? "opacity-100" : "opacity-0"}`} />
        ))}
        <button type="button" aria-label="Foto anterior" onClick={() => setActive((n) => (n + images.length - 1) % images.length)} className="absolute left-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-card/90 shadow"><ChevronLeft className="h-5 w-5" /></button>
        <button type="button" aria-label="Próxima foto" onClick={() => setActive((n) => (n + 1) % images.length)} className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-card/90 shadow"><ChevronRight className="h-5 w-5" /></button>
      </div>
      <div className="mt-2 flex justify-center gap-2">
        {images.map((photo, i) => (
          <button key={photo.src} type="button" onClick={() => setActive(i)} aria-label={`Mostrar foto ${i + 1}`} aria-current={i === active ? "true" : undefined} className={`h-2 rounded-full transition-all ${i === active ? "w-8 bg-primary" : "w-2 bg-primary/30"}`} />
        ))}
      </div>
    </div>
  );
}

function Index() {
  return (
    <main className="overflow-x-hidden pb-24 md:pb-0">
      {/* HERO */}
      <section className="relative bg-hero text-primary-foreground">
        <div className="relative mx-auto grid max-w-6xl gap-6 px-5 py-10 md:grid-cols-[1.2fr_1fr] md:items-center md:py-12">
          <div>
            <div className="mb-6 flex items-center gap-2 font-display text-sm font-bold uppercase tracking-widest">
              <HeartPulse className="h-7 w-7 text-accent" /> Enfermagem Visual
            </div>
            <span className="inline-block -rotate-1 rounded-lg bg-gold px-4 py-1 font-display text-lg font-extrabold text-accent-foreground sm:text-2xl">
              {BONUS.length ? "KIT COMPLETO + BÔNUS" : "KIT COMPLETO"}
            </span>
            <h1 className="mt-3 text-5xl font-extrabold leading-none tracking-tight sm:text-7xl">ENFERMAGEM VISUAL</h1>
            <span className="mt-3 inline-block rotate-1 rounded-lg bg-gold px-4 py-1 font-display text-xl font-extrabold text-accent-foreground sm:text-3xl">
              200 CARDS ILUSTRATIVOS
            </span>
            <p className="mt-6 max-w-xl text-lg text-secondary-foreground/90">
              Estude de forma mais visual, revise os principais conteúdos de Enfermagem e tenha seus materiais organizados em um só lugar.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                [BookOpen, "Estude com ilustrações didáticas"],
                [ClipboardCheck, "Revise quando e onde quiser"],
                [Printer, "Consulte pelo celular ou imprima"],
              ].map(([I, t]) => {
                const Icon = I as typeof BookOpen;
                return (
                  <li key={t as string} className="flex items-center gap-3 text-sm font-semibold">
                    <Icon className="h-7 w-7 shrink-0 text-accent" /> {t as string}
                  </li>
                );
              })}
            </ul>
            <p className="mt-6 font-script text-2xl sm:text-3xl">Seu próximo passo nos estudos começa com uma revisão mais organizada. ♡</p>
            <CTA className="mt-8">Quero meu kit completo</CTA>
          </div>
          <img src={assetUrl(boxKit)} alt="Box oficial do Enfermagem Visual" className="animate-box-float mx-auto max-h-[315px] w-full max-w-[260px] object-contain drop-shadow-2xl sm:max-h-[370px] sm:max-w-[330px]" />
        </div>
      </section>

      {/* VITRINE */}
      <section id="comprar" className="mx-auto grid max-w-6xl gap-7 px-5 py-10 md:grid-cols-2 md:items-start">
        <div>
          <h2 className="text-2xl font-extrabold text-secondary sm:text-3xl">VEJA COMO É ESTUDAR COM O ENFERMAGEM VISUAL</h2>
          <p className="mb-6 mt-2 text-muted-foreground">Cada página reúne conteúdos ilustrados para facilitar sua rotina de revisão.</p>
          <div className="mx-auto max-w-lg"><Carousel /></div>
        </div>
        <div className="h-fit rounded-3xl border-2 border-primary/30 bg-card p-4 shadow-soft sm:p-5 lg:sticky lg:top-6">
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-center gap-3">
            <PurchaseGallery />
            <div className="min-w-0">
              <span className="inline-flex rounded-full bg-gold px-2.5 py-1 text-[10px] font-extrabold uppercase text-accent-foreground sm:text-xs">Kit completo de enfermagem</span>
              <h3 className="mt-2 text-lg font-extrabold leading-tight text-secondary sm:text-xl">200 Cards Ilustrativos</h3>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">10 categorias, incluindo 20 desafios de revisão. Arquivo digital em PDF.</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-3 rounded-2xl border border-primary/25 bg-muted px-4 py-3">
            <div>
              <p className="font-display text-xs font-extrabold uppercase tracking-wider text-secondary">Oferta do kit</p>
              {PRICE.de && <p className="mt-1 text-sm text-muted-foreground">De <span className="line-through">{PRICE.de}</span></p>}
              <p className="font-display text-4xl font-extrabold leading-none text-primary sm:text-5xl">{PRICE.por}</p>
            </div>
            <span className="rounded-lg bg-gold px-3 py-2 text-sm font-extrabold text-accent-foreground">200 cards</span>
          </div>
          <CTA className="mt-3 w-full px-3 py-3 text-sm sm:text-base">Comprar agora — R$ 17,90</CTA>
          <p className="mt-2 text-center text-xs text-muted-foreground">Produto digital • Checkout da Cakto</p>
          <PromoCountdown />
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {["200 cards ilustrados", "10 categorias", "PDF para consulta e impressão", "20 desafios incluídos"].map((benefit) => (
              <li key={benefit} className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2 text-xs font-semibold">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />{benefit}
              </li>
            ))}
          </ul>
          {BONUS.length > 0 && (
            <div className="mt-4 rounded-xl bg-muted p-3">
              <p className="font-bold text-secondary">Bônus incluídos</p>
              {BONUS.map((b) => <p key={b.nome} className="mt-1 text-xs"><strong>{b.nome}</strong> — {b.descricao}</p>)}
            </div>
          )}
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="bg-muted py-16">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-center text-2xl font-extrabold text-secondary sm:text-3xl">O MÉTODO 100% VISUAL PARA ESTUDAR ENFERMAGEM DE UM JEITO MAIS SIMPLES E FÁCIL</h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-muted-foreground">Estude com cards ilustrativos, revise com praticidade e tenha os principais conteúdos organizados em um só lugar.</p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [Brain, "Aprendizado visual", "Ilustrações e esquemas que ajudam a compreender assuntos importantes."],
              [ClipboardCheck, "Revisão prática", "Consulte conceitos e informações de forma objetiva."],
              [FolderOpen, "Tudo organizado", "200 cards divididos em 10 categorias essenciais."],
              [Smartphone, "Estude no seu ritmo", "Acesse o PDF em dispositivos compatíveis ou imprima para estudar."],
            ].map(([I, t, d]) => {
              const Icon = I as typeof Brain;
              return (
                <div key={t as string} className="rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:shadow-soft">
                  <div className="grid h-14 w-14 place-items-center rounded-full bg-primary/15 text-primary"><Icon className="h-7 w-7" /></div>
                  <h3 className="mt-4 text-lg font-bold text-secondary">{t as string}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{d as string}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Demonstração de comentários; não representa compradores reais */}
      <ExampleCommentsCarousel />

      {/* CATEGORIAS */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="text-2xl font-extrabold text-secondary sm:text-3xl">O QUE VOCÊ VAI ENCONTRAR NO KIT?</h2>
        <p className="mt-2 text-muted-foreground">São 10 categorias com os principais temas da enfermagem, organizados de forma visual e objetiva.</p>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categorias.map(({ n, i: Icon }, k) => (
            <div key={n} className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 text-center transition hover:-translate-y-1 hover:shadow-soft">
              <span className="absolute inset-x-0 top-0 h-1 bg-cta" />
              <span className="absolute left-3 top-3 font-display text-xs font-bold text-muted-foreground">{String(k + 1).padStart(2, "0")}</span>
              <Icon className="mx-auto mt-2 h-9 w-9 text-primary" />
              <p className="mt-3 text-sm font-semibold">{n}</p>
            </div>
          ))}
        </div>
      </section>

      {/* EMOCIONAL */}
      <section className="bg-hero text-primary-foreground">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1fr_1.4fr] md:items-center">
          <img src={assetUrl(funil)} alt="Estudante revisando com os cards impressos" className="mx-auto w-full max-w-sm rounded-3xl shadow-2xl" loading="lazy" />
          <div>
            <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">MENOS TEMPO PROCURANDO CONTEÚDO. <span className="text-accent">MAIS PRATICIDADE PARA REVISAR.</span></h2>
            <p className="mt-5 text-lg text-secondary-foreground/90">
              Entre aulas, provas e estágios, ter seus materiais organizados faz diferença. O <b>Enfermagem Visual</b> reúne conteúdos essenciais em cards ilustrados que você pode consultar sempre que precisar.
            </p>
            <ul className="mt-6 grid grid-cols-2 gap-3 text-sm font-semibold">
              {[[Smartphone, "Estude onde quiser"], [Printer, "Imprima se preferir"], [FolderOpen, "Material organizado"], [Zap, "Revisões rápidas"]].map(([I, t]) => {
                const Icon = I as typeof Zap;
                return <li key={t as string} className="flex items-center gap-2"><Icon className="h-5 w-5 text-accent" />{t as string}</li>;
              })}
            </ul>
            <CTA className="mt-8">Sim, quero conhecer o kit!</CTA>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-5 py-16">
        <h2 className="text-center text-2xl font-extrabold text-secondary sm:text-3xl">Perguntas Frequentes</h2>
        <Accordion type="single" collapsible className="mt-8 space-y-3">
          {([
            ["O produto é físico ou digital?", "É um produto digital entregue em PDF. As fotos de cards plastificados são demonstrações de como o material pode ficar após impressão e plastificação, realizadas por conta do comprador."],
            ["Posso imprimir os cards?", "Sim, para uso pessoal, respeitando as condições de utilização do material."],
            ["Posso estudar pelo celular?", "Sim, em dispositivos que permitam visualizar arquivos PDF."],
            ["O kit substitui um curso de enfermagem?", "Não. É um material complementar de estudo e revisão, não substituindo aulas, protocolos institucionais ou supervisão profissional."],
            ["Como vou receber meu material?", "O acesso é enviado conforme as instruções da plataforma de pagamento informadas no checkout."],
            ["Existe garantia ou reembolso?", "As condições de garantia e reembolso são as informadas no checkout, respeitando os direitos do consumidor previstos em lei."],
          ] as [string, string][]).map(([q, a]) => (
            <AccordionItem key={q} value={q} className="rounded-2xl border border-border bg-card px-5">
              <AccordionTrigger className="text-left font-semibold">{q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="mt-12 grid grid-cols-2 gap-4 text-center text-sm font-semibold sm:grid-cols-4">
          {[[Lock, "Compra segura"], [Zap, "Material digital"], [HeartHandshake, "Feito para estudantes"], [Headset, "Suporte pós-compra"]].map(([I, t]) => {
            const Icon = I as typeof Lock;
            return <div key={t as string}><div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/15 text-primary"><Icon /></div><p className="mt-2">{t as string}</p></div>;
          })}
        </div>
      </section>

      {/* RODAPÉ */}
      <footer className="border-t border-border bg-muted py-10 text-sm text-muted-foreground">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 font-display font-bold text-secondary"><HeartPulse className="text-primary" /> Enfermagem Visual</div>
          <nav className="flex flex-wrap gap-4">
            <a href="#" className="hover:text-primary">Política de Privacidade</a>
            <a href="#" className="hover:text-primary">Termos de Uso</a>
            <a href="#" className="hover:text-primary">Suporte</a>
          </nav>
        </div>
        <p className="mx-auto mt-6 max-w-6xl px-5 text-xs">
          Material educacional complementar. Não substitui aulas, protocolos institucionais ou supervisão profissional. © {new Date().getFullYear()} Enfermagem Visual.
        </p>
      </footer>

      {/* CTA fixo mobile */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 p-3 backdrop-blur md:hidden">
        <CTA className="w-full py-3 text-sm">Quero meu kit completo</CTA>
      </div>
    </main>
  );
}
