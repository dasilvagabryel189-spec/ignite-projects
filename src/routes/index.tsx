import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowRight,
  Bot,
  Boxes,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleDot,
  ClipboardCheck,
  Code2,
  Compass,
  FileText,
  Layers3,
  Lightbulb,
  ListChecks,
  Menu,
  Rocket,
  Sparkles,
  Target,
  WandSparkles,
  X,
  Zap,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";

const CHECKOUT_URL = "#oferta";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Primeiro Projeto Online — Tire sua ideia do papel" },
      {
        name: "description",
        content:
          "Aprenda habilidades digitais, use inteligência artificial e construa seu primeiro projeto online com um caminho simples e prático.",
      },
      { property: "og:title", content: "Primeiro Projeto Online — Tire sua ideia do papel" },
      {
        property: "og:description",
        content: "Um guia direto para transformar uma ideia em um projeto real, mesmo começando do zero.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const problems = [
  { icon: Compass, text: "Não sei por onde começar" },
  { icon: Lightbulb, text: "Vejo milhares de ideias, mas não consigo escolher uma" },
  { icon: CircleDot, text: "Começo projetos e acabo desistindo" },
];

const steps = [
  { icon: Lightbulb, title: "Escolha uma ideia", description: "Saia do excesso de opções e encontre uma ideia possível para o seu momento." },
  { icon: Target, title: "Encontre um problema real", description: "Entenda para quem você quer criar e qual necessidade seu projeto resolve." },
  { icon: BrainCircuit, title: "Use IA para acelerar", description: "Aplique inteligência artificial para pesquisar, organizar e produzir melhor." },
  { icon: Code2, title: "Construa a primeira versão", description: "Transforme o plano em algo simples, funcional e pronto para ser testado." },
  { icon: Rocket, title: "Coloque no mundo", description: "Publique, compartilhe e use o retorno real para continuar evoluindo." },
];

const included = [
  { icon: Compass, title: "Guia passo a passo", description: "Uma sequência clara para saber o que fazer agora e o que vem depois." },
  { icon: Lightbulb, title: "Lista de ideias", description: "Possibilidades de projetos acessíveis para você avaliar e adaptar." },
  { icon: BrainCircuit, title: "Prompts de IA", description: "Comandos práticos para pesquisar, planejar e criar com mais direção." },
  { icon: Layers3, title: "Templates prontos", description: "Estruturas que eliminam a página em branco e ajudam você a avançar." },
  { icon: ClipboardCheck, title: "Checklist de execução", description: "Acompanhe cada etapa sem se perder no meio do processo." },
  { icon: ListChecks, title: "Plano de tarefas", description: "Organize as primeiras ações em blocos simples e realizáveis." },
  { icon: Boxes, title: "Biblioteca de ferramentas", description: "Recursos digitais selecionados para cada fase do seu projeto." },
];

const forWhom = [
  "Você nunca criou um projeto online",
  "Você quer aprender habilidades digitais",
  "Você quer entender como usar IA",
  "Você precisa de um caminho simples",
  "Você tem uma ideia, mas não sabe como começar",
];

const notFor = [
  "Você procura dinheiro rápido sem esforço",
  "Você quer resultados garantidos",
  "Você não pretende colocar nada em prática",
  "Você procura uma fórmula mágica",
];

const faqs = [
  { q: "Preciso ter experiência?", a: "Não. O material parte dos fundamentos e foi organizado para quem ainda está dando os primeiros passos no digital." },
  { q: "Preciso saber programar?", a: "Não. Você pode criar projetos sem programação. Quando uma ferramenta técnica aparece, ela é apresentada de forma acessível e aplicada ao contexto." },
  { q: "Preciso investir muito dinheiro?", a: "Não. O foco está em ferramentas acessíveis e opções gratuitas. Algumas plataformas podem oferecer planos pagos opcionais, mas você pode começar com recursos básicos." },
  { q: "Funciona para iniciantes?", a: "Sim. O conteúdo foi pensado especialmente para iniciantes que precisam de clareza, sequência e prática — não de mais informação solta." },
  { q: "Quais ferramentas são ensinadas?", a: "Você conhece ferramentas de inteligência artificial, organização, criação e publicação. A seleção prioriza recursos simples e úteis para o projeto escolhido." },
  { q: "Tenho acesso pelo celular?", a: "Sim. O material pode ser consultado pelo celular. Para algumas etapas de construção, um computador pode oferecer mais conforto." },
  { q: "Como recebo o material?", a: "O acesso é liberado digitalmente após a confirmação do pagamento, com as instruções enviadas no fluxo de compra." },
];

function Brand() {
  return (
    <a href="#topo" className="group inline-flex items-center gap-3" aria-label="Primeiro Projeto Online — início">
      <span className="grid size-9 place-items-center rounded-lg border border-primary/30 bg-primary/15 text-primary transition-transform group-hover:-rotate-3">
        <Rocket className="size-4" />
      </span>
      <span className="max-w-32 text-sm font-bold leading-tight text-foreground sm:max-w-none sm:text-base">
        Primeiro Projeto <span className="text-primary">Online</span>
      </span>
    </a>
  );
}

function SectionHeading({ eyebrow, title, description, center = false }: { eyebrow?: string; title: string; description?: string; center?: boolean }) {
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow && <p className="mb-4 text-xs font-bold uppercase text-primary">{eyebrow}</p>}
      <h2 className="font-display text-3xl font-semibold leading-tight text-foreground sm:text-4xl lg:text-5xl">{title}</h2>
      {description && <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>}
    </div>
  );
}

function GlassCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`glass-card ${className}`}>{children}</div>;
}

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Brand />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Navegação principal">
          <a className="nav-link" href="#como-funciona">Como funciona</a>
          <a className="nav-link" href="#o-que-voce-recebe">O que você recebe</a>
          <a className="nav-link" href="#faq">FAQ</a>
          <a className="nav-link" href="/auth">Área do aluno</a>
        </nav>
        <div className="hidden md:block">
          <Button asChild variant="premium" size="lg"><a href={CHECKOUT_URL}>Quero começar <ArrowRight /></a></Button>
        </div>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(!open)} aria-label={open ? "Fechar menu" : "Abrir menu"}>
          {open ? <X /> : <Menu />}
        </Button>
      </div>
      {open && (
        <nav className="border-t border-border bg-background px-5 py-5 md:hidden" aria-label="Navegação móvel">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {[ ["Como funciona", "#como-funciona"], ["O que você recebe", "#o-que-voce-recebe"], ["FAQ", "#faq"] ].map(([label, href]) => (
              <a key={href} className="rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground" href={href} onClick={() => setOpen(false)}>{label}</a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

function DashboardMockup() {
  return (
    <div className="relative mx-auto w-full max-w-xl lg:mx-0">
      <div className="dashboard-glow" />
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card/90 p-2 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex gap-1.5"><span className="size-2 rounded-full bg-muted-foreground/40" /><span className="size-2 rounded-full bg-muted-foreground/25" /><span className="size-2 rounded-full bg-muted-foreground/15" /></div>
          <span className="text-xs font-medium text-muted-foreground">meu-projeto.app</span>
          <Zap className="size-4 text-primary" />
        </div>
        <div className="grid gap-3 p-3 sm:grid-cols-[1.15fr_.85fr]">
          <div className="rounded-xl bg-surface p-4">
            <div className="mb-5 flex items-center justify-between"><span className="text-xs font-semibold text-foreground">Visão do projeto</span><span className="status-pill">Em construção</span></div>
            <p className="text-xs text-muted-foreground">Progresso geral</p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full w-[64%] rounded-full bg-primary" /></div>
            <div className="mt-2 flex justify-between text-xs"><span className="text-foreground">64%</span><span className="text-muted-foreground">8 de 12 tarefas</span></div>
            <div className="mt-5 space-y-2">
              {[ ["Definir problema", true], ["Criar estrutura", true], ["Publicar primeira versão", false] ].map(([label, done]) => (
                <div key={String(label)} className="flex items-center gap-3 rounded-lg border border-border bg-card/60 p-3">
                  <CheckCircle2 className={done ? "size-4 text-success" : "size-4 text-muted-foreground"} />
                  <span className="text-xs text-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <div className="rounded-xl bg-surface p-4">
              <p className="text-xs font-semibold text-foreground">Próxima ação</p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">Criar a página inicial da primeira versão.</p>
              <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-primary"><WandSparkles className="size-3.5" /> Abrir assistente</div>
            </div>
            <div className="rounded-xl bg-surface p-4">
              <p className="mb-3 text-xs font-semibold text-foreground">Ferramentas</p>
              <div className="grid grid-cols-3 gap-2">
                {[BrainCircuit, FileText, Boxes].map((Icon, i) => <span key={i} className="grid aspect-square place-items-center rounded-lg border border-border bg-card text-primary"><Icon className="size-4" /></span>)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-5 -left-3 flex items-center gap-3 rounded-xl border border-primary/25 bg-card/95 px-4 py-3 shadow-xl backdrop-blur sm:-left-8">
        <span className="grid size-8 place-items-center rounded-lg bg-primary/15 text-primary"><Sparkles className="size-4" /></span>
        <div><p className="text-xs font-semibold text-foreground">Ideia validada</p><p className="text-xs text-muted-foreground">Próximo passo definido</p></div>
      </div>
    </div>
  );
}

function Index() {
  return (
    <div id="topo" className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <Header />
      <main>
        <section className="hero-grid relative flex min-h-[92vh] items-center overflow-hidden px-5 pb-20 pt-32 sm:px-8 lg:pt-28">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-16 lg:grid-cols-[1.02fr_.98fr]">
            <div className="reveal-up max-w-3xl">
              <div className="eyebrow"><Sparkles className="size-3.5" /> Ideia, direção e execução</div>
              <h1 className="mt-7 font-display text-5xl font-semibold leading-[1.04] text-foreground sm:text-6xl lg:text-7xl">
                Seu primeiro projeto online pode <span className="gradient-text">começar hoje.</span>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                Aprenda habilidades digitais, use inteligência artificial a seu favor e transforme uma ideia em um projeto real — mesmo começando do zero.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="premium" size="xl"><a href={CHECKOUT_URL}>QUERO COMEÇAR AGORA <ArrowRight /></a></Button>
                <Button asChild variant="outlineGlow" size="xl"><a href="#como-funciona">Ver como funciona <ArrowDown /></a></Button>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-2"><Check className="size-4 text-success" /> Feito para iniciantes</span>
                <span className="flex items-center gap-2"><Check className="size-4 text-success" /> Aplicação prática</span>
                <span className="flex items-center gap-2"><Check className="size-4 text-success" /> Acesso digital</span>
              </div>
            </div>
            <div className="reveal-up"><DashboardMockup /></div>
          </div>
        </section>

        <section className="section-pad border-y border-border bg-surface/40">
          <div className="mx-auto max-w-7xl">
            <SectionHeading eyebrow="O ponto de partida" title="Você não precisa de mais um vídeo dizendo ‘fique rico’." description="O problema não é falta de informação. É ter informação demais e não saber qual é o próximo passo." center />
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {problems.map(({ icon: Icon, text }) => <GlassCard key={text} className="p-6"><Icon className="size-6 text-primary" /><h3 className="mt-7 text-lg font-semibold leading-snug text-foreground">{text}</h3></GlassCard>)}
            </div>
            <p className="mx-auto mt-10 max-w-3xl text-center text-lg font-medium text-foreground">O Primeiro Projeto Online transforma essa confusão em um caminho <span className="text-primary">simples e organizado.</span></p>
          </div>
        </section>

        <section id="como-funciona" className="section-pad scroll-mt-16">
          <div className="mx-auto max-w-7xl">
            <SectionHeading eyebrow="Como funciona" title="Do zero até seu primeiro projeto." description="Uma sequência prática para aprender construindo — sem precisar dominar tudo antes de começar." />
            <div className="timeline mt-14 grid gap-8 lg:grid-cols-5 lg:gap-5">
              {steps.map(({ icon: Icon, title, description }, i) => (
                <div key={title} className="relative">
                  <div className="mb-6 flex items-center gap-4 lg:block">
                    <span className="step-icon"><Icon className="size-5" /></span>
                    <span className="text-xs font-bold text-primary lg:mt-4 lg:block">0{i + 1}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="o-que-voce-recebe" className="section-pad scroll-mt-16 border-y border-border bg-surface/40">
          <div className="mx-auto max-w-7xl">
            <SectionHeading eyebrow="O material" title="Tudo o que você precisa para começar." description="Recursos objetivos para transformar intenção em ação e manter seu projeto avançando." center />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {included.map(({ icon: Icon, title, description }, i) => (
                <GlassCard key={title} className={i === included.length - 1 ? "p-6 sm:col-span-2 lg:col-span-1" : "p-6"}>
                  <span className="feature-icon"><Icon className="size-5" /></span>
                  <h3 className="mt-6 text-lg font-semibold text-foreground">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        <section className="section-pad">
          <div className="mx-auto max-w-7xl">
            <SectionHeading eyebrow="O diferencial" title="Menos teoria. Mais execução." description="O conteúdo não elimina o trabalho — ele organiza o caminho para que você use sua energia construindo." center />
            <div className="mx-auto mt-12 grid max-w-5xl overflow-hidden rounded-2xl border border-border bg-card md:grid-cols-2">
              <div className="p-7 sm:p-10">
                <p className="text-xs font-bold uppercase text-muted-foreground">Forma tradicional</p>
                <div className="mt-7 space-y-5">{["Assista dezenas de vídeos", "Anote centenas de ideias", "Fique perdido com ferramentas", "Não saiba qual passo vem depois"].map(x => <p key={x} className="flex items-center gap-3 text-sm text-muted-foreground"><X className="size-4 shrink-0" />{x}</p>)}</div>
              </div>
              <div className="comparison-good border-t border-primary/20 p-7 sm:p-10 md:border-l md:border-t-0">
                <p className="text-xs font-bold uppercase text-primary">Primeiro Projeto Online</p>
                <div className="mt-7 space-y-5">{["Aprenda enquanto executa", "Escolha uma ideia", "Use ferramentas específicas", "Siga um caminho organizado"].map(x => <p key={x} className="flex items-center gap-3 text-sm font-medium text-foreground"><CheckCircle2 className="size-4 shrink-0 text-success" />{x}</p>)}</div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-pad border-y border-border bg-surface/40">
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <SectionHeading eyebrow="Para quem é" title="Foi criado para quem está começando." />
              <div className="mt-8 grid gap-3">{forWhom.map(x => <div key={x} className="flex items-center gap-3 rounded-xl border border-border bg-card/70 p-4 text-sm text-foreground"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-success/10 text-success"><Check className="size-4" /></span>{x}</div>)}</div>
            </div>
            <div>
              <SectionHeading eyebrow="Com transparência" title="Talvez não seja para você se..." />
              <div className="mt-8 grid gap-3">{notFor.map(x => <div key={x} className="flex items-center gap-3 rounded-xl border border-border bg-card/40 p-4 text-sm text-muted-foreground"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground"><X className="size-4" /></span>{x}</div>)}</div>
            </div>
          </div>
        </section>

        <section id="oferta" className="offer-wrap section-pad scroll-mt-16">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[.9fr_1.1fr]">
            <div>
              <div className="eyebrow"><Rocket className="size-3.5" /> Comece com direção</div>
              <h2 className="mt-6 font-display text-4xl font-semibold leading-tight text-foreground sm:text-5xl">Comece seu primeiro projeto.</h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">Você não precisa esperar dominar todas as ferramentas. Precisa de uma ideia possível, um próximo passo e espaço para aprender fazendo.</p>
            </div>
            <div className="offer-card rounded-2xl border border-primary/30 bg-card p-6 shadow-2xl sm:p-9">
              <div className="flex items-start justify-between gap-4 border-b border-border pb-6">
                <div><p className="text-xs font-bold uppercase text-primary">Acesso completo</p><h3 className="mt-2 text-2xl font-semibold text-foreground">Primeiro Projeto Online</h3></div>
                <span className="feature-icon"><Rocket className="size-5" /></span>
              </div>
              <div className="my-6 grid gap-3 sm:grid-cols-2">{["Guia completo", "Templates", "Prompts", "Checklist", "Biblioteca de ferramentas", "Atualizações do material"].map(x => <p key={x} className="flex items-center gap-2 text-sm text-foreground"><Check className="size-4 text-success" />{x}</p>)}</div>
              <div className="border-t border-border pt-6">
                <p className="text-sm text-muted-foreground">Investimento</p>
                <p className="mt-1 font-display text-4xl font-semibold text-foreground">R$ <span className="text-primary">[PREÇO]</span></p>
                <Button asChild variant="premium" size="xl" className="mt-6 w-full"><a href="#checkout" data-checkout-link>QUERO COMEÇAR AGORA <ArrowRight /></a></Button>
                <p className="mt-4 text-center text-xs text-muted-foreground">Acesso imediato após a confirmação do pagamento.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section-pad border-y border-border bg-surface/40">
          <div className="mx-auto max-w-7xl">
            <SectionHeading eyebrow="Próximos passos" title="Você não precisa saber tudo antes de começar." center />
            <div className="mx-auto mt-12 grid max-w-5xl gap-4 md:grid-cols-3">
              {[ ["1", "Acesse o material", "Receba o conteúdo e conheça o caminho completo."], ["2", "Escolha seu projeto", "Use os critérios e ideias para definir um ponto de partida."], ["3", "Comece a executar", "Siga as tarefas e construa uma etapa de cada vez."] ].map(([n,t,d]) => <GlassCard key={n} className="p-7"><span className="font-display text-4xl font-semibold text-primary/60">{n}</span><h3 className="mt-7 text-lg font-semibold text-foreground">{t}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{d}</p></GlassCard>)}
            </div>
          </div>
        </section>

        <section id="faq" className="section-pad scroll-mt-16">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.75fr_1.25fr] lg:gap-20">
            <SectionHeading eyebrow="Dúvidas frequentes" title="Perguntas honestas. Respostas diretas." description="Tudo o que você precisa entender antes de dar o próximo passo." />
            <div className="divide-y divide-border border-y border-border">
              {faqs.map(({ q, a }) => (
                <details key={q} className="faq-item group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 text-left font-medium text-foreground"><span>{q}</span><ChevronDown className="size-5 shrink-0 text-primary transition-transform group-open:rotate-180" /></summary>
                  <p className="max-w-2xl pb-5 text-sm leading-6 text-muted-foreground">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 pb-28 sm:px-8">
          <div className="final-cta mx-auto max-w-7xl overflow-hidden rounded-2xl border border-primary/25 px-6 py-14 text-center sm:px-12 sm:py-20">
            <div className="mx-auto max-w-3xl">
              <span className="mx-auto grid size-12 place-items-center rounded-xl bg-primary/15 text-primary"><Rocket className="size-6" /></span>
              <h2 className="mt-7 font-display text-4xl font-semibold leading-tight text-foreground sm:text-5xl">Pare de esperar pela ideia perfeita.</h2>
              <p className="mt-5 text-lg text-muted-foreground">Escolha um projeto, aprenda o necessário e comece a construir.</p>
              <Button asChild variant="premium" size="xl" className="mt-8"><a href={CHECKOUT_URL}>COMEÇAR MEU PRIMEIRO PROJETO <ArrowRight /></a></Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border px-5 py-10 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-7 sm:flex-row">
          <Brand />
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground" aria-label="Links institucionais">
            <a className="hover:text-foreground" href="/termos">Termos de Uso</a>
            <a className="hover:text-foreground" href="/privacidade">Política de Privacidade</a>
            <a className="hover:text-foreground" href="mailto:contato@primeiroprojetoonline.com">Contato</a>
          </nav>
        </div>
      </footer>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 p-3 backdrop-blur-xl md:hidden">
        <Button asChild variant="premium" size="lg" className="w-full"><a href={CHECKOUT_URL}>QUERO COMEÇAR <ArrowRight /></a></Button>
      </div>
      <span id="checkout" className="sr-only">Configure aqui o link do checkout.</span>
    </div>
  );
}