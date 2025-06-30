const slider = d3.select("#slider");
const width = window.innerWidth;
const height = window.innerHeight;
const worldMap =  'https://unpkg.com/visionscarto-world-atlas@0.1.0/world/50m.json';

var svg = d3.select('svg');
var g = svg.append('g');
 
// Change the center of the image to the real center and use a scale
// so the entire map fits on laptops and standard dimension screens
const projection = d3.geoNaturalEarth1().scale([width/8]).translate([0.9*width/3, height/2.5]);
const pathGenerator = d3.geoPath().projection(projection);

// Colorblind-friendly scale taken from https://venngage.com/tools/accessible-color-palette-generator
// This prevents accessibility issues for color blindness but is not implemented here
// This scale comes from https://www.learnui.design/tools/data-color-picker.html#divergent
var lowerColor = '#de425b';
var middleLowerColor = '#e87f86';
var middleColor = '#e5e5e5';
var middleUpperColor= '#7fac6c';
var upperColor = '#488f31';

var interpolateColorVeryPos = d3.interpolateRgb(middleUpperColor, upperColor);
var interpolateColorPos = d3.interpolateRgb(middleColor, middleUpperColor);
var interpolateColorNeg = d3.interpolateRgb(middleLowerColor, middleColor);
var interpolateColorVeryNeg = d3.interpolateRgb(lowerColor, middleLowerColor);

const yearsCount = 73; // number of years in the data
const totalCountriesData = 235;
const totalCountriesPainted = 226;
var countries; 
var populationAllYears;
var popWorld;

var minPopulationGrowth = Infinity; // Minimum population growth
var maxPopulationGrowth = 0; // Maximum population growth
var meanPositiveGrowth = 0; // Average positive growth
var meanNegativeGrowth = 0; // Average negative growth
var numCountriesGrowing = 0;
var numCountriesShrinking = 0;
var clickedCountry = 0;

// Variables used to paint the map and show statistics
var initialPopulation;
var finalPopulation;
var countriesGrowthOrder;

// Create the legend
// Position it in a part of the map without countries
const svgWidth = parseInt(svg.style("width"));
const svgHeight = parseInt(svg.style("height"));
const rectWidth = 0.2 * svgWidth;
const rectHeight = 0.02 * svgHeight;
const rectMarginX = 0.26 * svgWidth; 
const rectMarginY = 0.14 * svgHeight;

const rectX = rectMarginX;
const rectY = svgHeight - rectHeight - rectMarginY;

// Paint color rectangles that represent the data ranges
const numSections = 50;
const sectionWidth = rectWidth / numSections;

// Create the legend colors
const interpolateColorNegative = d3.interpolateRgb(lowerColor, middleColor);
const interpolateColorPositive = d3.interpolateRgb(middleColor, upperColor);
for (let i = 0; i < numSections; i++) {
  var sectionColor = interpolateColorNegative(i / numSections);
  if(i > numSections / 2){
    sectionColor = interpolateColorPositive(i / numSections);
  }
  svg.append("rect")
    .attr("x", rectX + i * sectionWidth)
    .attr("y", rectY)
    .attr("width", sectionWidth)
    .attr("height", rectHeight)
    .style("fill", sectionColor);
}

var countryTrackingDiv;
// Years in which countries are painted according to the data,
// initial index is 60 and since data starts in 1950 initial year is 2010
var startYearIndex = 60;
var endYearIndex = 73;

// Load the data and paint the map between years 2010 and 2021 initially,
// which can later be changed
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
    // Select a country when clicking it
    .on("click", function (event, d) {
      countryTrackingDiv = d3.select('#seguimento_pais');
      // d is the clicked country index in the countries array
      clickedCountry = d;
      updateTrackedCountryData([startYearIndex + 1950, endYearIndex + 1950]);
    });
    paintMap([2010, 2023]);
  });

// To enable zoom with d3 v5
svg.call(d3.zoom().on('zoom', () => {
  g.attr('transform', d3.event.transform);
}));

// Event fired when moving the slider handles
// Taken from https://metroui.org.ua/double-slider.html#_slider_hint_position
function changeData(e){
  const years = [arguments[0], arguments[1]];
  paintMap(years);
}

// Paint data on the map and adjust legend values
function paintMap(years){

  startYearIndex = Math.round(years[0]) - 1950;
  endYearIndex = Math.round(years[1]) - 1950;
 
  minPopulationGrowth = Infinity; 
  maxPopulationGrowth = 0;
  let sumPositiveGrowth = 0; 
  let sumNegativeGrowth = 0; 
  numCountriesGrowing = 0;
  numCountriesShrinking = 0;

  initialPopulation = populationAllYears.slice(startYearIndex * totalCountriesData, (startYearIndex + 1) * totalCountriesData);
  finalPopulation = populationAllYears.slice(endYearIndex * totalCountriesData, (endYearIndex + 1) * totalCountriesData);

  // Find the countries from the data that are in the map and assign
  // a value to paint, also use averages for scale and legend texts
  for(let i = 0; i < countries.features.length; i++){
    for(let j = 0; j < finalPopulation.length; j++){
      if(finalPopulation[j].id == countries.features[i].properties.a3){
        countries.features[i].value = 100 * parseInt(finalPopulation[j].pop) / parseInt(initialPopulation[j].pop) - 100;
        countries.features[i].popInitial = initialPopulation[j].pop;
        countries.features[i].popFinal = finalPopulation[j].pop;
        countries.features[i].name = finalPopulation[j].name;
        if(countries.features[i].value >= 0) {
          sumPositiveGrowth += countries.features[i].value;
          numCountriesGrowing++;
        }
        else {
          sumNegativeGrowth += countries.features[i].value;
          numCountriesShrinking++;
        }
        if(countries.features[i].value > maxPopulationGrowth) maxPopulationGrowth = countries.features[i].value;
        else if(countries.features[i].value < minPopulationGrowth) minPopulationGrowth = countries.features[i].value;
      }         
    }
  }    

  meanPositiveGrowth = sumPositiveGrowth / numCountriesGrowing;
  meanNegativeGrowth = sumNegativeGrowth / numCountriesShrinking;

  // Update the statistics on the right panel
  const worldGrowthDiv = d3.select('#crecimiento_mundial');
  worldGrowthDiv.select('h3').text("World growth between " + Math.round(years[0]) + " - " + Math.round(years[1]));
 
  worldGrowthDiv.select("#textWorldGrow").text('The world population goes from ' + popWorld[startYearIndex].pop.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " to " + popWorld[endYearIndex].pop.replace(/\B(?=(\d{3})+(?!\d))/g, "."));
  const worldGrowthPercent = 100 * popWorld[endYearIndex].pop / popWorld[startYearIndex].pop - 100;
   
  worldGrowthDiv.select("#textWorldGrowPercentage").text('The world population grows by ' + worldGrowthPercent.toFixed(2) + "%");

  countriesGrowthOrder = countries.features.filter(country => country.value !== undefined);
  countriesGrowthOrder = countriesGrowthOrder.sort((a, b) => a.value - b.value);

  const fastestGrowingCountriesDiv = d3.select('#paises_que_mas_crecen');
  fastestGrowingCountriesDiv.select('#pais_mas_crece1').text(countriesGrowthOrder[totalCountriesPainted-1].name + " " + countriesGrowthOrder[totalCountriesPainted-1].value.toFixed(2) + "%");
  fastestGrowingCountriesDiv.select('#pais_mas_crece2').text(countriesGrowthOrder[totalCountriesPainted-2].name + " " + countriesGrowthOrder[totalCountriesPainted-2].value.toFixed(2) + "%");
  fastestGrowingCountriesDiv.select('#pais_mas_crece3').text(countriesGrowthOrder[totalCountriesPainted-3].name + " " + countriesGrowthOrder[totalCountriesPainted-3].value.toFixed(2) + "%");
  fastestGrowingCountriesDiv.select('#pais_mas_crece4').text(countriesGrowthOrder[totalCountriesPainted-4].name + " " + countriesGrowthOrder[totalCountriesPainted-4].value.toFixed(2) + "%");
  fastestGrowingCountriesDiv.select('#pais_mas_crece5').text(countriesGrowthOrder[totalCountriesPainted-5].name + " " + countriesGrowthOrder[totalCountriesPainted-5].value.toFixed(2) + "%");

  const fastestShrinkingCountriesDiv = d3.select('#paises_que_mas_decrecen');
  fastestShrinkingCountriesDiv.select('#pais_mas_decrece1').text(countriesGrowthOrder[0].name + " " + countriesGrowthOrder[0].value.toFixed(2) + "%");
  fastestShrinkingCountriesDiv.select('#pais_mas_decrece2').text(countriesGrowthOrder[1].name + " " + countriesGrowthOrder[1].value.toFixed(2) + "%");
  fastestShrinkingCountriesDiv.select('#pais_mas_decrece3').text(countriesGrowthOrder[2].name + " " + countriesGrowthOrder[2].value.toFixed(2) + "%");
  fastestShrinkingCountriesDiv.select('#pais_mas_decrece4').text(countriesGrowthOrder[3].name + " " + countriesGrowthOrder[3].value.toFixed(2) + "%");
  fastestShrinkingCountriesDiv.select('#pais_mas_decrece5').text(countriesGrowthOrder[4].name + " " + countriesGrowthOrder[4].value.toFixed(2) + "%");

  countryTrackingDiv = d3.select('#seguimento_pais');
  
  // If the initial message is not present, update the tracked country data
  if(countryTrackingDiv.select('#pais_seguido').text() != "Click on a country to track its growth") {
    updateTrackedCountryData(years);
  }

  // Change the map colors
  g.data(countries.features);

  svg.selectAll('text').remove();
  g.selectAll('title').remove();
  d3.selectAll(".country")
  .style("fill", d => {
    if (d.value) {
      if(d.value > 0){
        if(d.value <= meanPositiveGrowth){
          return interpolateColorPos(
            d3.scaleLinear()
              .domain([0, meanPositiveGrowth])
              .range([0,1])(d.value)
          );
        }
        else {
          return interpolateColorVeryPos(
            d3.scaleLinear()
              .domain([meanPositiveGrowth, maxPopulationGrowth])
              .range([0,1])(d.value)
          );
        }
      }
      else {
        if(d.value >= meanNegativeGrowth){
          return interpolateColorNeg(
            d3.scaleLinear()
              .domain([meanNegativeGrowth, 0])
              .range([0,1])(d.value)
          );
        }
        else {
          return interpolateColorVeryNeg(
            d3.scaleLinear()
              .domain([minPopulationGrowth, meanNegativeGrowth])
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
    ? ("Country: " + d.name + "\nGrowth: " + d.value.toFixed(2) + "% ")
    : "No data";
  });

  // Modify the legend text
  svg.append("text")
  .attr("x", rectX + sectionWidth * (numSections/2) + 2 * sectionWidth)
  .attr("y", rectY - rectHeight)
  .attr("text-anchor", "middle")
  .attr("dominant-baseline", "middle")
  .attr("fill", "black")
  .text(0 + "%"); 

  svg.append("text")
  .attr("x", rectX + sectionWidth)
  .attr("y", rectY - rectHeight)
  .attr("text-anchor", "middle")
  .attr("dominant-baseline", "middle")
  .attr("fill", "black")
  .text(Math.round(minPopulationGrowth) + "%"); 

  svg.append("text")
  .attr("x", rectX + sectionWidth * numSections - sectionWidth / 2)
  .attr("y", rectY - rectHeight)
  .attr("text-anchor", "middle")
  .attr("dominant-baseline", "middle")
  .attr("fill", "black")
  .text(Math.round(maxPopulationGrowth) + "%"); 

  svg.append("text")
  .attr("x", rectX + sectionWidth * (3 * numSections / 4) + 2 * sectionWidth)
  .attr("y", rectY - rectHeight)
  .attr("text-anchor", "middle")
  .attr("dominant-baseline", "middle")
  .attr("fill", "black")
  .text(Math.round(meanPositiveGrowth) + "%"); 

  svg.append("text")
  .attr("x", rectX + sectionWidth * (numSections / 4) + 2 * sectionWidth)
  .attr("y", rectY - rectHeight)
  .attr("text-anchor", "middle")
  .attr("dominant-baseline", "middle")
  .attr("fill", "black")
  .text(meanNegativeGrowth.toFixed(1) + "%"); 
}

// Ranking of the country's growth compared to other countries
var countryRank;
function updateTrackedCountryData(years){
  if(countries.features[clickedCountry].name !== undefined){

    countryTrackingDiv.select('#pais_seguido').text("Population of " + countries.features[clickedCountry].name
    + " between " + Math.round(years[0]) + "-"+Math.round(years[1]));
    countryTrackingDiv.select('#crecimiento_pais').text("Grows  " + countries.features[clickedCountry].value.toFixed(2) 
    + "% from "+countries.features[clickedCountry].popInic.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    + " to "+countries.features[clickedCountry].popFinal.replace(/\B(?=(\d{3})+(?!\d))/g, "."));  
    countryRank = 1;
    for(countryRank; countryRank<totalCountriesPainted;countryRank++){
      if(countries.features[clickedCountry].value == countriesGrowthOrder[countryRank].value) break;
    }
    if(countryRank==226) countryRank=0 //If the selected country is the one with less growing
    countryRank = 226-countryRank;
    countryTrackingDiv.select('#puesto_crecimiento_mundo').text("It is the country " + countryRank+" of 226 with less growing rate");
  }

  else{
    countryTrackingDiv.select('#pais_seguido').text("There is no data for the selected country");
    countryTrackingDiv.select('#crecimiento_pais').html("Information is not available for some small southern islands such as South Georgia and the South Sandwich Islands in Antarctica, small countries like Monaco or San Marino, and Somaliland (a country in the Horn of Africa) which does not have international recognition.");
    countryTrackingDiv.select('#crecimiento_continente').text("");
    countryTrackingDiv.select('#puesto_crecimiento_mundo').text("");

  }
}