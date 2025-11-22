const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

if (!API_BASE_URL) {
  throw new Error('La variable de entorno NEXT_PUBLIC_API_URL no está definida')
}

// Interfaces basadas en el modelo Producto del backend
export interface Producto {
  id: number | null
  nombre: string
  descripcion: string
  precio: number
  cantidad: number
  codigo: string | null
  activo: boolean
}

export interface AjustarStockRequest {
  delta: number
}

// --- Servicios CRUD de Productos ---

/**
 * Listar todos los productos
 * GET /productos/
 */
export async function listarProductos(): Promise<Producto[]> {
  const response = await fetch(`${API_BASE_URL}/productos/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error(`Error al listar productos: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Obtener un producto por ID
 * GET /productos/{producto_id}
 */
export async function obtenerProducto(productoId: number): Promise<Producto> {
  const response = await fetch(`${API_BASE_URL}/productos/${productoId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Producto con id=${productoId} no encontrado`)
    }
    throw new Error(`Error al obtener producto: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Crear un nuevo producto
 * POST /productos/
 */
export async function crearProducto(
  producto: Omit<Producto, 'id'>
): Promise<Producto> {
  const response = await fetch(`${API_BASE_URL}/productos/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...producto,
      id: null // El backend asigna el ID
    })
  })

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: response.statusText }))
    throw new Error(
      `Error al crear producto: ${error.detail || response.statusText}`
    )
  }

  return response.json()
}

/**
 * Actualizar completamente un producto
 * PUT /productos/{producto_id}
 */
export async function actualizarProducto(
  productoId: number,
  producto: Producto
): Promise<Producto> {
  const response = await fetch(`${API_BASE_URL}/productos/${productoId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...producto,
      id: productoId // Asegurar que el ID coincida
    })
  })

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Producto con id=${productoId} no existe`)
    }
    const error = await response
      .json()
      .catch(() => ({ detail: response.statusText }))
    throw new Error(
      `Error al actualizar producto: ${error.detail || response.statusText}`
    )
  }

  return response.json()
}

/**
 * Eliminar un producto
 * DELETE /productos/{producto_id}
 */
export async function eliminarProducto(productoId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/productos/${productoId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: response.statusText }))
    throw new Error(
      `Error al eliminar producto: ${error.detail || response.statusText}`
    )
  }

  // DELETE retorna 204 No Content, no hay body
}

/**
 * Ajustar el stock de un producto
 * POST /productos/{producto_id}/ajustar_stock
 */
export async function ajustarStockProducto(
  productoId: number,
  delta: number
): Promise<number> {
  const response = await fetch(
    `${API_BASE_URL}/productos/${productoId}/ajustar_stock`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ delta })
    }
  )

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Producto con id=${productoId} no existe`)
    }
    const error = await response
      .json()
      .catch(() => ({ detail: response.statusText }))
    throw new Error(
      `Error al ajustar stock: ${error.detail || response.statusText}`
    )
  }

  // Retorna el nuevo stock como número
  return response.json()
}
