# World Population Growth Visualization

**Link to the visualization:**  
👉 [https://crecimiento-poblacion.netlify.app/](https://crecimiento-poblacion.netlify.app/)

## Introduction

This repository is part of a project for the course *Design and Evaluation of Interactive Systems*, which belongs to the Double Degree in Computer Engineering and Statistics at the University of Valladolid (UVa).

The aim of this project is to develop an interactive visualization on a freely chosen topic. In this case, the visualization represents the **growth of the world population** over different time periods, using data provided by [Our World in Data](https://ourworldindata.org/population-growth).

### Visualization Structure

The visualization is divided into three main parts:

- **Header:**  
  Contains the title and provides general context for the visualization.

- **Interactive Map:**  
  Displays countries colored in **green** (growth) or **red** (decline), with color intensity proportional to the magnitude of population change.  
  It includes a *double slider* that allows users to select the time period over which the growth is calculated.

- **Statistics Area:**  
  Shows relevant data for the selected period, such as:  
  - Countries with the highest and lowest growth, with their respective percentages.  
  - Total variation of the world population.  
  - Detailed information about a country when clicked (the selected country remains active even if the year range changes).

### Purpose

This visualization helps to understand the impact of phenomena such as wars, genocides, or demographic crises on population growth. It also allows users to observe global trends or simply explore out of curiosity.

#### Highlighted Examples

- **Soviet-Afghan War (1978):**  
  A population collapse in Afghanistan can be seen between 1977 and 1982.  
  ![USSR Invasion](./crecimiento_afganistan1977-1982.png?raw=true "USSR Invasion")

- **Rwandan Genocide (1994):**  
  A clear impact between 1993 and 1995.  
  ![Rwandan Genocide](./crecimiento_ruanda1993-1995.png?raw=true "Rwandan Genocide")

It can also be used to explore general demographic changes out of simple curiosity.

---

## Color Scale

The scale is based on two divergent color ranges: **green** for growth and **red** for decline, generated using [Data Color Picker](https://www.learnui.design/tools/data-color-picker.html#divergent).

To improve visual perception, each color range uses a *non-linear* scale:

- From white to the second most intense color for values from 0 up to the average of the countries with the highest growth/decline.
- From that point to the most intense color for values exceeding the average.

This allows clear distinction between countries with moderate growth and those with extreme changes. A simple linear scale was insufficient because countries with very high growth rates (e.g., 10,000%) distorted the palette, making countries with 20% or 400% growth almost indistinguishable.

---

## Slider

A *double slider* from [Metro 4 UI](https://metroui.org.ua/double-slider.html#_slider_hint_position) is used.  
It may present errors if manipulated too quickly.

---

## Data

The data comes from [Our World in Data - Population Growth](https://ourworldindata.org/population-growth#explore-data-poverty).  
Transformations were performed to adapt the data to the visualization, especially regarding country encoding and preparation for coloring the map. These transformations were done in R and can be found in the [`identificar_paises.R`](./identificar_paises.R) file.
