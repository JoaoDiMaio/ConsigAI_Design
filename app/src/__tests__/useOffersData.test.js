import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useOffersData } from '../hooks/useOffersData.js'

describe('useOffersData — modo mock (VITE_USE_MOCK_OFFERS ativo)', () => {
  it('começa loading (true ou false dependendo da velocidade do mock síncrono)', () => {
    const { result } = renderHook(() => useOffersData())
    expect(typeof result.current.loading).toBe('boolean')
  })

  it('resolve loading=false após mount', async () => {
    const { result } = renderHook(() => useOffersData())
    await waitFor(() => expect(result.current.loading).toBe(false))
  })

  it('retorna 3 ofertas ativas conforme o mock configurado', async () => {
    const { result } = renderHook(() => useOffersData())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.activeOffers).toHaveLength(3)
    const ids = result.current.activeOffers.map((o) => o.config.id)
    expect(ids).toEqual(['equilibrio', 'folga', 'turbo'])
  })

  it('cada oferta tem config e data', async () => {
    const { result } = renderHook(() => useOffersData())
    await waitFor(() => expect(result.current.loading).toBe(false))
    result.current.activeOffers.forEach((offer) => {
      expect(offer.config).toBeDefined()
      expect(offer.data).toBeDefined()
    })
  })

  it('expõe usuario com salarioBruto e parcelaAtual', async () => {
    const { result } = renderHook(() => useOffersData())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.usuario.salarioBruto).toBe(2200)
    expect(result.current.usuario.parcelaAtual).toBe(550)
  })

  it('expõe impacto com creditToday', async () => {
    const { result } = renderHook(() => useOffersData())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.impacto.creditToday).toBeGreaterThan(0)
  })

  it('error é null no modo mock', async () => {
    const { result } = renderHook(() => useOffersData())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBeNull()
  })

  it('reload é uma função', async () => {
    const { result } = renderHook(() => useOffersData())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(typeof result.current.reload).toBe('function')
  })
})

describe('useOffersData — contrato do hook no modo mock', () => {
  it('não chama fetch enquanto o mock estiver ativo', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    const { result } = renderHook(() => useOffersData())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(fetchSpy).not.toHaveBeenCalled()
    fetchSpy.mockRestore()
  })
})
