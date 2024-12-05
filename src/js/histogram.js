import "@/css/histogram.scss"
import * as d3 from 'd3';

let svg

async function draw() {
  // Data
  const dataset = await d3.json('data.json')

  // Dimensions
  let dimensions = {
    width: 800,
    height: 400,
    margins: 50
  };

  dimensions.ctrWidth = dimensions.width - dimensions.margins * 2
  dimensions.ctrHeight = dimensions.height - dimensions.margins * 2

  // Draw Image
  svg = d3.select('#chart')
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)

  const ctr = svg.append("g") // <g>
    .attr(
      "transform",
      `translate(${dimensions.margins}, ${dimensions.margins})`
    )

  const labelGroup = ctr.append('g')
  const xAxisGroup = ctr.append('g')
  const yAxisGroup = ctr.append('g')


  const meanLine = ctr.append('line')
    .classed('mean-line', true)

  //****************************


  

  histogram('humidity')

  
  // events

  function histogram(metric) {

    const exitTransition = d3.transition()          
    const updateTransition = exitTransition.transition()

    //
    // const labelsExitTransition = d3.transition()
    // const labelsUpdateTransition = exitTransition.transition()

    //scales
    const xAccessor = (d) => d.currently[metric]
    const yAccessor = (d) => d.length


    const xScale = d3.scaleLinear()
      .domain(d3.extent(dataset, xAccessor))
      .range([0, dimensions.ctrWidth])
      .nice()


    // bin

    const bin = d3.bin()
      .domain(xScale.domain())
      .value(xAccessor)
      .thresholds(10)

    const newDataset = bin(dataset)


    // heightScale

    const heightScale = d3.scaleLinear()
      .domain(d3.extent([0, d3.max(newDataset, yAccessor)]))
      .range([0, dimensions.ctrHeight])
      .nice()

    const yScale = d3.scaleLinear()
      .domain(d3.extent([0, d3.max(newDataset, yAccessor)]))
      .range([dimensions.ctrHeight, 0])
      .nice()


    // bars 

    ctr.selectAll('rect')
      .data(newDataset)
      .join((enter) => {
          return enter.append('rect')
            .attr("width", d => dimensions.ctrWidth / newDataset.length - 10)
            .attr("height", d => 0)
            .attr("x", d => xScale(d.x0))
            .attr("y", d => dimensions.ctrHeight)
            .attr("fill", "dodgerblue")
        },
        update => update,
        exit => {
          return exit.transition(exitTransition)
            .attr("y", d => dimensions.ctrHeight)
            .attr("height", d => 0)
            .remove()
        }
      )
      .transition(updateTransition)      
      .attr("width", d => dimensions.ctrWidth / newDataset.length - 10)
      .attr("height", d => heightScale(d.length))
      .attr("x", d => xScale(d.x0))      
      .attr("y", d => yScale(yAccessor(d)))
      .attr("fill", "dodgerblue")


    const mean = d3.mean(dataset, xAccessor)

    meanLine
      .raise()
      .transition(updateTransition)
      .attr('x1', xScale(mean))
      .attr('x2', xScale(mean))
      .attr('y1', dimensions.ctrHeight)
      .attr('y2', 0)
    
    
    // labels

    labelGroup
      .selectAll('text')
      .data(newDataset)
      // .join('text')
      .join((enter) => {
          return enter.append('text')            
            .attr("x", d => xScale(d.x0) + 10)
            .attr("y", d => dimensions.ctrHeight - 10)
            .transition(exitTransition)
            .text(d => `${yAccessor(d)} days`)
            
        },
        update => update,
        exit => exit
          .remove()
      )

      .transition(updateTransition)
      // .delay(250)
      .attr("x", d => xScale(d.x0) + 10)
      .attr("y", d => yScale(yAccessor(d)) - 10)
      .text(d => `${yAccessor(d)} days`)

    
  

    // axis

    const xAxis = d3.axisBottom(xScale)
      .ticks(8)

    xAxisGroup
      .attr('transform', `translate(0, ${dimensions.ctrHeight})`)
      .classed("axis", true)
      .transition()
      .call(xAxis)

    const yAxis = d3.axisLeft(yScale)
      .ticks(10)

    yAxisGroup
      .call(yAxis)
      .classed('axis', true)
  }

  d3.select("#metric")
    .on('change', (e) => {
      histogram(e.target.value)
    })
  
  
}

draw('humidity')


const squareData = [1, 1.2, 1.3, 1.4, 1.5]

const wrappers = d3.select('.cont')
  .selectAll('div')
  .data(squareData)
  .join('div')
  .classed('wrapper', true)


wrappers
  .transition()
  .style('transform', d => `scale(${d})`)

wrappers.append('div')
  .classed('circle', true)


wrappers.append('div')
  .classed('square', true)


d3.select('.btn')
  .on('click', () => {
    wrappers
      .transition()
      .style('transform', 'scale(1)')
  })