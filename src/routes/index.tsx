import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRight, BookOpen, Brain, CheckCircle2, ChevronLeft, ChevronRight, ClipboardCheck,
  FolderOpen, HeartPulse, Printer, ShoppingCart, Smartphone, Star, X, Bone, ShieldPlus,
  Pill, Bandage, UserRound, Siren, Baby, FileText, GraduationCap, Zap, Lock, Headset, HeartHandshake,
} from "lucide-react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import capa from "@/assets/CAPA.png.asset.json";
import card03 from "@/assets/03_card.png.asset.json";
import pln02 from "@/assets/PLN_02.png.asset.json";
import funil from "@/assets/plr_funil.png.asset.json";

// Asset paths are served by Lovable, not by external hosts such as Vercel.
const assetUrl = (asset: { url: string }) =>
  new URL(asset.url, "https://reference-prompt-studio.lovable.app").href;

/* ===== CONFIGURAÇÃO DA OFERTA — preencha com dados reais ===== */
const CHECKOUT_URL = ""; // ex: "https://pay.hotmart.com/..."
const PRICE: { de?: string; por?: string; parcelas?: string } = {}; // ex: { de: "R$ 97", por: "R$ 37", parcelas: "ou 5x de R$ 8,20" }
const BONUS: { nome: string; descricao: string }[] = []; // bônus reais
type Review = { nome: string; foto?: string; estrelas: number; texto: string };
// EXEMPLOS de layout: troque por avaliações reais de compradores antes de anunciar.
const REVIEWS: Review[] = [
  { nome: "Exemplo — Juliana", estrelas: 5, texto: "Os cards de sinais vitais deixaram minha revisão para o estágio muito mais rápida." },
  { nome: "Exemplo — Camila", estrelas: 5, texto: "Imprimi e deixo na mochila. As ilustrações ajudam demais a memorizar." },
  { nome: "Exemplo — Rafael", estrelas: 5, texto: "Material muito organizado, encontro o assunto que preciso em segundos." },
  { nome: "Exemplo — Patrícia", estrelas: 5, texto: "Uso pelo celular entre as aulas. Visual bonito e direto ao ponto." },
];
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

function Index() {
  return (
    <main className="overflow-x-hidden pb-24 md:pb-0">
      {/* HERO */}
      <section className="relative bg-hero text-primary-foreground">
        <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.2fr_1fr] md:items-center md:py-20">
          <div>
            <div className="mb-6 flex items-center gap-2 font-display text-sm font-bold uppercase tracking-widest">
              <HeartPulse className="h-7 w-7 text-accent" /> Enfermagem Visual
            </div>
            <span className="inline-block -rotate-1 rounded-lg bg-gold px-4 py-1 font-display text-lg font-extrabold text-accent-foreground sm:text-2xl">
              KIT COMPLETO + BÔNUS
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
          <img src={assetUrl(capa)} alt="Capa oficial Enfermagem Visual" className="mx-auto w-full max-w-[260px] sm:max-w-xs rotate-2 rounded-2xl shadow-2xl" />
        </div>
      </section>

      {/* VITRINE */}
      <section id="comprar" className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:items-start">
        <div>
          <h2 className="text-2xl font-extrabold text-secondary sm:text-3xl">VEJA COMO É ESTUDAR COM O ENFERMAGEM VISUAL</h2>
          <p className="mb-6 mt-2 text-muted-foreground">Cada página reúne conteúdos ilustrados para facilitar sua rotina de revisão.</p>
          <div className="mx-auto max-w-lg"><Carousel /></div>
        </div>
        <div className="h-fit rounded-3xl border-2 border-primary/30 bg-card p-6 shadow-soft lg:sticky lg:top-6">
          <div className="flex items-center gap-4"><img src={assetUrl(capa)} alt="Capa do kit" className="h-24 w-24 shrink-0 rounded-xl object-cover shadow-soft" /><span className="rounded-full bg-gold px-3 py-1 text-xs font-bold uppercase text-accent-foreground">Kit completo + bônus</span></div>
          <h3 className="mt-5 text-2xl font-extrabold text-secondary">Enfermagem Visual — Kit com 200 Cards Ilustrativos</h3>
          {REVIEWS.length > 0 && (
            <div className="mt-2 flex items-center gap-1 text-accent">
              {[...Array(5)].map((_, k) => <Star key={k} className="h-5 w-5 fill-current" />)}
              <span className="ml-2 font-bold text-foreground">
                {(REVIEWS.reduce((a, r) => a + r.estrelas, 0) / REVIEWS.length).toFixed(1)}
              </span>
            </div>
          )}
          <p className="mt-3 text-muted-foreground">
            Um material digital para quem deseja revisar conteúdos essenciais de enfermagem com ilustrações, esquemas e explicações objetivas.
          </p>
          <ul className="mt-5 space-y-2.5">
            {["200 cards ilustrativos", "10 categorias de estudo", "Material organizado por assuntos", "PDF para consulta digital e impressão", "Revisões rápidas para provas e estágios"].map((b) => (
              <li key={b} className="flex items-center gap-3 rounded-xl bg-muted px-4 py-2.5 font-medium"><CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />{b}</li>
            ))}
          </ul>
          {BONUS.length > 0 && (
            <div className="mt-5 rounded-2xl bg-muted p-4">
              <p className="font-display font-bold text-secondary">Bônus incluídos</p>
              {BONUS.map((b) => <p key={b.nome} className="mt-2 text-sm"><b>{b.nome}</b> — {b.descricao}</p>)}
            </div>
          )}
          {PRICE.por && (
            <div className="mt-6 text-center">
              {PRICE.de && <p className="text-muted-foreground line-through">De {PRICE.de}</p>}
              <p className="font-display text-4xl font-extrabold text-primary">{PRICE.por}</p>
              {PRICE.parcelas && <p className="text-sm text-muted-foreground">{PRICE.parcelas}</p>}
            </div>
          )}
          <CTA className="mt-6 w-full">Quero meu kit completo</CTA>
          <p className="mt-3 text-center text-xs text-muted-foreground">Produto digital • Receba conforme as condições informadas no checkout</p>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="bg-muted py-16">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="text-center text-2xl font-extrabold text-secondary sm:text-3xl">SEUS ESTUDOS DE ENFERMAGEM MERECEM MAIS ORGANIZAÇÃO.</h2>
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

      {/* AVALIAÇÕES — exibe apenas avaliações reais */}
      {REVIEWS.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="text-2xl font-extrabold text-secondary sm:text-3xl">O QUE ESTÃO ACHANDO DO ENFERMAGEM VISUAL?</h2>
          <div className="mt-8 flex snap-x gap-5 overflow-x-auto pb-4">
            {REVIEWS.map((r) => (
              <div key={r.nome} className="w-72 shrink-0 snap-start rounded-2xl border border-border bg-card p-5 shadow-soft">
                <div className="flex items-center gap-3">
                  {r.foto && <img src={r.foto} alt="" className="h-12 w-12 rounded-full object-cover" />}
                  <div>
                    <p className="font-bold">{r.nome}</p>
                    <div className="flex text-accent">{[...Array(r.estrelas)].map((_, k) => <Star key={k} className="h-4 w-4 fill-current" />)}</div>
                  </div>
                </div>
                <p className="mt-3 text-sm">“{r.texto}”</p>
              </div>
            ))}
          </div>
        </section>
      )}

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
