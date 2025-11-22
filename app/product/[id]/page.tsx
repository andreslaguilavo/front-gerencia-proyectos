'use client'

import { use, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  Plus,
  Star,
  Leaf,
  Clock,
  Truck,
  ShoppingCart,
  Heart,
  Share2
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { obtenerProducto, Producto } from '@/app/services/products'

interface ProductoFront {
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

interface CartItem extends ProductoFront {
  quantity: number
}

// Función para mapear Producto del backend a ProductoFront
function mapProductoToFront(producto: Producto): ProductoFront {
  return {
    id: producto.id ?? 0,
    name: producto.nombre,
    price: producto.precio,
    description: producto.descripcion,
    longDescription: producto.descripcion,
    stock: producto.cantidad,
    image: `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=800&fit=crop`,
    category: 'Alimentos',
    weight: '500g',
    origin: 'Local',
    rating: 4.5,
    reviews: 0,
    nutritionalInfo: {
      calories: 'N/A',
      protein: 'N/A',
      carbs: 'N/A',
      fat: 'N/A'
    }
  }
}

export default function ProductDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const resolvedParams = use(params)
  const productId = parseInt(resolvedParams.id)
  const [product, setProduct] = useState<ProductoFront | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        setLoading(true)
        const productoBackend = await obtenerProducto(productId)
        const productoMapeado = mapProductoToFront(productoBackend)
        setProduct(productoMapeado)
        setError(null)
      } catch (err) {
        console.error('Error al cargar producto:', err)
        setError('No se pudo cargar el producto')
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    if (!isNaN(productId)) {
      fetchProducto()

      // Check if product is in favorites
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
      setIsFavorite(favorites.includes(productId))
    } else {
      setError('ID de producto inválido')
      setLoading(false)
    }
  }, [productId])

  const addToCart = () => {
    if (!product) return

    const cart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItem = cart.find((item) => item.id === product.id)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.push({ ...product, quantity })
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    router.push('/')
  }

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    if (isFavorite) {
      const newFavorites = favorites.filter((id: number) => id !== product?.id)
      localStorage.setItem('favorites', JSON.stringify(newFavorites))
    } else {
      favorites.push(product?.id)
      localStorage.setItem('favorites', JSON.stringify(favorites))
    }
    setIsFavorite(!isFavorite)
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Cargando producto...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold mb-4 text-red-600'>
            {error || 'Producto no encontrado'}
          </h2>
          <Link href='/'>
            <Button className='bg-gradient-to-r from-green-600 to-emerald-600'>
              <ArrowLeft className='w-4 h-4 mr-2' />
              Volver a la tienda
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
      {/* Header */}

      {/* Product Detail */}
      <main className='container mx-auto px-4 py-8'>
        <Link href='/'>
          <Button variant='ghost' className='mb-6 hover:bg-gray-100'>
            <ArrowLeft className='w-4 h-4 mr-2' />
            Volver a productos
          </Button>
        </Link>

        <div className='bg-white rounded-2xl shadow-lg overflow-hidden'>
          <div className='grid lg:grid-cols-2 gap-8 p-8'>
            {/* Product Image */}
            <div className='space-y-4'>
              <div className='relative aspect-square rounded-xl overflow-hidden bg-gray-100'>
                <img
                  src={product.image}
                  alt={product.name}
                  className={`w-full h-full object-cover transition-all ${
                    product.stock === 0 ? 'grayscale opacity-40' : ''
                  }`}
                />

                {/* Overlay cuando no hay stock */}
                {product.stock === 0 && (
                  <div className='absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center'>
                    <div className='bg-white rounded-xl shadow-2xl p-6 text-center max-w-xs mx-4'>
                      <div className='text-6xl mb-3'>📦</div>
                      <h3 className='text-2xl font-bold text-gray-800 mb-2'>
                        Sin Stock
                      </h3>
                      <p className='text-gray-600'>Reabasteciendo...</p>
                    </div>
                  </div>
                )}

                <div className='absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold'>
                  {product.category}
                </div>
                {product.stock === 0 ? (
                  <div className='absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 animate-pulse'>
                    🔄 Reabasteciendo
                  </div>
                ) : product.stock < 20 ? (
                  <div className='absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold'>
                    ¡Pocas unidades!
                  </div>
                ) : null}
              </div>
            </div>

            {/* Product Info */}
            <div className='flex flex-col'>
              <h1 className='text-4xl font-bold mb-4'>{product.name}</h1>

              <div className='flex items-center gap-2 mb-4'>
                <div className='flex items-center gap-1'>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className='text-gray-600'>
                  {product.rating} ({product.reviews} reseñas)
                </span>
              </div>

              <div className='text-5xl font-bold text-green-600 mb-6'>
                ${product.price}
              </div>

              <p className='text-gray-700 text-lg mb-6 leading-relaxed'>
                {product.longDescription}
              </p>

              {/* Product Details */}
              <div className='grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg'>
                <div className='flex items-center gap-2'>
                  <Leaf className='w-5 h-5 text-green-600' />
                  <div>
                    <p className='text-xs text-gray-500'>Origen</p>
                    <p className='font-semibold'>{product.origin}</p>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <Clock className='w-5 h-5 text-green-600' />
                  <div>
                    <p className='text-xs text-gray-500'>Peso</p>
                    <p className='font-semibold'>{product.weight}</p>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <Truck className='w-5 h-5 text-green-600' />
                  <div>
                    <p className='text-xs text-gray-500'>Disponible</p>
                    <p className='font-semibold'>{product.stock} unidades</p>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <ShoppingCart className='w-5 h-5 text-green-600' />
                  <div>
                    <p className='text-xs text-gray-500'>Estado</p>
                    <p
                      className={`font-semibold ${
                        product.stock === 0 ? 'text-red-600' : 'text-green-600'
                      }`}
                    >
                      {product.stock === 0 ? 'Agotado' : 'En stock'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Nutritional Info */}
              {product.nutritionalInfo && (
                <div className='mb-6'>
                  <h3 className='font-bold text-lg mb-3'>
                    Información Nutricional
                  </h3>
                  <div className='grid grid-cols-2 gap-3'>
                    <div className='bg-green-50 p-3 rounded-lg'>
                      <p className='text-xs text-gray-600'>Calorías</p>
                      <p className='font-bold text-green-700'>
                        {product.nutritionalInfo.calories}
                      </p>
                    </div>
                    <div className='bg-green-50 p-3 rounded-lg'>
                      <p className='text-xs text-gray-600'>Proteínas</p>
                      <p className='font-bold text-green-700'>
                        {product.nutritionalInfo.protein}
                      </p>
                    </div>
                    <div className='bg-green-50 p-3 rounded-lg'>
                      <p className='text-xs text-gray-600'>Carbohidratos</p>
                      <p className='font-bold text-green-700'>
                        {product.nutritionalInfo.carbs}
                      </p>
                    </div>
                    <div className='bg-green-50 p-3 rounded-lg'>
                      <p className='text-xs text-gray-600'>Grasas</p>
                      <p className='font-bold text-green-700'>
                        {product.nutritionalInfo.fat}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              {product.stock > 0 && (
                <div className='mb-6'>
                  <label className='block text-sm font-semibold mb-2'>
                    Cantidad
                  </label>
                  <div className='flex items-center gap-3'>
                    <Button
                      variant='outline'
                      size='icon'
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className='h-12 w-12'
                    >
                      <Plus className='w-5 h-5 rotate-45' />
                    </Button>
                    <span className='text-2xl font-bold w-12 text-center'>
                      {quantity}
                    </span>
                    <Button
                      variant='outline'
                      size='icon'
                      onClick={() =>
                        setQuantity(Math.min(product.stock, quantity + 1))
                      }
                      className='h-12 w-12'
                    >
                      <Plus className='w-5 h-5' />
                    </Button>
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <Button
                onClick={addToCart}
                disabled={product.stock === 0}
                className={`w-full h-14 text-lg ${
                  product.stock === 0
                    ? 'bg-gray-400 cursor-not-allowed hover:bg-gray-400'
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                }`}
              >
                <ShoppingCart className='w-5 h-5 mr-2' />
                {product.stock === 0
                  ? 'No Disponible'
                  : `Agregar al Carrito - $${product.price * quantity}`}
              </Button>

              {/* Mensaje de reabastecimiento */}
              {product.stock === 0 && (
                <div className='mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg'>
                  <div className='flex items-start gap-3'>
                    <div className='text-2xl'>⏳</div>
                    <div>
                      <h4 className='font-semibold text-orange-800 mb-1'>
                        Producto en Reabastecimiento
                      </h4>
                      <p className='text-sm text-orange-700'>
                        Estamos trabajando para tener este producto disponible
                        pronto. Te notificaremos cuando esté de vuelta en stock.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
