import * as d3 from 'd3';
//import {select} from 'd3';

// import object from '@/data.json'

//d3.json('/data.json').then(console.log)

const getData = async () => {
  const fetchResult = await d3.csv('/data.csv')


  const svg = d3.select('.chart')
    .append('svg')
    .attr('width', 500)
    .attr('height', 500);

  svg.append('circle')
    .attr('cx', 250)
    .attr('cy', 250)
    .attr('r', 100)
    .attr('fill', 'orange')

  d3.select('body')
    .append('p')

  d3.select('body')
    .append('p')

  d3.selectAll('p')
    .attr('class', 'kukuku')
    .text('Mara uraaa')
    .style('background-color', 'orange')
    .style('color', 'red')

  const data = [1, 2, 3, 4, 5]
  ///const data = fetchResult[0]

  
  const result = d3.select('.list')
    .selectAll('li')
    .data(data)
    .join('li')
    .text(d => d)
    .style('height', d => d * 30 + 'px')

  result.enter().append('img')

}

getData()





