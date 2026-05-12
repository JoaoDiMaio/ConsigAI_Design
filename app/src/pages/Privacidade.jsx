import { useNavigate } from 'react-router-dom'
import { appFontFamily, onboardingAliasVarsCss } from '../ui/theme'

const SECTIONS = [
  {
    title: 'Quem somos',
    body: 'A ConsigAI é uma plataforma de comparação e simulação de crédito consignado público. Atuamos como correspondente bancário, conectando você às melhores condições do mercado. Não somos um banco.',
  },
  {
    title: 'Quais dados coletamos',
    body: 'Coletamos nome completo, CPF, data de nascimento, telefone, e-mail e documentos financeiros (contracheque, holerite ou extrato de consignado) fornecidos por você durante o cadastro e upload.',
  },
  {
    title: 'Por que coletamos seus dados',
    body: 'Seus dados são coletados exclusivamente para: (1) localizar seus contratos de consignado vigentes; (2) calcular sua margem disponível; (3) comparar condições entre bancos parceiros; (4) exibir simulações personalizadas de economia. Não fazemos consulta ao SPC/Serasa.',
  },
  {
    title: 'Com quem compartilhamos',
    body: 'Compartilhamos seus dados apenas com bancos e instituições financeiras parceiras, regulados pelo Banco Central do Brasil, e exclusivamente para fins de simulação e eventual contratação mediante sua confirmação expressa. Não vendemos dados a terceiros.',
  },
  {
    title: 'Por quanto tempo armazenamos',
    body: 'Seus dados são armazenados pelo período necessário para prestação do serviço e cumprimento de obrigações legais. Documentos enviados para análise são utilizados apenas durante o processamento.',
  },
  {
    title: 'Seus direitos (LGPD — Lei 13.709/2018)',
    body: 'Você tem direito a: confirmar a existência do tratamento; acessar seus dados; corrigir dados incompletos; solicitar exclusão dos dados; revogar o consentimento a qualquer momento. Para exercer seus direitos, entre em contato pelo e-mail privacidade@consigai.com.br.',
  },
  {
    title: 'Segurança',
    body: 'Utilizamos criptografia e boas práticas de segurança da informação para proteger seus dados. Nenhuma contratação ocorre sem sua confirmação expressa.',
  },
  {
    title: 'Contato',
    body: 'Dúvidas sobre esta política: privacidade@consigai.com.br',
  },
]

export default function Privacidade() {
  const navigate = useNavigate()
  return (
    <>
      <style>{`
        :root { ${onboardingAliasVarsCss} }
        .privacy-page {
          min-height: 100dvh;
          font-family: ${appFontFamily};
          color: var(--blue-dark);
          background: transparent;
          padding: 40px 20px 64px;
        }
        .privacy-inner {
          max-width: 720px;
          margin: 0 auto;
        }
        .privacy-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 28px;
          padding: 8px 14px;
          border-radius: 10px;
          border: 1px solid var(--line);
          background: white;
          color: var(--blue-main);
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          font-family: inherit;
          transition: box-shadow .15s ease;
        }
        .privacy-back:hover { box-shadow: 0 4px 12px rgba(4,59,139,.10); }
        .privacy-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: 999px;
          background: var(--green-soft);
          border: 1px solid var(--green-line);
          color: var(--green);
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: .08em;
          margin-bottom: 14px;
        }
        .privacy-title {
          font-size: clamp(24px, 4vw, 36px);
          font-weight: 950;
          letter-spacing: -.04em;
          line-height: 1.1;
          color: var(--blue-dark);
          margin-bottom: 8px;
        }
        .privacy-updated {
          font-size: 12px;
          color: var(--muted);
          font-weight: 650;
          margin-bottom: 32px;
        }
        .privacy-section {
          margin-bottom: 24px;
          padding: 20px 22px;
          border-radius: 18px;
          background: white;
          border: 1px solid var(--line);
        }
        .privacy-section h2 {
          font-size: 15px;
          font-weight: 900;
          color: var(--blue-main);
          margin-bottom: 8px;
          letter-spacing: -.02em;
        }
        .privacy-section p {
          font-size: 14px;
          line-height: 1.6;
          color: #334155;
          font-weight: 600;
        }
        .privacy-footer {
          margin-top: 32px;
          padding: 16px 20px;
          border-radius: 16px;
          background: var(--blue-soft);
          border: 1px solid var(--line);
          font-size: 12px;
          color: var(--muted);
          font-weight: 650;
          line-height: 1.5;
          text-align: center;
        }
      `}</style>
      <main className="privacy-page">
        <div className="privacy-inner">
          <button className="privacy-back" onClick={() => navigate(-1)}>← Voltar</button>
          <div className="privacy-badge">LGPD — Lei 13.709/2018</div>
          <h1 className="privacy-title">Política de Privacidade</h1>
          <p className="privacy-updated">Atualizada em maio de 2025 · Versão 1.0</p>
          {SECTIONS.map((s) => (
            <div key={s.title} className="privacy-section">
              <h2>{s.title}</h2>
              <p>{s.body}</p>
            </div>
          ))}
          <div className="privacy-footer">
            A ConsigAI atua como correspondente bancário conforme Resolução CMN nº 3.954/2011.
            Simulações são estimativas sujeitas a análise e aprovação de crédito.
          </div>
        </div>
      </main>
    </>
  )
}
