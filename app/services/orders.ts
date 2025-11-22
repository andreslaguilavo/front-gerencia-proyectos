const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

if (!API_BASE_URL) {
  throw new Error('La variable de entorno NEXT_PUBLIC_API_URL no está definida')
}

// Interfaces basadas en el modelo Pedido del backend
export interface DetallePedido {
  producto_id: number
  cantidad: number
  precio_unitario: number | null
  pedido_id: number | null
}

export interface Pedido {
  id: number | null
  usuario_id: number | null
  estado: 'pendiente' | 'confirmado' | 'enviado' | 'cancelado'
  items: DetallePedido[]
  total: number
}

export interface CrearPedidoRequest {
  usuario_id?: number | null
  items: {
    producto_id: number
    cantidad: number
    precio_unitario?: number | null
  }[]
}

export interface CambiarEstadoRequest {
  estado: 'pendiente' | 'confirmado' | 'enviado' | 'cancelado'
}

// --- Servicios de Pedidos ---

/**
 * Crear un nuevo pedido
 * POST /pedidos/
 */
export async function crearPedido(pedido: CrearPedidoRequest): Promise<Pedido> {
  const response = await fetch(`${API_BASE_URL}/pedidos/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      usuario_id: pedido.usuario_id,
      estado: 'pendiente',
      items: pedido.items,
      total: 0
    })
  })

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: response.statusText }))
    throw new Error(
      `Error al crear pedido: ${error.detail || response.statusText}`
    )
  }

  return response.json()
}

/**
 * Obtener un pedido por ID
 * GET /pedidos/{pedido_id}
 */
export async function obtenerPedido(pedidoId: number): Promise<Pedido> {
  const response = await fetch(`${API_BASE_URL}/pedidos/${pedidoId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Pedido con id=${pedidoId} no encontrado`)
    }
    throw new Error(`Error al obtener pedido: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Cambiar el estado de un pedido
 * PATCH /pedidos/{pedido_id}/estado
 */
export async function cambiarEstadoPedido(
  pedidoId: number,
  estado: CambiarEstadoRequest['estado']
): Promise<Pedido> {
  const response = await fetch(`${API_BASE_URL}/pedidos/${pedidoId}/estado`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ estado })
  })

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Pedido con id=${pedidoId} no existe`)
    }
    const error = await response
      .json()
      .catch(() => ({ detail: response.statusText }))
    throw new Error(
      `Error al cambiar estado: ${error.detail || response.statusText}`
    )
  }

  return response.json()
}

// import { Pedido as PedidoBackend, DetallePedido } from '@/app/services/orders'

export interface PedidoFront {
  id: number
  usuario_id: number | null
  estado: 'pendiente' | 'confirmado' | 'enviado' | 'cancelado'
  items: DetallePedidoFront[]
  total: number
  fecha: string
}

export interface DetallePedidoFront {
  producto_id: number
  producto_nombre: string
  cantidad: number
  precio_unitario: number
  subtotal: number
}

// Helper para mapear pedido del backend al frontend
export function mapPedidoToFront(
  pedido: Pedido,
  productosMap?: Map<number, string>
): PedidoFront {
  return {
    id: pedido.id ?? 0,
    usuario_id: pedido.usuario_id,
    estado: pedido.estado,
    items: pedido.items.map((item) => ({
      producto_id: item.producto_id,
      producto_nombre:
        productosMap?.get(item.producto_id) || `Producto #${item.producto_id}`,
      cantidad: item.cantidad,
      precio_unitario: item.precio_unitario ?? 0,
      subtotal: (item.precio_unitario ?? 0) * item.cantidad
    })),
    total: pedido.total,
    fecha: new Date().toISOString() // El backend no devuelve fecha, usar fecha actual
  }
}

export const estadoColors: Record<
  PedidoFront['estado'],
  { bg: string; text: string; badge: string }
> = {
  pendiente: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-800',
    badge: 'bg-yellow-500'
  },
  confirmado: { bg: 'bg-blue-50', text: 'text-blue-800', badge: 'bg-blue-500' },
  enviado: { bg: 'bg-green-50', text: 'text-green-800', badge: 'bg-green-500' },
  cancelado: { bg: 'bg-red-50', text: 'text-red-800', badge: 'bg-red-500' }
}

export const estadoLabels: Record<PedidoFront['estado'], string> = {
  pendiente: '⏳ Pendiente',
  confirmado: '✅ Confirmado',
  enviado: '🚚 Enviado',
  cancelado: '❌ Cancelado'
}
