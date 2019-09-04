import d3 = require("d3");
import TreemapSetting from "./treemapSetting";
import TreemapData from "../Data/treemapData";

class Treemap {
  processedData: TreemapData;

  xScale: any;

  yScale: any;

  color: d3.ScaleLinear<string, string>;

  treemapSetting: TreemapSetting;

  constructor(proceesedData: TreemapData, treemapSetting) {
    this.processedData = proceesedData;
    this.treemapSetting = treemapSetting;
  }

  private createTreemap() {
    const paddingTop = this.treemapSetting.paddings[0];
    const paddingBottom = this.treemapSetting.paddings[1];
    const paddingLeft = this.treemapSetting.paddings[2];
    const paddingRight = this.treemapSetting.paddings[3];

    this.xScale = d3
      .scaleLinear()
      .domain([0, this.treemapSetting.width])
      .range([0, this.treemapSetting.width]);
    this.yScale = d3
      .scaleLinear()
      .domain([0, this.treemapSetting.height])
      .range([0, this.treemapSetting.height]);
    this.color = d3
      .scaleLinear<string>()
      .domain(this.treemapSetting.color.thresholds)
      .range(this.treemapSetting.color.colors)
      .interpolate(d3.interpolateRgb.gamma(this.treemapSetting.color.gamma));

    const treemap = d3
      .treemap()
      .size([this.treemapSetting.width, this.treemapSetting.height])
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
    const treemap = this.createTreemap();
    const nodes = treemap(
      root.sort(d => d.value).sort((a, b) => a.value - b.value)
    );
    return nodes;
  }

  private setUpTreemapChart(nodes) {
    // deleting previous cell style
    if (d3.select(".node")) {
      d3.selectAll(".node").remove();
    }

    const chart = d3
      .select("#treeMapChart")
      .selectAll(".node")
      .data(nodes.descendants())
      .enter()
      .append("div")
      .attr("class", (d: any) => {
        return "node level-" + d.depth;
      })
      .attr("id", (d: any) => {
        return d.children ? d.data.name : d.parent.data.name;
      });
    return chart;
  }

  drawTreemap(processedData?: TreemapData) {
    if (processedData) {
        this.processedData = processedData;
    }
    const nodes = this.createTreeNodes();
    console.log(nodes);
    const chart = this.setUpTreemapChart(nodes);
    const upButton = d3.select("#TreemapBackButton").datum(nodes);

    chart
      .style("left", (d: any) => {
        return this.xScale(d.x0) + "%";
      })
      .style("top", (d: any) => {
        return this.yScale(d.y0) + "%";
      })
      .style("width", (d: any) => {
        return this.xScale(d.x1) - this.xScale(d.x0) + "%";
      })
      .style("height", (d: any) => {
        return this.yScale(d.y1) - this.yScale(d.y0) + "%";
      })
      .style("background-color", (d: any) => {
        // make user to choose these thresholds
        if (d.depth === 1) {
          return "transparent";
        }
        return d.parent
          ? this.color(d.data.value2 / d.parent.data.value2)
          : "none";
      })
      .on("click", d => {
        this.zoomTreemap(d, chart, upButton, nodes);
      })
      .append("p")
      .attr("class", "label")
      .text((d: any) => {
        return d.data.name ? d.data.name : "---";
      });

    // hide the text when it's fully zoomed-out
    chart.selectAll("p").style("opacity", (d: any) => {
      return d.depth > 1 ? 0 : 1;
    });

    upButton.on("click", d => {
      this.zoomTreemap(d, chart, upButton, nodes);
    });
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
    this.xScale.domain([d.x0, d.x1]);
    this.yScale.domain([d.y0, d.y1]);
    upButton.datum(d.parent || nodes);

    const t = d3
      .transition()
      .duration(800)
      .ease(d3.easeCubicOut);

    chart
      .transition(t)
      .style("left", d => {
        return this.xScale(d.x0) + "%";
      })
      .style("top", d => {
        return this.yScale(d.y0) + "%";
      })
      .style("width", d => {
        return this.xScale(d.x1) - this.xScale(d.x0) + "%";
      })
      .style("height", d => {
        return this.yScale(d.y1) - this.yScale(d.y0) + "%";
      });
    chart // hide this depth and above
      .filter(function(d) {
        return d.depth <= currentDepth;
      })
      .classed("hide", function(d) {
        return d.children ? true : false;
      });
    chart // show this depth + 1 and below
      .filter(function(d) {
        return d.depth > currentDepth;
      })
      .classed("hide", false);
    // show the functions when zoomed in
    chart.selectAll("p").style("opacity", function(d) {
      return d.depth >= currentDepth ? 1 : 0;
    });
    // show only the file name when zoomed out
    if (currentDepth === 0) {
      chart.selectAll("p").style("opacity", function(d) {
        return d.depth > currentDepth + 1 ? 0 : 1;
      });
    }
  }
}

export default Treemap;
