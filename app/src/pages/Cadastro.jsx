import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { maskCPF, maskDate, maskPhone, formatFileSize } from '../lib/masks'
import { sanitizeText, validatePersonalData, validateUploadFile } from '../lib/validators'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { saveProfileData } from '../lib/profileStorage'
import { DesktopPageHeader, MobilePageHeader } from '../components/AppHeader'
import { appPageStyle } from '../ui/theme'
import { t } from '../lib/pageTheme'

const s = (n) => `calc(${n}px * var(--scale))`

//  Sub-components 

function FontToggle({ large, onToggle, dark }) {
  const bg    = dark ? 'rgba(255,255,255,.07)' : '#fff'
  const bdr   = dark ? '1px solid rgba(255,255,255,.1)' : `1px solid ${t.line}`
  const shad  = dark ? 'none' : '0 2px 8px rgba(0,24,81,.08)'
  const inact = dark ? 'rgba(255,255,255,.55)' : t.muted
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

function FieldInput({ id, label, required, hint, error, onBlurField, ...props }) {
  const [focused, setFocused] = useState(false)
  const hasError = Boolean(error)
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: s(11), fontWeight: 700, letterSpacing: '.03em', color: t.muted, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
        {label} {required && <span style={{ color: t.blue, fontSize: s(14), lineHeight: 1 }}>*</span>}
      </div>
      <input
        id={id}
        name={id}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${id}-error` : hint ? `${id}-hint` : undefined}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false)
          if (onBlurField) onBlurField(id)
        }}
        style={{
          width: '100%', border: `1.5px solid ${hasError ? '#d94b4b' : focused ? t.blue : t.line}`, borderRadius: 12,
          padding: '12px 14px', fontSize: s(14), fontWeight: 500, lineHeight: 1.2,
          color: t.text, background: focused ? '#fff' : '#fafbfe', outline: 'none',
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          boxShadow: hasError ? '0 0 0 3px rgba(217,75,75,.12)' : focused ? '0 0 0 3px rgba(35,80,200,.1)' : 'none',
          transition: 'border-color .15s, box-shadow .15s', WebkitAppearance: 'none',
        }}
        {...props}
      />
      {hasError && (
        <div id={`${id}-error`} role="alert" style={{ fontSize: s(10), color: '#a02020', marginTop: 5, fontWeight: 600 }}>
          {error}
        </div>
      )}
      {!hasError && hint && <div id={`${id}-hint`} style={{ fontSize: s(10), color: t.muted, marginTop: 5, fontWeight: 500 }}>{hint}</div>}
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
    >  Voltar</button>
  )
}

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M6 3l5 5-5 5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

//  Step 1 

function Step1({ form, errors, touched, onChange, onBlurField, onNext, canProceed }) {
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <StepTag label="ETAPA 1 DE 2" />
        <div style={{ fontSize: s(18), fontWeight: 700, color: t.text, lineHeight: 1.2, marginBottom: 4 }}>Dados pessoais</div>
        <div style={{ fontSize: s(12), color: t.muted, fontWeight: 500, lineHeight: 1.4 }}>Precisamos confirmar sua identidade</div>
      </div>

      <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e6ecf8', boxShadow: '0 8px 28px rgba(0,24,81,.09)', padding: 16, marginBottom: 14 }}>
        <FieldInput id="nome" label="Nome completo" required placeholder="Como aparece no documento" autoComplete="name" value={form.nome} onChange={e => onChange('nome', e.target.value)} onBlurField={onBlurField} error={touched.nome ? errors.nome : ''} />
        <FieldInput id="cpf" label="CPF" required placeholder="000.000.000-00" inputMode="numeric" value={form.cpf} onChange={e => onChange('cpf', maskCPF(e.target.value))} maxLength={14} onBlurField={onBlurField} error={touched.cpf ? errors.cpf : ''} />
        <FieldInput id="nasc" label="Data de nascimento" required placeholder="DD/MM/AAAA" inputMode="numeric" value={form.nasc} onChange={e => onChange('nasc', maskDate(e.target.value))} maxLength={10} onBlurField={onBlurField} error={touched.nasc ? errors.nasc : ''} />
        <FieldInput id="tel" label="Telefone / WhatsApp" required placeholder="(00) 00000-0000" inputMode="tel" value={form.tel} onChange={e => onChange('tel', maskPhone(e.target.value))} maxLength={15} onBlurField={onBlurField} error={touched.tel ? errors.tel : ''} />
        <div style={{ marginBottom: 0 }}>
          <FieldInput id="email" label="E-mail" placeholder="seu@email.com" type="email" autoComplete="email" hint="Para receber sua proposta" value={form.email} onChange={e => onChange('email', e.target.value)} onBlurField={onBlurField} error={touched.email ? errors.email : ''} />
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

      <BtnPrimary disabled={!canProceed} onClick={onNext}>Continuar <ArrowIcon /></BtnPrimary>
    </div>
  )
}

//  Step 2 

function Step2({ file, fileError, onFile, onRemoveFile, skipped, onSkip, onNext, onBack }) {
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
            style={{ border: `2px dashed ${fileError ? '#d94b4b' : dragging ? t.blue : t.blueMid}`, borderRadius: 20, background: dragging ? '#dce6ff' : t.blueLight, padding: '28px 20px', textAlign: 'center', cursor: 'pointer', transition: 'all .2s ease' }}
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
            <div style={{ fontSize: s(10), color: t.muted, fontWeight: 500, lineHeight: 1.3, marginTop: 6 }}>Somente PDF/JPG/PNG com até 10 MB.</div>
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
        {fileError && (
          <div role="alert" style={{ marginTop: 8, fontSize: s(10.5), fontWeight: 600, color: '#a02020' }}>
            {fileError}
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
        <div style={{ fontSize: s(10), fontWeight: 600, color: t.muted, whiteSpace: 'nowrap', letterSpacing: '.03em' }}>NAO TENHO O EXTRATO AGORA</div>
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

//  Success 

function StepSuccess({ form, file, skipped, onPrimaryAction, ctaLabel }) {
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
          ['Nome',    form.nome || ''],
          ['CPF',     form.cpf  || ''],
          ['Extrato', file ? file.name : isPending ? 'Não enviado  pendente' : ''],
        ].map(([label, value], i, arr) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: i < arr.length - 1 ? `1px solid ${t.line}` : 'none', fontSize: s(12) }}>
            <span style={{ color: t.muted, fontWeight: 500 }}>{label}</span>
            <span style={{ color: t.text, fontWeight: 600 }}>{value}</span>
          </div>
        ))}
      </div>

      <BtnPrimary onClick={onPrimaryAction}>{ctaLabel}  </BtnPrimary>
    </div>
  )
}

//  Desktop Left Panel 

const valueProps = [
  { icon: 'a', title: 'Análise em Minutos',      sub: 'Resultado da simulação na hora, sem burocracia.' },
  { icon: 'x', title: 'Segurança LGPD',           sub: 'Dados criptografados e protegidos por lei.' },
  { icon: 'x', title: 'Melhores Taxas do Mercado', sub: 'Comparamos dezenas de ofertas pra você.' },
]

function DesktopLeftPanel({ step }) {
  return (
    <div style={{ width: '44%', minHeight: '100vh', background: t.navy, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '48px 40px', position: 'sticky', top: 0 }}>
      <div>
        <div style={{ marginBottom: 56 }} />

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

//  Main 

export default function Cadastro() {
  const navigate   = useNavigate()
  const isDesktop  = useMediaQuery('(min-width: 768px)')

  const [large,   setLarge]   = useState(false)
  const [step,    setStep]    = useState(1)
  const [form,    setForm]    = useState({ nome: '', cpf: '', nasc: '', tel: '', email: '' })
  const [touched, setTouched] = useState({})
  const [file,    setFile]    = useState(null)
  const [fileError, setFileError] = useState('')
  const [skipped, setSkipped] = useState(false)

  const scale = large ? 1.47 : 1.22
  const clientName = form.nome ? normalizeSpaces(form.nome) : 'Novo cliente'

  const personalErrors = validatePersonalData(form)
  const canProceedStep1 = Object.keys(personalErrors).length === 0

  const setField = (key, val) => {
    let nextValue = val
    if (key === 'nome') nextValue = sanitizeTextInput(val).slice(0, 120)
    if (key === 'email') nextValue = sanitizeTextInput(val).slice(0, 254)
    setForm((f) => ({ ...f, [key]: nextValue }))
  }

  const handleBlurField = (key) => {
    setTouched((v) => ({ ...v, [key]: true }))
  }

  const handleNextStep1 = () => {
    setTouched({ nome: true, cpf: true, nasc: true, tel: true, email: true })
    if (!canProceedStep1) return
    setStep(2)
  }

  const handleFileSelect = (nextFile) => {
    const err = validateUploadFile(nextFile)
    if (err) {
      setFile(null)
      setFileError(err)
      return
    }
    setFile(nextFile)
    setFileError('')
    setSkipped(false)
  }

  const handleRemoveFile = () => {
    setFile(null)
    setFileError('')
  }

  const handleSkipFile = () => {
    setSkipped((s) => !s)
    setFileError('')
  }

  const handleNextStep2 = () => {
    if (!skipped) {
      const err = validateUploadFile(file)
      if (err) {
        setFileError(err)
        return
      }
    }
    setStep(3)
  }

  const handleFinishCadastro = () => {
    saveProfileData({
      nomeCompleto: form.nome,
      cpf: form.cpf,
      dataNascimento: form.nasc,
      telefone: form.tel,
      email: form.email,
    })

    if (skipped && !file) {
      navigate('/dados-bancarios', {
        state: {
          sourcePath: '/cadastro',
          nextPath: '/ofertas',
          reason: 'sem_holerite',
        },
      })
      return
    }

    navigate('/ofertas')
  }

  const formPanel = (
    <>
      {step === 1 && <Step1 form={form} errors={personalErrors} touched={touched} onChange={setField} onBlurField={handleBlurField} onNext={handleNextStep1} canProceed={canProceedStep1} />}
      {step === 2 && <Step2 file={file} fileError={fileError} onFile={handleFileSelect} onRemoveFile={handleRemoveFile} skipped={skipped} onSkip={handleSkipFile} onNext={handleNextStep2} onBack={() => setStep(1)} />}
      {step === 3 && (
        <StepSuccess
          form={form}
          file={file}
          skipped={skipped}
          onPrimaryAction={handleFinishCadastro}
          ctaLabel={skipped && !file ? 'Informar dados bancarios' : 'Ver minhas ofertas'}
        />
      )}
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

      {/* --scale CSS var aplicado aqui   todos s(n) herdam */}
      <div style={{ ...appPageStyle, '--scale': scale }}>

                {isDesktop ? (
          <>
            <DesktopPageHeader
              clientName={clientName}
              chipLabel="Cadastro"
              title="Crie sua conta ConsigAI"
              subtitle="Preencha seus dados para liberar as propostas personalizadas."
              onLogoClick={() => navigate('/ofertas')}
              actions={[
                { label: 'Ofertas', onClick: () => navigate('/ofertas') },
                { label: 'Configuracoes', onClick: () => navigate('/configuracoes') },
              ]}
            />
            <div style={{ display: 'flex', minHeight: 'calc(100vh - 146px)' }}>
            <DesktopLeftPanel step={step} />

            <div style={{ flex: 1, background: t.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 32px', minHeight: 'calc(100vh - 146px)', overflowY: 'auto' }}>
              {/* Font toggle fixo top-right */}
              <div style={{ position: 'fixed', top: 164, right: 24, zIndex: 10 }}>
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
          </>
        ) : (
          /* Mobile */
          <div style={{ background: t.bg }}>
                        <MobilePageHeader
              clientName={clientName}
              onLogoClick={() => navigate('/ofertas')}
              actions={[{ label: 'Configuracoes', onClick: () => navigate('/configuracoes') }]}
            />
            <div style={{ background: t.navy, padding: '10px 20px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, gap: 10 }}>
                <div>
                  <div style={{ fontSize: s(11), color: 'rgba(255,255,255,.5)', marginBottom: 4 }}>Bem-vindo a ConsigAI</div>
                  <div style={{ fontSize: s(18), fontWeight: 700, color: '#fff', lineHeight: 1.1 }}>Crie sua conta</div>
                </div>
                <FontToggle large={large} onToggle={setLarge} dark={true} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
                <ProgressDots step={step} total={2} />
              </div>
            </div><div style={{ background: t.bg, borderRadius: '26px 26px 0 0', marginTop: 0, padding: '22px 18px calc(28px + env(safe-area-inset-bottom))', animation: 'slideIn .22s ease forwards' }}>
              {formPanel}
            </div>
          </div>
        )}
      </div>
    </>
  )
}


