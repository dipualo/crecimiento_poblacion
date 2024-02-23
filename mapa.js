const slider = d3.select("#slider");
const width = window.innerWidth;
const height = window.innerHeight;
const worldMap =  'https://unpkg.com/visionscarto-world-atlas@0.1.0/world/50m.json';


var svg = d3.select('svg');
var g = svg.append('g');
 
// Cambio el centro de la imagen por el autentico centro y uso una escala
// para que pinte todo el mapa en portatatiles y pantallas con dimensiones estandar
const projection = d3.geoNaturalEarth1().scale([width/8]).translate([0.9*width/3,height/2.5]);
const pathGenerator = d3.geoPath().projection(projection);

// Escala daltonicos sacada de https://venngage.com/tools/accessible-color-palette-generator
// Con esto me evito problemas de accesibilidad por daltonismo no se ha implementado
/*
const lowerColor = '#c44601';
const middleLowerColor = '#f57600';
const middleColor = '#8babf1';
const middleUpperColor= '#0073e6';
const upperColor = '#054fb9';
*/

// Esta escala viene de https://www.learnui.design/tools/data-color-picker.html#divergent
var lowerColor = '#de425b';
var middleLowerColor = '#e87f86';
var middleColor = '#e5e5e5';
var middleUpperColor= '#7fac6c';
var upperColor = '#488f31';

var interpolateColorVeryPos = d3.interpolateRgb(middleUpperColor,upperColor);
var interpolateColorPos = d3.interpolateRgb(middleColor,middleUpperColor);
var interpolateColorNeg = d3.interpolateRgb(middleLowerColor,middleColor);
var interpolateColorVeryNeg = d3.interpolateRgb(lowerColor,middleLowerColor);

const anos = 72; // años de los datos
const numPaisesDatos = 235;
const numPaisesPintados = 226;
var countries; 
var populationAllYears;
var popWorld;

var minPop = Infinity; //Minimo crecimiento de la poblacion
var maxPop = 0; //Maximo
var meanPosGrow = 0; //Media de los crecimientos positivos
var meanNegGrow = 0; //Media crecimientos negativos
var numPaisesCrecen = 0;
var numPaisesDecrecen = 0;
var paisClickado = 0;

//Variables usadas para pintar el mapa y las estadísticas
var populationInic;
var populationFin;
var ordenCrecimientoPaises;

//Crear la leyenda 
//Ajustarla a una zona del mapa sin países
const svgWidth = parseInt(svg.style("width"));
const svgHeight = parseInt(svg.style("height"));
const rectWidth = 0.2*svgWidth;
const rectHeight = 0.02*svgHeight;
const rectMarginX = 0.26*svgWidth; 
const rectMarginY = 0.14*svgHeight;

const rectX = rectMarginX;
const rectY = svgHeight - rectHeight - rectMarginY;

//Pintar rectangulos de los colores que pueden tener los datos
const numSections = 50;
const sectionWidth = rectWidth / numSections;

// Crear los colores de la leyenda
const interpolateColorNegativos = d3.interpolateRgb(lowerColor,middleColor);
const interpolateColorPositivos = d3.interpolateRgb(middleColor,upperColor);
for (let i = 0; i < numSections; i++) {
  var sectionColor = interpolateColorNegativos(i / numSections);
  if(i>numSections/2){
    sectionColor = interpolateColorPositivos(i/ numSections);
  }
  svg.append("rect")
    .attr("x", rectX + i * sectionWidth)
    .attr("y", rectY)
    .attr("width", sectionWidth)
    .attr("height", rectHeight)
    .style("fill", sectionColor);
}

var divSeguimientoPais;
// Años en los que se pintan los países según los datos el inicial es 60 y como 
//los datos empiezan en 1950 el año inicial será 2010
var inic = 60;
var fin = 71;

//Cargar los datos y pintar el mapa entre los años 2010 y 2021 que se mostraran
//de manera inicial y se podran cambiar
Promise.all([
    d3.json(worldMap),
    d3.csv('./population_all_years.csv'),
    d3.csv('./pop_world.csv')
  ]).then(([geoData, population, populationWorld]) => {

    countries = topojson.feature(geoData, geoData.objects.countries);
    populationAllYears = population;
    popWorld = populationWorld;
    g.selectAll('path')
    .data(countries.features)
    .enter().append("path")
      .attr('class', 'country')
      .attr('d', pathGenerator)
    //Seleccionar un pais al clickarlo
    .on("click", function (event, d) {
      divSeguimientoPais = d3.select('#seguimento_pais');
      //d es el indice del pais clickado en el array de paises
      paisClickado = d;
      cambiarDatosPaisSeguido([inic+1950,fin+1950]);
    });
    pintar_mapa([2010,2021]);
  });

//Para hacer zoom con d3v5
svg.call(d3.zoom().on('zoom', () => {
  g.attr('transform', d3.event.transform);
}));

//Evento que se dispara al mover los manejadores del slider
// sacado de  https://metroui.org.ua/double-slider.html#_slider_hint_position
function cambiarDatos(e){
  const agnos = [arguments[0],arguments[1]];
  pintar_mapa(agnos);
}

// Pinta los datos en el mapa y ajusta los valores de la leyenda
function pintar_mapa(agnos){

  inic = Math.round(agnos[0])-1950;
  fin = Math.round(agnos[1])-1950;
 
  minPop = Infinity; 
  maxPop = 0;
  sumPosGrow = 0; 
  sumNegGrow = 0; 
  numPaisesCrecen = 0;
  numPaisesDecrecen = 0;

  populationInic =  populationAllYears.slice(inic*numPaisesDatos,(inic+1)*numPaisesDatos);
  populationFin = populationAllYears.slice(fin*numPaisesDatos,(fin+1)*numPaisesDatos);

  //Se buscan los países de los datos que estén en el mapa y se les asigna un valor que
  //se pintare, además de usar las medias para la escala y textos de la leyenda
  for(i=0;i<countries.features.length;i++){
    for(j=0;j<populationFin.length;j++){
      if(populationFin[j].id == countries.features[i].properties.a3){
        countries.features[i].value = 100*parseInt(populationFin[j].pop)/parseInt(populationInic[j].pop) - 100;
        countries.features[i].popInic = populationInic[j].pop;
        countries.features[i].popFin = populationFin[j].pop;
        countries.features[i].name = populationFin[j].name;
        if(countries.features[i].value >= 0) {
          sumPosGrow += countries.features[i].value;
          numPaisesCrecen++;
        }
        else{
          sumNegGrow += countries.features[i].value;
          numPaisesDecrecen++;
        }
        if(countries.features[i].value > maxPop) maxPop = countries.features[i].value;
        else{
          if(countries.features[i].value<minPop) minPop = countries.features[i].value;
        }
      }         
    }
  }    
  meanPosGrow = sumPosGrow/numPaisesCrecen;
  meanNegGrow = sumNegGrow/numPaisesDecrecen;

  //Se cambian las estadísticas de la parte derecha
  const divCrecimientoMundial = d3.select('#crecimiento_mundial');
  divCrecimientoMundial.select('h3').text("Crecimiento mundial entre "+ Math.round(agnos[0]) +"-"+Math.round(agnos[1]));
 
  divCrecimientoMundial.select("#textWorldGrow").text('La población mundial pasa de '+popWorld[inic].pop.replace(/\B(?=(\d{3})+(?!\d))/g, ".")+" a "+popWorld[fin].pop.replace(/\B(?=(\d{3})+(?!\d))/g, "."));
  const worldGrow = 100*popWorld[fin].pop/popWorld[inic].pop-100;
   
  divCrecimientoMundial.select("#textWorldGrowPercentage").text('La población mundial crece un '+ worldGrow.toFixed(2)+"%");

  ordenCrecimientoPaises = countries.features.filter(country => country.value !== undefined);
  ordenCrecimientoPaises = ordenCrecimientoPaises.sort((countriesA, countriesB) => countriesA.value - countriesB.value);

  const divPaisesMasCrecen =  d3.select('#paises_que_mas_crecen');
  divPaisesMasCrecen.select('#pais_mas_crece1').text(ordenCrecimientoPaises[numPaisesPintados-1].name+" "+ordenCrecimientoPaises[numPaisesPintados-1].value.toFixed(2)+"%");
  divPaisesMasCrecen.select('#pais_mas_crece2').text(ordenCrecimientoPaises[numPaisesPintados-2].name+" "+ordenCrecimientoPaises[numPaisesPintados-2].value.toFixed(2)+"%");
  divPaisesMasCrecen.select('#pais_mas_crece3').text(ordenCrecimientoPaises[numPaisesPintados-3].name+" "+ordenCrecimientoPaises[numPaisesPintados-3].value.toFixed(2)+"%");
  divPaisesMasCrecen.select('#pais_mas_crece4').text(ordenCrecimientoPaises[numPaisesPintados-4].name+" "+ordenCrecimientoPaises[numPaisesPintados-4].value.toFixed(2)+"%");
  divPaisesMasCrecen.select('#pais_mas_crece5').text(ordenCrecimientoPaises[numPaisesPintados-5].name+" "+ordenCrecimientoPaises[numPaisesPintados-5].value.toFixed(2)+"%");

  const divPaisesMasDecrecen =  d3.select('#paises_que_mas_decrecen');
  divPaisesMasDecrecen.select('#pais_mas_decrece1').text(ordenCrecimientoPaises[0].name+" "+ordenCrecimientoPaises[0].value.toFixed(2)+"%");
  divPaisesMasDecrecen.select('#pais_mas_decrece2').text(ordenCrecimientoPaises[1].name+" "+ordenCrecimientoPaises[1].value.toFixed(2)+"%");
  divPaisesMasDecrecen.select('#pais_mas_decrece3').text(ordenCrecimientoPaises[2].name+" "+ordenCrecimientoPaises[2].value.toFixed(2)+"%");
  divPaisesMasDecrecen.select('#pais_mas_decrece4').text(ordenCrecimientoPaises[3].name+" "+ordenCrecimientoPaises[3].value.toFixed(2)+"%");
  divPaisesMasDecrecen.select('#pais_mas_decrece5').text(ordenCrecimientoPaises[4].name+" "+ordenCrecimientoPaises[4].value.toFixed(2)+"%");
 

  divSeguimientoPais = d3.select('#seguimento_pais');
  
  //Si no está el menseje inicial se debe modificar los datos del pais clickado
  if(divSeguimientoPais.select('#pais_seguido').text()!="Haga click en un país para seguir su crecimiento") {
    cambiarDatosPaisSeguido(agnos);
  }

  // Cambiamos los colores del mapa
  g.data(countries.features);

  svg.selectAll('text').remove();
  g.selectAll('title').remove();
  d3.selectAll(".country")
  .style("fill",d => {
    if (d.value) {
      if(d.value>0){
        if(d.value <= meanPosGrow){
        
          return interpolateColorPos(
            d3.scaleLinear()
              .domain([0,meanPosGrow])
              .range([0,1])(d.value)
          );
        }
        else{
          return interpolateColorVeryPos(
            d3.scaleLinear()
              .domain([meanPosGrow,maxPop])
              .range([0,1])(d.value)
          );
        }
      }
      else{
        if(d.value >= meanNegGrow){

          return interpolateColorNeg(
            d3.scaleLinear()
              .domain([meanNegGrow,0])
              .range([0,1])(d.value)
          );
        }
        else{
          return interpolateColorVeryNeg(
            d3.scaleLinear()
              .domain([minPop,meanNegGrow])
              .range([0,1])(d.value)
          );
        }
      }
    } else {
      return "gray"; 
    }
  })
  .append('title')
  .text((d) => {
    return (d.value) 
    ? ("País: " + d.name + "\nCreciemiento: " + d.value.toFixed(2) + "% ")
    : "Sin datos";
  });

  // Modificamos el texto de la leyenda
  svg.append("text")
  .attr("x", rectX + sectionWidth*(numSections/2)+2*sectionWidth)
  .attr("y", rectY -  rectHeight)
  .attr("text-anchor", "middle")
  .attr("dominant-baseline", "middle")
  .attr("fill", "black")
  .text(0 + "%"); 

  svg.append("text")
  .attr("x", rectX + sectionWidth)
  .attr("y", rectY -  rectHeight)
  .attr("text-anchor", "middle")
  .attr("dominant-baseline", "middle")
  .attr("fill", "black")
  .text(Math.round(minPop) + "%"); 

  svg.append("text")
  .attr("x", rectX +sectionWidth*numSections - sectionWidth / 2)
  .attr("y", rectY -  rectHeight)
  .attr("text-anchor", "middle")
  .attr("dominant-baseline", "middle")
  .attr("fill", "black")
  .text(Math.round(maxPop) + "%"); 

  svg.append("text")
  .attr("x", rectX + sectionWidth*(3*numSections/4)+2*sectionWidth)
  .attr("y", rectY -  rectHeight)
  .attr("text-anchor", "middle")
  .attr("dominant-baseline", "middle")
  .attr("fill", "black")
  .text(Math.round(meanPosGrow) + "%"); 

  svg.append("text")
  .attr("x", rectX + sectionWidth*(numSections/4)+2*sectionWidth)
  .attr("y", rectY -  rectHeight)
  .attr("text-anchor", "middle")
  .attr("dominant-baseline", "middle")
  .attr("fill", "black")
  .text(meanNegGrow.toFixed(1)+ "%"); 
}

// Puesto del crecimiento del pais comparado con el resto de paises del mundos 
var puestoPais;
function cambiarDatosPaisSeguido(agnos){
  if(countries.features[paisClickado].name  !== undefined){

    divSeguimientoPais.select('#pais_seguido').text("Población "+countries.features[paisClickado].name
    +" entre "+ Math.round(agnos[0]) +"-"+Math.round(agnos[1]));
    divSeguimientoPais.select('#crecimiento_pais').text("Crece un " + countries.features[paisClickado].value.toFixed(2) 
    + "% pasando de "+countries.features[paisClickado].popInic.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    + " a "+countries.features[paisClickado].popFin.replace(/\B(?=(\d{3})+(?!\d))/g, "."));  
    puestoPais = 1;
    for(puestoPais; puestoPais<numPaisesPintados;puestoPais++){
      if(countries.features[paisClickado].value == ordenCrecimientoPaises[puestoPais].value) break;
    }
    if(puestoPais==226) puestoPais=0 //No se ha encontrado el país por lo que es el país que menos crece 
    puestoPais = 226-puestoPais;
    divSeguimientoPais.select('#puesto_crecimiento_mundo').text("Es el país " + puestoPais+" de 226 con mayor tasa de crecimiento");
  }

  else{
    divSeguimientoPais.select('#pais_seguido').text("No hay datos en el pais seleccionado");
    divSeguimientoPais.select('#crecimiento_pais').html("No se dispone información de algunas islas al sur pequeñas como las isla Georgias del Sur "+
    "la Antártida, pequeños países como Mónaco o San Marino y de Somalilandia (país en el cuerno de África)"+
    " que no tiene reconocimiento internacional.");
    divSeguimientoPais.select('#crecimiento_continente').text("");
    divSeguimientoPais.select('#puesto_crecimiento_mundo').text("");

  }
}