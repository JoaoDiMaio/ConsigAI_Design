import { useNavigate } from 'react-router-dom'
import { useState, useRef } from 'react'
import OnboardingBrandHeader from '../components/onboarding/OnboardingBrandHeader'
import { FontSizeToggleFloating } from '../components/FontSizeToggle'

const ACCEPT = '.pdf,.jpg,.jpeg,.png,.webp'
const MAX_MB = 10

function formatSize(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function FileIcon({ type }) {
  const isPdf = type === 'application/pdf'
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="8" fill={isPdf ? '#FFF1F0' : '#F0F7FF'} />
      <text x="50%" y="58%" dominantBaseline="middle" textAnchor="middle" fontSize="13" fontWeight="900" fill={isPdf ? '#E53E3E' : '#055ECE'}>
        {isPdf ? 'PDF' : 'IMG'}
      </text>
    </svg>
  )
}

export default function UploadExtrato() {
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const [files, setFiles] = useState([])
  const [dragOver, setDragOver] = useState(false)
  const [errors, setErrors] = useState([])
  const [submitted, setSubmitted] = useState(false)

  function processFiles(incoming) {
    const newErrors = []
    const newFiles = []
    Array.from(incoming).forEach(f => {
      const ext = f.name.split('.').pop().toLowerCase()
      const allowed = ['pdf', 'jpg', 'jpeg', 'png', 'webp']
      if (!allowed.includes(ext)) {
        newErrors.push(`${f.name}: formato não suportado`)
        return
      }
      if (f.size > MAX_MB * 1024 * 1024) {
        newErrors.push(`${f.name}: arquivo maior que ${MAX_MB} MB`)
        return
      }
      newFiles.push(f)
    })
    setErrors(newErrors)
    setFiles(prev => {
      const names = new Set(prev.map(f => f.name))
      return [...prev, ...newFiles.filter(f => !names.has(f.name))]
    })
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    processFiles(e.dataTransfer.files)
  }

  function handleRemove(name) {
    setFiles(prev => prev.filter(f => f.name !== name))
  }

  function handleSubmit() {
    setSubmitted(true)
    if (files.length === 0) return
    navigate('/ofertas')
  }

  return (
    <>
      <style>{`
        :root {
          --blue-dark: #002D6E;
          --blue-main: #043B8B;
          --logo-blue: #2454D6;
          --cyan: #1DA1EB;
          --green: #00A86B;
          --muted: #64748B;
          --line: #DDE8F6;
          --shadow: 0 24px 68px rgba(3, 36, 111, 0.12);
        }

        .register-page * { box-sizing: border-box; margin: 0; padding: 0; }

        .register-page {
          min-height: 100dvh;
          display: grid;
          place-items: center;
          padding: 24px 20px;
          font-family: Inter, Arial, sans-serif;
          color: var(--blue-dark);
          background: transparent;
        }

        .register-page button, .register-page input { font-family: inherit; }
        .register-page button { cursor: pointer; -webkit-tap-highlight-color: transparent; }

        .register-shell {
          width: min(1040px, 100%);
          height: 800px;
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          border-radius: 34px;
          background: rgba(255,255,255,0.98);
          border: 1px solid var(--line);
          box-shadow: var(--shadow);
          overflow: hidden;
          position: relative;
          isolation: isolate;
        }

        .register-shell::before {
          content: "";
          position: absolute;
          inset: 0 0 auto 0;
          height: 5px;
          background: linear-gradient(90deg, var(--blue-main), var(--logo-blue), var(--green));
          z-index: 3;
        }

        .side-panel {
          position: relative;
          padding: 38px;
          color: white;
          background:
            radial-gradient(circle at 78% 14%, rgba(0,231,255,0.18), transparent 32%),
            radial-gradient(circle at 12% 90%, rgba(0,122,82,0.16), transparent 28%),
            linear-gradient(145deg, #06184E 0%, #03246F 58%, #055ECE 100%);
          overflow: hidden;
        }

        .side-panel::before {
          content: "";
          position: absolute;
          width: 360px; height: 360px;
          left: -110px; top: -110px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,231,255,0.18), transparent 66%);
        }

        .side-content {
          position: relative;
          z-index: 1;
          height: 100%;
          display: grid;
          align-content: space-between;
          gap: 32px;
        }

        .side-kicker {
          display: inline-flex;
          width: fit-content;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.18);
          color: #DDE8F6;
          font-size: 11px;
          font-weight: 950;
          text-transform: uppercase;
          letter-spacing: 0.09em;
        }

        .side-kicker::before {
          content: "";
          width: 7px; height: 7px;
          border-radius: 50%;
          background: var(--cyan);
          box-shadow: 0 0 12px rgba(0,231,255,0.85);
        }

        .side-title {
          margin-top: 24px;
          color: white;
          font-size: clamp(36px, 4vw, 56px);
          line-height: 1.08;
          font-weight: 950;
          letter-spacing: -0.075em;
          max-width: 470px;
        }

        .side-title span { color: #A9FFD8; }

        .side-copy {
          max-width: 440px;
          margin-top: 16px;
          color: rgba(255,255,255,0.78);
          font-size: 15px;
          line-height: 1.5;
          font-weight: 650;
        }

        .info-cards {
          display: grid;
          gap: 10px;
          max-width: 440px;
        }

        .info-card {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px 16px;
          border-radius: 14px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.14);
          backdrop-filter: blur(8px);
        }

        .info-card-icon {
          width: 36px; height: 36px;
          flex: 0 0 auto;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: rgba(255,255,255,0.12);
          font-size: 17px;
        }

        .info-card strong {
          display: block;
          color: white;
          font-size: 12px;
          font-weight: 900;
          line-height: 1.2;
        }

        .info-card span {
          display: block;
          margin-top: 3px;
          color: rgba(255,255,255,0.65);
          font-size: 11px;
          font-weight: 650;
          line-height: 1.35;
        }

        .form-panel {
          padding: 42px;
          display: flex;
          flex-direction: column;
          background:
            radial-gradient(circle at 92% 8%, rgba(0,231,255,0.08), transparent 36%),
            white;
        }

        .form-box {
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          width: 100%;
          max-width: 390px;
          margin: 0 auto;
          overflow-y: auto;
        }

        .progress-bar-track {
          width: 72px;
          height: 6px;
          border-radius: 999px;
          background: #DDE8F6;
          margin-top: 12px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, var(--blue-main), var(--cyan));
        }

        .form-kicker {
          color: var(--blue-main);
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .form-title {
          color: var(--blue-dark);
          font-size: 34px;
          font-weight: 950;
          letter-spacing: -0.06em;
          letter-spacing: -0.05em;
          line-height: 1.1;
          margin-bottom: 6px;
        }

        .form-title span { color: var(--green); }

        .form-sub {
          color: var(--muted);
          font-size: 13px;
          font-weight: 650;
          line-height: 1.45;
          margin-bottom: 28px;
        }

        .dropzone {
          border: 2px dashed #BFD4F6;
          border-radius: 20px;
          background: #F8FBFF;
          padding: 32px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          text-align: center;
          cursor: pointer;
          transition: border-color 180ms, background 180ms, box-shadow 180ms;
          position: relative;
        }

        .dropzone.over {
          border-color: var(--logo-blue);
          background: #EEF5FF;
          box-shadow: 0 0 0 4px rgba(29,161,235,0.12);
        }

        .dropzone.has-error {
          border-color: #E53E3E;
          background: #FFF5F5;
        }

        .dropzone-icon {
          width: 52px; height: 52px;
          border-radius: 16px;
          background: linear-gradient(145deg, #EEF5FF, #D6E7FB);
          display: grid;
          place-items: center;
          font-size: 24px;
        }

        .dropzone-title {
          font-size: 14px;
          font-weight: 800;
          color: var(--blue-dark);
        }

        .dropzone-sub {
          font-size: 12px;
          font-weight: 650;
          color: var(--muted);
          line-height: 1.4;
        }

        .dropzone-btn {
          margin-top: 4px;
          padding: 8px 20px;
          border-radius: 12px;
          border: 1px solid #BFD4F6;
          background: white;
          color: var(--blue-main);
          font-size: 13px;
          font-weight: 900;
          font-family: inherit;
          cursor: pointer;
          transition: background 150ms, box-shadow 150ms;
        }

        .dropzone-btn:hover { background: #F0F7FF; }

        .file-list {
          display: grid;
          gap: 8px;
          margin-top: 16px;
        }

        .file-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 14px;
          background: #F8FBFF;
          border: 1px solid var(--line);
        }

        .file-info { flex: 1; min-width: 0; }

        .file-name {
          display: block;
          font-size: 13px;
          font-weight: 800;
          color: var(--blue-dark);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .file-size {
          display: block;
          font-size: 11px;
          font-weight: 650;
          color: var(--muted);
          margin-top: 2px;
        }

        .file-remove {
          flex: 0 0 auto;
          width: 28px; height: 28px;
          border-radius: 8px;
          border: none;
          background: #FFF1F0;
          color: #E53E3E;
          font-size: 16px;
          font-weight: 900;
          display: grid;
          place-items: center;
          cursor: pointer;
          line-height: 1;
          font-family: inherit;
          transition: background 150ms;
        }

        .file-remove:hover { background: #FFE0DE; }

        .upload-error {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: 8px;
          font-size: 12px;
          font-weight: 700;
          color: #E53E3E;
        }

        .upload-error::before {
          content: "!";
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 15px; height: 15px;
          border-radius: 50%;
          background: #E53E3E;
          color: white;
          font-size: 10px;
          font-weight: 900;
          flex: 0 0 auto;
        }

        .actions {
          display: grid;
          gap: 10px;
          margin-top: 28px;
        }

        .primary-cta {
          width: 100%;
          min-height: 56px;
          border: 0;
          border-radius: 18px;
          background: linear-gradient(145deg, var(--blue-main), var(--blue-dark));
          color: white;
          font-size: 15px;
          font-weight: 900;
          box-shadow: 0 16px 32px rgba(4, 59, 139, 0.22);
          font-family: inherit;
          transition: transform .18s ease, filter .18s ease;
        }

        .primary-cta:hover { transform: translateY(-1px); filter: saturate(1.05); }
        .primary-cta:active { transform: translateY(0) scale(.985); }

        .secondary-cta {
          width: 100%;
          min-height: 54px;
          border-radius: 18px;
          border: 1px solid #DDE8F6;
          background: transparent;
          color: var(--blue-main);
          font-size: 15px;
          font-weight: 900;
          font-family: inherit;
        }

        @media (max-width: 920px) {
          .register-shell {
            grid-template-columns: 1fr;
            height: auto;
          }

          .side-panel { order: 2; min-height: 220px; padding: 28px; }
          .form-panel { order: 1; padding: 30px 28px; }
          .side-title { font-size: clamp(24px, 6vw, 36px); }
        }

        @media (max-width: 560px) {
          .register-page { padding: 12px; }
          .register-shell { border-radius: 22px; }
          .side-panel, .form-panel { padding: 18px; }
        }
      `}</style>

      <FontSizeToggleFloating />
      <main className="register-page">
        <section className="register-shell" aria-label="Upload do extrato">
          <aside className="side-panel">
            <div className="side-content">
              <div>
                <div className="side-kicker">Envio seguro</div>
                <h1 className="side-title">Seu extrato é a chave para <span style={{ color: '#00E7FF' }}>Economizar</span></h1>
                <p className="side-copy">
                  Com seu contracheque ou histórico de consignado, a ConsigAI identifica contratos elegíveis e compara as melhores condições do mercado.
                </p>
              </div>

              <div className="info-cards">
                <div className="info-card">
                  <div className="info-card-icon">📄</div>
                  <div>
                    <strong>Contracheque ou holerite</strong>
                    <span>Documento que mostra sua margem disponível e descontos em folha.</span>
                  </div>
                </div>
                <div className="info-card">
                  <div className="info-card-icon">📋</div>
                  <div>
                    <strong>Extrato de consignado</strong>
                    <span>Histórico de empréstimos ativos emitido pelo INSS ou SIAPE.</span>
                  </div>
                </div>
                <div className="info-card">
                  <div className="info-card-icon">🔒</div>
                  <div>
                    <strong>Uso exclusivo para análise</strong>
                    <span>Seus documentos são usados apenas para localizar suas melhores ofertas.</span>
                  </div>
                </div>
                <div className="info-card" style={{ background: 'rgba(0, 231, 255, 0.1)', borderColor: 'rgba(0, 231, 255, 0.2)' }}>
                  <div className="info-card-icon">⚡</div>
                  <div>
                    <strong style={{ color: '#00E7FF' }}>O que acontece agora?</strong>
                    <span>Nossa IA vai ler seu extrato em segundos. Buscamos apenas os melhores contratos para você.</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <section className="form-panel">
            <OnboardingBrandHeader showStepBadge stepLabel="Etapa 2 de 2" stepProgress={100} />
            <div className="form-box">
              <div className="form-kicker">Documentos</div>
              <h2 className="form-title">Envie seu <span>extrato</span></h2>
              <p className="form-sub">
                Aceito: contracheque, holerite ou extrato de consignado. PDF ou imagem, até {MAX_MB} MB.
              </p>

              <div
                className={`dropzone${dragOver ? ' over' : ''}${submitted && files.length === 0 ? ' has-error' : ''}`}
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current.click()}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept={ACCEPT}
                  multiple
                  style={{ display: 'none' }}
                  onChange={e => { processFiles(e.target.files); e.target.value = '' }}
                />
                <div className="dropzone-icon">📁</div>
                <div className="dropzone-title">Arraste o arquivo aqui</div>
                <div className="dropzone-sub">PDF, JPG ou PNG · Até {MAX_MB} MB por arquivo</div>
                <button className="dropzone-btn" type="button" onClick={e => { e.stopPropagation(); inputRef.current.click() }}>
                  Selecionar arquivo
                </button>
              </div>

              {submitted && files.length === 0 && (
                <span className="upload-error">Envie ao menos um documento para continuar</span>
              )}

              {errors.map((err, i) => (
                <span key={i} className="upload-error">{err}</span>
              ))}

              {files.length > 0 && (
                <div className="file-list">
                  {files.map(f => (
                    <div key={f.name} className="file-row">
                      <FileIcon type={f.type} />
                      <div className="file-info">
                        <span className="file-name">{f.name}</span>
                        <span className="file-size">{formatSize(f.size)}</span>
                      </div>
                      <button className="file-remove" type="button" onClick={() => handleRemove(f.name)}>×</button>
                    </div>
                  ))}
                </div>
              )}

              <div className="actions">
                <button className="primary-cta" type="button" onClick={handleSubmit}>
                  Continuar
                </button>
                <button className="secondary-cta" type="button" onClick={() => navigate('/cadastro')}>
                  Voltar
                </button>
              </div>
            </div>
          </section>
        </section>
      </main>
    </>
  )
}
