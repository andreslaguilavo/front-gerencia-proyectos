'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Plus, Minus, Trash2, X, AlertCircle } from 'lucide-react'
import { crearPedido } from '@/app/services/orders'

export interface CartItem {
  id: number
  name: string
  price: number
  image: string
  description: string
  category: string
  stock: number
  rating: number
  reviews: number
  quantity: number
}

interface CartSidebarProps {
  isOpen: boolean
  cart: CartItem[]
  onClose: () => void
  onUpdateQuantity: (id: number, quantity: number) => void
  onRemoveItem: (id: number) => void
  onClearCart: () => void
}

export default function CartSidebar({
  isOpen,
  cart,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}: CartSidebarProps) {
  const router = useRouter()
  const [processingOrder, setProcessingOrder] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const handleCreateOrder = async () => {
    if (cart.length === 0) return

    // Verificar si hay usuario logueado
    const savedUser = localStorage.getItem('user')
    if (!savedUser) {
      setError('Debes iniciar sesión para realizar un pedido')
      setTimeout(() => {
        router.push('/login')
      }, 2000)
      return
    }

    const user = JSON.parse(savedUser)

    try {
      setProcessingOrder(true)
      setError(null)

      // Crear pedido usando el servicio del backend
      const nuevoPedido = await crearPedido({
        usuario_id: user.id || null,
        items: cart.map((item) => ({
          producto_id: item.id,
          cantidad: item.quantity,
          precio_unitario: item.price
        }))
      })

      // Guardar pedido en localStorage para la vista de pedidos
      const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]')
      const pedidoFront = {
        id: nuevoPedido.id ?? 0,
        usuario_id: nuevoPedido.usuario_id,
        estado: nuevoPedido.estado,
        items: nuevoPedido.items.map((item) => {
          const producto = cart.find((c) => c.id === item.producto_id)
          return {
            producto_id: item.producto_id,
            producto_nombre: producto?.name || `Producto #${item.producto_id}`,
            cantidad: item.cantidad,
            precio_unitario: item.precio_unitario ?? 0,
            subtotal: (item.precio_unitario ?? 0) * item.cantidad
          }
        }),
        total: nuevoPedido.total,
        fecha: new Date().toISOString()
      }

      savedOrders.push(pedidoFront)
      localStorage.setItem('orders', JSON.stringify(savedOrders))

      // Limpiar carrito
      onClearCart()
      onClose()

      // Redirigir a página de pedidos
      router.push('/pedidos')
    } catch (err) {
      console.error('Error al crear pedido:', err)
      setError(
        err instanceof Error
          ? err.message
          : 'Error al procesar tu pedido. Por favor intenta de nuevo.'
      )
    } finally {
      setProcessingOrder(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div
        className='fixed inset-0 bg-black/50 z-40 backdrop-blur-sm'
        onClick={onClose}
      />
      <div className='fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col'>
        <div className='p-6 border-b flex justify-between items-center bg-gradient-to-r from-green-600 to-emerald-600 text-white'>
          <h2 className='text-2xl font-bold'>Tu Carrito</h2>
          <button
            onClick={onClose}
            className='hover:bg-white/20 p-2 rounded-full transition-colors'
          >
            <X className='w-6 h-6' />
          </button>
        </div>

        <div className='flex-1 overflow-y-auto p-6'>
          {cart.length === 0 ? (
            <div className='flex flex-col items-center justify-center h-full text-gray-500'>
              <ShoppingCart className='w-16 h-16 mb-4 opacity-50' />
              <p className='text-lg'>Tu carrito está vacío</p>
            </div>
          ) : (
            <div className='space-y-4'>
              {cart.map((item) => (
                <div
                  key={item.id}
                  className='flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors'
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className='w-20 h-20 object-cover rounded-lg'
                  />
                  <div className='flex-1'>
                    <h3 className='font-bold text-sm mb-1'>{item.name}</h3>
                    <p className='text-green-600 font-semibold'>
                      ${item.price.toFixed(2)}
                    </p>
                    <div className='flex items-center gap-2 mt-2'>
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={processingOrder}
                        className='w-7 h-7 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
                      >
                        <Minus className='w-4 h-4' />
                      </button>
                      <span className='font-semibold w-8 text-center'>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          onUpdateQuantity(item.id, item.quantity + 1)
                        }
                        disabled={processingOrder}
                        className='w-7 h-7 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
                      >
                        <Plus className='w-4 h-4' />
                      </button>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        disabled={processingOrder}
                        className='ml-auto p-2 text-red-600 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed'
                      >
                        <Trash2 className='w-4 h-4' />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className='border-t p-6 bg-gray-50'>
            {error && (
              <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2'>
                <AlertCircle className='w-5 h-5 text-red-600 flex-shrink-0 mt-0.5' />
                <p className='text-sm text-red-800'>{error}</p>
              </div>
            )}

            <div className='flex justify-between mb-4 text-lg'>
              <span className='font-semibold'>Total:</span>
              <span className='text-2xl font-bold text-green-600'>
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            <div className='text-sm text-gray-600 mb-4'>
              <p>
                {totalItems} {totalItems === 1 ? 'producto' : 'productos'} en
                total
              </p>
            </div>

            <Button
              onClick={onClearCart}
              variant='outline'
              disabled={processingOrder}
              className='w-full mb-2 text-red-600 border-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Vaciar Carrito
            </Button>

            <Button
              onClick={handleCreateOrder}
              disabled={processingOrder}
              className='w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-12 text-lg disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {processingOrder ? (
                <div className='flex items-center gap-2'>
                  <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
                  Procesando...
                </div>
              ) : (
                'Proceder al Pago'
              )}
            </Button>

            <p className='text-xs text-gray-500 mt-3 text-center'>
              Al proceder, crearás un pedido con estado "Pendiente"
            </p>
          </div>
        )}
      </div>
    </>
  )
}
