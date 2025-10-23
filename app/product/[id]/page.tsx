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

export default function ProductDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const resolvedParams = use(params)
  const productId = resolvedParams.id
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    // Productos de ejemplo - Alimentos (same as main page)
    const products: Product[] = [
      {
        id: 1,
        name: 'Aguacate Hass Premium',
        price: 4.99,
        image:
          'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800&h=800&fit=crop',
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
          'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&h=800&fit=crop',
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
          'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=800&h=800&fit=crop',
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
          'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&h=800&fit=crop',
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
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&h=800&fit=crop',
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
          'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=800&fit=crop',
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
          'https://images.unsplash.com/photo-1587049352846-4a222e784l38?w=800&h=800&fit=crop',
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
          'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=800&fit=crop',
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

    const foundProduct = products.find((p) => p.id === parseInt(productId))
    setProduct(foundProduct || null)

    // Check if product is in favorites
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    setIsFavorite(favorites.includes(parseInt(productId)))
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

  if (!product) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold mb-4'>Producto no encontrado</h2>
          <Link href='/'>
            <Button className='bg-gradient-to-r from-green-600 to-emerald-600'>
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
          </div>
        </div>
      </header>

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

              {/* Action Buttons */}
              <div className='flex gap-3'>
                <Button
                  onClick={toggleFavorite}
                  variant='outline'
                  className={`flex-1 h-12 ${
                    isFavorite ? 'bg-red-50 border-red-300 text-red-600' : ''
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 mr-2 ${
                      isFavorite ? 'fill-red-600' : ''
                    }`}
                  />
                  {isFavorite ? 'En Favoritos' : 'Agregar a Favoritos'}
                </Button>
                <Button variant='outline' className='flex-1 h-12'>
                  <Share2 className='w-5 h-5 mr-2' />
                  Compartir
                </Button>
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
                ${product.price.toFixed(2)}
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
                  : `Agregar al Carrito - $${(product.price * quantity).toFixed(
                      2
                    )}`}
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

              {/* Shipping Info */}
              <div className='mt-6 p-4 bg-blue-50 rounded-lg'>
                <div className='flex items-start gap-3'>
                  <Truck className='w-5 h-5 text-blue-600 mt-1' />
                  <div>
                    <p className='font-semibold text-blue-900'>Envío gratis</p>
                    <p className='text-sm text-blue-700'>
                      En pedidos superiores a $50.00
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
