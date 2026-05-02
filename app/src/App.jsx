import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Cadastro from './pages/Cadastro'
import DadosBancarios from './pages/DadosBancarios'
import Contratacao from './pages/Contratacao'
import NovoContrato from './pages/NovoContrato'
import Portabilidade from './pages/Portabilidade'
import Refinanciamento from './pages/Refinanciamento'
import OfertasNova from './pages/OfertasNova'
import EstrategiaCombinada from './pages/EstrategiaCombinada'
import Configuracoes from './pages/Configuracoes'
import AndamentoPropostas from './pages/AndamentoPropostas'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/ofertas" replace />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/dados-bancarios" element={<DadosBancarios />} />
        <Route path="/contratacao" element={<Contratacao />} />
        <Route path="/novo-contrato" element={<NovoContrato />} />
        <Route path="/portabilidade" element={<Portabilidade />} />
        <Route path="/refinanciamento" element={<Refinanciamento />} />
        <Route path="/ofertas" element={<OfertasNova />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        <Route path="/acompanhamento" element={<AndamentoPropostas />} />
        <Route path="/estrategia-combinada" element={<EstrategiaCombinada />} />
        <Route path="/novo-economia" element={<EstrategiaCombinada variant="novo" />} />
        <Route path="/refin-portabilidade" element={<EstrategiaCombinada variant="refin" />} />
        <Route path="/refin-economia" element={<EstrategiaCombinada variant="refin" />} />
      </Routes>
    </BrowserRouter>
  )
}
