import { useState, useRef, useCallback } from 'react'
import { maskCPF, maskDate, maskPhone, formatFileSize } from '../lib/masks'
import { useMediaQuery } from '../hooks/useMediaQuery'
import logoSvg from '../assets/logo.svg'
import logoIconSvg from '../assets/logo-icon.svg'

// ── Brand tokens ──────────────────────────────────────────────────────────────
const t = {
  navy:        '#001851',
  blue:        '#2350c8',
  blue2:       '#1844b8',
  blueLight:   '#e8eeff',
  blueMid:     '#c2d0f8',
  text:        '#0f2057',
  muted:       '#7a8db8',
  line:        '#e4eaf8',
  green:       '#0a6640',
  greenBg:     '#e8f5ee',
  greenAccent: '#16a364',
  greenBorder: '#b8e0ca',
  bg:          '#f4f7fd',
  gold:        '#7a5200',
  goldBg:      '#fffbf0',
  goldLine:    '#edddb0',
  goldIcon:    '#fde9a0',
  goldBody:    '#9b7020',
}

// s(n) → uses CSS var --scale set on root wrapper; scales with A+ toggle
const s = (n) => `calc(${n}px * var(--scale))`

// ── Sub-components ─────────────────────────────────────────────────────────────

function FontToggle({ large, onToggle, dark }) {
  const bg    = dark ? 'rgba(255,255,255,.07)' : '#fff'
  const bdr   = dark ? '1px solid rgba(255,255,255,.1)' : `1px solid ${t.line}`
  const shad  = dark ? 'none' : '0 2px 8px rgba(0,24,81,.08)'
  const inact = dark ? 'rgba(255,255,255,.55)' : t.muted
  const act   = dark ? '#fff' : t.navy
  const actBg = dark ? 'rgba(255,255,255,.14)' : t.navy
  const actC  = dark ? t.navy : '#fff'

  return (
    <div style={{ display: 'flex', gap: 2, padding: 3, borderRadius: 999, background: bg, border: bdr, boxShadow: shad }}>
      {[false, true].map((isLarge) => (
        <button
          key={String(isLarge)}
          type="button"
          onClick={() => onToggle(isLarge)}
          style={{
            border: 'none', borderRadius: 999, cursor: 'pointer',
            padding: '5px 12px', fontSize: 11, fontWeight: 600,
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            background: large === isLarge ? actBg : 'transparent',
            color:      large === isLarge ? actC  : inact,
            transition: '.15s ease',
          }}
        >{isLarge ? 'A+' : 'Normal'}</button>
      ))}
    </div>
  )
}

function ProgressDots({ step, total }) {
  return (
    <div style={{ flexShrink: 0 }}>
      <div style={{ fontSize: s(10), color: 'rgba(255,255,255,.4)', fontWeight: 600, textAlign: 'right', marginBottom: 6 }}>
        {step <= total ? `Etapa ${step} de ${total}` : 'Concluído'}
      </div>
      <div style={{ display: 'flex', gap: 5, justifyContent: 'flex-end' }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{
            height: 5, borderRadius: 999, transition: 'all .3s ease',
            width: i === step - 1 ? 36 : 24,
            background: i < step - 1 ? t.greenAccent : i === step - 1 ? '#fff' : 'rgba(255,255,255,.15)',
          }} />
        ))}
      </div>
    </div>
  )
}

function StepTag({ label }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: t.blueLight, borderRadius: 999, padding: '3px 10px 3px 7px', marginBottom: 8 }}>
      <div style={{ width: 5, height: 5, borderRadius: '50%', background: t.blue }} />
      <span style={{ fontSize: s(10), fontWeight: 700, letterSpacing: '.07em', color: t.blue }}>{label}</span>
    </div>
  )
}

function FieldInput({ label, required, hint, ...props }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: s(11), fontWeight: 700, letterSpacing: '.03em', color: t.muted, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
        {label} {required && <span style={{ color: t.blue, fontSize: s(14), lineHeight: 1 }}>*</span>}
      </div>
      <input
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', border: `1.5px solid ${focused ? t.blue : t.line}`, borderRadius: 12,
          padding: '12px 14px', fontSize: s(14), fontWeight: 500, lineHeight: 1.2,
          color: t.text, background: focused ? '#fff' : '#fafbfe', outline: 'none',
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          boxShadow: focused ? '0 0 0 3px rgba(35,80,200,.1)' : 'none',
          transition: 'border-color .15s, box-shadow .15s', WebkitAppearance: 'none',
        }}
        {...props}
      />
      {hint && <div style={{ fontSize: s(10), color: t.muted, marginTop: 5, fontWeight: 500 }}>{hint}</div>}
    </div>
  )
}

function BtnPrimary({ children, disabled, onClick }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      style={{
        width: '100%', border: 0, borderRadius: 14, cursor: disabled ? 'not-allowed' : 'pointer',
        background: t.blue, color: '#fff', padding: '15px 14px',
        fontSize: s(15), fontWeight: 600, lineHeight: 1.2,
        boxShadow: '0 8px 20px rgba(35,80,200,.25)', marginBottom: 8,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        opacity: disabled ? .5 : 1, transition: '.15s ease',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >{children}</button>
  )
}

function BtnBack({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: '100%', border: `1.5px solid ${t.line}`, borderRadius: 14,
        background: 'transparent', color: t.muted, padding: 13,
        fontSize: s(13), fontWeight: 500, cursor: 'pointer',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >← Voltar</button>
  )
}

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M6 3l5 5-5 5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// ── Step 1 ─────────────────────────────────────────────────────────────────────

function Step1({ form, onChange, onNext }) {
  const valid = form.nome.trim() && form.cpf.length === 14 && form.nasc.length === 10 && form.tel.length >= 14
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <StepTag label="ETAPA 1 DE 2" />
        <div style={{ fontSize: s(18), fontWeight: 700, color: t.text, lineHeight: 1.2, marginBottom: 4 }}>Dados pessoais</div>
        <div style={{ fontSize: s(12), color: t.muted, fontWeight: 500, lineHeight: 1.4 }}>Precisamos confirmar sua identidade</div>
      </div>

      <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e6ecf8', boxShadow: '0 8px 28px rgba(0,24,81,.09)', padding: 16, marginBottom: 14 }}>
        <FieldInput label="Nome completo"       required placeholder="Como aparece no documento" autoComplete="name"    value={form.nome}  onChange={e => onChange('nome', e.target.value)} />
        <FieldInput label="CPF"                 required placeholder="000.000.000-00"             inputMode="numeric"   value={form.cpf}   onChange={e => onChange('cpf',  maskCPF(e.target.value))}   maxLength={14} />
        <FieldInput label="Data de nascimento"  required placeholder="DD/MM/AAAA"                inputMode="numeric"   value={form.nasc}  onChange={e => onChange('nasc', maskDate(e.target.value))}  maxLength={10} />
        <FieldInput label="Telefone / WhatsApp" required placeholder="(00) 00000-0000"           inputMode="tel"       value={form.tel}   onChange={e => onChange('tel',  maskPhone(e.target.value))} maxLength={15} />
        <div style={{ marginBottom: 0 }}>
          <FieldInput label="E-mail" placeholder="seu@email.com" type="email" autoComplete="email" hint="Para receber sua proposta" value={form.email} onChange={e => onChange('email', e.target.value)} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: t.greenBg, border: `1px solid ${t.greenBorder}`, borderRadius: 12, padding: '10px 12px', marginBottom: 14 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: '#c8eeda', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path d="M10 2l7 3v6c0 4-3.5 6.5-7 7.5C6.5 17.5 3 15 3 11V5l7-3z" stroke={t.greenAccent} strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M7 10l2 2 4-4" stroke={t.greenAccent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div style={{ fontSize: s(10.5), color: t.green, fontWeight: 500, lineHeight: 1.35 }}>
          <strong>Seus dados estão protegidos.</strong> Criptografia e conformidade com a LGPD.
        </div>
      </div>

      <BtnPrimary disabled={!valid} onClick={onNext}>Continuar <ArrowIcon /></BtnPrimary>
    </div>
  )
}

// ── Step 2 ─────────────────────────────────────────────────────────────────────

function Step2({ file, onFile, onRemoveFile, skipped, onSkip, onNext, onBack }) {
  const inputRef  = useRef(null)
  const [dragging, setDragging] = useState(false)
  const handleFile = useCallback((f) => { if (f) onFile(f) }, [onFile])
  const canProceed = !!file || skipped

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <StepTag label="ETAPA 2 DE 2" />
        <div style={{ fontSize: s(18), fontWeight: 700, color: t.text, lineHeight: 1.2, marginBottom: 4 }}>Extrato do INSS</div>
        <div style={{ fontSize: s(12), color: t.muted, fontWeight: 500, lineHeight: 1.4 }}>Precisamos do seu extrato para calcular a melhor oferta</div>
      </div>

      <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e6ecf8', boxShadow: '0 8px 28px rgba(0,24,81,.09)', padding: 16, marginBottom: 14 }}>
        <div style={{ fontSize: s(11), fontWeight: 700, letterSpacing: '.03em', color: t.muted, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
          Extrato de pagamento <span style={{ color: t.blue, fontSize: s(14), lineHeight: 1 }}>*</span>
        </div>

        {!file ? (
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }}
            style={{ border: `2px dashed ${dragging ? t.blue : t.blueMid}`, borderRadius: 20, background: dragging ? '#dce6ff' : t.blueLight, padding: '28px 20px', textAlign: 'center', cursor: 'pointer', transition: 'all .2s ease' }}
          >
            <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
            <div style={{ width: 48, height: 48, borderRadius: 14, background: '#fff', border: `1px solid ${t.blueMid}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', boxShadow: '0 4px 12px rgba(35,80,200,.1)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 16V8M12 8l-3 3M12 8l3 3" stroke={t.blue} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke={t.blue} strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            <div style={{ fontSize: s(14), fontWeight: 700, color: t.blue, marginBottom: 4 }}>Toque para enviar</div>
            <div style={{ fontSize: s(11), color: t.muted, fontWeight: 500, lineHeight: 1.4 }}>Selecione o extrato do seu benefício INSS</div>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 10 }}>
              {['PDF','JPG','PNG'].map(fmt => (
                <span key={fmt} style={{ background: '#fff', border: `1px solid ${t.blueMid}`, borderRadius: 6, padding: '3px 8px', fontSize: s(9.5), fontWeight: 700, color: t.blue, letterSpacing: '.04em' }}>{fmt}</span>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fff', border: `1.5px solid ${t.greenAccent}`, borderRadius: 14, padding: '12px 14px' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: t.greenBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M6 2h7l4 4v12a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z" stroke={t.greenAccent} strokeWidth="1.4" strokeLinejoin="round"/>
                <path d="M13 2v4h4M7 10h6M7 13h4" stroke={t.greenAccent} strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: s(12), fontWeight: 700, color: t.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 2 }}>{file.name}</div>
              <div style={{ fontSize: s(10), color: t.muted, fontWeight: 500 }}>{formatFileSize(file.size)}</div>
            </div>
            <button type="button" onClick={onRemoveFile} style={{ width: 26, height: 26, borderRadius: '50%', background: '#f0f3fa', border: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.muted, flexShrink: 0 }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 1.5l7 7M8.5 1.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
          </div>
        )}
      </div>

      {/* How to */}
      <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e6ecf8', boxShadow: '0 8px 28px rgba(0,24,81,.09)', padding: 14, marginBottom: 14 }}>
        <div style={{ fontSize: s(11), fontWeight: 700, color: t.text, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 7 }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke={t.muted} strokeWidth="1.3"/><path d="M8 7v4M8 5.5v.5" stroke={t.muted} strokeWidth="1.4" strokeLinecap="round"/></svg>
          Como baixar o extrato do INSS
        </div>
        {[
          ['Acesse o app ', 'Meu INSS', ' ou o site meu.inss.gov.br'],
          ['Vá em ', '"Extrato de Pagamento"', ' no menu'],
          ['Baixe o PDF do ', 'último extrato', ' disponível'],
        ].map(([a, b, c], i) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: i < 2 ? 10 : 0 }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: t.blueLight, color: t.blue, fontSize: s(10), fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</div>
            <div style={{ fontSize: s(11), color: t.muted, fontWeight: 500, lineHeight: 1.4, paddingTop: 2 }}>{a}<strong style={{ color: t.text }}>{b}</strong>{c}</div>
          </div>
        ))}
      </div>

      <BtnPrimary disabled={!canProceed} onClick={onNext}>
        {skipped && !file ? 'Ver ofertas estimadas' : 'Enviar e ver ofertas'} <ArrowIcon />
      </BtnPrimary>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '4px 0 10px' }}>
        <div style={{ flex: 1, height: 1, background: t.line }} />
        <div style={{ fontSize: s(10), fontWeight: 600, color: t.muted, whiteSpace: 'nowrap', letterSpacing: '.03em' }}>NÃO TENHO O EXTRATO AGORA</div>
        <div style={{ flex: 1, height: 1, background: t.line }} />
      </div>

      {skipped && (
        <div style={{ background: t.goldBg, border: `1.5px solid ${t.goldLine}`, borderRadius: 20, padding: '14px 16px', marginBottom: 10, animation: 'fadeWarn .22s ease forwards' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: t.goldIcon, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M10 3l8 14H2L10 3z" stroke="#a87000" strokeWidth="1.5" strokeLinejoin="round"/><path d="M10 8v4M10 14.5v.5" stroke="#a87000" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
            <div>
              <div style={{ fontSize: s(12.5), fontWeight: 700, color: t.gold, lineHeight: 1.2, marginBottom: 3 }}>Ofertas estimadas, não personalizadas</div>
              <div style={{ fontSize: s(11), fontWeight: 500, color: t.goldBody, lineHeight: 1.45 }}>Sem o extrato, calculamos com base em dados médios do seu perfil. Os valores reais podem variar.</div>
            </div>
          </div>
          <div style={{ height: 1, background: t.goldLine, margin: '10px 0' }} />
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: t.greenAccent, flexShrink: 0, marginTop: 5 }} />
            <div style={{ fontSize: s(11), fontWeight: 500, color: t.green, lineHeight: 1.45 }}>
              <strong>Quando tiver o extrato, é só enviar aqui.</strong> Suas ofertas serão atualizadas com os valores exatos.
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onSkip}
        style={{ width: '100%', border: `1.5px dashed ${t.blueMid}`, borderRadius: 14, background: 'transparent', color: t.muted, padding: '13px 14px', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", fontSize: s(13), fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
      >
        <svg width="15" height="15" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5"/><path d="M10 6v4.5L12.5 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        Continuar sem extrato por enquanto
      </button>

      <div style={{ marginTop: 8 }}><BtnBack onClick={onBack} /></div>
    </div>
  )
}

// ── Success ────────────────────────────────────────────────────────────────────

function StepSuccess({ form, file, skipped, onVerOfertas }) {
  const isPending = skipped && !file
  return (
    <div style={{ textAlign: 'center', padding: '20px 0 10px' }}>
      <div style={{ width: 72, height: 72, borderRadius: '50%', background: t.greenBg, border: `2px solid ${t.greenBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', animation: 'popIn .4s cubic-bezier(.34,1.56,.64,1) forwards' }}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M8 16l5 5 11-10" stroke={t.greenAccent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      <div style={{ fontSize: s(20), fontWeight: 700, color: t.text, marginBottom: 8 }}>Cadastro concluído!</div>
      <div style={{ fontSize: s(13), color: t.muted, fontWeight: 500, lineHeight: 1.5, maxWidth: 240, margin: '0 auto 24px' }}>
        {isPending
          ? 'Cadastro recebido! Suas ofertas estão estimadas. Envie o extrato para ver os valores exatos.'
          : 'Estamos analisando seu extrato. Em instantes suas ofertas estarão disponíveis.'}
      </div>

      {isPending && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: t.goldBg, border: `1px solid ${t.goldLine}`, borderRadius: 12, padding: '10px 12px', marginBottom: 14 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: t.goldIcon, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none"><path d="M10 3l8 14H2L10 3z" stroke="#a87000" strokeWidth="1.5" strokeLinejoin="round"/><path d="M10 8v4M10 14.5v.5" stroke="#a87000" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </div>
          <div style={{ fontSize: s(10.5), fontWeight: 500, color: t.goldBody, lineHeight: 1.35, textAlign: 'left' }}>
            <strong style={{ color: t.gold }}>Extrato pendente.</strong> Suas ofertas estão estimadas. Envie o extrato para ver os valores exatos.
          </div>
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e6ecf8', boxShadow: '0 8px 28px rgba(0,24,81,.09)', padding: 16, marginBottom: 16, textAlign: 'left' }}>
        <div style={{ fontSize: s(10), fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: t.muted, marginBottom: 10 }}>Dados enviados</div>
        {[
          ['Nome',    form.nome || '—'],
          ['CPF',     form.cpf  || '—'],
          ['Extrato', file ? file.name : isPending ? 'Não enviado — pendente' : '—'],
        ].map(([label, value], i, arr) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: i < arr.length - 1 ? `1px solid ${t.line}` : 'none', fontSize: s(12) }}>
            <span style={{ color: t.muted, fontWeight: 500 }}>{label}</span>
            <span style={{ color: t.text, fontWeight: 600 }}>{value}</span>
          </div>
        ))}
      </div>

      <BtnPrimary onClick={onVerOfertas}>Ver minhas ofertas →</BtnPrimary>
    </div>
  )
}

// ── Desktop Left Panel ────────────────────────────────────────────────────────

const valueProps = [
  { icon: '⚡', title: 'Análise em Minutos',      sub: 'Resultado da simulação na hora, sem burocracia.' },
  { icon: '🔒', title: 'Segurança LGPD',           sub: 'Dados criptografados e protegidos por lei.' },
  { icon: '💰', title: 'Melhores Taxas do Mercado', sub: 'Comparamos dezenas de ofertas pra você.' },
]

function DesktopLeftPanel({ step }) {
  return (
    <div style={{ width: '44%', minHeight: '100vh', background: t.navy, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '48px 40px', position: 'sticky', top: 0 }}>
      <div>
        {/* Logo real */}
        <div style={{ marginBottom: 56 }}>
          <img src={logoSvg} alt="ConsigAI" style={{ height: 100, width: 'auto' }} />
        </div>

        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', marginBottom: 12 }}>Economia Inteligente</div>
          <div style={{ fontSize: 30, fontWeight: 700, color: '#fff', lineHeight: 1.2, letterSpacing: '-.02em' }}>
            Seu crédito,<br />do seu jeito.
          </div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,.5)', fontWeight: 500, lineHeight: 1.6, marginTop: 14, maxWidth: 280 }}>
            Simule e contrate em minutos. Sem letras miúdas, sem surpresas.
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {valueProps.map(({ icon, title, sub }) => (
            <div key={title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{icon}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 3 }}>{title}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.45)', fontWeight: 500, lineHeight: 1.4 }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress vertical */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,.1)', paddingTop: 24, marginTop: 40 }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', fontWeight: 600, marginBottom: 12, letterSpacing: '.04em' }}>
          {step <= 2 ? `ETAPA ${step} DE 2` : 'CONCLUÍDO'}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[{ n: 1, label: 'Dados pessoais' }, { n: 2, label: 'Extrato do INSS' }].map(({ n, label }) => {
            const done = step > n, active = step === n
            return (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: done ? t.greenAccent : active ? '#fff' : 'rgba(255,255,255,.1)', border: `2px solid ${done ? t.greenAccent : active ? '#fff' : 'rgba(255,255,255,.2)'}`, transition: 'all .3s ease' }}>
                  {done
                    ? <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    : <span style={{ fontSize: 11, fontWeight: 700, color: active ? t.navy : 'rgba(255,255,255,.4)' }}>{n}</span>
                  }
                </div>
                <span style={{ fontSize: 13, fontWeight: active ? 600 : 500, color: done || active ? '#fff' : 'rgba(255,255,255,.35)', transition: 'color .3s ease' }}>{label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Main ───────────────────────────────────────────────────────────────────────

export default function Cadastro() {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const [large,   setLarge]   = useState(false)
  const [step,    setStep]    = useState(1)
  const [form,    setForm]    = useState({ nome: '', cpf: '', nasc: '', tel: '', email: '' })
  const [file,    setFile]    = useState(null)
  const [skipped, setSkipped] = useState(false)

  const scale = large ? 1.47 : 1.22

  const setField = (key, val) => setForm(f => ({ ...f, [key]: val }))
  const handleFileSelect = (f) => { setFile(f); setSkipped(false) }

  const formPanel = (
    <>
      {step === 1 && <Step1 form={form} onChange={setField} onNext={() => setStep(2)} />}
      {step === 2 && <Step2 file={file} onFile={handleFileSelect} onRemoveFile={() => setFile(null)} skipped={skipped} onSkip={() => setSkipped(s => !s)} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
      {step === 3 && <StepSuccess form={form} file={file} skipped={skipped} onVerOfertas={() => alert('→ Navegar para ofertas')} />}
    </>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        @keyframes popIn    { from { transform:scale(.5);opacity:0 } to { transform:scale(1);opacity:1 } }
        @keyframes fadeWarn { from { opacity:0;transform:translateY(6px) } to { opacity:1;transform:translateY(0) } }
        @keyframes slideIn  { from { opacity:0;transform:translateX(14px) } to { opacity:1;transform:translateX(0) } }
        input::placeholder  { opacity:.6 }
      `}</style>

      {/* --scale CSS var aplicado aqui → todos s(n) herdam */}
      <div style={{ '--scale': scale, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", minHeight: '100vh', color: t.text }}>

        {isDesktop ? (
          <div style={{ display: 'flex', minHeight: '100vh' }}>
            <DesktopLeftPanel step={step} />

            <div style={{ flex: 1, background: t.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 32px', minHeight: '100vh', overflowY: 'auto' }}>
              {/* Font toggle fixo top-right */}
              <div style={{ position: 'fixed', top: 20, right: 24, zIndex: 10 }}>
                <FontToggle large={large} onToggle={setLarge} dark={false} />
              </div>

              <div style={{ width: '100%', maxWidth: 480, animation: 'slideIn .22s ease forwards' }}>
                {step <= 2 && (
                  <div style={{ marginBottom: 28 }}>
                    <div style={{ fontSize: s(22), fontWeight: 700, color: t.text, letterSpacing: '-.02em', marginBottom: 4 }}>
                      {step === 1 ? 'Dados pessoais' : 'Extrato do INSS'}
                    </div>
                    <div style={{ fontSize: s(14), color: t.muted, fontWeight: 500 }}>
                      {step === 1 ? 'Precisamos confirmar sua identidade.' : 'Para calcular a melhor oferta pra você.'}
                    </div>
                  </div>
                )}
                {formPanel}
              </div>
            </div>
          </div>
        ) : (
          /* Mobile */
          <div style={{ background: t.bg }}>
            <div style={{ background: t.navy, padding: 'max(18px, env(safe-area-inset-top)) 20px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <img src={logoIconSvg} alt="" aria-hidden="true" style={{ height: 28, width: 28 }} />
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#fff', letterSpacing: '-.01em' }}>ConsigAI</span>
                </div>
                <FontToggle large={large} onToggle={setLarge} dark={true} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, gap: 10 }}>
                <div>
                  <div style={{ fontSize: s(11), color: 'rgba(255,255,255,.5)', marginBottom: 4 }}>Bem-vindo à ConsigAI</div>
                  <div style={{ fontSize: s(18), fontWeight: 700, color: '#fff', lineHeight: 1.1 }}>Crie sua conta</div>
                </div>
                <ProgressDots step={step} total={2} />
              </div>
            </div>
            <div style={{ background: t.bg, borderRadius: '26px 26px 0 0', marginTop: -26, padding: '22px 18px calc(28px + env(safe-area-inset-bottom))', animation: 'slideIn .22s ease forwards' }}>
              {formPanel}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
