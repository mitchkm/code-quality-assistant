import d3 = require("d3");
import TreemapData from "./treemapData";

class Treemap {

    processedData: any;

    width: number;

    height: number;

    color: ((x: number) => string);

    xScale: any;

    yScale: any;

    chart: any;

    upButton: any;

    constructor(proceesedData, width: number, height: number, color) {

        this.processedData = proceesedData;

        this.width = width;

        this.height = height;

        this.color = color;

        this.xScale = d3.scaleLinear().domain([0, width]).range([0, width]);

        this.yScale = d3.scaleLinear().domain([0, height]).range([0, height]);

        this.chart = d3.select("#treeMapChart");

        this.upButton = d3.select("#TreemapBackButton");
    }

    private createTreemap(paddingTop, paddingBottom, paddingLeft, paddingRight) {
        const treemap = d3.treemap()
            .size([this.width, this.height])
            .tile(d3.treemapResquarify)
            .round(false)
            .paddingTop(paddingTop)
            .paddingBottom(paddingBottom)
            .paddingLeft(paddingLeft)
            .paddingRight(paddingRight);
        return treemap;
    }

    private createTreeNodes() {
        const root = d3.hierarchy(this.processedData);
        const treemap = this.createTreemap(0.3, 0.3, 0.3, 0.3);
        const nodes = treemap(root
            .sort(d => d.value)
            .sort((a, b) => a.value - b.value));
        return nodes;
    }

    private setUpTreemapChart(nodes) {

        // deleting previous cell style
        if (d3.select(".node")) {
            d3.selectAll(".node").remove();
        }

        const chart = this.chart
            .selectAll(".node")
            .data(nodes.descendants())
            .enter()
            .append("div")
            .attr("class", function (d) { return "node level-" + d.depth; })
            .attr("id", function (d) { return d.children ? d.data.name : d.parent.data.name; });
        return chart;
    }

    drawTreemap() {
        const nodes = this.createTreeNodes();
        const chart = this.setUpTreemapChart(nodes);
        const upButton = this.upButton.datum(nodes);

        chart
            .style("left", (d) => { return this.xScale(d.x0) + "%"; })
            .style("top", (d) => { return this.yScale(d.y0) + "%"; })
            .style("width", (d) => { return this.xScale(d.x1) - this.xScale(d.x0) + "%"; })
            .style("height", (d) => { return this.yScale(d.y1) - this.yScale(d.y0) + "%"; })
            .style("background-color", (d) => {
                // need to fix this!
                if (d.depth === 1) {
                    return "transparent";
                }
                return d.parent ? this.color(d.data.value2 / d.parent.data.value2) : "none";
            })
            .on("click", (d) => { this.zoomTreemap(d, chart, upButton, nodes); })
            .append("p")
            .attr("class", "label")
            .text((d) => { return d.data.name ? d.data.name : "---"; });

        // hide the text when it's fully zoomed-out
        chart.selectAll("p")
            .style("opacity", (d) => { return d.depth > 1 ? 0 : 1; });

        upButton.on("click", (d) => { this.zoomTreemap(d, chart, upButton, nodes); });
        return chart;
    }

    /**
     * This function does ...
     * @param d parameter to do something
     * @param chart
     * @param xScale
     * @param yScale
     * @param upButton
     * @param nodes
     */
    private zoomTreemap(d, chart, upButton, nodes) {
        const currentDepth = d.depth;
        const xScale = this.xScale;
        xScale.domain([d.x0, d.x1]);
        this.yScale.domain([d.y0, d.y1]);
        upButton.datum(d.parent || nodes);

        const t = d3.transition()
            .duration(800)
            .ease(d3.easeCubicOut);

        chart
            .transition(t)
            .style("left", (d) => { return this.xScale(d.x0) + "%"; })
            .style("top", (d) => { return this.yScale(d.y0) + "%"; })
            .style("width", (d) => { return this.xScale(d.x1) - this.xScale(d.x0) + "%"; })
            .style("height", (d) => { return this.yScale(d.y1) - this.yScale(d.y0) + "%"; });
        chart // hide this depth and above
            .filter(function (d) { return d.depth <= currentDepth; })
            .classed("hide", function (d) { return d.children ? true : false; });
        chart // show this depth + 1 and below
            .filter(function (d) { return d.depth > currentDepth; })
            .classed("hide", false);
        // show the functions when zoomed in
        chart
            .selectAll("p")
            .style("opacity", function (d) { return d.depth >= currentDepth ? 1 : 0; });
        // show only the file name when zoomed out
        if (currentDepth === 0) {
            chart
                .selectAll("p")
                .style("opacity", function (d) { return d.depth > currentDepth + 1 ? 0 : 1; });
        }
    }

    updateTreemap() {
        const selectedSize = d3.select("#sizeSelector").property("value");
        const selectedColor = d3.select("#colorSelector").property("value");
        const selectedFile = d3.select("#fileSelector").property("value");
        const treemapData = new TreemapData(selectedSize, selectedColor, selectedFile);
        const processedData = treemapData.processData();
        const treemap = new Treemap(processedData, this.width, this.height, this.color);
        console.log(treemap);
        treemap.drawTreemap();
    }
}

export default Treemap;
