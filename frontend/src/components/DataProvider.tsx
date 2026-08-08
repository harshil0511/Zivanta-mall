'use client'
import { useEffect } from 'react'
import { getBrands, getCategories } from '@/lib/api'
import useStore from '@/store/useStore'

export default function DataProvider() {
  const { setBrands, setCategories, setLoading } = useStore()

  useEffect(() => {
    const controller = new AbortController()

    Promise.all([getBrands(), getCategories()])
      .then(([brands, categories]) => {
        if (controller.signal.aborted) return
        setBrands(brands)
        setCategories(categories)
      })
      .catch(() => {
        // Backend unavailable — UI uses static fallback data
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [setBrands, setCategories, setLoading])

  return null
}
