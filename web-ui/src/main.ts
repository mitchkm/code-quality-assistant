import d3 = require("d3");
import { exampleProcessedData } from "./example";


// tslint:disable-next-line: whitespace
const data: any = "{$code_analysis_json}";

// TODO process data:

const processedData: any = exampleProcessedData;

//declare margin width and height
let margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 650 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom;

// general setting for treemap
let color = d3.scaleOrdinal(d3.schemeSet2);

let treemap = d3.treemap()
    .size([width, height])
    .tile(d3.treemapResquarify)
    .paddingTop(3)
    .paddingBottom(3)
    .paddingLeft(3)
    .paddingRight(3);

let svg = d3.select("body").append("svg")
    .attr("width", (width + margin.left + margin.right) + "px")
    .attr("height", (height + margin.top + margin.bottom) + "px")
    .append("g")
    .attr("class", "node")
    .attr('transform', function(d) {
        return 'translate(' + margin.left + "," + 0 + ')'
    });


// create hierarchy of data
const root = d3.hierarchy(processedData);

const nodes = treemap(root
    .sum(d => d.value)
    .sort((a, b) => a.value - b.value))
    .leaves();

svg
    .selectAll("rect")
    .data(nodes)
    .enter()
    .append("rect")
    .attr("x", function(d) { return d.x0 + "px"; })
    .attr("y", function(d) { return d.y0 + "px"; })
    .attr("width", function (d) { return d.x1 - d.x0 + "px"; })
    .attr("height", function (d) { return d.y1 - d.y0 + "px"; })
    .style("stroke", "white")
    .style("fill",  function (d) { return d.children ? null : color((d.parent.data as any).name);});

svg
    .selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .attr("x", function (d) { return d.x0 + 5; })
    .attr("y", function (d) { return d.y0 + 10; })
    .text(function (d) { return d.children ? undefined : (d.data as any).name; })
    .attr("font-size", "11px")
    .attr("font-family", "Arial" )
    .attr("fill", "white");

svg
    .selectAll("vals")
    .data(nodes)
    .enter()
    .append("text")
    .attr("x", function (d) { return d.x0 + 5; })
    .attr("y", function (d) { return d.y0 + 20; })
    .text(function (d) { return d.children ? undefined : (d.data as any).value; })
    .attr("font-size", "9px")
    .attr("font-family", "Arial")
    .attr("fill", "white");