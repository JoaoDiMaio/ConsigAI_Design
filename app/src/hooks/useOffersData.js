import { useState, useEffect, useCallback } from 'react'
import {
  OFFER_CARD_CONFIG,
  MOCK_DADOS,
  MAX_API_CARDS,
  FORCED_VISIBLE_OFFER_IDS,
} from '../data/offersMock.js'
import { normalizeApiOffers } from '../lib/offerUtils.js'

/**
 * Retorna dados de ofertas + dados do usuário.
 *
 * Enquanto FORCED_VISIBLE_OFFER_IDS não estiver vazio, usa mock local.
 * Quando vazio, chama GET /api/ofertas — trocar a URL quando o backend estiver pronto.
 *
 * Shape retornado:
 *   {
 *     activeOffers: Array<{ config, data, isRecommended }>,
 *     usuario: { salarioBruto, parcelaAtual },
 *     impacto: { creditToday, ... },
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

  const getCatalogEntry = useCallback((id) => {
    const config = OFFER_CARD_CONFIG.find((c) => c.id === id)
    const data = MOCK_DADOS.ofertas.find((o) => o.id === id)
    if (!config || !data) return null
    return { config, data }
  }, [])

  const buildActiveOffers = useCallback((normalizedList) => {
    return normalizedList
      .map((item) => {
        const entry = getCatalogEntry(item.id)
        if (!entry) return null
        return { ...entry, isRecommended: item.isRecommended }
      })
      .filter(Boolean)
      .slice(0, MAX_API_CARDS)
  }, [getCatalogEntry])

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    // TODO: remover este bloco quando /api/ofertas estiver pronto
    if (FORCED_VISIBLE_OFFER_IDS.length > 0) {
      const normalized = normalizeApiOffers(FORCED_VISIBLE_OFFER_IDS, MAX_API_CARDS)
      setState((prev) => ({
        ...prev,
        activeOffers: buildActiveOffers(normalized),
        loading: false,
      }))
      return
    }

    try {
      const res = await fetch('/api/ofertas')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const payload = await res.json()
      const normalized = normalizeApiOffers(payload, MAX_API_CARDS)
      setState((prev) => ({
        ...prev,
        activeOffers: buildActiveOffers(normalized),
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
