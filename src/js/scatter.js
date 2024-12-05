import "@/css/style.css"
import "@/css/scatter.scss"

import * as d3 from 'd3';

const draw = async () => {
  const dataSet = await d3.json('/data.json')

  const dimensions = {
    width: 800,
    height: 800,
    margin: {
      top: 50,
      bottom: 50,
      right: 50,
      left: 50
    }
  }

  dimensions.ctrWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
  dimensions.ctrHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom

  const svg = d3.select('#chart')
    .append('svg')
    .attr('width', dimensions.width)
    .attr('height', dimensions.height)

  const ctr = svg.append('g')
    .attr("transform", `translate(${dimensions.margin.left}, ${dimensions.margin.top})`)
  const xAccessor = (d) => d.currently.humidity
  const yAccessor = (d) => d.currently.apparentTemperature

  const max = d3.extent(dataSet, xAccessor)[1]

  const xScale = d3.scaleLinear()
    .domain(d3.extent(dataSet, xAccessor))
    .rangeRound([0, dimensions.ctrWidth])

  const yScale = d3.scaleLinear()
    .domain(d3.extent(dataSet, yAccessor))
    .rangeRound([dimensions.ctrHeight, 0])
    .nice()
    .clamp(true)


  const circles = ctr
    .selectAll('circle')
    .data(dataSet)
    .join('circle')
    .attr("cx", d => xScale(xAccessor(d)))
    .attr("cy", d => yScale(yAccessor(d)))
    .attr('r', 5)
    .attr('fill', 'red')

  const xAxis = d3.axisBottom(xScale)
    .ticks(5)
    .tickFormat(label => label * 100 + '%')

  const xAxisGroup = ctr.append('g')
    .attr('transform', `translate(0, ${dimensions.ctrHeight})`)
    .call(xAxis)
    .classed("axis", true)


  xAxisGroup.append('text')
    .text("Humidity")
    .attr("fill", "blue")
    .attr("x", dimensions.ctrWidth / 2)
    .attr("y", dimensions.margin.bottom - 10)
    .style("font-size", "18px")

  const yAxis = d3.axisLeft(yScale)

  const yAxisGroup = ctr.append('g')
    .call(yAxis)
    .classed("axis", true)

  
  // координаты label для оси Y
  const textX = -34 
  const textY = dimensions.ctrHeight / 2
  
  
  yAxisGroup.append('text')
    .attr("fill", "black")
    .attr("x", textX)
    .attr("y", textY)
    .html('Temperature &deg;F')
    .classed('yAxisLabel', true)
    .attr("transform",
      `rotate(270, ${textX}, ${textY})`)  // textX, textY - transform-origin, точно, вокруг которой будет вращение
  
  //**************************
  
  // часть  с тултипами (мой вполне рабочий вариант):

  // let tooltip
  //
  // circles
  //   .on('mouseenter', function(e){
  //     const x =  this.getAttribute('cx')
  //     const y =  this.getAttribute('cy')
  //    
  //     tooltip  = ctr.append('rect')
  //       .attr('x', x)
  //       .attr('y', y - 26 )
  //       .attr('width', 20)
  //       .attr('height', 20)
  //       .attr('fill', 'green')
  //   })
  //   .on('mouseleave', function(e){
  //     tooltip.remove()        
  //   })


  circles
    .on('mouseenter', function(e, datum){
      
      const tempFormatter = d3.format('.1f')
      const dateFormatter = d3.timeFormat('%b %-d, %Y')
      
      d3.select(this)
        .transition()
        .style('fill', 'green')
        .attr('r',8)
      
      d3.select('#tooltip')
        .style('display', 'block')      
        .style('left', e.clientX + 'px')      
        .style('top', e.clientY - 56 + 'px')  
        // .text(`humidity: ${ datum.currently.humidity * 100 }%`)
        .html(`<div>humidity: ${xAccessor(datum) * 100 }%<div>
               <div>date: ${dateFormatter(datum.currently.time * 1000)}<div>
               <div>temperature: ${tempFormatter(yAccessor(datum))}&deg;<div>
              `)
    })
    .on('mouseleave', function(e){
      d3.select(this)
        .transition()
        .style('fill', 'red')
        .attr('r',5)
      d3.select('#tooltip')
        .style('display', 'none')
    })
  
  
  
}



draw()