'use client'
import { useState } from 'react'
import useStore from '@/store/useStore'
import DataProvider from '@/components/DataProvider'
import SecureLogin from '@/components/SecureLogin'
import AdminDashboard from '@/components/AdminDashboard'

export default function AdminPage() {
  const [token, setToken]     = useState<string | null>(null)
  const { brands, setBrands } = useStore()

  const handleLogout = () => setToken(null)

  return (
    <>
      <DataProvider />
      {token ? (
        <AdminDashboard
          brands={brands}
          onBrandsChange={setBrands}
          token={token}
          onLogout={handleLogout}
        />
      ) : (
        <SecureLogin onSuccess={setToken} />
      )}
    </>
  )
}
