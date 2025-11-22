'use client'

import { Button } from '@/components/ui/button'
import { ShoppingCart, Plus, Minus, Trash2, X } from 'lucide-react'

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
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

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
                        className='w-7 h-7 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-100'
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
                        className='w-7 h-7 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-100'
                      >
                        <Plus className='w-4 h-4' />
                      </button>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className='ml-auto p-2 text-red-600 hover:bg-red-50 rounded'
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
            <div className='flex justify-between mb-4 text-lg'>
              <span className='font-semibold'>Total:</span>
              <span className='text-2xl font-bold text-green-600'>
                ${totalPrice.toFixed(2)}
              </span>
            </div>
            <Button
              onClick={onClearCart}
              variant='outline'
              className='w-full mb-2 text-red-600 border-red-600 hover:bg-red-50'
            >
              Vaciar Carrito
            </Button>
            <Button className='w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-12 text-lg'>
              Proceder al Pago
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
