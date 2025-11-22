const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

if (!API_BASE_URL) {
  throw new Error('La variable de entorno NEXT_PUBLIC_API_URL no está definida')
}

// Interfaces basadas en el modelo Usuario del backend
export interface Usuario {
  id: number | null
  nombre: string
  email: string
  rol: 'user' | 'admin'
  activo: boolean
}

export interface CrearUsuarioRequest {
  nombre: string
  email: string
  rol?: 'user' | 'admin'
  activo?: boolean
}

export interface ActualizarUsuarioParcialRequest {
  nombre?: string
  email?: string
  rol?: 'user' | 'admin'
  activo?: boolean
}

// --- Servicios CRUD de Usuarios ---

/**
 * Listar todos los usuarios
 * GET /usuarios/
 */
export async function listarUsuarios(): Promise<Usuario[]> {
  const response = await fetch(`${API_BASE_URL}/usuarios/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error(`Error al listar usuarios: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Obtener un usuario por ID
 * GET /usuarios/{usuario_id}
 */
export async function obtenerUsuario(usuarioId: number): Promise<Usuario> {
  const response = await fetch(`${API_BASE_URL}/usuarios/${usuarioId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Usuario con id=${usuarioId} no encontrado`)
    }
    throw new Error(`Error al obtener usuario: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Obtener un usuario por email
 * GET /usuarios/?email={email}
 */
export async function obtenerUsuarioPorEmail(
  email: string
): Promise<Usuario | null> {
  try {
    const usuarios = await listarUsuarios()
    return usuarios.find((u) => u.email === email) || null
  } catch (error) {
    console.error('Error al buscar usuario por email:', error)
    return null
  }
}

/**
 * Crear un nuevo usuario
 * POST /usuarios/
 */
export async function crearUsuario(
  usuario: CrearUsuarioRequest
): Promise<Usuario> {
  const response = await fetch(`${API_BASE_URL}/usuarios/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: null,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol || 'user',
      activo: usuario.activo !== undefined ? usuario.activo : true
    })
  })

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: response.statusText }))
    throw new Error(
      `Error al crear usuario: ${error.detail || response.statusText}`
    )
  }

  return response.json()
}

/**
 * Actualizar completamente un usuario
 * PUT /usuarios/{usuario_id}
 */
export async function actualizarUsuario(
  usuarioId: number,
  usuario: Usuario
): Promise<Usuario> {
  const response = await fetch(`${API_BASE_URL}/usuarios/${usuarioId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...usuario,
      id: usuarioId
    })
  })

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Usuario con id=${usuarioId} no existe`)
    }
    const error = await response
      .json()
      .catch(() => ({ detail: response.statusText }))
    throw new Error(
      `Error al actualizar usuario: ${error.detail || response.statusText}`
    )
  }

  return response.json()
}

/**
 * Actualizar parcialmente un usuario
 * PATCH /usuarios/{usuario_id}
 */
export async function actualizarUsuarioParcial(
  usuarioId: number,
  cambios: ActualizarUsuarioParcialRequest
): Promise<Usuario> {
  const response = await fetch(`${API_BASE_URL}/usuarios/${usuarioId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(cambios)
  })

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Usuario con id=${usuarioId} no existe`)
    }
    const error = await response
      .json()
      .catch(() => ({ detail: response.statusText }))
    throw new Error(
      `Error al actualizar usuario: ${error.detail || response.statusText}`
    )
  }

  return response.json()
}

/**
 * Eliminar un usuario
 * DELETE /usuarios/{usuario_id}
 */
export async function eliminarUsuario(usuarioId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/usuarios/${usuarioId}`, {
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
      `Error al eliminar usuario: ${error.detail || response.statusText}`
    )
  }
}

/**
 * Simular login (validación de credenciales)
 * Como el backend no maneja contraseñas, usamos "password" como contraseña fija
 */
export async function loginUsuario(
  email: string,
  password: string
): Promise<Usuario> {
  // Validar contraseña fija
  if (password !== 'password') {
    throw new Error('Contraseña incorrecta')
  }

  // Buscar usuario por email
  const usuario = await obtenerUsuarioPorEmail(email)

  if (!usuario) {
    throw new Error('Usuario no encontrado')
  }

  if (!usuario.activo) {
    throw new Error('Usuario inactivo')
  }

  return usuario
}

/**
 * Registrar nuevo usuario (crear + login)
 */
export async function registrarUsuario(
  nombre: string,
  email: string
): Promise<Usuario> {
  // Verificar si el usuario ya existe
  const usuarioExistente = await obtenerUsuarioPorEmail(email)

  if (usuarioExistente) {
    throw new Error('El email ya está registrado')
  }

  // Crear nuevo usuario
  const nuevoUsuario = await crearUsuario({
    nombre,
    email,
    rol: 'user',
    activo: true
  })

  return nuevoUsuario
}
