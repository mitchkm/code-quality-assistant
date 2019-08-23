import d3 = require("d3");
import Treemap from "./treemap";
import { MetricData } from "./metricData";
import { exampleData } from "./example";

// new Vue({
//     el: "#chart",
//     methods: {
//         Treemap.display(width, height, sizeOption, colorOption, color);
//     }
// })
 // declare width and height of treemap
const width = 100;
const height = 100;
const gamma = 1.0; // change the brightness of color
const sizeOption = "nloc";
const colorOption = "ccn";
// const fileOption = "/mnt/g/Projects/apple-surp-2019/code-analysis/examples-to-analyze/analyze-me.swift";

// set up the color for treemap
const color = d3.scaleLinear<string>()
                .domain([0, 0.3333, 0.66666, 1])
                .range(["green", "yellow", "orange", "red"])
                .interpolate(d3.interpolateRgb.gamma(gamma));

let data;
try {
    data = JSON.parse(document.getElementById("rawData").textContent);
} catch (err) {
    console.log("Could not parse injected rawData!" + err);
    console.log("Displaying exampleData");
    data = exampleData;
}

// TODO process data:
const mD = new MetricData(data);

const processedData: any = mD.toTreemapData(this.sizeOption, this.colorOption);

// display treemap
Treemap.display(processedData, width, height, sizeOption, colorOption, color);