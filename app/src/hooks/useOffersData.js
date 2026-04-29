import { useState, useEffect, useCallback } from 'react'
import {
  OFFER_CARD_CONFIG,
  MOCK_DADOS,
  MAX_API_CARDS,
  FORCED_VISIBLE_OFFER_IDS,
} from '../data/offersMock.js'
import { normalizeApiOffers } from '../lib/offerUtils.js'

/**
 * Extrai usuario, impacto e lista de ofertas de um payload da API.
 * Fallback para MOCK_DADOS quando campo ausente (modo desenvolvimento).
 */
function normalizeApiResponse(payload) {
  const usuario = payload?.usuario ?? MOCK_DADOS.usuario
  const impacto = payload?.impacto ?? MOCK_DADOS.impacto
  const ofertasMap = new Map(
    (payload?.ofertas ?? MOCK_DADOS.ofertas).map((o) => [o.id, o]),
  )
  return { usuario, impacto, ofertasMap }
}

/**
 * Retorna dados de ofertas + dados financeiros do usuário.
 *
 * Mock ativo: FORCED_VISIBLE_OFFER_IDS não-vazio → usa MOCK_DADOS, não chama API.
 * Produção: zerar FORCED_VISIBLE_OFFER_IDS → chama GET /api/ofertas.
 *
 * Shape retornado:
 *   {
 *     activeOffers: Array<{ config, data, isRecommended }>,
 *     usuario: { salarioBruto, parcelaAtual },
 *     impacto: { pocketToday, pocketAfter, creditToday, creditAfter },
 *     loading: boolean,
 *     error: string | null,
 *     reload: () => void,
 *   }
 */
export function useOffersData() {
  const [state, setState] = useState({
    activeOffers: [],
    usuario: MOCK_DADOS.usuario,
    impacto: MOCK_DADOS.impacto,
    loading: true,
    error: null,
  })

  const buildActiveOffers = useCallback((normalizedList, ofertasMap) => {
    return normalizedList
      .map((item) => {
        const config = OFFER_CARD_CONFIG.find((c) => c.id === item.id)
        const data = ofertasMap.get(item.id)
        if (!config || !data) return null
        return { config, data, isRecommended: item.isRecommended }
      })
      .filter(Boolean)
      .slice(0, MAX_API_CARDS)
  }, [])

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    // TODO: remover este bloco quando /api/ofertas estiver pronto
    if (FORCED_VISIBLE_OFFER_IDS.length > 0) {
      const { usuario, impacto, ofertasMap } = normalizeApiResponse(null)
      const normalized = normalizeApiOffers(FORCED_VISIBLE_OFFER_IDS, MAX_API_CARDS)
      setState((prev) => ({
        ...prev,
        activeOffers: buildActiveOffers(normalized, ofertasMap),
        usuario,
        impacto,
        loading: false,
      }))
      return
    }

    try {
      const res = await fetch('/api/ofertas')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const payload = await res.json()
      const { usuario, impacto, ofertasMap } = normalizeApiResponse(payload)
      const normalized = normalizeApiOffers(payload, MAX_API_CARDS)
      setState((prev) => ({
        ...prev,
        activeOffers: buildActiveOffers(normalized, ofertasMap),
        usuario,
        impacto,
        loading: false,
      }))
    } catch (err) {
      setState((prev) => ({
        ...prev,
        activeOffers: [],
        loading: false,
        error: err.message ?? 'Erro ao carregar ofertas',
      }))
    }
  }, [buildActiveOffers])

  useEffect(() => {
    load()
  }, [load])

  return { ...state, reload: load }
}
