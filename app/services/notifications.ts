const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

if (!API_BASE_URL) {
  throw new Error('La variable de entorno NEXT_PUBLIC_API_URL no está definida')
}

// Interfaces basadas en el modelo Notificacion del backend
export interface Notificacion {
  id: number | null
  tipo: string
  mensaje: string
  producto_id: number | null
  destinatario_id: number | null
  leida: boolean
  nivel: 'info' | 'warning' | 'error' | 'critical'
  created_at?: string
}

export interface CrearNotificacionRequest {
  tipo: string
  mensaje: string
  producto_id?: number | null
  destinatario_id?: number | null
  nivel?: 'info' | 'warning' | 'error' | 'critical'
}

// Colores según el nivel de notificación
export const nivelColors: Record<
  Notificacion['nivel'],
  { bg: string; text: string; icon: string }
> = {
  info: { bg: 'bg-blue-50', text: 'text-blue-800', icon: '📘' },
  warning: { bg: 'bg-yellow-50', text: 'text-yellow-800', icon: '⚠️' },
  error: { bg: 'bg-red-50', text: 'text-red-800', icon: '❌' },
  critical: { bg: 'bg-purple-50', text: 'text-purple-800', icon: '🚨' }
}

// --- Servicios de Notificaciones ---

/**
 * Listar todas las notificaciones
 * GET /notificaciones/
 */
export async function listarNotificaciones(): Promise<Notificacion[]> {
  const response = await fetch(`${API_BASE_URL}/notificaciones/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error(`Error al listar notificaciones: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Obtener notificaciones de un usuario específico
 * GET /notificaciones/usuario/{usuario_id}
 */
export async function obtenerNotificacionesPorUsuario(
  usuarioId: number
): Promise<Notificacion[]> {
  const response = await fetch(
    `${API_BASE_URL}/notificaciones/usuario/${usuarioId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Usuario con id=${usuarioId} no encontrado`)
    }
    throw new Error(`Error al obtener notificaciones: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Obtener una notificación por ID
 * GET /notificaciones/{notificacion_id}
 */
export async function obtenerNotificacion(
  notificacionId: number
): Promise<Notificacion> {
  const response = await fetch(
    `${API_BASE_URL}/notificaciones/${notificacionId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Notificación con id=${notificacionId} no encontrada`)
    }
    throw new Error(`Error al obtener notificación: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Crear una nueva notificación
 * POST /notificaciones/
 */
export async function crearNotificacion(
  notificacion: CrearNotificacionRequest
): Promise<Notificacion> {
  const response = await fetch(`${API_BASE_URL}/notificaciones/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: null,
      tipo: notificacion.tipo,
      mensaje: notificacion.mensaje,
      producto_id: notificacion.producto_id ?? null,
      destinatario_id: notificacion.destinatario_id ?? null,
      leida: false,
      nivel: notificacion.nivel || 'info'
    })
  })

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: response.statusText }))
    throw new Error(
      `Error al crear notificación: ${error.detail || response.statusText}`
    )
  }

  return response.json()
}

/**
 * Marcar una notificación como leída
 * PATCH /notificaciones/{notificacion_id}/marcar-leida
 */
export async function marcarNotificacionLeida(
  notificacionId: number
): Promise<Notificacion> {
  const response = await fetch(
    `${API_BASE_URL}/notificaciones/${notificacionId}/marcar-leida`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Notificación con id=${notificacionId} no encontrada`)
    }
    throw new Error(`Error al marcar notificación: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Eliminar una notificación
 * DELETE /notificaciones/{notificacion_id}
 */
export async function eliminarNotificacion(
  notificacionId: number
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/notificaciones/${notificacionId}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: response.statusText }))
    throw new Error(
      `Error al eliminar notificación: ${error.detail || response.statusText}`
    )
  }
}
