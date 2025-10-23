'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  X,
  Star,
  User,
  LogOut
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Tipos
interface Product {
  id: number
  name: string
  price: number
  image: string
  description: string
  category: string
  longDescription: string
  stock: number
  weight: string
  origin: string
  rating: number
  reviews: number
  nutritionalInfo?: {
    calories: string
    protein: string
    carbs: string
    fat: string
  }
}

interface CartItem extends Product {
  quantity: number
}

// Productos de ejemplo - Alimentos
const products: Product[] = [
  {
    id: 1,
    name: 'Aguacate Hass Premium',
    price: 4.99,
    image:
      'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=500&h=500&fit=crop',
    description: 'Aguacates frescos y cremosos',
    category: 'Frutas',
    longDescription:
      'Aguacates Hass de primera calidad, perfectamente maduros y listos para consumir. Cultivados de forma sostenible en las mejores tierras, estos aguacates ofrecen una textura cremosa y un sabor excepcional. Ideales para ensaladas, tostadas, guacamole o como acompañamiento saludable.',
    stock: 0,
    weight: '250g (unidad)',
    origin: 'Colombia',
    rating: 4.8,
    reviews: 124,
    nutritionalInfo: {
      calories: '160 kcal',
      protein: '2g',
      carbs: '9g',
      fat: '15g'
    }
  },
  {
    id: 2,
    name: 'Salmón Fresco Atlántico',
    price: 18.99,
    image:
      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&h=500&fit=crop',
    description: 'Filete de salmón de alta calidad',
    category: 'Pescados',
    longDescription:
      'Filete de salmón atlántico fresco, rico en omega-3 y proteínas de alta calidad. Pescado de manera sostenible y procesado el mismo día para garantizar máxima frescura. Perfecto para asar, hornear o preparar a la plancha.',
    stock: 25,
    weight: '400g',
    origin: 'Noruega',
    rating: 4.9,
    reviews: 89,
    nutritionalInfo: {
      calories: '206 kcal',
      protein: '22g',
      carbs: '0g',
      fat: '13g'
    }
  },
  {
    id: 3,
    name: 'Queso Mozzarella Fresco',
    price: 7.99,
    image:
      'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500&h=500&fit=crop',
    description: 'Mozzarella artesanal italiana',
    category: 'Lácteos',
    longDescription:
      'Mozzarella fresca elaborada de forma artesanal siguiendo recetas tradicionales italianas. Textura suave y cremosa, perfecta para ensaladas caprese, pizzas caseras o para disfrutar sola con un toque de aceite de oliva y albahaca fresca.',
    stock: 40,
    weight: '250g',
    origin: 'Italia',
    rating: 4.7,
    reviews: 156,
    nutritionalInfo: {
      calories: '280 kcal',
      protein: '18g',
      carbs: '3g',
      fat: '22g'
    }
  },
  {
    id: 4,
    name: 'Aceite de Oliva Virgen Extra',
    price: 12.99,
    image:
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&h=500&fit=crop',
    description: 'Aceite premium de primera extracción',
    category: 'Aceites',
    longDescription:
      'Aceite de oliva virgen extra de primera extracción en frío. Proveniente de olivares centenarios en Andalucía, este aceite premium ofrece un sabor afrutado y equilibrado. Ideal para aliñar ensaladas, marinar carnes o simplemente disfrutar con pan artesanal.',
    stock: 60,
    weight: '500ml',
    origin: 'España',
    rating: 4.9,
    reviews: 203,
    nutritionalInfo: {
      calories: '884 kcal',
      protein: '0g',
      carbs: '0g',
      fat: '100g'
    }
  },
  {
    id: 5,
    name: 'Tomates Cherry Orgánicos',
    price: 5.49,
    image:
      'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&h=500&fit=crop',
    description: 'Tomates dulces y jugosos',
    category: 'Verduras',
    longDescription:
      'Tomates cherry orgánicos cultivados sin pesticidas ni químicos. Pequeños, dulces y llenos de sabor, estos tomates son perfectos para ensaladas, pasta, aperitivos o simplemente para picar. Cosechados en su punto óptimo de maduración.',
    stock: 75,
    weight: '300g',
    origin: 'Local',
    rating: 4.6,
    reviews: 98,
    nutritionalInfo: {
      calories: '18 kcal',
      protein: '1g',
      carbs: '4g',
      fat: '0.2g'
    }
  },
  {
    id: 6,
    name: 'Pan Integral Artesanal',
    price: 4.49,
    image:
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&h=500&fit=crop',
    description: 'Pan recién horneado con granos',
    category: 'Panadería',
    longDescription:
      'Pan integral artesanal elaborado con harina de trigo integral, semillas de girasol, lino y sésamo. Horneado diariamente siguiendo métodos tradicionales. Alto en fibra y con un sabor robusto que complementa cualquier comida. Sin conservantes artificiales.',
    stock: 30,
    weight: '500g',
    origin: 'Local',
    rating: 4.8,
    reviews: 145,
    nutritionalInfo: {
      calories: '247 kcal',
      protein: '8g',
      carbs: '49g',
      fat: '3g'
    }
  },
  {
    id: 7,
    name: 'Miel de Abeja Pura',
    price: 9.99,
    image:
      'https://images.unsplash.com/photo-1587049352846-4a222e784l38?w=500&h=500&fit=crop',
    description: 'Miel natural sin procesar',
    category: 'Endulzantes',
    longDescription:
      'Miel de abeja 100% pura y natural, sin procesar ni pasteurizar. Recolectada de colmenas en zonas florales diversas, esta miel conserva todas sus propiedades naturales, enzimas y nutrientes. Perfecta para endulzar bebidas, postres o consumir directamente.',
    stock: 0,
    weight: '350g',
    origin: 'Colombia',
    rating: 4.9,
    reviews: 187,
    nutritionalInfo: {
      calories: '304 kcal',
      protein: '0.3g',
      carbs: '82g',
      fat: '0g'
    }
  },
  {
    id: 8,
    name: 'Quinoa Orgánica Tricolor',
    price: 8.99,
    image:
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&h=500&fit=crop',
    description: 'Superalimento proteico',
    category: 'Granos',
    longDescription:
      'Quinoa orgánica tricolor (blanca, roja y negra) cultivada en los Andes. Este superalimento es una excelente fuente de proteína completa, rica en aminoácidos esenciales, fibra y minerales. Perfecta como base para ensaladas, guarnición o plato principal vegetariano.',
    stock: 55,
    weight: '500g',
    origin: 'Perú',
    rating: 4.7,
    reviews: 112,
    nutritionalInfo: {
      calories: '368 kcal',
      protein: '14g',
      carbs: '64g',
      fat: '6g'
    }
  }
]

export default function Home() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [mounted, setMounted] = useState(false)

  // Cargar carrito y usuario del localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }

    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }

    setMounted(true)
  }, [])

  // Guardar carrito en localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('cart', JSON.stringify(cart))
    }
  }, [cart, mounted])

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prevCart, { ...product, quantity: 1 }]
    })
  }

  const updateQuantity = (id: number, change: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id))
  }

  const clearCart = () => {
    setCart([])
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
      {/* Header */}
      <header className='sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b shadow-sm'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <div className='w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center'>
                <span className='text-white font-bold text-xl'>S</span>
              </div>
              <h1 className='text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent'>
                SmartStock
              </h1>
            </div>

            <div className='flex items-center gap-3'>
              {user ? (
                <div className='flex items-center gap-3'>
                  <div className='hidden sm:flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg'>
                    <User className='w-4 h-4 text-green-600' />
                    <span className='text-sm font-semibold text-green-700'>
                      {user.name}
                    </span>
                  </div>
                  <Button
                    onClick={() => {
                      localStorage.removeItem('user')
                      setUser(null)
                    }}
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
                onClick={() => setIsCartOpen(true)}
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

      {/* Products Grid */}
      <main className='container mx-auto px-4 py-8'>
        <div className='mb-8'>
          <h2 className='text-4xl font-bold mb-2'>Productos Frescos</h2>
          <p className='text-gray-600'>Alimentos de la mejor calidad para ti</p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {products.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`}>
              <div
                className={`group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer ${
                  product.stock === 0 ? 'relative' : ''
                }`}
              >
                <div className='relative overflow-hidden aspect-square'>
                  <img
                    src={product.image}
                    alt={product.name}
                    className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 ${
                      product.stock === 0 ? 'opacity-60 grayscale' : ''
                    }`}
                  />

                  {/* Out of Stock Overlay */}
                  {product.stock === 0 && (
                    <div className='absolute inset-0 bg-black/40 flex items-center justify-center'>
                      <div className='bg-white/95 backdrop-blur-sm rounded-lg px-4 py-3 text-center'>
                        <p className='font-bold text-gray-900 text-sm'>
                          Sin Stock
                        </p>
                        <p className='text-xs text-gray-600 mt-1'>
                          Reabasteciendo...
                        </p>
                      </div>
                    </div>
                  )}

                  <div className='absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full'>
                    {product.category}
                  </div>
                  {product.stock > 0 && product.stock < 20 && (
                    <div className='absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full'>
                      ¡Pocas unidades!
                    </div>
                  )}
                  {product.stock === 0 && (
                    <div className='absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full animate-pulse'>
                      🔄 Reabasteciendo
                    </div>
                  )}
                </div>
                <div className='p-4'>
                  <h3 className='font-bold text-lg mb-1'>{product.name}</h3>
                  <p className='text-gray-600 text-sm mb-2'>
                    {product.description}
                  </p>
                  <div className='flex items-center gap-1 mb-3'>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className='text-xs text-gray-500 ml-1'>
                      ({product.reviews})
                    </span>
                  </div>

                  {product.stock === 0 ? (
                    <div className='space-y-2'>
                      <div className='flex items-center justify-between'>
                        <span className='text-2xl font-bold text-gray-400'>
                          ${product.price.toFixed(2)}
                        </span>
                        <span className='text-sm font-semibold text-orange-600 bg-orange-50 px-3 py-1 rounded-full'>
                          Agotado
                        </span>
                      </div>
                      <Button
                        disabled
                        className='w-full bg-gray-300 text-gray-500 cursor-not-allowed'
                      >
                        No Disponible
                      </Button>
                      <p className='text-xs text-center text-gray-500'>
                        Notificaremos cuando esté disponible
                      </p>
                    </div>
                  ) : (
                    <div className='flex items-center justify-between'>
                      <span className='text-2xl font-bold text-green-600'>
                        ${product.price.toFixed(2)}
                      </span>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          addToCart(product)
                        }}
                        className='bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                      >
                        <Plus className='w-4 h-4 mr-1' />
                        Agregar
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className='fixed inset-0 z-50'>
          <div
            className='absolute inset-0 bg-black/50 backdrop-blur-sm'
            onClick={() => setIsCartOpen(false)}
          />
          <div className='absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col'>
            {/* Cart Header */}
            <div className='p-6 border-b'>
              <div className='flex items-center justify-between'>
                <h2 className='text-2xl font-bold'>Tu Carrito</h2>
                <Button
                  onClick={() => setIsCartOpen(false)}
                  variant='ghost'
                  size='icon'
                  className='hover:bg-gray-100'
                >
                  <X className='w-5 h-5' />
                </Button>
              </div>
              {totalItems > 0 && (
                <p className='text-sm text-gray-600 mt-1'>
                  {totalItems} artículos
                </p>
              )}
            </div>

            {/* Cart Items */}
            <div className='flex-1 overflow-auto p-6'>
              {cart.length === 0 ? (
                <div className='flex flex-col items-center justify-center h-full text-gray-400'>
                  <ShoppingCart className='w-16 h-16 mb-4' />
                  <p className='text-lg font-medium'>Tu carrito está vacío</p>
                  <p className='text-sm'>Agrega productos para comenzar</p>
                </div>
              ) : (
                <div className='space-y-4'>
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className='flex gap-4 bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors'
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className='w-20 h-20 object-cover rounded-lg'
                      />
                      <div className='flex-1'>
                        <h3 className='font-semibold mb-1'>{item.name}</h3>
                        <p className='text-blue-600 font-bold mb-2'>
                          ${item.price.toFixed(2)}
                        </p>
                        <div className='flex items-center gap-2'>
                          <Button
                            onClick={() => updateQuantity(item.id, -1)}
                            variant='outline'
                            size='icon'
                            className='h-8 w-8'
                          >
                            <Minus className='w-3 h-3' />
                          </Button>
                          <span className='font-semibold w-8 text-center'>
                            {item.quantity}
                          </span>
                          <Button
                            onClick={() => updateQuantity(item.id, 1)}
                            variant='outline'
                            size='icon'
                            className='h-8 w-8'
                          >
                            <Plus className='w-3 h-3' />
                          </Button>
                          <Button
                            onClick={() => removeFromCart(item.id)}
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 ml-auto text-red-500 hover:text-red-700 hover:bg-red-50'
                          >
                            <Trash2 className='w-4 h-4' />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className='border-t p-6 space-y-4 bg-gray-50'>
                <div className='flex justify-between items-center text-lg'>
                  <span className='font-semibold'>Total:</span>
                  <span className='text-2xl font-bold text-green-600'>
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
                <Button className='w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-12 text-lg'>
                  Proceder al Pago
                </Button>
                <Button
                  onClick={clearCart}
                  variant='outline'
                  className='w-full hover:bg-red-50 hover:text-red-600 hover:border-red-300'
                >
                  Vaciar Carrito
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
