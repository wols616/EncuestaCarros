# 🚗 Sistema de Votación - Vehículo Más Llamativo

Aplicación web desarrollada en React para registrar votos y elegir el vehículo más llamativo considerando marca y modelo específico.

## 🎯 Características Implementadas

### ✅ Requerimientos Funcionales Completos

1. ✔️ **Registro de votos** - Sistema completo de votación
2. ✔️ **Tabla de resultados** (N°, Marca, Modelo)
3. ✔️ **Porcentajes con 2 decimales** - Cálculo automático
4. ✔️ **Número aleatorio 10-20** - Generado al inicio
5. ✔️ **Mayor porcentaje** - Destacado en estadísticas
6. ✔️ **Menor porcentaje** - Identificado automáticamente
7. ✔️ **Diferencia 1°-2° lugar** - Calculado en puntos porcentuales
8. ✔️ **Ordenamiento mayor a menor** - Automático
9. ✔️ **Ranking Top 5** - Tabla dedicada
10. ✔️ **Cierre automático al superar 50%** - Implementado
11. ✔️ **DUI único por persona** - Validación estricta
12. ✔️ **Tabla resumen** - Completa con todos los datos
13. ✔️ **Botón de reinicio** - Funcional

### 📊 Clasificación Automática

- **> 50%**: Dominio Absoluto (🟢 Verde)
- **35% - 50%**: Alta Preferencia (🔵 Azul)
- **20% - 34%**: Preferencia Media (🟡 Amarillo)
- **< 20%**: Baja Preferencia (⚫ Gris)

### 🔐 Validaciones Implementadas

- Formato de DUI: `########-#` (8 dígitos, guion, 1 dígito)
- Un solo voto por DUI
- Campos obligatorios
- Cierre automático al alcanzar 50%

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js (v18 o superior)
- npm o yarn

### Pasos para ejecutar

1. **Instalar dependencias** (si aún no se hizo):
   ```bash
   npm install
   ```

2. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

3. **Abrir en el navegador**:
   - La aplicación se abrirá automáticamente en `http://localhost:5173`
   - O accede manualmente a la URL mostrada en la consola

## 📝 Uso de la Aplicación

### 1. Registrar Voto
- Ingresar DUI en formato `########-#`
- Seleccionar Marca del vehículo
- Seleccionar Modelo (se habilita después de seleccionar marca)
- Hacer clic en "Registrar Voto"

### 2. Visualizar Estadísticas
La aplicación muestra automáticamente:
- Total de votos
- Vehículo con mayor porcentaje (🏆)
- Vehículo con menor porcentaje (📉)
- Diferencia entre 1° y 2° lugar
- Tabla completa ordenada de mayor a menor
- Top 5 con medallas (🥇🥈🥉)
- Tabla resumen con todos los datos

### 3. Reiniciar Votación
- Hacer clic en el botón "🔄 Reiniciar Votación"
- Esto borrará todos los votos y permite empezar de nuevo

## 🏗️ Tecnologías Utilizadas

- **React 18** - Framework principal
- **Vite** - Build tool y desarrollo
- **Bootstrap 5** - Estilos y componentes
- **useState** - Manejo de estado
- **useEffect** - Efectos secundarios

## 📋 Catálogo de Vehículos

### Vehículos Disponibles (con Imágenes Reales):

1. **Toyota Corolla 2024**
2. **Honda Civic 2024**
3. **BMW Serie 3 2024**
4. **Mercedes-Benz Clase C 2024**
5. **Ford Mustang 2024**

Todos los vehículos incluyen imágenes reales de alta calidad.

## 🎨 Personalización

### Cambiar colores
Edita el archivo `src/App.css` para modificar:
- Gradiente de fondo
- Colores de las tarjetas
- Estilos de las tablas

### Agregar más vehículos
Edita el array `vehiculosDisponibles` en `src/App.jsx` (línea 19):
```javascript
const vehiculosDisponibles = [
  {
    id: 6,
    marca: 'Chevrolet',
    modelo: 'Camaro 2024',
    imagen: 'URL_DE_LA_IMAGEN'
  },
  // ... más vehículos
]
```

## 📦 Scripts Disponibles

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Construye para producción
- `npm run preview` - Vista previa de la build de producción

## 🐛 Solución de Problemas

### El puerto 5173 está ocupado
Cierra otras aplicaciones que puedan estar usando el puerto o modifica el puerto en `vite.config.js`

### Error al instalar dependencias
Elimina la carpeta `node_modules` y `package-lock.json`, luego ejecuta `npm install` nuevamente

## 📄 Licencia

Este proyecto es de uso educativo.

---

**Desarrollado con ⚛️ React + ⚡ Vite**
