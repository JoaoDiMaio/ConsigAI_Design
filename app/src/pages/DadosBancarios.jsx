import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { loadProfileData, saveProfileData } from '../lib/profileStorage'
import { DesktopPageHeader, MobilePageHeader } from '../components/AppHeader'
import { appPageStyle, theme } from '../ui/theme'

const t = {
  ...theme,
}

const bankOptions = [
  'Caixa Economica Federal',
  'Banco do Brasil',
  'Bradesco',
  'Itau',
  'Santander',
  'Nubank',
  'Inter',
  'Sicoob',
  'Outro',
]

const accountTypeOptions = [
  'Conta Corrente',
  'Conta Poupanca',
  'Conta de Pagamento',
]

function validate(form) {
  const errors = {}
  if (!form.bancoNome) errors.bancoNome = 'Selecione o banco.'
  if (!form.bancoTipoConta) errors.bancoTipoConta = 'Selecione o tipo de conta.'
  if (!form.bancoAgencia) errors.bancoAgencia = 'Informe a agencia.'
  if (!form.bancoConta) errors.bancoConta = 'Informe a conta com digito.'

  if (form.bancoAgencia && form.bancoAgencia.replace(/\D/g, '').length < 3) {
    errors.bancoAgencia = 'Agencia invalida.'
  }
  if (form.bancoConta && form.bancoConta.replace(/\D/g, '').length < 4) {
    errors.bancoConta = 'Conta invalida.'
  }

  return errors
}

function FieldLabel({ children, required }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.03em', color: t.muted, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
      {children}
      {required && <span style={{ color: t.blue, fontSize: 14, lineHeight: 1 }}>*</span>}
    </div>
  )
}

function InputField({ value, onChange, placeholder, error, maxLength }) {
  return (
    <>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        style={{
          width: '100%',
          border: `1.5px solid ${error ? t.danger : t.line}`,
          borderRadius: 12,
          padding: '12px 14px',
          fontSize: 14,
          fontWeight: 500,
          color: t.text,
          background: '#fafbfe',
          outline: 'none',
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        }}
      />
      {error && <div style={{ marginTop: 5, fontSize: 10, color: t.danger, fontWeight: 600 }}>{error}</div>}
    </>
  )
}

function SelectField({ value, onChange, options, placeholder, error }) {
  return (
    <>
      <select
        value={value}
        onChange={onChange}
        style={{
          width: '100%',
          border: `1.5px solid ${error ? t.danger : t.line}`,
          borderRadius: 12,
          padding: '12px 14px',
          fontSize: 14,
          fontWeight: 500,
          color: t.text,
          background: '#fafbfe',
          outline: 'none',
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          WebkitAppearance: 'none',
          appearance: 'none',
        }}
      >
        <option value="">{placeholder}</option>
        {options.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
      {error && <div style={{ marginTop: 5, fontSize: 10, color: t.danger, fontWeight: 600 }}>{error}</div>}
    </>
  )
}

export default function DadosBancarios() {
  const navigate = useNavigate()
  const location = useLocation()
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const flowState = location.state || {}
  const nextPath = flowState.nextPath || '/ofertas'
  const sourcePath = flowState.sourcePath || '/ofertas'
  const offerState = flowState.offerState || null

  const initialProfile = useMemo(() => loadProfileData(), [])
  const [form, setForm] = useState({
    bancoNome: initialProfile.bancoNome || '',
    bancoTipoConta: initialProfile.bancoTipoConta || '',
    bancoAgencia: initialProfile.bancoAgencia || '',
    bancoConta: initialProfile.bancoConta || '',
    bancoPix: initialProfile.bancoPix || '',
  })
  const [attemptedSave, setAttemptedSave] = useState(false)

  const errors = validate(form)
  const hasErrors = Object.keys(errors).length > 0

  const scale = 1.2
  const s = (value) => `calc(${value}px * var(--scale))`

  const onChange = (key, value) => {
    let next = value
    if (key === 'bancoAgencia') next = value.replace(/\D/g, '').slice(0, 6)
    if (key === 'bancoConta') next = value.replace(/[^0-9-]/g, '').slice(0, 14)
    if (key === 'bancoPix') next = value.slice(0, 120)
    setForm((prev) => ({ ...prev, [key]: next }))
  }

  const goNext = (bankData) => {
    if (nextPath === '/contratacao') {
      navigate('/contratacao', {
        state: {
          ...(offerState || {}),
          bankData,
        },
      })
      return
    }

    navigate(nextPath, {
      state: {
        ...(flowState || {}),
        bankData,
      },
    })
  }

  const handleSave = () => {
    setAttemptedSave(true)
    if (hasErrors) return

    const merged = saveProfileData(form)
    goNext({
      bancoNome: merged.bancoNome,
      bancoTipoConta: merged.bancoTipoConta,
      bancoAgencia: merged.bancoAgencia,
      bancoConta: merged.bancoConta,
      bancoPix: merged.bancoPix,
    })
  }

  const handleSkip = () => {
    goNext({
      bancoNome: '',
      bancoTipoConta: '',
      bancoAgencia: '',
      bancoConta: '',
      bancoPix: '',
    })
  }

  const formPanel = (
    <>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: t.blueLight, borderRadius: 999, padding: '3px 10px 3px 7px', marginBottom: 8 }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: t.blue }} />
        <span style={{ fontSize: s(10), fontWeight: 700, letterSpacing: '.07em', color: t.blue }}>DADOS BANCARIOS</span>
      </div>
      <div style={{ fontSize: s(18), fontWeight: 700, color: t.text, lineHeight: 1.2, marginBottom: 4 }}>Conta para recebimento</div>
      <div style={{ fontSize: s(12), color: t.muted, fontWeight: 500, lineHeight: 1.4, marginBottom: 18 }}>Informe onde quer receber seu credito</div>

      <div style={{ background: '#fff', borderRadius: 20, border: `1px solid ${t.cardBorder}`, boxShadow: t.cardShadow, padding: 16, marginBottom: 14 }}>
        <div style={{ marginBottom: 14 }}>
          <FieldLabel required>Banco</FieldLabel>
          <SelectField value={form.bancoNome} onChange={(e) => onChange('bancoNome', e.target.value)} options={bankOptions} placeholder="Selecione seu banco" error={attemptedSave ? errors.bancoNome : ''} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <FieldLabel required>Tipo de conta</FieldLabel>
          <SelectField value={form.bancoTipoConta} onChange={(e) => onChange('bancoTipoConta', e.target.value)} options={accountTypeOptions} placeholder="Selecione" error={attemptedSave ? errors.bancoTipoConta : ''} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr', gap: 10 }}>
          <div style={{ marginBottom: 14 }}>
            <FieldLabel required>Agencia</FieldLabel>
            <InputField value={form.bancoAgencia} onChange={(e) => onChange('bancoAgencia', e.target.value)} placeholder="0000" maxLength={6} error={attemptedSave ? errors.bancoAgencia : ''} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <FieldLabel required>Conta + digito</FieldLabel>
            <InputField value={form.bancoConta} onChange={(e) => onChange('bancoConta', e.target.value)} placeholder="000000-0" maxLength={14} error={attemptedSave ? errors.bancoConta : ''} />
          </div>
        </div>

        <div>
          <FieldLabel>Chave Pix</FieldLabel>
          <InputField value={form.bancoPix} onChange={(e) => onChange('bancoPix', e.target.value)} placeholder="CPF, e-mail ou telefone" maxLength={120} />
          <div style={{ fontSize: s(10), color: t.muted, marginTop: 5, fontWeight: 500 }}>Opcional para transferencias mais rapidas</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: t.greenBg, border: '1px solid #b8e0ca', borderRadius: 12, padding: '10px 12px', marginBottom: 14 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: '#c8eeda', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path d="M10 2l7 3v6c0 4-3.5 6.5-7 7.5C6.5 17.5 3 15 3 11V5l7-3z" stroke={t.greenAccent} strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M7 10l2 2 4-4" stroke={t.greenAccent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div style={{ fontSize: s(10.5), color: t.green, fontWeight: 500, lineHeight: 1.35 }}>
          <strong>Verificado pelo Banco Central.</strong> Seus dados bancarios sao transmitidos com seguranca total.
        </div>
      </div>

      {attemptedSave && hasErrors && (
        <div style={{ marginBottom: 10, borderRadius: 12, border: '1px solid #f1c2c2', background: '#fff1f1', padding: '9px 11px', fontSize: 11, color: t.danger, fontWeight: 600 }}>
          Revise os campos obrigatorios para continuar.
        </div>
      )}

      <button
        type="button"
        onClick={handleSave}
        style={{
          width: '100%',
          border: 0,
          borderRadius: 14,
          cursor: 'pointer',
          background: t.blue,
          color: '#fff',
          padding: '15px 14px',
          fontSize: s(15),
          fontWeight: 600,
          lineHeight: 1.2,
          boxShadow: '0 8px 20px rgba(35,80,200,.25)',
          marginBottom: 8,
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        }}
      >
        Salvar dados bancarios
      </button>

      <button
        type="button"
        onClick={handleSkip}
        style={{
          width: '100%',
          border: `1.5px solid ${t.blueMid}`,
          borderRadius: 14,
          cursor: 'pointer',
          background: 'transparent',
          color: t.blue,
          padding: 13,
          fontSize: s(13.5),
          fontWeight: 500,
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        }}
      >
        Fazer depois
      </button>
    </>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
      `}</style>

      <div style={{ ...appPageStyle, '--scale': scale }}>
        {isDesktop ? (
          <>
            <DesktopPageHeader
              clientName={initialProfile.nomeCompleto || 'Cliente'}
              chipLabel="Dados bancarios"
              title="Conta para recebimento"
              subtitle="Informe onde voce quer receber seu credito para concluir as proximas etapas."
              onLogoClick={() => navigate('/ofertas')}
              actions={[
                { label: 'Voltar', onClick: () => navigate(sourcePath) },
                { label: 'Configuracoes', onClick: () => navigate('/configuracoes') },
              ]}
            />
            <div style={{ maxWidth: 740, margin: '0 auto', padding: '28px 20px 40px' }}>
              {formPanel}
            </div>
          </>
        ) : (
          <>
            <MobilePageHeader
              clientName={initialProfile.nomeCompleto || 'Cliente'}
              onLogoClick={() => navigate(sourcePath)}
              actions={[
                { label: 'Voltar', onClick: () => navigate(sourcePath) },
                { label: 'Configuracoes', onClick: () => navigate('/configuracoes') },
              ]}
            />

            <div style={{ background: t.bg, borderRadius: '26px 26px 0 0', marginTop: 0, padding: '22px 18px calc(28px + env(safe-area-inset-bottom))' }}>
              {formPanel}
            </div>
          </>
        )}
      </div>
    </>
  )
}

