const width = window.innerWidth;
const height = window.innerHeight;

const worldMap = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'
const poblacion2021 = './poblacion_anno2021.xlsx'

const svg = d3.select('svg');
// Cambio el centro de la imagaen por el autentico centro y uso una escala
//para que pinte todo el mapa en portatatiles y pantallas con dimensiones estandar

const projection = d3.geoNaturalEarth1().scale([width/8.5]).translate([0.9*width/3,height/2.5]);
const pathGenerator = d3.geoPath().projection(projection);

var color = d3.scaleQuantize()
 .range(["rgb(237,248,233)", "rgb(186,228,179)",
 "rgb(116,196,118)", "rgb(49,163,84)", "rgb(0,109,44)"]);


svg.append('path')

d3.json(worldMap)
.then(data => {
    const countries = topojson.feature(data, data.objects.countries);
    svg.selectAll('path').data(countries.features)
    .enter().append('path')
        .attr('class', 'country')
        .attr('d', pathGenerator);
});

d3.csv("")
color.domain([
    d3.min(data, function(d) { return d.value; }),
    d3.max(data, function(d) { return d.value; })
    ]);