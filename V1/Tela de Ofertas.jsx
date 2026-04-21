function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type ThemeKey = "blue" | "green" | "slate";

type MainCard = {
  badge: string;
  title: string;
  amount: string;
  benefit: string;
  sub: string;
  cta: string;
  theme: ThemeKey;
  prazoLabel: string;
  idealPara: string;
  recommended?: boolean;
};

type SoloCard = {
  label: string;
  title: string;
  value: string;
  desc: string;
  cta: string;
  theme: ThemeKey;
};

type ThemeStyle = {
  card: string;
  badge: string;
  amount: string;
  benefit: string;
  cta: string;
  ring: string;
};

const themeMap: Record<ThemeKey, ThemeStyle> = {
  blue: {
    card: "border-blue-200 bg-white",
    badge: "bg-blue-600 text-white",
    amount: "text-blue-700",
    benefit: "bg-orange-500 text-white",
    cta: "bg-blue-600 text-white hover:bg-blue-700",
    ring: "ring-2 ring-blue-400 shadow-blue-100",
  },
  green: {
    card: "border-emerald-200 bg-white",
    badge: "bg-emerald-600 text-white",
    amount: "text-emerald-700",
    benefit: "bg-orange-500 text-white",
    cta: "bg-emerald-600 text-white hover:bg-emerald-700",
    ring: "shadow-emerald-100",
  },
  slate: {
    card: "border-slate-200 bg-white",
    badge: "bg-slate-700 text-white",
    amount: "text-slate-800",
    benefit: "bg-orange-500 text-white",
    cta: "bg-slate-800 text-white hover:bg-slate-900",
    ring: "shadow-slate-100",
  },
};

const mainCards: MainCard[] = [
  {
    badge: "Recomendado",
    title: "Receba e economize",
    amount: "R$ 3.000",
    benefit: "Economize R$ 2.000 em juros",
    sub: "Mantendo o prazo atual dos contratos",
    cta: "Quero esta oferta",
    theme: "blue",
    prazoLabel: "Mesmo prazo",
    idealPara: "Economizar",
    recommended: true,
  },
  {
    badge: "Mais alívio",
    title: "Receba e pague menos por mês",
    amount: "R$ 500",
    benefit: "Mais dinheiro sobrando no fim do mês",
    sub: "Com a menor parcela possível após a portabilidade",
    cta: "Quero esta oferta",
    theme: "green",
    prazoLabel: "Menor parcela",
    idealPara: "Respirar",
  },
  {
    badge: "Mais opções",
    title: "Receba e abra novas possibilidades",
    amount: "R$ 600",
    benefit: "Prepare espaço para contratar melhor depois",
    sub: "Ideal para quem quer resolver hoje sem travar amanhã",
    cta: "Ver estratégia",
    theme: "slate",
    prazoLabel: "Estratégia flex",
    idealPara: "Planejar",
  },
];

const soloCards: SoloCard[] = [
  {
    label: "Só economia",
    title: "Portabilidade",
    value: "R$ 2.399",
    desc: "Reduza juros e pague menos no total sem combinar com outras soluções.",
    cta: "Ver só economia",
    theme: "green",
  },
  {
    label: "Só crédito novo",
    title: "Novo contrato",
    value: "R$ 8.400",
    desc: "Libere dinheiro novo direto, com escolha de valor e prazo ideal.",
    cta: "Ver só novo contrato",
    theme: "blue",
  },
  {
    label: "Só refin",
    title: "Refinanciamento",
    value: "R$ 9.547",
    desc: "Receba dinheiro agora usando apenas os contratos já existentes.",
    cta: "Ver só refinanciamento",
    theme: "slate",
  },
];

function assertValidCards() {
  const allThemesValid = [...mainCards, ...soloCards].every((card) => Boolean(themeMap[card.theme]));
  if (!allThemesValid) {
    throw new Error("Um ou mais cards usam um tema inválido.");
  }

  if (mainCards.length !== 3) {
    throw new Error("A tela deve ter exatamente 3 ofertas principais.");
  }

  if (soloCards.length !== 3) {
    throw new Error("A tela deve ter exatamente 3 soluções diretas.");
  }
}

function MainOfferCard({ card }: { card: MainCard }) {
  const theme = themeMap[card.theme];

  return (
    <div
      className={cn(
        "relative rounded-[28px] border p-5 shadow-xl",
        theme.card,
        card.recommended && theme.ring,
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <span
          className={cn(
            "rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em]",
            theme.badge,
          )}
        >
          {card.badge}
        </span>

        {card.recommended ? (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-emerald-700">
            Melhor equilíbrio
          </span>
        ) : null}
      </div>

      <div className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">
        {card.title}
      </div>

      <div className="mb-5">
        <div className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">
          Você recebe
        </div>
        <div className={cn("mt-2 text-4xl font-bold tracking-tight md:text-5xl", theme.amount)}>
          {card.amount}
        </div>
      </div>

      <div className="mb-4 rounded-[22px] bg-slate-50 p-4">
        <div className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">
          Principal benefício
        </div>
        <div className={cn("mt-3 rounded-2xl px-4 py-4 text-center text-lg font-bold leading-tight", theme.benefit)}>
          {card.benefit}
        </div>
      </div>

      <div className="mb-5 min-h-[72px] rounded-2xl bg-slate-100 px-4 py-4 text-sm font-medium leading-6 text-slate-600">
        {card.sub}
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-3">
        <div className="rounded-2xl bg-white p-3 text-center shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Prazo</div>
          <div className="mt-2 text-lg font-bold text-slate-800">{card.prazoLabel}</div>
        </div>
        <div className="rounded-2xl bg-white p-3 text-center shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Ideal para</div>
          <div className="mt-2 text-lg font-bold text-slate-800">{card.idealPara}</div>
        </div>
      </div>

      <button className={cn("w-full rounded-2xl px-4 py-4 text-base font-bold transition", theme.cta)}>
        {card.cta}
      </button>
    </div>
  );
}

function SoloOfferCard({ card }: { card: SoloCard }) {
  const theme = themeMap[card.theme];

  return (
    <div className={cn("rounded-[24px] border p-5 shadow-sm", theme.card)}>
      <div
        className={cn(
          "mb-4 inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em]",
          theme.badge,
        )}
      >
        {card.label}
      </div>

      <div className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">Produto</div>
      <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{card.title}</div>
      <div className={cn("mt-4 text-4xl font-bold tracking-tight", theme.amount)}>{card.value}</div>

      <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
        {card.desc}
      </div>

      <button className={cn("mt-5 w-full rounded-2xl px-4 py-4 text-base font-bold transition", theme.cta)}>
        {card.cta}
      </button>
    </div>
  );
}

export default function TelaOfertasFintechMockup() {
  assertValidCards();

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[32px] bg-[#001851] px-6 py-8 text-white shadow-2xl md:px-10">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-100">
                <span className="h-2 w-2 rounded-full bg-cyan-300" />
                Ofertas para você
              </div>
              <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                Escolha o melhor caminho para usar seu crédito
              </h1>
              <p className="mt-3 max-w-3xl text-sm text-blue-100 md:text-base">
                Em vez de comparar produtos, compare o resultado final. Cada oferta abaixo mostra quanto entra na sua conta e o principal benefício para sua vida financeira.
              </p>
            </div>

            <div className="hidden rounded-2xl bg-white/10 px-4 py-3 text-right md:block">
              <div className="text-xs uppercase tracking-[0.16em] text-blue-100">Cliente</div>
              <div className="mt-1 text-lg font-semibold">Carlos Eduardo</div>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {mainCards.map((card) => (
              <MainOfferCard key={card.title} card={card} />
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-slate-400">
            Ou escolha uma solução direta
          </div>

          <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Opções de produto único</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                Para quem já sabe exatamente o que quer, a tela também pode oferecer caminhos simples sem combinação de estratégias.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-600">
              Menos comparação, decisão mais rápida
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {soloCards.map((card) => (
              <SoloOfferCard key={card.title} card={card} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
