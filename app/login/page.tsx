'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { loginUsuario, registrarUsuario } from '@/app/services/users'
import { useCart } from '@/context/CartContext'

export default function LoginPage() {
  const router = useRouter()
  const { setUser } = useCart() // Obtener setUser del contexto
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  // Verificar si ya hay usuario logueado
  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem('user')
      if (user) {
        // Si hay usuario logueado, redirigir al inicio
        router.push('/')
      } else {
        setCheckingAuth(false)
      }
    }

    checkAuth()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      if (isLogin) {
        // Validaciones de login
        if (!formData.email || !formData.password) {
          setError('Por favor completa todos los campos')
          return
        }

        if (!formData.email.includes('@')) {
          setError('Por favor ingresa un email válido')
          return
        }

        setLoading(true)

        const usuario = await loginUsuario(formData.email, formData.password)

        // Crear objeto de usuario
        const userData = {
          id: usuario.id,
          name: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol
        }

        // Guardar usuario en localStorage
        localStorage.setItem('user', JSON.stringify(userData))

        // Actualizar el contexto
        setUser(userData)

        // Redirigir a la página principal
        router.push('/')
      } else {
        // Validaciones de registro
        if (!formData.name || !formData.email || !formData.password) {
          setError('Por favor completa todos los campos')
          return
        }

        if (!formData.email.includes('@')) {
          setError('Por favor ingresa un email válido')
          return
        }

        if (formData.name.length < 3) {
          setError('El nombre debe tener al menos 3 caracteres')
          return
        }

        if (formData.password !== formData.confirmPassword) {
          setError('Las contraseñas no coinciden')
          return
        }

        if (formData.password !== 'password') {
          setError(
            'Por seguridad, usa la contraseña temporal del sistema: "password"'
          )
          return
        }

        setLoading(true)

        const usuario = await registrarUsuario(formData.name, formData.email)

        // Crear objeto de usuario
        const userData = {
          id: usuario.id,
          name: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol
        }

        // Guardar usuario en localStorage
        localStorage.setItem('user', JSON.stringify(userData))

        // Actualizar el contexto
        setUser(userData)

        // Redirigir a la página principal
        router.push('/')
      }
    } catch (err) {
      // Manejo de errores amigable
      let errorMessage = 'Ocurrió un error inesperado'

      if (err instanceof Error) {
        const message = err.message.toLowerCase()

        if (message.includes('contraseña incorrecta')) {
          errorMessage = '❌ Contraseña incorrecta'
        } else if (message.includes('usuario no encontrado')) {
          errorMessage = '👤 No encontramos una cuenta con este email'
        } else if (message.includes('usuario inactivo')) {
          errorMessage = '🚫 Tu cuenta está inactiva. Contacta al administrador'
        } else if (message.includes('email ya está registrado')) {
          errorMessage =
            '📧 Este email ya está registrado. Intenta iniciar sesión'
        } else if (message.includes('fetch') || message.includes('network')) {
          errorMessage =
            '🌐 Error de conexión. Verifica que el servidor esté activo'
        } else {
          errorMessage = err.message
        }
      }

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Mostrar pantalla de carga mientras verifica autenticación
  if (checkingAuth) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4'>
            <span className='text-3xl font-bold text-green-600'>S</span>
          </div>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4'></div>
          <p className='text-gray-600 font-medium'>Verificando sesión...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4'>
      {/* Background Pattern */}
      <div className='absolute inset-0 opacity-10'>
        <div
          className='absolute inset-0'
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2316a34a' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      <div className='w-full max-w-md relative'>
        {/* Back Button */}
        <Link href='/'>
          <Button variant='ghost' className='mb-4 hover:bg-green-100'>
            <ArrowLeft className='w-4 h-4 mr-2' />
            Volver a SmartStock
          </Button>
        </Link>

        {/* Login/Register Card */}
        <div className='bg-white rounded-2xl shadow-2xl overflow-hidden'>
          {/* Header */}
          <div className='bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-white text-center'>
            <div className='w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4'>
              <span className='text-3xl font-bold'>S</span>
            </div>
            <h1 className='text-3xl font-bold mb-2'>SmartStock</h1>
            <p className='text-green-100'>
              {isLogin ? 'Bienvenido de vuelta' : 'Únete a nosotros'}
            </p>
          </div>

          {/* Form */}
          <div className='p-8'>
            {/* Toggle Tabs */}
            <div className='flex mb-8 bg-gray-100 rounded-lg p-1'>
              <button
                onClick={() => {
                  setIsLogin(true)
                  setError(null)
                  setFormData({
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                  })
                }}
                className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all ${
                  isLogin
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => {
                  setIsLogin(false)
                  setError(null)
                  setFormData({
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                  })
                }}
                className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all ${
                  !isLogin
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Registrarse
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-shake'>
                <AlertCircle className='w-5 h-5 text-red-600 flex-shrink-0 mt-0.5' />
                <div className='flex-1'>
                  <p className='text-sm text-red-800 font-medium'>{error}</p>
                  {error.includes('contraseña') && (
                    <div className='mt-2 p-2 bg-red-100 rounded border border-red-200'>
                      <p className='text-xs text-red-700'>
                        💡 <strong>Contraseña temporal del sistema:</strong>{' '}
                        <code className='bg-white px-2 py-1 rounded font-mono text-red-800'>
                          password
                        </code>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-5'>
              {/* Name Field (Register only) */}
              {!isLogin && (
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>
                    Nombre Completo
                  </label>
                  <div className='relative'>
                    <User className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                    <input
                      type='text'
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className='w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors'
                      placeholder='Juan Pérez'
                      required={!isLogin}
                      disabled={loading}
                      minLength={3}
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Correo Electrónico
                </label>
                <div className='relative'>
                  <Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                  <input
                    type='email'
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className='w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors'
                    placeholder='tu@email.com'
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Contraseña
                </label>
                <div className='relative'>
                  <Lock className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className='w-full pl-11 pr-11 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors'
                    placeholder='••••••••'
                    required
                    disabled={loading}
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className='w-5 h-5' />
                    ) : (
                      <Eye className='w-5 h-5' />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password (Register only) */}
              {!isLogin && (
                <div>
                  <label className='block text-sm font-semibold text-gray-700 mb-2'>
                    Confirmar Contraseña
                  </label>
                  <div className='relative'>
                    <Lock className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value
                        })
                      }
                      className='w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors'
                      placeholder='••••••••'
                      required={!isLogin}
                      disabled={loading}
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type='submit'
                disabled={loading}
                className='w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {loading ? (
                  <div className='flex items-center gap-2'>
                    <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
                    {isLogin ? 'Iniciando sesión...' : 'Creando cuenta...'}
                  </div>
                ) : (
                  <>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
