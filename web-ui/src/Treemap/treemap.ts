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
  /**
   * create a treemapLayout based on treemapSetting
   */
  private createTreemap() {
    const paddingTop = this.treemapSetting.paddings[0];
    const paddingBottom = this.treemapSetting.paddings[1];
    const paddingLeft = this.treemapSetting.paddings[2];
    const paddingRight = this.treemapSetting.paddings[3];

    // determines the width of each square in a treemap
    this.xScale = d3
      .scaleLinear()
      .domain([0, this.treemapSetting.width])
      .range([0, this.treemapSetting.width]);

    // determines the height of each square in a treemap
    this.yScale = d3
      .scaleLinear()
      .domain([0, this.treemapSetting.height])
      .range([0, this.treemapSetting.height]);

    // decides the color of each sqaure in a treemap
    this.color = d3
      .scaleLinear<string>()
      .domain(this.treemapSetting.color.thresholds)
      .range(this.treemapSetting.color.colors)
      .interpolate(d3.interpolateHslLong);

    // sets treemap layout
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

  /**
   * Create nodes of a treemap based on the hierarchy of data
   */
  private createTreeNodes() {
    // creates hierarchy of data
    const root = d3.hierarchy(this.processedData);

    const treemap = this.createTreemap();

    // sorts and applies nodes to treemap layout
    const nodes = treemap(
      root.sort(d => d.value).sort((a, b) => a.value - b.value)
    );
    return nodes;
  }

  /**
   * dyamically add treemapChart in our web application
   * @param nodes treemap nodes to create treemap with
   */
  private setUpTreemapChart(nodes) {
    // deleting previous cell style
    if (d3.select(".node")) {
      d3.selectAll(".node").remove();
    }

    // dynamically creates HTML <div> elements for nodes
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

  /**
   * styles and displays a treemap in frontend
   * @param processedData data to update the treemap
   */
  drawTreemap(processedData?: TreemapData) {
    // change to new data from user
    if (processedData) {
      this.processedData = processedData;
    }

    const nodes = this.createTreeNodes();

    const chart = this.setUpTreemapChart(nodes);

    const upButton = d3.select("#TreemapBackButton").datum(nodes);

    const mouseHover = d3.select(".mouseHover");

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
          ? this.color(d.data.value2)
          : "none";
      })
      .on("click", (d: any) => {
        // on click zoom-in treemap
        this.zoomTreemap(d, chart, upButton, mouseHover, nodes);
      })
      .append("p")
      .attr("class", "label")
      .text((d: any) => {
        return d.data.name ? d.data.name : "---";
      })
      .on("mousemove", (d: any) => {
        // display file/function name when mouse hovered
        mouseHover.style("left", d3.event.pageX + 10 + "px");
        mouseHover.style("top", d3.event.pageY - 20 + "px");
        mouseHover.style("display", "inline-block");
        mouseHover.text(d.data.name);
      })
      .on("mouseout", () => {
        // stop displaying file/function name when mouse out
        mouseHover.style("display", "none");
      });

    // hide the text when it's fully zoomed-out
    chart.selectAll("p").style("opacity", (d: any) => {
      return d.depth > 1 ? 0 : 1;
    });

    // on click zoom out treemap
    upButton.on("click", d => {
      this.zoomTreemap(d, chart, upButton, mouseHover, nodes);
    });
    return chart;
  }

  /**
   * Handles zooming in the treemap
   * @param d clicked node in the treemap
   * @param chart treemapChart created by setUpTreemapChart function
   * @param upButton navigates treemap to zoom out
   * @param nodes entire nodes in the treemap
   */
  private zoomTreemap(d, chart, upButton, mouseHover, nodes) {
    const currentDepth = d.depth;

    // changes domains of width and height according to selected node
    this.xScale.domain([d.x0, d.x1]);
    this.yScale.domain([d.y0, d.y1]);

    upButton.datum(d.parent || nodes);

    // sets transition
    const t = d3
      .transition()
      .duration(800)
      .ease(d3.easeCubicOut);

    // changes message when treemap is hovered and fully zoomed in
    if (currentDepth === 2) {
      chart
        .on("mousemove", d => {
          let funcData = "";
          funcData += "functionName: " + d.data.funcData.name;
          funcData += "\nfunctionFullName: " + d.data.funcData.longName;
          funcData += "\nstartLine: " + d.data.funcData.startLine;
          funcData += "\nnloc: " + d.data.funcData.nloc;
          funcData += "\nccn: " + d.data.funcData.ccn;
          funcData += "\ntokens: " + d.data.funcData.tokens;
          funcData += "\nparams: " + d.data.funcData.params;
          funcData += "\nlength: " + d.data.funcData.length;
          mouseHover.text(funcData);
        })
        .on("mouseout", () => {
          mouseHover.style("display", "none");
        });
    } else {
      // display file/function name when treemap is not fully zoomed in and gets mouse hovered
      chart
        .on("mousemove", d => {
          mouseHover.text(d.data.name);
        })
        .on("mouseout", () => {
          mouseHover.style("display", "none");
        });
    }

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
