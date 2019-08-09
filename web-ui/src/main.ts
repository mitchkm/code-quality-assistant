import d3 = require("d3");
import { exampleProcessedData } from "./example";


// tslint:disable-next-line: whitespace
const data: any = "{$code_analysis_json}";

// TODO process data:

const processedData: any = exampleProcessedData;

//declare width and height of treemap
let width = 80;
let height = 80;

// x and y scale for size of boxes
var x = d3.scaleLinear().domain([0, width]).range([0, width]);
var y = d3.scaleLinear().domain([0, height]).range([0, height]);

let color = d3.scaleOrdinal(d3.schemeSet2);

let treemap = d3.treemap()
    .size([width, height])
    .tile(d3.treemapResquarify)
    .round(false)
    .paddingTop(3)
    .paddingBottom(3)
    .paddingLeft(3)
    .paddingRight(3);

// create hierarchy of data
const root = d3.hierarchy(processedData);

const nodes = treemap(root
    .sum(d => d.value)
    .sort((a, b) => a.value - b.value));

// console.log(nodes);

// Adding attributes and styles to charts
var chart = d3.select("#chart");

var cells = chart
    .selectAll(".node")
    .data(nodes.descendants())
    .enter()
    .append("div")
    .attr("class", function(d) { return "node level-" + d.depth; })
	.attr("title", function(d) { return (d.data as any).name ? (d.data as any).name : "null"; });

cells
    .style("left", function(d) { return x(d.x0) + "%"; })
    .style("top", function(d) { return y(d.y0) + "%"; })
    .style("width", function(d) { return x(d.x1) - x(d.x0) + "%"; })
    .style("height", function(d) { return y(d.y1) - y(d.y0) + "%"; })
    .style("background-color", function(d) { while (d.depth > 2) d = d.parent; return color((d.data as any).name); })
    .on("click", zoom)
    .append("p")
    .attr("class", "label")
    .text(function(d) { return (d.data as any).name ? (d.data as any).name : "---"; })
    // .append("text")
    // .text(function(d){ return (d.data as any).value ? "\n" + (d.data as any).value : "---"});

// UP button to navigate to the parent cell easily
var parent = d3.select(".up")
    .datum(nodes)
    .on("click", zoom);


function zoom(d) {
    var currentDepth = d.depth;
    parent.datum(d.parent || nodes);
    x.domain([d.x0, d.x1]);
	y.domain([d.y0, d.y1]);
	
	var t = d3.transition()
    	.duration(800)
    	.ease(d3.easeCubicOut);
	
	cells
		.transition(t)
		.style("left", function(d) { return x(d.x0) + "%"; })
		.style("top", function(d) { return y(d.y0) + "%"; })
		.style("width", function(d) { return x(d.x1) - x(d.x0) + "%"; })
		.style("height", function(d) { return y(d.y1) - y(d.y0) + "%"; });
	
	cells // hide this depth and above
		.filter(function(d) { return d.depth <= currentDepth; })
		.classed("hide", function(d) { return d.children ? true : false });
	
	cells // show this depth + 1 and below
		.filter(function(d) { return d.depth > currentDepth; })
		.classed("hide", false);	
}