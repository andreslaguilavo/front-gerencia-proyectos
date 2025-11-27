# SmartStock Frontend

Este es el frontend de **SmartStock**, una tienda inteligente con gestión de inventario en tiempo real usando sensores IoT y notificaciones automáticas para administradores.

## 🚀 Tecnologías

- [Next.js](https://nextjs.org/) (React)
- Tailwind CSS
- TypeScript
- [Lucide React](https://lucide.dev/) (iconos)
- MQTT (para integración IoT, vía backend)

---

## ⚙️ Configuración

1. **Clona el repositorio** y entra a la carpeta `front/`:

   ```bash
   git clone <repo-url>
   ```

2. **Copia el archivo de entorno**:

   ```bash
   cp .env.example .env.local
   ```

   Edita `.env.local` y asegúrate de que la variable apunte al backend:

   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

3. **Instala las dependencias**:

   ```bash
   npm install
   # o
   yarn install
   ```

---

## 🧑‍💻 Desarrollo

Para iniciar el servidor de desarrollo:

```bash
npm run dev
# o
yarn dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🛠️ Estructura del Proyecto

```
front/
├── app/                # Rutas y páginas Next.js
├── components/         # Componentes reutilizables (Header, Notifications, etc)
├── context/            # Contextos globales (ej: carrito)
├── public/             # Imágenes y archivos estáticos
├── services/           # Servicios para consumir la API REST
├── .env.local          # Variables de entorno (API URL)
├── next.config.ts      # Configuración Next.js
├── tailwind.config.js  # Configuración Tailwind
└── ...
```

---

## 🔗 Conexión con el Backend

El frontend se comunica con el backend FastAPI usando la variable de entorno `NEXT_PUBLIC_API_URL`.  
Asegúrate de que el backend esté corriendo y accesible en la URL configurada.

---

## 🔔 Notificaciones en tiempo real

- Los administradores reciben notificaciones automáticas cuando el stock está bajo o agotado.
- El sistema de notificaciones hace polling cada 30 segundos al endpoint `/notificaciones/usuario/{id}`.

---

## 🧪 Pruebas rápidas

- Inicia el backend y el frontend.
- Haz login como administrador.
- Simula un evento IoT (por ejemplo, usando MQTT) para que el backend genere una notificación.
- Deberías ver la campana de notificaciones con un badge rojo en la barra superior.




---

## 📦 Build para producción

```bash
npm run build
npm run start
```

---

## 📚 Recursos útiles

- [Documentación Next.js](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [FastAPI Backend](../back/README.md)

---

## 📝 Licencia

MIT

---

**SmartStock** - Gestión inteligente de inventario en tiempo real 🚀
