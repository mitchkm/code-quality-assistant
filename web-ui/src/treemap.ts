import d3 = require("d3");
import treemapConfig from "./treemapConfig";

export class Treemap extends treemapConfig {


    processedData: any;

    color: ((x: number) => string);

    xScale: ((x: number) => number);

    yScale: ((x: number) => number);

    sizeOption: string;

    colorOption: string;

    fileOption: string;

    chart: any;

    upButton: any;

    private constructor(width: number, height: number, sizeOption: string, colorOption: string, color, fileOption = "none") {

        super(width, height, sizeOption, colorOption, fileOption);

        this.color = color;

        this.xScale = d3.scaleLinear().domain([0, width]).range([0, width]);

        this.yScale = d3.scaleLinear().domain([0, height]).range([0, height]);

        this.chart = d3.select("#chart");

        this.upButton = d3.select(".up");
    }

    private addCells(nodes) {
        const cells = this.chart
                        .selectAll(".node")
                        .data(nodes.descendants())
                        .enter()
                        .append("div")
                        .attr("class", function(d) { return "node level-" + d.depth; })
                        .attr("id", function(d) { return d.children ? d.data.name : d.parent.data.name; });
        return cells;
    }

    private styleCells() {
        const nodes = super.createNodes();
        const cells = this.addCells(nodes);
        const xScale = this.xScale;
        const yScale = this.yScale;
        const zoom = this.zoomCells;
        const upButton = this.upButton.datum(nodes);
        const color = this.color;
        cells
            .style("left", function(d) { return xScale(d.x0) + "%"; })
            .style("top", function(d) { return yScale(d.y0) + "%"; })
            .style("width", function(d) { return xScale(d.x1) - xScale(d.x0) + "%"; })
            .style("height", function(d) { return yScale(d.y1) - yScale(d.y0) + "%"; })
            .style("background-color", function(d) {
                // need to fix this!
                if (d.depth === 1) {
                    return "transparent";
                }
                return d.parent ? color(d.data.value2 / d.parent.data.value2) : "none";
            })
            .on("click", function(d) { zoom(d, cells, xScale, yScale, upButton, nodes); })
            .append("p")
            .attr("class", "label")
            .text(function(d) { return d.data.name ? d.data.name : "---"; });

        // hide the text when it's fully zoomed-out
        cells.selectAll("p")
            .style("opacity", function(d) { return d.depth > 1 ? 0 : 1; });

        upButton.on("click", function(d) { zoom(d, cells, xScale, yScale, upButton, nodes); });
        return cells;
    }

    private zoomCells(d, cells, xScale, yScale, upButton, nodes) {
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
            // show the functions when zoomed in
        cells
            .selectAll("p")
            .style("opacity", function(d) { return d.depth >= currentDepth ? 1 : 0; });
            // show only the file name when zoomed out
        if (currentDepth === 0) {
            cells
                .selectAll("p")
                .style("opacity", function(d) { return d.depth > currentDepth + 1 ? 0 : 1; });
        }
    }

    static display(width: number, height: number, sizeOption: string, colorOption: string, color, fileOption = "none") {

        const treemap = new Treemap(width, height, sizeOption, colorOption, color, fileOption);

        d3.select("#fileSelector")
            .on("change", function(d) {
                const selected = d3.select("#fileSelector").property("value");
                console.log(selected);
                Treemap.display(width, height, sizeOption, colorOption, color, selected);
            });

        if (d3.select(".node")) {
            d3.selectAll(".node").remove();
        }
        treemap.styleCells();
    }
}

export default Treemap;