# Credenciales de Administrador

## Acceso Administrador

**Email:** admin@directorio.com  
**Contraseña:** La que establezcas al registrarte

## Instrucciones

1. Registrate en la aplicación usando el email `admin@directorio.com`
2. El sistema detectará automáticamente este email y te asignará rol de administrador
3. Una vez iniciada sesión, verás el enlace "Admin" en el navbar
4. Desde el panel de administración podrás:
   - Cambiar el estado de las empresas (pending → active → inactive)
   - Crear, editar y eliminar servicios extra
   - Ver todas las empresas registradas

## Funcionalidades del Sistema

### Roles de Usuario

1. **Cliente (Gratis)**
   - Puede ver empresas y sus publicaciones
   - Puede ver servicios extras
   - No puede crear publicaciones

2. **Empresa (Suscripción)**
   - Debe registrarse como empresa
   - Inicia con estado "pending" (pendiente)
   - Debe contactar al admin para activar cuenta
   - Una vez activa, puede crear publicaciones
   - La suscripción dura 30 días desde la activación
   - Después de 30 días, el estado cambia a "inactive" automáticamente

3. **Administrador**
   - Email: admin@directorio.com
   - Puede activar/desactivar empresas
   - Puede gestionar servicios extras
   - Cambia estado de empresas: pending → active (con fecha de expiración 30 días)

### Estados de Suscripción

- **pending**: Empresa registrada, esperando pago y activación
- **active**: Empresa activa, puede publicar (dura 30 días)
- **inactive**: Suscripción expirada, no puede publicar

### Flujo de Activación de Empresa

1. Empresa se registra → Estado: pending
2. Se muestra aviso: "Contacta a admin@directorio.com para pago"
3. Admin cambia estado a "active" desde panel admin
4. Sistema establece fecha de activación y expiración (30 días)
5. Empresa puede crear y editar publicaciones
6. Después de 30 días, el estado se debe cambiar manualmente a "inactive"
7. Para renovar, admin cambia nuevamente a "active" (reinicia 30 días)

### Restricciones por Estado

**Empresas con estado pending o inactive NO pueden:**
- Crear nuevas publicaciones
- Editar publicaciones existentes
- Editar información de la empresa

**Empresas con estado active SÍ pueden:**
- Crear publicaciones
- Editar publicaciones
- Editar información de la empresa

## Notas Importantes

- Las empresas inactivas pueden ver sus publicaciones pero no modificarlas
- Los clientes pueden ver todo pero no crear contenido
- Solo el administrador puede gestionar estados y servicios extras
- La fecha de expiración se calcula automáticamente al activar

## Límites y Restricciones

### Límite de Publicaciones
- Cada empresa puede tener un máximo de **10 publicaciones activas**
- Para crear una nueva publicación cuando se alcanza el límite, debe eliminarse una publicación existente
- El contador de publicaciones se muestra en el dashboard de la empresa

### Eliminación Automática de Publicaciones
- Las publicaciones se eliminan automáticamente si no han sido modificadas en **30 días**
- El sistema verifica la fecha de la última actualización (`updated_at`)
- Cuando una publicación es editada, se actualiza automáticamente la fecha `updated_at`
- NOTA: En este momento, la verificación de posts antiguos debe hacerse manualmente mediante SQL:
  ```sql
  DELETE FROM posts
  WHERE updated_at < NOW() - INTERVAL '30 days';
  ```
- Se recomienda configurar un cron job o tarea programada para ejecutar esta limpieza periódicamente

### Almacenamiento de Imágenes
- Las imágenes se almacenan localmente en el servidor
- Estructura de directorios:
  - `/public/uploads/companies/` - Logos de empresas
  - `/public/uploads/posts/` - Imágenes de publicaciones
  - `/public/uploads/profiles/` - Fotos de perfil de clientes
- Las imágenes deben subirse a través de la interfaz de usuario
- Formatos soportados: JPG, PNG, GIF, WebP
- NOTA: En esta versión, se usan URLs de imágenes. Para implementar carga de archivos local, se necesitaría un backend adicional con Node.js/Express
