import '@/css/heat-map.scss'
import * as d3 from 'd3';

async function draw(el, scale) {
  // Data
  const dataset = await d3.json('data-heat-map.json')
  dataset.sort((a,b)=>a-b)

  // Dimensions
  let dimensions = {
    width: 600,
    height: 150,
  };
  
  let box = 30

  // Draw Image
  const svg = d3.select(el)
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)

  // scales
  
  let colorScale
  
  if (scale === 'linear') {
    colorScale = d3.scaleLinear()
      .domain(d3.extent(dataset))      
      .range(['white', 'red'])
    
  }
  
  if (scale === 'quantize') {    
    colorScale = d3.scaleQuantize()
      .domain(d3.extent(dataset))
      .range(['white', 'pink', 'red'])
  }
  
  if (scale === 'quantile') {
    colorScale = d3.scaleQuantile()
      .domain(dataset)
      .range(['white', 'pink', 'red'])
  }

  if (scale === 'threshold') {
    colorScale = d3.scaleThreshold()
      .domain([45200, 135600])      
      .range(d3.schemeReds[3])
  }
  
  svg.append('g')
    .attr('stroke', 'black')
    .attr('fill', '#ddd')
    .attr('transform', 'translate(2, 2)')

    .selectAll('rect')
    .data(dataset)
    .join('rect')
    .attr('x', (d,i)=>{
      return (i % 20) * box
    })

    .attr('y', (d,i)=>{
      return parseInt(i / 20) * box
    })

    .attr('width', box - 3)
    .attr('height', box - 3)     
    .attr('fill', d=>colorScale(d))

}

draw('#heatmap1', "linear")

draw('#heatmap2', "quantize")

draw('#heatmap3', "quantile")

draw('#heatmap4', "threshold")