# Visualización del Crecimiento de la Población Mundial

**Enlace a la visualización:**  
👉 [https://crecimiento-poblacion.netlify.app/](https://crecimiento-poblacion.netlify.app/)

## Introducción

Este repositorio forma parte de una práctica de la asignatura *Diseño y Evaluación de Sistemas Interactivos*, correspondiente al Doble Grado en Ingeniería Informática y Estadística de la Universidad de Valladolid (UVa).

El objetivo del trabajo es desarrollar una visualización interactiva sobre un tema libremente elegido. En este caso, la visualización representa el **crecimiento de la población mundial** en distintos periodos de tiempo, a partir de los datos proporcionados por [Our World in Data](https://ourworldindata.org/population-growth).

### Estructura de la visualización

La visualización se compone de tres partes principales:

- **Encabezado**: Contiene el título y da contexto general a la visualización.

- **Mapa interactivo**:  
  Muestra los países coloreados en **verde** (crecimiento) o **rojo** (decrecimiento), con una intensidad proporcional a la magnitud del cambio poblacional.  
  Además, incluye un *slider doble* que permite seleccionar el periodo de años sobre el que se calcula el crecimiento.

- **Zona de estadísticas**:  
  Muestra datos relevantes del periodo seleccionado, como:
  - Países que más y menos han crecido, con sus respectivos porcentajes.
  - Variación total de la población mundial.
  - Información detallada de un país al hacer clic sobre él (el país seleccionado permanece activo incluso si se cambia el intervalo de años).

### Utilidad

Esta visualización permite comprender el impacto de fenómenos como guerras, genocidios o crisis demográficas en el crecimiento poblacional, así como observar tendencias globales o simplemente explorar por curiosidad.

#### Ejemplos destacados

- **Guerra afgano-soviética (1978):**  
  Se observa un colapso de la población de Afganistán entre 1977 y 1982.  
  ![Invasión URSS](./crecimiento_afganistan1977-1982.png?raw=true "Invasión URSS")

- **Genocidio de Ruanda (1994):**  
  Impacto evidente entre 1993 y 1995.  
  ![Genocidio Ruanda](./crecimiento_ruanda1993-1995.png?raw=true "Genocidio Ruanda")

También puede utilizarse para explorar cambios demográficos generales por pura curiosidad.

---

## Escala de Colores

La escala se basa en dos gamas divergentes: **verde** para crecimiento y **rojo** para decrecimiento, generadas mediante [Data Color Picker](https://www.learnui.design/tools/data-color-picker.html#divergent).

Para mejorar la percepción visual, cada color tiene una escala *no lineal*:

- De blanco al segundo color más intenso para valores de 0 a la media de los países que más crecen/decrecen.
- De ese punto al color más intenso para valores que superan dicha media.

Esto permite distinguir claramente entre países con crecimientos moderados y aquellos con cambios extremos. Una escala lineal simple no era suficiente, ya que países con crecimientos muy altos (ej. 10,000%) distorsionaban la paleta, haciendo casi indistinguibles los países con un 20% o 400% de crecimiento.

---

## Slider

Se ha utilizado un *slider doble* proveniente de [Metro 4 UI](https://metroui.org.ua/double-slider.html#_slider_hint_position).  
Puede presentar errores si se manipula muy rápidamente.

---

## Datos

Los datos provienen de [Our World in Data - Population Growth](https://ourworldindata.org/population-growth#explore-data-poverty).  
Se han realizado transformaciones para adaptarlos a la visualización, especialmente en lo que respecta a la codificación por país y la preparación para colorear el mapa. Estas transformaciones se realizaron en R y pueden consultarse en el archivo [`identificar_paises.R`](./identificar_paises.R).
