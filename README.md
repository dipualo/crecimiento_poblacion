## Introducción

Este repositorio esta basado en mi práctica de diseño y evaluación de sistemas interactivos del doble grado de infórmatica y estadística de la UVa. Este trabajo se basa en la realización de una visualización a escoger por el alumno. MI visualización  se basa en un mapa que representase el porcentaje de crecimiento de la población en distinos intervalos de años selecionables a partir de los datos de ourworldindata(poner el enlace). En la visualización hay dos zonas relevantes además del encabecado con el título que son:

- El mapa, en el que los países están pintados de colores verde o rojo según crezca o decrezca su población, siendo más intenso el color cuanto mayor sea la variación de la población. La escala para colorear el mapa busca que los usuarios de la visualización puedan separar los países según su crecimieto de un vistazo y posteriormente se describe como se construye. También en esta parte hay un slider que permite seleccionar los años de inicio y fin del periodo en el que se calcula el crecimiento de la población.

- Zona con estadísticas, aquí aparecen estadísticas del crecimiento de la población del período seleccionable como los países que más y menos crezen con sus porcentajes o como cambia la población mundial en el intervalo seleccionado. Además, se permite clickar en un país para conocer más datos sobre el crecimiento del país y podiendo seguir su crecimiento aunque se cambie el período selecionado.

La visualización puede ser útil para apreciar como afectan catastrofes demográficas a la población y como los países se recuperan de ellas.

Se pueden encontrar ejemplos como: 

- La guerra afgano-soviética empezada en 1978. En la visualización como entre 1977 y 1982 la población de Afganistan se hunde.
![Alt text](./crecimiento_afganistan1977-1982.png?raw=true "Invasion URSS")

- Genocidio de Ruanda en 1994.
![Alt text](./crecimiento_ruanda1993-1995.png?raw=true "Genocidio Ruanda")

O simplemente explorar los cambios demográficos de los países por mera curiosidad.

## Escala

La escala se divide en verde y rojo según la población del país decrezca o crezca respectivamente. La escala se genera mediante https://www.learnui.design/tools/data-color-picker.html#divergent y para cada color se crean dos escalas divergentes lineales que van desde el 0 hasta la media de los países que más crecen (en el caso del color verde) que va desde el blanco hasta el segundo verde con más tonalidad y se usa otra desde ese verde hasta el verde con mayor tonalidad para los datos que van desde la media hasta el valor más extremo. De esta manera se consiigue que se noten las diferencias a simple vista entre los países que más crecen y los que crecen moderadamente. Esto no se observaba realizando sólo una escala divergente lineal de verdes los valores desde el 0 hasta el país que más crece, ya que el país que crece más puede llegar a crecer un 10000% que tiene un color verde intenso y el resto de países que crecen, pero poco comparado con el anterior se llevan un verde muy poco intenso y no se ve las diferencias entre países que crecen un 20% y un 400%.

## Slider

El doble slider da algúñn problema si se mueve raoidamente y esta sacado de https://metroui.org.ua/double-slider.html#_slider_hint_position.

## Datos 

LOs datos proceden de https://ourworldindata.org/population-growth#explore-data-poverty y para poder representarlas en el mapa se han echo modificaciones fundamentalmente para poder representar los colores en el mapa en los datos usando R como se puede ver en identificar_paises.R
