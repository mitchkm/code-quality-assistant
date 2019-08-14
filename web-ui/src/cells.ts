import Treemap from "./treemap";
import d3 = require("d3");

// singleton design pattern
let instance = undefined;

class Cells extends Treemap {

    color: ((x: number) => string);

    xScale: ((x: number) => number);

    yScale: ((x: number) => number);

    sizeOption: string;

    colorOption: string;

    constructor(width, height, data, sizeOption, colorOption, color) {

        super(width, height, data);

        if (!instance) {
            instance = this;
        }

        this.sizeOption = sizeOption;

        this.colorOption = colorOption;

        this.color = color;

        this.xScale = d3.scaleLinear().domain([0, width]).range([0, width]);

        this.yScale = d3.scaleLinear().domain([0, height]).range([0, height]);

        (this as any).chart = d3.select("#chart");

        (this as any).upButton = d3.select(".up");

        return instance;
    }

    private defineCells(nodes) {
        const sizeOption = this.sizeOption;
        const cells = (this as any).chart
                        .selectAll(".node")
                        .data(nodes.descendants())
                        .enter()
                        // filter cyclocomplexity
                        // .filter(function(d) {
                        //     console.log(d);
                        //     if (d.parent !== null && (d.parent.data.name === sizeOption)) {
                        //         return false;
                        //     }
                        //     else if (d.data.name === sizeOption) {
                        //         return false;
                        //     }
                        //     return true;
                        // })
                        .append("div")
                        .attr("class", function(d) { return "node level-" + d.depth; })
                        .attr("id", function(d) { return d.children ? d.data.name : d.parent.data.name; });

        return cells;
    }

    styleCells() {
        const nodes = super.createNodes();
        const cells = this.defineCells(nodes);
        const xScale = this.xScale;
        const yScale = this.yScale;
        const zoom = this.zoomCells;
        const upButton = (this as any).upButton.datum(nodes);
        const colorOption = this.colorOption;
        const color = this.color;

        cells
            .style("left", function(d) { return xScale(d.x0) + "%"; })
            .style("top", function(d) { return yScale(d.y0) + "%"; })
            .style("width", function(d) { return xScale(d.x1) - xScale(d.x0) + "%"; })
            .style("height", function(d) { return yScale(d.y1) - yScale(d.y0) + "%"; })
            .style("background-color", function(d) {
                console.log(d);
                if (d.children === undefined && d.parent.data.name === colorOption) {
                    return color(d.data.value / d.parent.data.value);
                }
            })
        .on("click", function(d) { zoom(d, cells, xScale, yScale, upButton, nodes); })
        .append("p")
        .attr("class", "label")
        .text(function(d) { return d.data.name ? d.data.name : "---"; });

        upButton.on("click", function(d) { zoom(d, cells, xScale, yScale, upButton, nodes); });

        return cells;
    }

    zoomCells(d, cells, xScale, yScale, upButton, nodes) {
        const currentDepth = d.depth;
        xScale.domain([d.x0, d.x1]);
        yScale.domain([d.y0, d.y1]);
        upButton.datum(d.parent || nodes);

        const t = d3.transition()
            .duration(800)
            .ease(d3.easeCubicOut);
        cells
            .transition(t)
            .style("left", function(d) { return xScale(d.x0) + "%"; })
            .style("top", function(d) { return yScale(d.y0) + "%"; })
            .style("width", function(d) { return xScale(d.x1) - xScale(d.x0) + "%"; })
            .style("height", function(d) { return yScale(d.y1) - yScale(d.y0) + "%"; });
        cells // hide this depth and above
            .filter(function(d) { return d.depth <= currentDepth; })
            .classed("hide", function(d) { return d.children ? true : false; });
        cells // show this depth + 1 and below
            .filter(function(d) { return d.depth > currentDepth; })
            .classed("hide", false);
    }
}

export default Cells;