'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Package, Users, ShoppingBag, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import ProductsManagement from './components/ProductsManagement'
// import OrdersManagement from './components/OrdersManagement'
import UsersManagement from './components/UsersManagement'

type TabType = 'products' | 'orders' | 'users'

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('products')
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{
    id?: number
    name: string
    email: string
    rol?: string
  } | null>(null)

  useEffect(() => {
    // Verificar si hay usuario logueado y si es admin
    const savedUser = localStorage.getItem('user')

    if (!savedUser) {
      // No hay usuario, redirigir al login
      router.push('/login')
      return
    }

    const userData = JSON.parse(savedUser)

    if (userData.rol !== 'admin') {
      // No es admin, redirigir al inicio
      router.push('/')
      return
    }

    setUser(userData)
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Verificando permisos...</p>
        </div>
      </div>
    )
  }

  const tabs = [
    {
      id: 'products' as TabType,
      label: 'Productos',
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    // {
    //   id: 'orders' as TabType,
    //   label: 'Pedidos',
    //   icon: ShoppingBag,
    //   color: 'text-blue-600',
    //   bgColor: 'bg-blue-50'
    // },
    {
      id: 'users' as TabType,
      label: 'Administradores',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ]

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
      {/* Header */}
      <header className='bg-white shadow-sm sticky top-0 z-50'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <Link href='/'>
                <Button variant='ghost' className='hover:bg-gray-100'>
                  <ArrowLeft className='w-4 h-4 mr-2' />
                  Volver a la tienda
                </Button>
              </Link>
              <div className='h-8 w-px bg-gray-300'></div>
              <div>
                <h1 className='text-2xl font-bold text-gray-800'>
                  Panel de Administración
                </h1>
                {user && (
                  <p className='text-sm text-gray-600'>Admin: {user.name}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className='bg-white border-b shadow-sm'>
        <div className='container mx-auto px-4'>
          <div className='flex gap-2 overflow-x-auto'>
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-semibold border-b-2 transition-all whitespace-nowrap ${
                    isActive
                      ? `${tab.color} border-current`
                      : 'text-gray-600 border-transparent hover:text-gray-900'
                  }`}
                >
                  <Icon className='w-5 h-5' />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className='container mx-auto px-4 py-8'>
        {activeTab === 'products' && <ProductsManagement />}
        {activeTab === 'orders' && <OrdersManagement />}
        {activeTab === 'users' && <UsersManagement />}
      </main>
    </div>
  )
}
