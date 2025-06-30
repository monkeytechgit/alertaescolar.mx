# Configuración de Supabase para Alerta Escolar

## Tabla de Contacto Webpage

### Estructura de la Tabla

La tabla `contacto_webpage` debe tener la siguiente estructura en Supabase:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `bigint` | ID automático (primary key) |
| `tipo_solicitud` | `text` | Tipo de solicitud (demo-gratuito, cotizacion-personalizada, etc.) |
| `correo` | `text` | Correo electrónico del solicitante |
| `telefono` | `text` | Número de teléfono/WhatsApp (opcional) |
| `nombre_institucion` | `text` | Nombre de la institución educativa |
| `tipo_institucion` | `text` | Tipo de institución (escuela-privada, primaria, etc.) |
| `cantidad_alumnos` | `text` | Rango de cantidad de alumnos |
| `responsable` | `text` | Nombre y cargo del responsable |
| `mensaje` | `text` | Mensaje adicional (opcional) |
| `created_at` | `timestamp with time zone` | Fecha y hora de creación (automático) |

### SQL para Crear la Tabla

```sql
-- Crear la tabla contacto_webpage
CREATE TABLE contacto_webpage (
    id BIGSERIAL PRIMARY KEY,
    tipo_solicitud TEXT NOT NULL,
    correo TEXT NOT NULL,
    telefono TEXT,
    nombre_institucion TEXT NOT NULL,
    tipo_institucion TEXT,
    cantidad_alumnos TEXT,
    responsable TEXT NOT NULL,
    mensaje TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Configurar RLS (Row Level Security) si es necesario
ALTER TABLE contacto_webpage ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserciones desde la aplicación web
CREATE POLICY "Permitir inserciones desde web" ON contacto_webpage
    FOR INSERT WITH CHECK (true);

-- Política para permitir lectura solo a usuarios autenticados (opcional)
CREATE POLICY "Permitir lectura a usuarios autenticados" ON contacto_webpage
    FOR SELECT USING (auth.role() = 'authenticated');
```

## Configuración del Cliente

### 1. Obtener Credenciales de Supabase

1. Ve a tu proyecto en [Supabase](https://supabase.com)
2. Ve a **Settings** > **API**
3. Copia la **URL** y la **anon public key**

### 2. Configurar supabase-config.js

Edita el archivo `supabase-config.js` y reemplaza los valores de ejemplo:

```javascript
const SUPABASE_CONFIG = {
    // Tu URL de Supabase (ejemplo: https://tuproyecto.supabase.co)
    url: 'https://tu-proyecto-real.supabase.co',

    // Tu API Key anónima de Supabase
    anonKey: 'tu-api-key-anonima-real'
};

// No modifiques esta línea
window.SUPABASE_CONFIG = SUPABASE_CONFIG;
```

## Funcionalidad de Formularios

### Páginas con Formularios

Todas las siguientes páginas incluyen formularios que se envían a la tabla `contacto_webpage`:

- `index.html` - Página principal
- `sistema-control-asistencia-escolar.html` - Software de control
- `hardware-control-asistencia.html` - Hardware de control
- `panel-administrativo.html` - Panel administrativo
- `credenciales-pvc.html` - Credenciales PVC
- `preguntas-frecuentes.html` - Preguntas frecuentes

### Campos del Formulario

Todos los formularios incluyen los siguientes campos:

- **Tipo de Solicitud** (requerido): demo-gratuito, cotizacion-personalizada
- **Correo Electrónico** (requerido)
- **WhatsApp** (opcional)
- **Nombre de la Institución** (requerido)
- **Tipo de Institución** (requerido)
- **Cantidad de Alumnos** (requerido)
- **Responsable / Cargo** (requerido)
- **Mensaje Adicional** (opcional)

### Proceso de Envío

1. El usuario llena el formulario
2. Se valida que los campos requeridos estén completos
3. Se envían los datos a Supabase usando la API REST
4. Se muestra un mensaje de éxito o error
5. Se resetea el formulario

### Manejo de Errores

El sistema maneja los siguientes tipos de errores:

- **Configuración de Supabase**: Si las credenciales no están configuradas
- **Campos requeridos**: Si faltan campos obligatorios
- **Error de red**: Si hay problemas de conectividad
- **Error de Supabase**: Si hay problemas con la base de datos

## Verificación de la Configuración

### 1. Verificar en el Navegador

1. Abre cualquier página con formulario
2. Abre las herramientas de desarrollador (F12)
3. Ve a la pestaña **Console**
4. Intenta enviar un formulario
5. Verifica que no aparezcan errores de configuración

### 2. Verificar en Supabase

1. Ve a tu proyecto en Supabase
2. Ve a **Table Editor**
3. Selecciona la tabla `contacto_webpage`
4. Verifica que los datos se estén insertando correctamente

## Solución de Problemas

### Error: "Supabase no está configurado"

**Causa**: Las credenciales en `supabase-config.js` no han sido actualizadas.

**Solución**: 
1. Verifica que hayas actualizado `supabase-config.js` con tus credenciales reales
2. Asegúrate de que el archivo esté guardado
3. Recarga la página

### Error: "Error 401: Unauthorized"

**Causa**: La API key anónima es incorrecta o no tiene permisos.

**Solución**:
1. Verifica que estés usando la **anon public key** correcta
2. Asegúrate de que las políticas RLS permitan inserciones
3. Verifica que la tabla `contacto_webpage` exista

### Error: "Error 404: Not Found"

**Causa**: La URL de Supabase es incorrecta o la tabla no existe.

**Solución**:
1. Verifica que la URL de Supabase sea correcta
2. Asegúrate de que la tabla `contacto_webpage` esté creada
3. Verifica que el nombre de la tabla sea exactamente `contacto_webpage`

### Los formularios no se envían

**Causa**: Problemas con JavaScript o configuración.

**Solución**:
1. Verifica que `script.js` y `supabase-config.js` estén incluidos en todas las páginas
2. Revisa la consola del navegador para errores de JavaScript
3. Asegúrate de que la función `handlePricingFormSubmit` esté disponible globalmente

## Notas Importantes

- **Seguridad**: La API key anónima es pública y está diseñada para ser usada en el frontend
- **RLS**: Row Level Security debe estar configurado correctamente para permitir inserciones
- **CORS**: Supabase maneja automáticamente los problemas de CORS
- **Rate Limiting**: Supabase tiene límites de rate limiting para evitar spam

## Soporte

Si tienes problemas con la configuración:

1. Revisa los logs en la consola del navegador
2. Verifica la configuración en Supabase
3. Consulta la documentación oficial de Supabase
4. Contacta al equipo de desarrollo de Alerta Escolar 