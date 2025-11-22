'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Package,
  Plus,
  Edit,
  Pause,
  Play,
  Search,
  DollarSign
} from 'lucide-react'
import {
  listarProductos,
  crearProducto,
  actualizarProducto,
  Producto
} from '@/app/services/products'

export default function ProductsManagement() {
  const [products, setProducts] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<Omit<Producto, 'id' | 'cantidad'>>({
    nombre: '',
    descripcion: '',
    precio: 0,
    codigo: '',
    activo: true
  })

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await listarProductos()
      setProducts(data)
    } catch (error) {
      console.error('Error al cargar productos:', error)
      alert('Error al cargar productos')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingProduct && editingProduct.id) {
        // Al editar, mantener la cantidad existente
        await actualizarProducto(editingProduct.id, {
          ...formData,
          id: editingProduct.id,
          cantidad: editingProduct.cantidad
        })
        alert('Producto actualizado exitosamente')
      } else {
        // Al crear, iniciar con cantidad 0
        await crearProducto({
          ...formData,
          cantidad: 0
        })
        alert('Producto creado exitosamente')
      }
      resetForm()
      loadProducts()
    } catch (error) {
      console.error('Error:', error)
      alert(
        error instanceof Error ? error.message : 'Error al guardar producto'
      )
    }
  }

  const handleEdit = (product: Producto) => {
    setEditingProduct(product)
    setFormData({
      nombre: product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
      codigo: product.codigo,
      activo: product.activo
    })
    setShowForm(true)
  }

  const handleToggleActive = async (product: Producto) => {
    if (!product.id) return

    const newStatus = !product.activo
    const action = newStatus ? 'activar' : 'pausar'

    if (!confirm(`¿Estás seguro de ${action} este producto?`)) return

    try {
      await actualizarProducto(product.id, {
        ...product,
        activo: newStatus
      })
      alert(`Producto ${newStatus ? 'activado' : 'pausado'} exitosamente`)
      loadProducts()
    } catch (error) {
      console.error('Error:', error)
      alert('Error al cambiar estado del producto')
    }
  }

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      precio: 0,
      codigo: '',
      activo: true
    })
    setEditingProduct(null)
    setShowForm(false)
  }

  const filteredProducts = products.filter((p) =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-green-600'></div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-3xl font-bold text-gray-800'>
            Gestión de Productos
          </h2>
          <p className='text-gray-600'>
            {products.length} productos registrados
          </p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className='bg-gradient-to-r from-green-600 to-emerald-600'
        >
          <Plus className='w-4 h-4 mr-2' />
          Nuevo Producto
        </Button>
      </div>

      {/* Search */}
      <div className='relative'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
        <input
          type='text'
          placeholder='Buscar productos...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none'
        />
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 h-screen'>
          <div className='bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
            <div className='p-6 border-b'>
              <h3 className='text-2xl font-bold'>
                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className='p-6 space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>
                    Nombre *
                  </label>
                  <input
                    type='text'
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    className='w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>
                    Código
                  </label>
                  <input
                    type='text'
                    value={formData.codigo || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, codigo: e.target.value })
                    }
                    className='w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none'
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Descripción *
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) =>
                    setFormData({ ...formData, descripcion: e.target.value })
                  }
                  className='w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none'
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Precio *
                </label>
                <div className='relative'>
                  <DollarSign className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                  <input
                    type='number'
                    step='0.01'
                    min='0'
                    value={formData.precio}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        precio: parseFloat(e.target.value)
                      })
                    }
                    className='w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none'
                    required
                  />
                </div>
              </div>

              <div className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  id='activo'
                  checked={formData.activo}
                  onChange={(e) =>
                    setFormData({ ...formData, activo: e.target.checked })
                  }
                  className='w-4 h-4 text-green-600 rounded'
                />
                <label
                  htmlFor='activo'
                  className='text-sm font-semibold text-gray-700'
                >
                  Producto activo
                </label>
              </div>

              <div className='flex gap-3 pt-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={resetForm}
                  className='flex-1'
                >
                  Cancelar
                </Button>
                <Button
                  type='submit'
                  className='flex-1 bg-gradient-to-r from-green-600 to-emerald-600'
                >
                  {editingProduct ? 'Actualizar' : 'Crear'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
      {filteredProducts.length === 0 ? (
        <div className='text-center py-12 bg-white rounded-xl'>
          <Package className='w-16 h-16 mx-auto text-gray-300 mb-4' />
          <p className='text-gray-600'>
            {searchTerm
              ? 'No se encontraron productos'
              : 'No hay productos registrados'}
          </p>
        </div>
      ) : (
        <div className='bg-white rounded-xl shadow-md overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50 border-b-2 border-gray-200'>
                <tr>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                    Código
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                    Producto
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                    Descripción
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                    Precio
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                    Stock
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                    Estado
                  </th>
                  <th className='px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className='hover:bg-gray-50 transition-colors'
                  >
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className='text-sm font-mono text-gray-600'>
                        {product.codigo || '-'}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className='text-sm font-semibold text-gray-800'>
                        {product.nombre}
                      </span>
                    </td>
                    <td className='px-6 py-4'>
                      <span className='text-sm text-gray-600 line-clamp-2'>
                        {product.descripcion}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className='text-sm font-bold text-green-600'>
                        ${product.precio.toFixed(2)}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className='text-sm font-semibold text-gray-800'>
                        {product.cantidad}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          product.activo
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {product.activo ? 'Activo' : 'Pausado'}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center justify-center gap-2'>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() => handleEdit(product)}
                          className='text-blue-600 hover:bg-blue-50'
                          title='Editar producto'
                        >
                          <Edit className='w-4 h-4' />
                        </Button>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() => handleToggleActive(product)}
                          className={
                            product.activo
                              ? 'text-orange-600 hover:bg-orange-50'
                              : 'text-green-600 hover:bg-green-50'
                          }
                          title={
                            product.activo
                              ? 'Pausar producto'
                              : 'Activar producto'
                          }
                        >
                          {product.activo ? (
                            <Pause className='w-4 h-4' />
                          ) : (
                            <Play className='w-4 h-4' />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
