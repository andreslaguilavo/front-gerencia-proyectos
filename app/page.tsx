'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Star } from 'lucide-react'
import Link from 'next/link'
import { listarProductos, Producto } from '@/app/services/products'
import { useCart } from '@/context/CartContext'

// Interfaz para el frontend
export interface ProductoFront {
  id: number
  name: string
  price: number
  image: string
  description: string
  category: string
  stock: number
  rating: number
  reviews: number
}

// Mapear productos del backend al formato del frontend
function mapProductoToFront(producto: Producto): ProductoFront {
  return {
    id: producto.id ?? 0,
    name: producto.nombre,
    price: producto.precio,
    description: producto.descripcion,
    stock: producto.cantidad,
    image: `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=500&fit=crop`,
    category: 'Alimentos',
    rating: 4.5,
    reviews: 0
  }
}

export default function Home() {
  const { addToCart } = useCart()
  const [products, setProducts] = useState<ProductoFront[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar productos del backend
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true)
        const productosBackend = await listarProductos()
        const productosMapeados = productosBackend
          .filter((p) => p.activo)
          .map(mapProductoToFront)
        setProducts(productosMapeados)
        setError(null)
      } catch (err) {
        console.error('Error al cargar productos:', err)
        setError('No se pudieron cargar los productos del servidor.')
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProductos()
  }, [])

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
      {/* Products Grid */}
      <main className='container mx-auto px-4 py-8'>
        <div className='mb-8'>
          <h2 className='text-4xl font-bold mb-2'>Productos Frescos</h2>
          <p className='text-gray-600'>Alimentos de la mejor calidad para ti</p>
          {error && (
            <div className='mt-4 p-4 bg-red-50 border border-red-200 rounded-lg'>
              <p className='text-red-800 text-sm'>{error}</p>
            </div>
          )}
        </div>

        {loading ? (
          <div className='flex items-center justify-center py-20'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-green-600'></div>
          </div>
        ) : products.length === 0 ? (
          <div className='text-center py-20'>
            <p className='text-xl text-gray-600'>
              No hay productos disponibles
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {products.map((product) => (
              <div
                key={product.id}
                className='group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1'
              >
                <Link href={`/product/${product.id}`}>
                  <div className='relative overflow-hidden aspect-square cursor-pointer'>
                    <img
                      src={product.image}
                      alt={product.name}
                      className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 ${
                        product.stock === 0 ? 'opacity-60 grayscale' : ''
                      }`}
                    />

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
                      <div className='absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse'>
                        ¡Pocas unidades!
                      </div>
                    )}
                  </div>
                </Link>

                <div className='p-4'>
                  <Link href={`/product/${product.id}`}>
                    <h3 className='font-bold text-lg mb-1 cursor-pointer hover:text-green-600'>
                      {product.name}
                    </h3>
                  </Link>
                  <p className='text-gray-600 text-sm mb-2 line-clamp-2'>
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
                    </div>
                  ) : (
                    <div className='flex items-center justify-between'>
                      <span className='text-2xl font-bold text-green-600'>
                        ${product.price.toFixed(2)}
                      </span>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          e.preventDefault()
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
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
