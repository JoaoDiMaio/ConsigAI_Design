import { useNavigate } from 'react-router-dom'
import { appFontFamily, onboardingAliasVarsCss } from '../ui/theme'

const SECTIONS = [
  {
    title: 'O que é a ConsigAI',
    body: 'A ConsigAI é uma plataforma digital de simulação e comparação de crédito consignado público. Atuamos como correspondente bancário, regulados pelo Banco Central do Brasil. Não somos uma instituição financeira e não concedemos crédito diretamente.',
  },
  {
    title: 'Simulação não é contratação',
    body: 'Todo resultado exibido na plataforma é uma simulação estimada, baseada nos dados fornecidos por você. Nenhuma contratação ocorre automaticamente. Você revisa todas as condições e confirma expressamente antes de qualquer operação ser iniciada.',
  },
  {
    title: 'Valores estimados',
    body: 'Parcelas, economias, taxas, prazos e valores de crédito exibidos são estimativas sujeitas à análise e aprovação das instituições financeiras parceiras. Os valores finais podem diferir das simulações.',
  },
  {
    title: 'Uso responsável da plataforma',
    body: 'Ao usar a ConsigAI, você declara que as informações fornecidas são verdadeiras e que está ciente de que se trata de uma simulação sem compromisso. Você pode desistir a qualquer momento antes de confirmar a contratação.',
  },
  {
    title: 'Portabilidade de crédito',
    body: 'A portabilidade de crédito consignado é um direito garantido pela Resolução CMN nº 4.292/2013. A ConsigAI facilita o processo, mas a efetivação depende da análise e aceite do banco receptor. Seu benefício (INSS ou SIAPE) não é afetado pela portabilidade.',
  },
  {
    title: 'Responsabilidade',
    body: 'A ConsigAI não se responsabiliza por decisões financeiras tomadas com base exclusiva nas simulações exibidas. Recomendamos avaliar sua capacidade de pagamento antes de contratar qualquer crédito.',
  },
  {
    title: 'Alterações nos termos',
    body: 'Podemos atualizar estes termos periodicamente. A versão atualizada estará sempre disponível nesta página. O uso continuado da plataforma após alterações constitui aceite dos novos termos.',
  },
  {
    title: 'Contato',
    body: 'Dúvidas sobre estes termos: contato@consigai.com.br',
  },
]

export default function Termos() {
  const navigate = useNavigate()
  return (
    <>
      <style>{`
        :root { ${onboardingAliasVarsCss} }
        .terms-page {
          min-height: 100dvh;
          font-family: ${appFontFamily};
          color: var(--blue-dark);
          background: transparent;
          padding: 40px 20px 64px;
        }
        .terms-inner {
          max-width: 720px;
          margin: 0 auto;
        }
        .terms-back {
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
        .terms-back:hover { box-shadow: 0 4px 12px rgba(4,59,139,.10); }
        .terms-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: 999px;
          background: var(--blue-soft);
          border: 1px solid var(--line);
          color: var(--blue-main);
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: .08em;
          margin-bottom: 14px;
        }
        .terms-title {
          font-size: clamp(24px, 4vw, 36px);
          font-weight: 950;
          letter-spacing: -.04em;
          line-height: 1.1;
          color: var(--blue-dark);
          margin-bottom: 8px;
        }
        .terms-updated {
          font-size: 12px;
          color: var(--muted);
          font-weight: 650;
          margin-bottom: 32px;
        }
        .terms-section {
          margin-bottom: 24px;
          padding: 20px 22px;
          border-radius: 18px;
          background: white;
          border: 1px solid var(--line);
        }
        .terms-section h2 {
          font-size: 15px;
          font-weight: 900;
          color: var(--blue-main);
          margin-bottom: 8px;
          letter-spacing: -.02em;
        }
        .terms-section p {
          font-size: 14px;
          line-height: 1.6;
          color: #334155;
          font-weight: 600;
        }
        .terms-footer {
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
      <main className="terms-page">
        <div className="terms-inner">
          <button className="terms-back" onClick={() => navigate(-1)}>← Voltar</button>
          <div className="terms-badge">Termos de Uso</div>
          <h1 className="terms-title">Termos de Uso</h1>
          <p className="terms-updated">Atualizados em maio de 2025 · Versão 1.0</p>
          {SECTIONS.map((s) => (
            <div key={s.title} className="terms-section">
              <h2>{s.title}</h2>
              <p>{s.body}</p>
            </div>
          ))}
          <div className="terms-footer">
            Correspondente bancário conforme Resolução CMN nº 3.954/2011.
            Crédito consignado regulado pela Lei nº 10.820/2003 e pelo Banco Central do Brasil.
          </div>
        </div>
      </main>
    </>
  )
}
