import d3 = require("d3");
import Treemap from "./Treemap/treemap";
import TreemapData from "./Treemap/treemapData";
import TreemapOptions from "./Treemap/treemapOptions";
import InterfaceEventController from "./InterfaceEventController";

const width = 100;
const height = 100;
const gamma = 1.0; // change the brightness of color

// set up the color for treemap
const color = d3.scaleLinear<string>()
                .domain([0, 0.3333, 0.66666, 1])
                //.range(["green", "yellow", "orange", "red"])
                .range(["#00a539", "#fff453", "#fd7900", "#ff001f"])
                .interpolate(d3.interpolateRgb.gamma(gamma));

const treemapData = new TreemapData();
const processedData = treemapData.processData();

// display treemap
const treemap = new Treemap(processedData, width, height, color);

const treemapOptions = new TreemapOptions(processedData);
treemapOptions.setUpTreemapOptions(treemap);

new InterfaceEventController();
console.log(treemap);
treemap.drawTreemap();

