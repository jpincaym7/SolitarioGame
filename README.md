# 🃏 Solitaire Pro — Klondike Luxury Web Edition

Juego de Solitario Klondike web de nivel profesional, desarrollado con **React 19**, **TypeScript**, **Vite**, **Tailwind CSS**, la baraja vectorial estándar completa de Chris Aguilar en SVG y componentes animados de **[React Bits](https://reactbits.dev)**.

---

## 🌟 Nueva Arquitectura de Interfaz & Componentes React Bits

1. **`Dock` Interactivo (macOS Style)**:
   - Base de control flotante en la parte inferior con magnificación dinámica al pasar el ratón (*spring physics*), badges y tooltips para atajos de teclado (`Ctrl+Z`, `Ctrl+Y`, `H`, `N`).
   - Acciones integradas: Deshacer, Rehacer, Pista, Autocompletar, Nueva Partida, Estadísticas y Configuración.
2. **HUD Superior Flotante Glassmorphic (Dynamic Island)**:
   - Emblema con `ShinyText` ("SOLITAIRE PRO") con reflejo metálico continuo.
   - Marcador central con puntuación en verde neón, cronómetro y contador de movimientos.
   - Botón selector de dificultad (Modo 1 Carta vs Modo 3 Cartas).
3. **`StarBorder`**:
   - Botón de autocompletado enmarcado con estrellas animadas que recorren el contorno dejando una estela de polvo brillante.
4. **`ClickSpark`**:
   - Chispas doradas y celestes que brotan alrededor del cursor al hacer clic o arrastrar cartas por la mesa.
5. **`SpotlightCard`**:
   - Focos de luz reactivos al cursor en los paneles de Configuración, Estadísticas y Victoria.

---

## ⌨️ Atajos de Teclado

| Tecla | Acción |
| :--- | :--- |
| `Ctrl + Z` / `Cmd + Z` | Deshacer movimiento |
| `Ctrl + Y` / `Cmd + Y` / `Ctrl + Shift + Z` | Rehacer movimiento |
| `H` | Solicitar pista estratégica |
| `Espacio` | Robar carta del mazo |
| `N` | Nueva partida |
| `Esc` | Cerrar pistas o modales de configuración |

---

## 🚀 Puesta en Marcha

```bash
# Iniciar servidor de desarrollo
npm run dev

# Ejecutar tests unitarios
npm test

# Compilar para producción
npm run build
```
