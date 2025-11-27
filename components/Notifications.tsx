'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Bell, X, Check, Trash2 } from 'lucide-react'
import {
  Notificacion,
  obtenerNotificacionesPorUsuario,
  marcarNotificacionLeida,
  eliminarNotificacion,
  nivelColors
} from '@/app/services/notifications'

interface NotificationsProps {
  userId: number | null
  userRole: string | null
  pollingInterval?: number // en milisegundos
}

export default function Notifications({
  userId,
  userRole,
  pollingInterval = 30000 // 30 segundos por defecto
}: NotificationsProps) {
  const [notifications, setNotifications] = useState<Notificacion[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Obtener notificaciones
  const fetchNotifications = async () => {
    if (!userId) return

    try {
      setLoading(true)
      const data = await obtenerNotificacionesPorUsuario(userId)
      setNotifications(data)
    } catch (error) {
      console.error('Error al cargar notificaciones:', error)
    } finally {
      setLoading(false)
    }
  }

  // Iniciar polling
  useEffect(() => {
    if (!userId || userRole !== 'admin') return

    // Cargar inmediatamente
    fetchNotifications()

    // Configurar polling
    intervalRef.current = setInterval(() => {
      fetchNotifications()
    }, pollingInterval)

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, userRole, pollingInterval])

  // Solo mostrar para administradores
  if (!userId || userRole !== 'admin') return null

  // Marcar como leída
  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await marcarNotificacionLeida(notificationId)
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, leida: true } : n))
      )
    } catch (error) {
      console.error('Error al marcar notificación:', error)
    }
  }

  // Eliminar notificación
  const handleDelete = async (notificationId: number) => {
    try {
      await eliminarNotificacion(notificationId)
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
    } catch (error) {
      console.error('Error al eliminar notificación:', error)
    }
  }

  // Marcar todas como leídas
  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter((n) => !n.leida)
    try {
      await Promise.all(
        unreadNotifications.map((n) => marcarNotificacionLeida(n.id!))
      )
      setNotifications((prev) => prev.map((n) => ({ ...n, leida: true })))
    } catch (error) {
      console.error('Error al marcar todas como leídas:', error)
    }
  }

  const unreadCount = notifications.filter((n) => !n.leida).length

  return (
    <div className='relative'>
      {/* Bell Icon */}
      <Button
        variant='ghost'
        size='icon'
        onClick={() => setIsOpen(!isOpen)}
        className='relative'
      >
        <Bell className='w-5 h-5' />
        {unreadCount > 0 && (
          <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse'>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {/* Notifications Dropdown */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className='fixed inset-0 z-40'
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Panel */}
          <div className='absolute right-0 top-12 w-96 bg-white rounded-lg shadow-2xl border z-50 max-h-[600px] flex flex-col'>
            {/* Header */}
            <div className='p-4 border-b flex items-center justify-between bg-linear-to-r from-green-50 to-emerald-50'>
              <div>
                <h3 className='font-bold text-lg'>Notificaciones</h3>
                <p className='text-sm text-gray-600'>
                  {unreadCount > 0 ? `${unreadCount} sin leer` : 'Todo al día'}
                </p>
              </div>
              <div className='flex items-center gap-2'>
                {unreadCount > 0 && (
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={handleMarkAllAsRead}
                    className='text-xs'
                  >
                    <Check className='w-4 h-4 mr-1' />
                    Marcar todas
                  </Button>
                )}
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => setIsOpen(false)}
                >
                  <X className='w-4 h-4' />
                </Button>
              </div>
            </div>

            {/* Notifications List */}
            <div className='flex-1 overflow-y-auto'>
              {loading && notifications.length === 0 ? (
                <div className='flex items-center justify-center py-12'>
                  <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-green-600'></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className='flex flex-col items-center justify-center py-12 text-gray-500'>
                  <Bell className='w-12 h-12 mb-4 opacity-50' />
                  <p>No tienes notificaciones</p>
                </div>
              ) : (
                <div className='divide-y'>
                  {notifications.map((notification) => {
                    const colors = nivelColors[notification.nivel]
                    return (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-gray-50 transition-colors ${
                          !notification.leida ? 'bg-blue-50/30' : ''
                        }`}
                      >
                        <div className='flex items-start gap-3'>
                          {/* Icon */}
                          <div
                            className={`${colors.bg} ${colors.text} p-2 rounded-lg text-xl shrink-0`}
                          >
                            {colors.icon}
                          </div>

                          {/* Content */}
                          <div className='flex-1 min-w-0'>
                            <div className='flex items-start justify-between gap-2'>
                              <div className='flex-1'>
                                <span
                                  className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${colors.bg} ${colors.text} mb-1`}
                                >
                                  {notification.tipo}
                                </span>
                                <p
                                  className={`text-sm ${
                                    !notification.leida
                                      ? 'font-semibold text-gray-900'
                                      : 'text-gray-700'
                                  }`}
                                >
                                  {notification.mensaje}
                                </p>
                                {notification.producto_id && (
                                  <p className='text-xs text-gray-500 mt-1'>
                                    Producto ID: {notification.producto_id}
                                  </p>
                                )}
                                {notification.created_at && (
                                  <p className='text-xs text-gray-400 mt-1'>
                                    {new Date(
                                      notification.created_at
                                    ).toLocaleString('es-ES', {
                                      day: '2-digit',
                                      month: 'short',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                )}
                              </div>

                              {/* Actions */}
                              <div className='flex items-center gap-1 shrink-0'>
                                {!notification.leida && (
                                  <Button
                                    variant='ghost'
                                    size='icon'
                                    onClick={() =>
                                      handleMarkAsRead(notification.id!)
                                    }
                                    className='h-7 w-7'
                                    title='Marcar como leída'
                                  >
                                    <Check className='w-4 h-4 text-green-600' />
                                  </Button>
                                )}
                                <Button
                                  variant='ghost'
                                  size='icon'
                                  onClick={() => handleDelete(notification.id!)}
                                  className='h-7 w-7'
                                  title='Eliminar'
                                >
                                  <Trash2 className='w-4 h-4 text-red-600' />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className='p-3 border-t bg-gray-50 text-center'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={fetchNotifications}
                  disabled={loading}
                  className='text-xs'
                >
                  {loading ? 'Actualizando...' : '🔄 Actualizar'}
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
