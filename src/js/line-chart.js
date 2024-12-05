import "@/css/style.css"
import "@/css/line-chart.scss"

import * as d3 from 'd3';

async function draw() {
  // Data
  const dataset = await d3.csv('data.csv')

  const parseTime = d3.timeParse("%Y-%m-%d")
  const xAccessor = d => parseTime(d.date)
  const yAccessor = d => parseInt(d.close)  // из строки в число просто переводим

  // Dimensions
  let dimensions = {
    width: 1000,
    height: 500,
    margins: 50,
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
  
  const tooltip = d3.select('#tooltip')
  
  const tooltipDot = ctr.append('cicle')
    .attr('r', 5)
    .attr('fill', '#fc8781')
    .attr('stroke', 'black')
    .attr('stroke-width', 2)
    .style('opacity', 0)
    .style('pointer-event', 'none')
  

  // Scales
  const yScale = d3.scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .rangeRound([dimensions.ctrHeight, 0])
    .nice()

  const xScale = d3.scaleTime()
    .domain(d3.extent(dataset, xAccessor))
    .rangeRound([0, dimensions.ctrWidth])
    .nice()


  // line generator

  const lineGenerator = d3.line()
    .x(d => xScale(xAccessor(d)))
    .y(d => yScale(yAccessor(d)))
     .curve(d3.curveBundle)

  
  
  // ctr
  //   .append('path')
  //   .attr('d', lineGenerator(dataset))
  //   .attr('fill', 'none')
  //   .attr('stroke', 'brown')

  // или так, если по-правильному:
  
  ctr
    .append('path')
    .datum(dataset)
    .attr('d', d=>lineGenerator(d))  // поскольки мы приджойнили данные, они тут будут 
  // если элементов много, то data, если один - то datum
    .attr('fill', 'none')
    .attr('stroke', 'brown')
    .on('touchmouse mousemove', function(event){
      
      const mousePos = d3.pointer(event, this) // Вернет массив типа [x, y]
      // this - это аргумент-target, относительно чего считать позицию, 
      // ваще-то координаты выдаются относительно контейнера .ctr, при чем тут this
      
      const date = xScale.invert(mousePos[0])
            
      const bisector = d3.bisector(xAccessor).left

      console.log(bisector(dataset, date))
      
      
      
    })
    .on('mouseleave')
  
  
  // points - my way

  //
  // ctr
  //   .selectAll('circle')
  //   .data(dataset)
  //   .join('circle')
  //   .attr('r', 5)
  //   .attr('fill', 'orange')
  //   .attr('cx', d=> {      
  //     return xScale(xAccessor(d))
  //   })
  //   .attr('cy', d=> yScale(yAccessor(d)))
  //
  //  
  
  
  const xAxis = d3.axisBottom(xScale)
  const yAxis = d3.axisLeft(yScale)
  
  ctr.append('g')
    .attr('transform', `translate(0, ${dimensions.ctrHeight})`)
    .call(xAxis)
  
  ctr.append('g')
    .call(yAxis)
  


}


draw()