import d3 = require("d3");
import { exampleProcessedData } from "./example";


// tslint:disable-next-line: whitespace
const data: any = {"$replace_me":0};

// TODO process data:

const processedData: any = exampleProcessedData;

const canvas = d3.select("body").append("svg")
    .attr("width", 500)
    .attr("height", 500);

const treemap = d3.treemap()
    .size([500, 500])
    .padding(2);

const root = d3.hierarchy(processedData);

const nodes = treemap(root
    .sum(d => d.value)
    .sort((a, b) => a.value - b.value))
    .descendants();

console.log(nodes);

const color = d3.scaleOrdinal(d3.schemeCategory10);

const cells = canvas.selectAll(".cell")
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", "cell");

cells.append("rect")
    .attr("x", function (d) { return d.x0 + "px"; })
    .attr("y", function (d) { return d.y0 + "px"; })
    .attr("width", function (d) { return (d.x1 - d.x0) + "px"; })
    .attr("height", function (d) { return d.y1 - d.y0 + "px"; })
    .style("stroke", "white")
    .style("fill", function (d) { return d.children ? undefined : color((d.parent.data as any).name); });

    cells.append("text")
    .attr("x", function (d) { return d.x0 + 5; })
    .attr("y", function (d) { return d.y0 + 20; })
    .text(function (d) { return d.children ? undefined : (d.data as any).name; })
    .attr("font-size", "15px")
    .attr("fill", "white");
