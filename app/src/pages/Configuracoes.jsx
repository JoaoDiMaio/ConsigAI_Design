import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { maskDate, maskPhone, maskCEP } from '../lib/masks'
import { isValidEmail, isValidCEP } from '../lib/validators'
import { loadProfileData, saveProfileData } from '../lib/profileStorage'
import { DesktopPageHeader, MobilePageHeader } from '../components/AppHeader'
import { appPageStyle } from '../ui/theme'
import { t } from '../lib/pageTheme'

function validate(form) {
  const errors = {}
  const required = [
    ['nomeCompleto',    'Informe o nome completo.'],
    ['dataNascimento',  'Informe a data de nascimento.'],
    ['telefone',        'Informe o telefone.'],
    ['email',           'Informe o e-mail.'],
    ['cep',             'Informe o CEP.'],
    ['endereco',        'Informe o endereco.'],
    ['numero',          'Informe o numero.'],
    ['bairro',          'Informe o bairro.'],
    ['cidade',          'Informe a cidade.'],
    ['estado',          'Informe o estado.'],
  ]
  required.forEach(([key, message]) => {
    if (!String(form[key] || '').trim()) errors[key] = message
  })
  if (form.email && !isValidEmail(form.email))      errors.email = 'E-mail invalido.'
  if (form.cep   && !isValidCEP(form.cep))          errors.cep   = 'CEP invalido.'
  if (form.dataNascimento && !/^\d{2}\/\d{2}\/\d{4}$/.test(form.dataNascimento))
    errors.dataNascimento = 'Data invalida. Use DD/MM/AAAA.'
  if (form.telefone && String(form.telefone).replace(/\D/g, '').length < 10)
    errors.telefone = 'Telefone incompleto.'
  if (form.estado && String(form.estado).trim().length !== 2)
    errors.estado = 'Use a sigla com 2 letras.'
  return errors
}

function Field({ label, value, name, onChange, editable, error, placeholder, maxLength }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: t.muted, marginBottom: 6, letterSpacing: '.03em' }}>
        {label}
      </div>
      <input
        name={name}
        value={value}
        disabled={!editable}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        style={{
          width: '100%',
          borderRadius: 12,
          border: `1.5px solid ${error ? t.danger : t.line}`,
          background: editable ? '#fff' : '#f8faff',
          padding: '11px 13px',
          fontSize: 14,
          color: t.text,
          outline: 'none',
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        }}
      />
      {error && (
        <div style={{ marginTop: 5, fontSize: 10, fontWeight: 600, color: t.danger }}>
          {error}
        </div>
      )}
    </div>
  )
}

function Card({ title, subtitle, children }) {
  return (
    <div style={{ borderRadius: 20, border: `1px solid ${t.cardBorder}`, background: '#fff', boxShadow: t.cardShadow, padding: 16 }}>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: t.text }}>{title}</div>
        {subtitle && <div style={{ marginTop: 3, fontSize: 12, color: t.muted }}>{subtitle}</div>}
      </div>
      {children}
    </div>
  )
}

export default function Configuracoes() {
  const navigate = useNavigate()
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const initialProfile = useMemo(() => {
    return loadProfileData()
  }, [])

  const [form, setForm] = useState(initialProfile)
  const [editing, setEditing] = useState(false)
  const [savedAt, setSavedAt] = useState(null)
  const [attemptedSave, setAttemptedSave] = useState(false)

  const errors = useMemo(() => validate(form), [form])
  const hasErrors = Object.keys(errors).length > 0

  const onChange = (e) => {
    const { name, value } = e.target
    let next = value
    if (name === 'telefone') next = maskPhone(value)
    if (name === 'dataNascimento') next = maskDate(value)
    if (name === 'cep') next = maskCEP(value)
    if (name === 'estado') next = value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 2)
    if (name === 'bancoAgencia') next = value.replace(/\D/g, '').slice(0, 6)
    if (name === 'bancoConta') next = value.replace(/[^0-9-]/g, '').slice(0, 14)
    setForm((prev) => ({ ...prev, [name]: next }))
  }

  const handleSave = () => {
    setAttemptedSave(true)
    if (hasErrors) return
    saveProfileData(form)
    setSavedAt(new Date())
    setEditing(false)
  }

  const clientName = form.nomeCompleto || 'Cliente'
  const showFieldError = (name) => attemptedSave ? errors[name] : ''

  const formBody = (
    <div style={{ display: 'grid', gap: 14 }}>
      <Card title="Dados pessoais" subtitle="Informacoes basicas da sua conta">
        <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr', gap: 10 }}>
          <Field label="Nome completo" name="nomeCompleto" value={form.nomeCompleto} onChange={onChange} editable={editing} error={showFieldError('nomeCompleto')} />
          <Field label="CPF" name="cpf" value={form.cpf} onChange={onChange} editable={false} placeholder="000.000.000-00" />
          <Field label="Data de nascimento" name="dataNascimento" value={form.dataNascimento} onChange={onChange} editable={editing} error={showFieldError('dataNascimento')} maxLength={10} />
          <Field label="Telefone" name="telefone" value={form.telefone} onChange={onChange} editable={editing} error={showFieldError('telefone')} maxLength={15} />
          <Field label="E-mail" name="email" value={form.email} onChange={onChange} editable={editing} error={showFieldError('email')} />
        </div>
      </Card>

      <Card title="Endereco" subtitle="Usado para validacoes e comunicacao">
        <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? '2fr 1fr 1fr' : '1fr', gap: 10 }}>
          <Field label="Endereco" name="endereco" value={form.endereco} onChange={onChange} editable={editing} error={showFieldError('endereco')} />
          <Field label="Numero" name="numero" value={form.numero} onChange={onChange} editable={editing} error={showFieldError('numero')} />
          <Field label="Complemento" name="complemento" value={form.complemento} onChange={onChange} editable={editing} />
          <Field label="Bairro" name="bairro" value={form.bairro} onChange={onChange} editable={editing} error={showFieldError('bairro')} />
          <Field label="Cidade" name="cidade" value={form.cidade} onChange={onChange} editable={editing} error={showFieldError('cidade')} />
          <Field label="Estado" name="estado" value={form.estado} onChange={onChange} editable={editing} error={showFieldError('estado')} maxLength={2} />
          <Field label="CEP" name="cep" value={form.cep} onChange={onChange} editable={editing} error={showFieldError('cep')} maxLength={9} />
        </div>
      </Card>

      <Card title="Dados bancarios" subtitle="Conta usada para recebimento do credito">
        <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr', gap: 10 }}>
          <Field label="Banco" name="bancoNome" value={form.bancoNome || ''} onChange={onChange} editable={editing} placeholder="Nao informado" />
          <Field label="Tipo de conta" name="bancoTipoConta" value={form.bancoTipoConta || ''} onChange={onChange} editable={editing} placeholder="Nao informado" />
          <Field label="Agencia" name="bancoAgencia" value={form.bancoAgencia || ''} onChange={onChange} editable={editing} placeholder="Nao informado" maxLength={6} />
          <Field label="Conta + digito" name="bancoConta" value={form.bancoConta || ''} onChange={onChange} editable={editing} placeholder="Nao informado" maxLength={14} />
          <Field label="Chave Pix" name="bancoPix" value={form.bancoPix || ''} onChange={onChange} editable={editing} placeholder="Opcional" />
        </div>
      </Card>
    </div>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      <div style={appPageStyle}>
        {isDesktop ? (
          <>
            <DesktopPageHeader
              clientName={clientName}
              chipLabel="Area do cliente"
              title="Configuracoes da sua conta"
              subtitle="Revise e atualize seus dados cadastrais para manter tudo certo na sua conta."
              onLogoClick={() => navigate('/ofertas')}
              actions={[
                { label: 'Acompanhamento', onClick: () => navigate('/acompanhamento') },
                { label: 'Configuracoes', onClick: () => navigate('/configuracoes') },
              ]}
            />
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 40px 48px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: 20, alignItems: 'start' }}>
                <div>{formBody}</div>
                <div style={{ position: 'sticky', top: 22 }}>
                  <Card title="Controle da conta" subtitle="Atualize seu cadastro sempre que necessario">
                    <div style={{ borderRadius: 12, background: t.greenBg, border: `1px solid #b8e0ca`, padding: '10px 12px', marginBottom: 12 }}>
                      <div style={{ fontSize: 11, color: t.green, fontWeight: 600 }}>
                        {savedAt ? `Ultima atualizacao: ${savedAt.toLocaleString('pt-BR')}` : 'Nenhuma alteracao salva nesta sessao'}
                      </div>
                    </div>

                    <div style={{ borderRadius: 12, background: t.blueLight, border: `1px solid ${t.blueMid}`, padding: '10px 12px', marginBottom: 12 }}>
                      <div style={{ fontSize: 10, color: t.blue, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 5 }}>
                        Feature nova
                      </div>
                      <div style={{ fontSize: 12, color: t.text, lineHeight: 1.5, marginBottom: 9 }}>
                        Acompanhe propostas aceitas ou nao, status de contratos e comparativo entre oferta inicial e oferta concretizada.
                      </div>
                      <button
                        type="button"
                        onClick={() => navigate('/acompanhamento')}
                        style={{ width: '100%', border: 0, borderRadius: 12, background: t.blue, color: '#fff', padding: '9px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                      >
                        Abrir acompanhamento
                      </button>
                    </div>

                    {!editing ? (
                      <button
                        type="button"
                        onClick={() => setEditing(true)}
                        style={{ width: '100%', border: 0, borderRadius: 14, background: t.blue, color: '#fff', padding: '12px 14px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
                      >
                        Editar dados cadastrais
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={handleSave}
                          style={{ width: '100%', border: 0, borderRadius: 14, background: t.blue, color: '#fff', padding: '12px 14px', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginBottom: 8 }}
                        >
                          Salvar alteracoes
                        </button>
                        <button
                          type="button"
                          onClick={() => { setForm(loadProfileData()); setEditing(false); setAttemptedSave(false) }}
                          style={{ width: '100%', border: `1.5px solid ${t.line}`, borderRadius: 14, background: '#fff', color: t.muted, padding: '11px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                        >
                          Cancelar edicao
                        </button>
                      </>
                    )}

                    {attemptedSave && hasErrors && (
                      <div style={{ marginTop: 10, borderRadius: 12, background: t.dangerBg, border: '1px solid #f1c2c2', padding: '9px 11px', fontSize: 11, color: t.danger, fontWeight: 600 }}>
                        Revise os campos destacados para salvar.
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <MobilePageHeader
              clientName={clientName}
              onLogoClick={() => navigate('/ofertas')}
              actions={[
                { label: 'Acompanhar', onClick: () => navigate('/acompanhamento') },
                { label: 'Configuracoes', onClick: () => navigate('/configuracoes') },
              ]}
            />

            <div style={{ background: t.bg, borderRadius: '26px 26px 0 0', marginTop: 0, padding: '20px 18px calc(24px + env(safe-area-inset-bottom))' }}>
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 999, background: t.blueLight, padding: '4px 12px 4px 8px', marginBottom: 9 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: t.blue }} />
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.07em', color: t.blue, textTransform: 'uppercase' }}>Configuracoes</span>
                </div>
                <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: t.text, lineHeight: 1.2 }}>Area do cliente</h1>
                <p style={{ margin: '6px 0 0', fontSize: 12, color: t.muted, lineHeight: 1.55 }}>
                  Aqui voce consulta e atualiza os seus dados cadastrais.
                </p>
              </div>

              {formBody}

              <div style={{ marginTop: 14, borderRadius: 16, border: `1px solid ${t.cardBorder}`, background: '#fff', boxShadow: t.cardShadow, padding: 14 }}>
                <div style={{ borderRadius: 12, background: t.blueLight, border: `1px solid ${t.blueMid}`, padding: '10px 12px', marginBottom: 10 }}>
                  <div style={{ fontSize: 10, color: t.blue, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 5 }}>
                    Feature nova
                  </div>
                  <div style={{ fontSize: 12, color: t.text, lineHeight: 1.5, marginBottom: 8 }}>
                    Veja o andamento das propostas e compare o ofertado com o realizado.
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/acompanhamento')}
                    style={{ width: '100%', border: 0, borderRadius: 12, background: t.blue, color: '#fff', padding: '10px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                  >
                    Abrir acompanhamento
                  </button>
                </div>

                {!editing ? (
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    style={{ width: '100%', border: 0, borderRadius: 14, background: t.blue, color: '#fff', padding: '13px 14px', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginBottom: 8 }}
                  >
                    Editar dados cadastrais
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleSave}
                      style={{ width: '100%', border: 0, borderRadius: 14, background: t.blue, color: '#fff', padding: '13px 14px', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginBottom: 8 }}
                    >
                      Salvar alteracoes
                    </button>
                    <button
                      type="button"
                      onClick={() => { setForm(loadProfileData()); setEditing(false); setAttemptedSave(false) }}
                      style={{ width: '100%', border: `1.5px solid ${t.line}`, borderRadius: 14, background: '#fff', color: t.muted, padding: '12px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                    >
                      Cancelar edicao
                    </button>
                  </>
                )}

                {savedAt && (
                  <div style={{ marginTop: 9, borderRadius: 10, background: t.greenBg, border: '1px solid #b8e0ca', padding: '8px 10px', fontSize: 11, color: t.green, fontWeight: 600 }}>
                    Dados atualizados em {savedAt.toLocaleString('pt-BR')}
                  </div>
                )}

                {attemptedSave && hasErrors && (
                  <div style={{ marginTop: 9, borderRadius: 10, background: t.dangerBg, border: '1px solid #f1c2c2', padding: '8px 10px', fontSize: 11, color: t.danger, fontWeight: 600 }}>
                    Revise os campos destacados para salvar.
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

