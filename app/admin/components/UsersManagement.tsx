'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Users,
  Plus,
  Edit,
  Pause,
  Play,
  Search,
  Mail,
  Shield,
  User
} from 'lucide-react'
import {
  listarUsuarios,
  crearUsuario,
  actualizarUsuario,
  Usuario
} from '@/app/services/users'

export default function UsersManagement() {
  const [users, setUsers] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingUser, setEditingUser] = useState<Usuario | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<Omit<Usuario, 'id'>>({
    nombre: '',
    email: '',
    rol: 'admin',
    activo: true
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const data = await listarUsuarios()
      // Filtrar solo administradores
      const admins = data.filter((user) => user.rol === 'admin')
      setUsers(admins)
    } catch (error) {
      console.error('Error al cargar usuarios:', error)
      alert('Error al cargar usuarios')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingUser && editingUser.id) {
        // Al editar
        await actualizarUsuario(editingUser.id, {
          ...formData,
          id: editingUser.id
        })
        alert('Usuario actualizado exitosamente')
      } else {
        // Al crear, asegurarse que sea admin
        await crearUsuario({
          nombre: formData.nombre,
          email: formData.email,
          rol: 'admin',
          activo: formData.activo,
          password: 'changeme' 
        })
        alert('Usuario creado exitosamente')
      }
      resetForm()
      loadUsers()
    } catch (error) {
      console.error('Error:', error)
      alert(error instanceof Error ? error.message : 'Error al guardar usuario')
    }
  }

  const handleEdit = (user: Usuario) => {
    setEditingUser(user)
    setFormData({
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
      activo: user.activo
    })
    setShowForm(true)
  }

  const handleToggleActive = async (user: Usuario) => {
    if (!user.id) return

    const newStatus = !user.activo
    const action = newStatus ? 'activar' : 'desactivar'

    if (!confirm(`¿Estás seguro de ${action} este administrador?`)) return

    try {
      await actualizarUsuario(user.id, {
        ...user,
        activo: newStatus
      })
      alert(`Usuario ${newStatus ? 'activado' : 'desactivado'} exitosamente`)
      loadUsers()
    } catch (error) {
      console.error('Error:', error)
      alert('Error al cambiar estado del usuario')
    }
  }

  const resetForm = () => {
    setFormData({
      nombre: '',
      email: '',
      rol: 'admin',
      activo: true
    })
    setEditingUser(null)
    setShowForm(false)
  }

  const filteredUsers = users.filter(
    (u) =>
      u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600'></div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-3xl font-bold text-gray-800'>
            Gestión de Administradores
          </h2>
          <p className='text-gray-600'>
            {users.length} administradores registrados
          </p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className='bg-gradient-to-r from-orange-600 to-red-600'
        >
          <Plus className='w-4 h-4 mr-2' />
          Nuevo Administrador
        </Button>
      </div>

      {/* Search */}
      <div className='relative'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
        <input
          type='text'
          placeholder='Buscar por nombre o email...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none'
        />
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 h-screen'>
          <div className='bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
            <div className='p-6 border-b'>
              <h3 className='text-2xl font-bold'>
                {editingUser ? 'Editar Administrador' : 'Nuevo Administrador'}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className='p-6 space-y-4'>
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Nombre Completo *
                </label>
                <div className='relative'>
                  <User className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                  <input
                    type='text'
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    className='w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none'
                    placeholder='Ej: Juan Pérez'
                    required
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Email *
                </label>
                <div className='relative'>
                  <Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                  <input
                    type='email'
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className='w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none'
                    placeholder='admin@ejemplo.com'
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
                  className='w-4 h-4 text-orange-600 rounded'
                />
                <label
                  htmlFor='activo'
                  className='text-sm font-semibold text-gray-700'
                >
                  Usuario activo
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
                  className='flex-1 bg-gradient-to-r from-orange-600 to-red-600'
                >
                  {editingUser ? 'Actualizar' : 'Crear'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <div className='text-center py-12 bg-white rounded-xl'>
          <Users className='w-16 h-16 mx-auto text-gray-300 mb-4' />
          <p className='text-gray-600'>
            {searchTerm
              ? 'No se encontraron administradores'
              : 'No hay administradores registrados'}
          </p>
        </div>
      ) : (
        <div className='bg-white rounded-xl shadow-md overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50 border-b-2 border-gray-200'>
                <tr>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                    ID
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                    Nombre
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                    Email
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                    Rol
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
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className='hover:bg-gray-50 transition-colors'
                  >
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className='text-sm font-mono text-gray-600'>
                        #{user.id}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center gap-2'>
                        <div className='w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center'>
                          <User className='w-4 h-4 text-orange-600' />
                        </div>
                        <span className='text-sm font-semibold text-gray-800'>
                          {user.nombre}
                        </span>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center gap-2'>
                        <Mail className='w-4 h-4 text-gray-400' />
                        <span className='text-sm text-gray-600'>
                          {user.email}
                        </span>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span className='inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800'>
                        <Shield className='w-3 h-3' />
                        Admin
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          user.activo
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {user.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center justify-center gap-2'>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() => handleEdit(user)}
                          className='text-blue-600 hover:bg-blue-50'
                          title='Editar administrador'
                        >
                          <Edit className='w-4 h-4' />
                        </Button>
                        <Button
                          size='sm'
                          variant='outline'
                          onClick={() => handleToggleActive(user)}
                          className={
                            user.activo
                              ? 'text-orange-600 hover:bg-orange-50'
                              : 'text-green-600 hover:bg-green-50'
                          }
                          title={
                            user.activo
                              ? 'Desactivar administrador'
                              : 'Activar administrador'
                          }
                        >
                          {user.activo ? (
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
