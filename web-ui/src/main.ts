import d3 = require("d3");

const data = {
    "name": "Max",
    "value": 100,
    "children": [
        {
            "name": "Sylvia",
            "value": 75,
            "children": [
                { "name": "Craig", "value": 25 },
                { "name": "Robin", "value": 25 },
                { "name": "Anna", "value": 25 }
            ]
        },
        {
            "name": "David",
            "value": 75,
            "children": [
                { "name": "Jeff", "value": 25 },
                { "name": "Buffy", "value": 25 }
            ]
        },
        {
            "name": "Mr X",
            "value": 75
        }
    ]
};

var canvas = d3.select("body").append("svg")
    .attr("width", 500)
    .attr("height", 500);

var treemap = d3.treemap()
    .size([500, 500])
    .padding(2);

var root = d3.hierarchy(data);

const nodes = treemap(root
    .sum(d => d.value)
    .sort((a, b) => a.value - b.value))
    .descendants();

console.log(nodes);

var color = d3.scaleOrdinal(d3.schemeCategory10);

var cells = canvas.selectAll(".cell")
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", "cell");

cells.append("rect")
    .attr('x', function (d) { return d.x0 + "px"; })
    .attr('y', function (d) { return d.y0 + "px"; })
    .attr('width', function (d) { return (d.x1 - d.x0) + "px"; })
    .attr('height', function (d) { return d.y1 - d.y0 + "px"; })
    .style("stroke", "white")
    .style("fill", function (d) { return d.children ? null : color((d.parent.data as any).name); });

    cells.append("text")
    .attr("x", function (d) { return d.x0 + 5; })
    .attr("y", function (d) { return d.y0 + 20; })
    .text(function (d) { return d.children ? null : (d.data as any).name; })
    .attr("font-size", "15px")
    .attr("fill", "white");
