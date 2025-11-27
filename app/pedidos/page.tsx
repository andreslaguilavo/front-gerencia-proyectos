'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  ShoppingBag,
  RefreshCw
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  PedidoFront,
  estadoColors,
  estadoLabels,
  obtenerPedidosPorUsuario,
  Pedido
} from '@/app/services/orders'
import { obtenerProducto } from '@/app/services/products'

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<PedidoFront[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set())
  const [user, setUser] = useState<{
    id?: number
    name: string
    email: string
    rol?: string
  } | null>(null)

  useEffect(() => {
    loadOrders()
  }, [router])

  const loadOrders = async () => {
    try {
      setLoading(true)
      setError(null)

      // Verificar si hay usuario logueado
      const savedUser = localStorage.getItem('user')
      if (!savedUser) {
        router.push('/login')
        return
      }

      const userData = JSON.parse(savedUser)
      setUser(userData)

      // Si el usuario no tiene ID, no puede obtener pedidos
      if (!userData.id) {
        setOrders([])
        setLoading(false)
        return
      }

      // Obtener pedidos del backend
      const pedidosBackend = await obtenerPedidosPorUsuario(userData.id)

      // Mapear pedidos del backend al formato del frontend
      const pedidosMapeados: PedidoFront[] = await Promise.all(
        pedidosBackend.map(async (pedido) => {
          // Enriquecer items con nombres de productos
          const itemsEnriquecidos = await Promise.all(
            pedido.items.map(async (item) => {
              try {
                const producto = await obtenerProducto(item.producto_id)
                return {
                  producto_id: item.producto_id,
                  producto_nombre: producto.nombre,
                  cantidad: item.cantidad,
                  precio_unitario: item.precio_unitario ?? 0,
                  subtotal: item.subtotal ?? 0
                }
              } catch {
                // Si falla obtener el producto, usar nombre genérico
                return {
                  producto_id: item.producto_id,
                  producto_nombre: `Producto #${item.producto_id}`,
                  cantidad: item.cantidad,
                  precio_unitario: item.precio_unitario ?? 0,
                  subtotal: item.subtotal ?? 0
                }
              }
            })
          )

          return {
            id: pedido.id ?? 0,
            usuario_id: pedido.usuario_id,
            estado: pedido.estado,
            items: itemsEnriquecidos,
            total: pedido.total,
            fecha: new Date().toISOString() // El backend no retorna fecha aún
          }
        })
      )

      // Ordenar por ID descendente (más recientes primero)
      pedidosMapeados.sort((a, b) => b.id - a.id)

      setOrders(pedidosMapeados)
    } catch (err) {
      console.error('Error al cargar pedidos:', err)
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudieron cargar los pedidos.'
      )
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const toggleOrderExpansion = (orderId: number) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(orderId)) {
        newSet.delete(orderId)
      } else {
        newSet.add(orderId)
      }
      return newSet
    })
  }

  const getStatusIcon = (estado: PedidoFront['estado']) => {
    switch (estado) {
      case 'pendiente':
        return <Clock className='w-5 h-5' />
      case 'confirmado':
        return <CheckCircle className='w-5 h-5' />
      case 'enviado':
        return <Truck className='w-5 h-5' />
      case 'cancelado':
        return <XCircle className='w-5 h-5' />
    }
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Cargando tus pedidos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
      {/* Main Content */}
      <main className='container mx-auto px-4 py-8'>
        <div className='mb-8'>
          <Link href='/'>
            <Button variant='ghost' className='mb-4 hover:bg-gray-100'>
              <ArrowLeft className='w-4 h-4 mr-2' />
              Volver a la tienda
            </Button>
          </Link>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-4xl font-bold text-gray-800 mb-2'>
                Mis Pedidos
              </h1>
              {user && (
                <p className='text-gray-600'>
                  {user.name} • {user.email}
                </p>
              )}
            </div>
            <Button
              onClick={loadOrders}
              variant='outline'
              className='flex items-center gap-2'
            >
              <RefreshCw className='w-4 h-4' />
              Actualizar
            </Button>
          </div>
        </div>

        {error && (
          <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg'>
            <p className='text-red-800'>{error}</p>
          </div>
        )}

        {orders.length === 0 ? (
          <div className='bg-white rounded-2xl shadow-lg p-12 text-center'>
            <div className='mb-6'>
              <ShoppingBag className='w-24 h-24 mx-auto text-gray-300' />
            </div>
            <h2 className='text-3xl font-bold mb-4'>No tienes pedidos aún</h2>
            <p className='text-gray-600 mb-8 text-lg'>
              Explora nuestros productos frescos y haz tu primer pedido
            </p>
            <Link href='/'>
              <Button className='bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-lg px-8 py-3'>
                Ir a la tienda
              </Button>
            </Link>
          </div>
        ) : (
          <div className='space-y-4'>
            {orders.map((order) => {
              const isExpanded = expandedOrders.has(order.id)
              const colors = estadoColors[order.estado]

              return (
                <div
                  key={order.id}
                  className='bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow'
                >
                  {/* Order Header */}
                  <div
                    className='p-6 cursor-pointer hover:bg-gray-50 transition-colors'
                    onClick={() => toggleOrderExpansion(order.id)}
                  >
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-4'>
                        <div className={`p-3 rounded-lg ${colors.bg}`}>
                          <Package className={`w-6 h-6 ${colors.text}`} />
                        </div>
                        <div>
                          <h3 className='font-bold text-lg'>
                            Pedido #{order.id.toString().padStart(6, '0')}
                          </h3>
                          <p className='text-sm text-gray-600'>
                            {new Date(order.fecha).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>

                      <div className='flex items-center gap-6'>
                        <div className='text-right'>
                          <p className='text-sm text-gray-500 mb-1'>Total</p>
                          <p className='text-2xl font-bold text-green-600'>
                            ${order.total.toFixed(2)}
                          </p>
                        </div>

                        <div
                          className={`px-4 py-2 rounded-full ${colors.bg} ${colors.text} flex items-center gap-2 font-semibold`}
                        >
                          {getStatusIcon(order.estado)}
                          {estadoLabels[order.estado]}
                        </div>

                        <Button variant='ghost' size='icon'>
                          {isExpanded ? (
                            <ChevronUp className='w-5 h-5' />
                          ) : (
                            <ChevronDown className='w-5 h-5' />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Quick Summary */}
                    <div className='mt-4 flex items-center gap-4 text-sm text-gray-600'>
                      <span>{order.items.length} productos</span>
                      <span>•</span>
                      <span>
                        {order.items.reduce(
                          (sum, item) => sum + item.cantidad,
                          0
                        )}{' '}
                        unidades
                      </span>
                    </div>
                  </div>

                  {/* Order Details (Expandable) */}
                  {isExpanded && (
                    <div className='border-t bg-gray-50 p-6'>
                      <h4 className='font-bold mb-4 text-lg'>
                        Detalle del pedido
                      </h4>
                      <div className='space-y-3'>
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className='flex items-center justify-between bg-white p-4 rounded-lg'
                          >
                            <div className='flex items-center gap-4'>
                              <div className='w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center'>
                                <Package className='w-8 h-8 text-gray-400' />
                              </div>
                              <div>
                                <h5 className='font-semibold'>
                                  {item.producto_nombre}
                                </h5>
                                <p className='text-sm text-gray-600'>
                                  ${item.precio_unitario.toFixed(2)} ×{' '}
                                  {item.cantidad}
                                </p>
                              </div>
                            </div>
                            <div className='text-right'>
                              <p className='font-bold text-lg'>
                                ${item.subtotal.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Total */}
                      <div className='mt-6 pt-4 border-t'>
                        <div className='flex items-center justify-between text-xl font-bold'>
                          <span>Total</span>
                          <span className='text-green-600'>
                            ${order.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
