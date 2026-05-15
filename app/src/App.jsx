import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Cadastro from './pages/Cadastro'
import Contratacao from './pages/Contratacao'
import DadosBancarios from './pages/DadosBancarios'
import NovoContrato from './pages/NovoContrato'
import Portabilidade from './pages/Portabilidade'
import Refinanciamento from './pages/Refinanciamento'
import Ofertas from './pages/Ofertas'
import RefinPort from './pages/RefinPort'
import DinheiroEconomia from './pages/DinheiroEconomia'
import Configuracoes from './pages/Configuracoes'
import AndamentoPropostas from './pages/AndamentoPropostas'
import Entrada from './pages/Entrada'
import UploadExtrato from './pages/UploadExtrato'
import CarregamentoOfertas from './pages/CarregamentoOfertas'
import CardsPreview from './pages/CardsPreview'
import Privacidade from './pages/Privacidade'
import Termos from './pages/Termos'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/entrada" replace />} />
        <Route path="/entrada" element={<Entrada />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/upload-extrato" element={<UploadExtrato />} />
        <Route path="/carregamento-ofertas" element={<CarregamentoOfertas />} />
        <Route path="/contratacao" element={<Contratacao />} />
        <Route path="/dados-bancarios" element={<DadosBancarios />} />
        <Route path="/novo-contrato" element={<NovoContrato />} />
        <Route path="/portabilidade" element={<Portabilidade />} />
        <Route path="/refinanciamento" element={<Refinanciamento />} />
        <Route path="/ofertas" element={<Ofertas />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        <Route path="/acompanhamento" element={<AndamentoPropostas />} />
        <Route path="/estrategia-combinada" element={<RefinPort />} />
        <Route path="/refinport" element={<RefinPort />} />
        <Route path="/refin-portabilidade" element={<RefinPort />} />
        <Route path="/refin-economia" element={<RefinPort />} />
        <Route path="/dinheiro-economia" element={<DinheiroEconomia />} />
        <Route path="/novo-economia" element={<DinheiroEconomia />} />
        <Route path="/preview" element={<CardsPreview />} />
        <Route path="/privacidade" element={<Privacidade />} />
        <Route path="/termos" element={<Termos />} />
      </Routes>
    </BrowserRouter>
  )
}
