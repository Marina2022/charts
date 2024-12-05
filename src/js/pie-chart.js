import "@/css/style.css"
import "@/css/pie-chart.scss"

import * as d3 from 'd3';

async function draw() {
  // Data
  const dataset = await d3.csv('pie-data.csv')

  // Dimensions
  let dimensions = {
    width: 600,
    height: 600,
    margins: 10,
  };

  dimensions.ctrWidth = dimensions.width - dimensions.margins * 2
  dimensions.ctrHeight = dimensions.height - dimensions.margins * 2

  // Draw Image
  const svg = d3.select('#chart')
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)

  const ctr = svg.append("g") // <g>
    .attr(
      "transform",
      `translate(${dimensions.margins}, ${dimensions.margins})`
    )

  // Pies


// переформатирует данные в нужный массивчег  
  const populationPie = d3.pie()
    .value(d => d.value)
    //.sort((a,b)=>a.value-b.value)
    .sort(null)

  // получаем отформатированные данные с углами и всем необходимым для построения Pie chart (спец. формат для передачи в data и потом в arc 
  const slices = populationPie(dataset)

  const radius = dimensions.ctrHeight / 2


  const ageArray = dataset.map(item => item.name)
  console.log('ageArray', ageArray)

  const colorScale = d3.scaleOrdinal()
    .domain(ageArray)
     .range(d3.quantize(d=>d3.interpolateSpectral(d), dataset.length)) // Встроенная палитра
    //.range(d3.quantize(d => d3.interpolateRdBu(d), dataset.length)) // Встроенная палитра


// задаем формат наших слайсов
  const arc = d3.arc()
    .outerRadius(radius)
     .innerRadius(0)
    // .padAngle(.02)
    // .cornerRadius(10)

  // задаем формат наших слайсов
  const arc2 = d3.arc()
    .outerRadius(radius)
    .innerRadius(220)
    

  const arcGroup = ctr.append('g')
    // из центра контейнера надо рисовать:
    .attr('transform', `translate(${dimensions.ctrWidth / 2}, ${dimensions.ctrHeight / 2})`)

  console.log('slices', slices)

  arcGroup.selectAll('path')
    .data(slices)
    .join('path')
    .attr('d', arc)  // в функцию arc, которую создали с помощью  d3.arc().. 
    // передаем данные, приведенные к нужному формату с помощью функции  const populationPie = d3.pie()
    .attr('fill', (d, i) => colorScale(i)); // Установка цвета  


  const labelsGroup = ctr.append('g')
    // из центра контейнера надо рисовать:
    .attr('transform', `translate(${dimensions.ctrWidth / 2}, ${dimensions.ctrHeight / 2})`)
    .classed('labels', true)
    .selectAll('text')
    .data(slices)
    .join('text')
    .attr('transform', d => `translate(${arc2.centroid(d)})`)
    
    .call(sel=>{      
      sel.append('tspan')
        .text(d => d.data.name)
        .attr('y', -5)      
    })

    .call(sel=>{
      sel.append('tspan')
        .filter(d => d.endAngle - d.startAngle > 0.25)
        
        .text(d => d.data.value)
        .attr('y', 9)
        .attr('x', 0)

    })
    
}

draw()