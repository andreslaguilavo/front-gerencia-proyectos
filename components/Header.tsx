'use client'

import { Button } from '@/components/ui/button'
import { ShoppingCart, User, LogOut, Package } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface HeaderProps {
  user: { name: string; email: string } | null
  totalItems: number
  onCartClick: () => void
  onLogout: () => void
}

export default function Header({
  user,
  totalItems,
  onCartClick,
  onLogout
}: HeaderProps) {
  const pathname = usePathname()

  return (
    <header className='sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b shadow-sm'>
      <div className='container mx-auto px-4 py-4'>
        <div className='flex items-center justify-between'>
          <Link href='/' className='flex items-center space-x-2'>
            <div className='w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center'>
              <span className='text-white font-bold text-xl'>S</span>
            </div>
            <h1 className='text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent'>
              SmartStock
            </h1>
          </Link>

          {/* Navigation Links - Solo visible si hay usuario */}
          {user && (
            <nav className='hidden md:flex items-center gap-2'>
              <Link href='/'>
                <Button
                  variant='ghost'
                  className={`${
                    pathname === '/'
                      ? 'bg-green-50 text-green-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Tienda
                </Button>
              </Link>
              <Link href='/pedidos'>
                <Button
                  variant='ghost'
                  className={`${
                    pathname === '/pedidos'
                      ? 'bg-green-50 text-green-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Package className='w-4 h-4 mr-2' />
                  Mis Pedidos
                </Button>
              </Link>
            </nav>
          )}

          <div className='flex items-center gap-3'>
            {user ? (
              <div className='flex items-center gap-3'>
                {/* Dropdown móvil para navegación */}
                <div className='md:hidden'>
                  <Link href='/pedidos'>
                    <Button
                      variant='ghost'
                      size='sm'
                      className={`${
                        pathname === '/pedidos'
                          ? 'bg-green-50 text-green-700'
                          : 'text-gray-600'
                      }`}
                    >
                      <Package className='w-4 h-4' />
                    </Button>
                  </Link>
                </div>

                <div className='hidden sm:flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg'>
                  <User className='w-4 h-4 text-green-600' />
                  <span className='text-sm font-semibold text-green-700'>
                    {user.name}
                  </span>
                </div>
                <Button
                  onClick={onLogout}
                  variant='ghost'
                  size='sm'
                  className='text-red-600 hover:bg-red-50'
                >
                  <LogOut className='w-4 h-4 sm:mr-2' />
                  <span className='hidden sm:inline'>Salir</span>
                </Button>
              </div>
            ) : (
              <Link href='/login'>
                <Button
                  variant='ghost'
                  className='text-green-600 hover:bg-green-50'
                >
                  <User className='w-4 h-4 mr-2' />
                  Iniciar Sesión
                </Button>
              </Link>
            )}

            <Button
              onClick={onCartClick}
              variant='outline'
              className='relative hover:scale-105 transition-transform'
            >
              <ShoppingCart className='w-5 h-5 sm:mr-2' />
              <span className='hidden sm:inline'>Carrito</span>
              {totalItems > 0 && (
                <span className='absolute -top-2 -right-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold'>
                  {totalItems}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
