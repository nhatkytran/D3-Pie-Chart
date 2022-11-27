import { dims, cent, arcPath } from './utils.js';
import { arcTweenEnter, arcTweenExit, arcTweenUpdate } from './arcTween.js';

const svg = d3
  .select('.canvas')
  .append('svg')
  .attr('width', dims.width + 150)
  .attr('height', dims.height + 150);

const graph = svg
  .append('g')
  .attr('transform', `translate(${cent.x}, ${cent.y})`);

const pie = d3
  .pie()
  .sort(null)
  .value(d => d.cost);

const color = d3.scaleOrdinal(d3['schemeSet3']);

const legendGroup = svg
  .append('g')
  .attr('transform', `translate(${dims.width + 40}, 15)`);
const legend = d3.legendColor().shape('circle').shapePadding(10).scale(color);

const tip = d3
  .tip()
  .attr('class', 'tip card')
  .html(d => {
    return `
      <div>${d.data.name}</div>
      <div>${d.data.cost}</div>
      <div class="delete">Click slice to delete</div>
    `;
  });

graph.call(tip);

const graphController = (data, handleDeleteDoc) => {
  color.domain(data.map(d => d.name));
  legendGroup.call(legend);
  legendGroup.selectAll('text').attr('fill', 'white');

  const angles = pie(data);
  // Frlix remove item behavior
  const paths = graph.selectAll('path').data(angles, d => d.data.name);

  paths.exit().transition().duration(750).attrTween('d', arcTweenExit).remove();

  paths
    .attr('d', d => arcPath(d))
    .transition()
    .duration(750)
    .attrTween('d', arcTweenUpdate);

  paths
    .enter()
    .append('path')
    .attr('class', 'arc')
    .attr('stroke', '#fff')
    .attr('stroke-width', 3)
    .attr('fill', d => color(d.data.name))
    .each(function (d) {
      this._current = d;
    })
    .transition()
    .duration(750)
    .attrTween('d', arcTweenEnter);

  graph
    .selectAll('path')
    .on('mouseover', (event, doc) => {
      tip.show(doc, event.target);
      handleMouseOver(event, doc);
    })
    .on('mouseout', (event, doc) => {
      tip.hide();
      handleMouseOut(event, doc);
    })
    .on('click', handleDeleteDoc);
};

const handleMouseOver = event => {
  d3.select(event.target)
    .transition('changeSliceFill')
    .duration(300)
    .attr('fill', 'white');
};

const handleMouseOut = (event, doc) => {
  d3.select(event.target)
    .transition('changeSliceFill')
    .duration(300)
    .attr('fill', color(doc.data.name));
};

export default graphController;
