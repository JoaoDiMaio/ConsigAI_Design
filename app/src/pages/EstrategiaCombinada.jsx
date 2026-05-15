import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { DesktopPageHeader, MobilePageHeader } from '../components/AppHeader'
import { ResumoCard, ControleCard } from '../components/SimulationSideCards'
import { OperationGuideCard } from '../components/OperationGuideCard'
import { appPageStyle, theme } from '../ui/theme'
import { btnCompact, btnCompactPrimary, btnPrimary } from '../ui/buttonStyles'
import { loadProfileData } from '../lib/profileStorage'
import { printSimulationReceipt } from '../lib/receiptPrint'

const STRATEGIES = [
  {
    key: 'balance',
    badge: 'Recomendado',
    title: 'Melhor equilíbrio',
    strong: 'Economia + dinheiro',
    description: 'Reduz custo primeiro e depois avalia valor disponível com mais controle.',
  },
  {
    key: 'relief',
    badge: 'Mais folga no mês',
    title: 'Mais folga no mês',
    strong: 'Parcela mais leve',
    description: 'Prioriza aliviar o orçamento mensal depois da etapa de economia.',
  },
]

const COMBINED_GUIDE = {
  badge: 'Guia ConsigAI',
  title: 'Como funciona a estratégia combinada',
  subtitle: 'Primeiro melhoramos seu contrato. Depois simulamos se existe dinheiro disponível para você — com a parcela, prazo e custo total sempre visíveis.',
  steps: [
    {
      label: 'Passo 1 — Portabilidade',
      title: 'Melhorar o contrato',
      body: 'A ConsigAI compara bancos para tentar reduzir taxa, parcela ou custo total do seu contrato atual. Você vê tudo antes de aceitar.',
    },
    {
      label: 'Passo 2 — Você revisa e decide',
      title: 'Confirmar a nova condição',
      body: 'Você vê a economia estimada, nova parcela, prazo e custo total. Nada avança sem sua confirmação. Se a portabilidade não for aceita, você é avisado.',
    },
    {
      label: 'Passo 3 — Refinanciamento',
      title: 'Ver dinheiro disponível',
      body: 'Com o contrato em condição melhor, simulamos se existe valor seguro para liberar. Valor, parcela e impacto no bolso são mostrados antes de qualquer decisão.',
    },
    {
      label: 'Passo 4 — Resultado final',
      title: 'Dinheiro na conta com economia explicada',
      body: 'Você recebe um resumo com economia estimada, valor disponível, parcela final, prazo, taxa e custo total. Você decide se quer avançar.',
    },
  ],
  finalTitle: 'Você está no controle',
  finalText: 'Portabilidade é direito garantido por lei. Nenhuma contratação acontece sem sua confirmação expressa em cada etapa. Simulação não é aprovação final.',
  badges: [
    'Economia primeiro — dinheiro depois',
    'Você revisa tudo antes de confirmar',
    'Sem contratação automática',
    'Direito garantido por lei',
    'Dados protegidos conforme LGPD',
  ],
}

const CONDITIONS = [
  {
    label: 'Parcela estimada',
    value: 'R$ 522/mês',
    text: 'após a combinação simulada.',
    tone: 'default',
  },
  {
    label: 'Prazo',
    value: '84x',
    text: 'condição prevista nesta estratégia.',
    tone: 'default',
  },
  {
    label: 'Taxa estimada',
    value: '1,88% a.m.',
    text: 'sujeita à análise final.',
    tone: 'default',
  },
  {
    label: 'Margem estimada',
    value: 'até R$ 320',
    text: 'após a etapa de economia. Sujeita à análise.',
    tone: 'success',
  },
]

const CONTROL_ITEMS = [
  ['Portabilidade primeiro', 'A estratégia começa pela redução de custo do contrato atual.'],
  ['Dinheiro depois', 'Só depois da economia avaliamos valor seguro para liberar.'],
  ['Revisão obrigatória', 'Você confere tudo antes de confirmar qualquer mudança.'],
  ['Sem contratação automática', 'Nada avança sem sua confirmação expressa.'],
  ['Portabilidade é direito', 'Seu banco atual não pode bloquear. Regulado pelo Banco Central.'],
  ['Se a port. não for aceita', 'Você é avisado antes de qualquer avanço.'],
]

// Dados mock — estrutura pronta para receber location.state da API
const DEFAULT_CONFIG = {
  routeTitle: 'Economia + Dinheiro',
  chip: 'Economia + Dinheiro',
  heroBody:
    'A ConsigAI começa pela portabilidade para melhorar seu contrato atual. Depois calcula se existe valor estimado para liberar na conta, com parcela, prazo, taxa e custo total sempre visíveis.',
  pageDescription: 'Economia primeiro. Dinheiro depois.',
  summaryTitle: 'Resumo da estratégia',
  summaryBody: 'Você começa pela economia e só depois avalia dinheiro disponível para liberar.',
  selectedLabel: 'Selecionada',
  selectedValue: 'Melhor equilíbrio',
  economyValue: 'R$ 2.399',
  futureValue: 'R$ 4.200',
  installmentValue: 'R$ 522/mês',
  nextStepValue: 'Portabilidade',
  primaryLabel: 'Quero economizar e receber dinheiro',
  secondaryLabel: 'Gerar recibo da simulação',
  backLabel: 'Voltar para ofertas',
  ctaLabel: 'Confirmar Estratégia',
}

function normalizeVariant(raw) {
  const value = String(raw ?? '').trim().toLowerCase()
  const normalized = value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()

  if (normalized.includes('refin')) return true
  if (normalized.includes('novo')) return true
  return null
}

function SectionHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <h2 style={{ margin: 0, color: theme.navy, fontSize: 20, lineHeight: 1, fontWeight: 950, letterSpacing: '-.045em' }}>{title}</h2>
      <p style={{ margin: '6px 0 0', color: theme.muted, fontSize: 12, lineHeight: 1.45, fontWeight: 600 }}>{subtitle}</p>
    </div>
  )
}

function StatCard({ label, value, caption, tone = 'default' }) {
  const isSuccess = tone === 'success'

  return (
    <div
      style={{
        padding: '18px 20px',
        borderRadius: 22,
        border: `1px solid ${isSuccess ? '#BDECD7' : '#BFD4F6'}`,
        background: isSuccess ? '#F0FFF8' : '#FFFFFF',
        boxShadow: isSuccess ? '0 16px 36px rgba(0,168,107,.10)' : '0 12px 26px rgba(3,36,111,.06)',
        textAlign: 'center',
      }}
    >
      <small
        style={{
          display: 'block',
          color: isSuccess ? theme.green : theme.blue,
          fontSize: 10,
          lineHeight: 1,
          fontWeight: 950,
          letterSpacing: '.08em',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </small>
      <strong
        style={{
          display: 'block',
          marginTop: 8,
          color: isSuccess ? theme.green : theme.navy,
          fontSize: 'clamp(28px, 3vw, 42px)',
          lineHeight: 1,
          fontWeight: 950,
          letterSpacing: '-.075em',
        }}
      >
        {value}
      </strong>
      <span style={{ display: 'block', marginTop: 7, color: theme.muted, fontSize: 11.5, lineHeight: 1.35, fontWeight: 650 }}>
        {caption}
      </span>
    </div>
  )
}

function StrategyCard({ option, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{
        width: '100%',
        minHeight: 170,
        padding: 18,
        borderRadius: 22,
        border: active ? '2px solid #2454D6' : `1px solid ${theme.line}`,
        background: active
          ? 'radial-gradient(circle at 90% 8%, rgba(29,161,235,.10), transparent 32%), linear-gradient(180deg, #FFFFFF 0%, #F4F9FF 100%)'
          : '#FFFFFF',
        boxShadow: active ? '0 18px 38px rgba(3,36,111,.10)' : '0 10px 22px rgba(3,36,111,.04)',
        textAlign: 'left',
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              minHeight: 28,
              padding: '0 11px',
              borderRadius: 999,
              border: `1px solid ${active ? '#BDECD7' : '#C7D9FF'}`,
              background: active ? '#F0FFF8' : '#EEF4FF',
              color: active ? theme.green : theme.blue,
              fontSize: 10,
              fontWeight: 950,
              textTransform: 'uppercase',
              letterSpacing: '.04em',
            }}
          >
            {option.badge}
          </span>
          <h3 style={{ margin: '16px 0 0', color: theme.navy, fontSize: 22, lineHeight: 1, fontWeight: 950, letterSpacing: '-.05em' }}>
            {option.title}
          </h3>
          <strong
            style={{
              display: 'block',
              marginTop: 8,
              color: active ? theme.green : theme.muted,
              fontSize: 14,
              fontWeight: 950,
            }}
          >
            {option.strong}
          </strong>
          <p style={{ margin: '8px 0 0', color: theme.muted, fontSize: 12, lineHeight: 1.4, fontWeight: 650 }}>
            {option.description}
          </p>
        </div>

        <span
          aria-hidden="true"
          style={{
            width: 18,
            height: 18,
            borderRadius: '50%',
            flex: '0 0 auto',
            border: active ? '6px solid #2454D6' : '2px solid #DCE5FF',
            background: '#fff',
            marginTop: 2,
          }}
        />
      </div>
    </button>
  )
}

function MetricCard({ item }) {
  const isSuccess = item.tone === 'success'

  return (
    <article
      style={{
        minHeight: 102,
        padding: 16,
        borderRadius: 20,
        background: isSuccess ? '#F0FFF8' : '#F8FBFF',
        border: `1px solid ${isSuccess ? '#BDECD7' : theme.line}`,
      }}
    >
      <small
        style={{
          display: 'block',
          color: isSuccess ? theme.green : theme.blue,
          fontSize: 10,
          lineHeight: 1,
          fontWeight: 950,
          letterSpacing: '.08em',
          textTransform: 'uppercase',
        }}
      >
        {item.label}
      </small>
      <strong
        style={{
          display: 'block',
          marginTop: 9,
          color: isSuccess ? theme.green : theme.navy,
          fontSize: 23,
          lineHeight: 1,
          fontWeight: 950,
          letterSpacing: '-.05em',
        }}
      >
        {item.value}
      </strong>
      <span style={{ display: 'block', marginTop: 8, color: theme.muted, fontSize: 11, lineHeight: 1.25, fontWeight: 650 }}>
        {item.text}
      </span>
    </article>
  )
}

function ActionCard({ onPrimary, onSecondary, onBack, primaryLabel, secondaryLabel, backLabel }) {
  return (
    <section
      style={{
        padding: 22,
        borderRadius: 28,
        background: '#FFFFFF',
        border: `1px solid ${theme.line}`,
        boxShadow: '0 12px 32px rgba(3,36,111,.05)',
      }}
    >
      <div style={{ color: theme.navy, fontSize: 18, lineHeight: 1.1, fontWeight: 950, letterSpacing: '-.04em' }}>
        Próximo passo
      </div>
      <p style={{ marginTop: 8, color: theme.muted, fontSize: 12, lineHeight: 1.45, fontWeight: 650 }}>
        Se a simulação fizer sentido, você avança para revisar as condições reais antes de qualquer confirmação.
      </p>

      <button
        type="button"
        onClick={onPrimary}
        style={{ ...btnPrimary, marginTop: 18 }}
      >
        {primaryLabel}
      </button>

      <button
        type="button"
        onClick={onSecondary}
        style={{ ...btnCompactPrimary, marginTop: 10 }}
      >
        {secondaryLabel}
      </button>

      <button
        type="button"
        onClick={onBack}
        style={{ ...btnCompact, marginTop: 10 }}
      >
        {backLabel}
      </button>

      <p style={{ marginTop: 14, color: theme.muted, textAlign: 'center', fontSize: 12, lineHeight: 1.35, fontWeight: 700 }}>
        Nenhuma contratação sem sua confirmação. Simulação não é aprovação final.
      </p>
    </section>
  )
}

export default function EstrategiaCombinada({ variant: forcedVariant }) {
  const navigate = useNavigate()
  const location = useLocation()
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const profile = loadProfileData()
  const clientName = profile.nomeExibicao || profile.nomeCompleto || 'Cliente'

  // Variantes unificadas — mesma config independente de origem
  // Quando a API estiver pronta, receber dados via location.state
  const _variantDetected = useMemo(() => {
    if (normalizeVariant(forcedVariant)) return true
    if (normalizeVariant(location.state?.strategyType)) return true
    return false
  }, [forcedVariant, location.state])

  const config = DEFAULT_CONFIG
  const [selectedStrategy, setSelectedStrategy] = useState(0)
  const selectedOption = STRATEGIES[selectedStrategy] || STRATEGIES[0]

  const goContratacao = () => {
    navigate('/dados-bancarios', {
      state: {
        sourcePath: '/estrategia-combinada',
        nextPath: '/contratacao',
        offerState: {
          sourcePath: '/estrategia-combinada',
          offerTitle: config.routeTitle,
          offerSubtitle: 'Resumo da estratégia combinada antes da contratação',
          primaryValue: config.futureValue,
          ctaLabel: config.ctaLabel,
          summary: [
            { label: 'Economia estimada', value: config.economyValue },
            { label: 'Dinheiro estimado depois', value: config.futureValue },
            { label: 'Parcela estimada', value: config.installmentValue },
            { label: 'Próximo passo', value: config.nextStepValue },
          ],
        },
      },
    })
  }

  const downloadReceiptPdf = () => {
    printSimulationReceipt({
      title: `SIMULAÇÃO DE ${config.routeTitle.toUpperCase()}`,
      highlightLabel: config.selectedValue.toUpperCase(),
      highlightValue: config.futureValue,
      rows: [
        { label: 'Estratégia', value: selectedOption.title },
        { label: 'Economia estimada', value: config.economyValue },
        { label: 'Parcela estimada', value: config.installmentValue },
        { label: 'Próximo passo', value: config.nextStepValue },
      ],
      total: { label: 'Valor estimado depois', value: config.futureValue },
    })
  }

  const summaryRows = [
    { label: 'Economia estimada', value: config.economyValue },
    { label: 'Dinheiro estimado depois', value: config.futureValue },
    { label: 'Parcela estimada', value: config.installmentValue },
    { label: 'Próximo passo', value: config.nextStepValue },
  ]

  return (
    <div style={appPageStyle}>
      <style>{`
        .ec-layout { display: grid; grid-template-columns: 280px minmax(0,1fr) 340px; gap: 24px; align-items: start; }
        .ec-guide-col {}
        .ec-sidebar { position: sticky; top: 104px; display: grid; gap: 14px; }
        @media (max-width: 1200px) { .ec-layout { grid-template-columns: minmax(0,1fr) 340px; } .ec-guide-col { display: none; } }
        @media (max-width: 1060px) { .ec-layout { grid-template-columns: 1fr; } .ec-guide-col { display: none; } .ec-sidebar { position: static; display: grid; grid-template-columns: 1fr 1fr; } }
        @media (max-width: 640px) { .ec-sidebar { grid-template-columns: 1fr; } }
      `}</style>

      {isDesktop ? (
        <DesktopPageHeader
          clientName={clientName}
          onLogoClick={() => navigate('/ofertas')}
          fixed
          pageTitle="Economia + Dinheiro"
          pageDescription={config.pageDescription}
          actions={[
            { label: 'Ofertas', onClick: () => navigate('/ofertas') },
            { label: 'Configuracoes', onClick: () => navigate('/configuracoes') },
            { label: 'Acompanhamento', onClick: () => navigate('/acompanhamento') },
          ]}
        />
      ) : (
        <MobilePageHeader
          clientName={clientName}
          onLogoClick={() => navigate('/ofertas')}
          fixed
          pageTitle="Economia + Dinheiro"
          pageDescription={config.pageDescription}
          actions={[
            { label: 'Ofertas', onClick: () => navigate('/ofertas') },
            { label: 'Configuracoes', onClick: () => navigate('/configuracoes') },
            { label: 'Acompanhamento', onClick: () => navigate('/acompanhamento') },
          ]}
        />
      )}

      <main
        style={{
          maxWidth: 1400,
          margin: '0 auto',
          padding: isDesktop ? '104px 24px 56px' : '92px 18px calc(24px + env(safe-area-inset-bottom))',
        }}
      >
        <div className="ec-layout">

          {/* Coluna esquerda — guia educacional (igual a Portabilidade) */}
          <div className="ec-guide-col">
            <OperationGuideCard {...COMBINED_GUIDE} />
          </div>

          {/* Coluna central */}
          <div style={{ display: 'grid', gap: 16 }}>

            {/* Hero */}
            <section
              style={{
                padding: 24,
                borderRadius: 30,
                background:
                  'radial-gradient(circle at 50% 12%, rgba(0,168,107,.13), transparent 34%), radial-gradient(circle at 88% 10%, rgba(29,161,235,.10), transparent 32%), linear-gradient(180deg, #FFFFFF 0%, #F6FFFB 100%)',
                border: `1px solid #BDECD7`,
                boxShadow: '0 24px 68px rgba(3, 36, 111, 0.12)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: '0 0 auto 0',
                  height: 6,
                  background: 'linear-gradient(90deg, #007A52, #00A86B, #1DA1EB, #2454D6)',
                }}
              />

              <div style={{ display: 'grid', gap: 18, textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', width: 'fit-content', alignItems: 'center', gap: 8, color: theme.blue, fontSize: 11, lineHeight: 1, fontWeight: 950, textTransform: 'uppercase', letterSpacing: '.11em' }}>
                  <span
                    aria-hidden="true"
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: '#2454D6',
                      boxShadow: '0 0 10px rgba(36,84,214,.75)',
                    }}
                  />
                  {config.chip}
                </div>

                <div>
                  <h1
                    style={{
                      margin: '18px auto 0',
                      maxWidth: 780,
                      color: theme.navy,
                      fontSize: 'clamp(34px, 3.4vw, 48px)',
                      lineHeight: 1.02,
                      fontWeight: 950,
                      letterSpacing: '-.075em',
                    }}
                  >
                    Primeiro reduzimos o custo.{' '}
                    <span style={{ color: theme.green }}>Depois vemos dinheiro para você.</span>
                  </h1>
                  <p
                    style={{
                      maxWidth: 720,
                      margin: '12px auto 0',
                      color: theme.muted,
                      fontSize: 14,
                      lineHeight: 1.5,
                      fontWeight: 650,
                    }}
                  >
                    {config.heroBody}
                  </p>
                </div>

                {/* Economia protagonista (verde, maior) → Dinheiro depois (azul, secundário) */}
                <div style={{ width: 'min(820px, 100%)', margin: '0 auto' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? '1.1fr .9fr' : '1fr', gap: 12 }}>
                    <StatCard
                      tone="success"
                      label="Economia estimada primeiro"
                      value={config.economyValue}
                      caption="estimativa no custo total do contrato atual"
                    />
                    <StatCard
                      label="Dinheiro estimado depois"
                      value={config.futureValue}
                      caption="valor possível após a etapa de economia"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      minHeight: 34,
                      padding: '0 13px',
                      borderRadius: 999,
                      color: theme.green,
                      background: '#F0FFF8',
                      border: '1px solid #BDECD7',
                      fontSize: 12,
                      fontWeight: 850,
                    }}
                  >
                    Economia primeiro
                  </span>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      minHeight: 34,
                      padding: '0 13px',
                      borderRadius: 999,
                      color: theme.blue,
                      background: '#EEF4FF',
                      border: '1px solid #C7D9FF',
                      fontSize: 12,
                      fontWeight: 850,
                    }}
                  >
                    Dinheiro depois
                  </span>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      minHeight: 34,
                      padding: '0 13px',
                      borderRadius: 999,
                      color: theme.blue,
                      background: '#EEF4FF',
                      border: '1px solid #C7D9FF',
                      fontSize: 12,
                      fontWeight: 850,
                    }}
                  >
                    Você revisa tudo antes de confirmar
                  </span>
                </div>
              </div>
            </section>

            {/* Estratégias — perfil de uso */}
            <section
              style={{
                padding: 22,
                borderRadius: 28,
                background: '#FFFFFF',
                border: `1px solid ${theme.line}`,
                boxShadow: '0 12px 32px rgba(3,36,111,.05)',
              }}
            >
              <SectionHeader
                title="Economia + Dinheiro — escolha seu perfil"
                subtitle="As opções abaixo são ajustes da mesma análise, não ofertas competindo."
              />

              <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? 'repeat(2, minmax(0, 1fr))' : '1fr', gap: 12 }}>
                {STRATEGIES.map((option, index) => (
                  <StrategyCard
                    key={option.key}
                    option={option}
                    active={selectedStrategy === index}
                    onClick={() => setSelectedStrategy(index)}
                  />
                ))}
              </div>
            </section>

            {/* Condições da simulação */}
            <section
              style={{
                padding: 22,
                borderRadius: 28,
                background: '#FFFFFF',
                border: `1px solid ${theme.line}`,
                boxShadow: '0 12px 32px rgba(3,36,111,.05)',
              }}
            >
              <SectionHeader
                title="Condições da simulação"
                subtitle="Valores estimados. Você revisa tudo antes de confirmar."
              />

              <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? 'repeat(4, minmax(0, 1fr))' : '1fr', gap: 12 }}>
                {CONDITIONS.map((item) => (
                  <MetricCard key={item.label} item={item} />
                ))}
              </div>
            </section>
          </div>

          <aside className="ec-sidebar">
            <ResumoCard
              title={config.summaryTitle}
              subtitle={config.summaryBody}
              highlight={{ label: config.selectedLabel, value: selectedOption.title }}
              rows={summaryRows}
              style={{
                borderRadius: 30,
                boxShadow: '0 16px 38px rgba(3,36,111,.08)',
              }}
            />

            <ActionCard
              onPrimary={goContratacao}
              onSecondary={downloadReceiptPdf}
              onBack={() => navigate('/ofertas')}
              primaryLabel={config.primaryLabel}
              secondaryLabel={config.secondaryLabel}
              backLabel={config.backLabel}
            />

            <ControleCard
              items={CONTROL_ITEMS}
              style={{
                borderRadius: 30,
                boxShadow: '0 16px 38px rgba(3,36,111,.08)',
              }}
            />
          </aside>
        </div>
      </main>
    </div>
  )
}
