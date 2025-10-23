'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Mail, Lock, Eye, EyeOff, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isLogin) {
      // Login logic
      if (formData.email && formData.password) {
        localStorage.setItem(
          'user',
          JSON.stringify({
            name: formData.name || formData.email.split('@')[0],
            email: formData.email
          })
        )
        router.push('/')
      }
    } else {
      // Register logic
      if (
        formData.name &&
        formData.email &&
        formData.password === formData.confirmPassword
      ) {
        localStorage.setItem(
          'user',
          JSON.stringify({
            name: formData.name,
            email: formData.email
          })
        )
        router.push('/')
      }
    }
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
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all ${
                  isLogin
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all ${
                  !isLogin
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Registrarse
              </button>
            </div>

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
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
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
                    />
                  </div>
                </div>
              )}

              {/* Forgot Password (Login only) */}
              {isLogin && (
                <div className='flex items-center justify-between text-sm'>
                  <label className='flex items-center'>
                    <input
                      type='checkbox'
                      className='w-4 h-4 text-green-600 rounded'
                    />
                    <span className='ml-2 text-gray-600'>Recordarme</span>
                  </label>
                  <a
                    href='#'
                    className='text-green-600 hover:text-green-700 font-semibold'
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type='submit'
                className='w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all'
              >
                {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </Button>
            </form>

            {/* Social Login */}
            {/* <div className='mt-6'>
              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-gray-200' />
                </div>
                <div className='relative flex justify-center text-sm'>
                  <span className='px-4 bg-white text-gray-500'>
                    O continuar con
                  </span>
                </div>
              </div>

              <div className='mt-6 grid grid-cols-2 gap-4'>
                <Button
                  type='button'
                  variant='outline'
                  className='h-11 border-2 hover:bg-gray-50'
                >
                  <svg className='w-5 h-5 mr-2' viewBox='0 0 24 24'>
                    <path
                      fill='currentColor'
                      d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                    />
                    <path
                      fill='currentColor'
                      d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                    />
                    <path
                      fill='currentColor'
                      d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                    />
                    <path
                      fill='currentColor'
                      d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                    />
                  </svg>
                  Google
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  className='h-11 border-2 hover:bg-gray-50'
                >
                  <svg
                    className='w-5 h-5 mr-2'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
                  </svg>
                  Facebook
                </Button>
              </div>
            </div> */}
          </div>
        </div>

        {/* Footer */}
        <p className='text-center text-sm text-gray-600 mt-6'>
          Al continuar, aceptas nuestros{' '}
          <a href='#' className='text-green-600 hover:underline font-semibold'>
            Términos de Servicio
          </a>{' '}
          y{' '}
          <a href='#' className='text-green-600 hover:underline font-semibold'>
            Política de Privacidad
          </a>
        </p>
      </div>
    </div>
  )
}
