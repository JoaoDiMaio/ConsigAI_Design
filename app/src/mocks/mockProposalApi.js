import { financialSummary, proposals, statusMap, summaryCardDefs } from '../data/andamentoPropostasDataClean.js'

/**
 * Shape esperado da API de acompanhamento de propostas.
 *
 * {
 *   financialSummary: { ... },
 *   statusMap: { [status]: { label, bg, color, border } },
 *   summaryCardDefs: Array<{ title, status }>,
 *   proposals: Array<{
 *     id, product, openedAt, updatedAt, status,
 *     initialOffer, fulfilledOffer, note, progress
 *   }>
 * }
 */
export function createMockProposalApiResponse() {
  return {
    financialSummary: { ...financialSummary },
    statusMap: Object.fromEntries(
      Object.entries(statusMap).map(([key, value]) => [key, { ...value }]),
    ),
    summaryCardDefs: summaryCardDefs.map((item) => ({ ...item })),
    proposals: proposals.map((proposal) => ({
      ...proposal,
      initialOffer: { ...proposal.initialOffer },
      fulfilledOffer: { ...proposal.fulfilledOffer },
      progress: proposal.progress.map((step) => ({ ...step })),
    })),
  }
}

export const MOCK_PROPOSAL_API_RESPONSE = createMockProposalApiResponse()
