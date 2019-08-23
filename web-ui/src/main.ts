import d3 = require("d3");
import Treemap from "./treemap";

 // declare width and height of treemap
const width = 100;
const height = 100;
const gamma = 1.0; // change the brightness of color
const sizeOption = "nloc";
const colorOption = "ccn";

// set up the color for treemap
const color = d3.scaleLinear<string>()
                .domain([0, 0.3333, 0.66666, 1])
                .range(["green", "yellow", "orange", "red"])
                .interpolate(d3.interpolateRgb.gamma(gamma));

// display treemap
Treemap.display(width, height, sizeOption, colorOption, color);
// Treemap.display(width, height, colorOption, sizeOption, color);

