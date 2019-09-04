import d3 = require("d3");
import { MetricData } from "./Data/metricData";
import { exampleData } from "./Data/example";
import Treemap from "./Treemap/treemap";
import TreemapData from "./Data/treemapData";
import colorSetting from "./Treemap/colorSetting";
import treemapSetting from "./Treemap/treemapSetting";
import FileSelector from "./Selector/fileSelector";
import ColorSelector from "./Selector/colorSelector";
import SizeSelector from "./Selector/sizeSelector";
import InterfaceEventController from "./InterfaceEventController";

const defaultSizeOption = "nloc";
const defaultColorOption = "ccn";
const defaultfileOption = "none";

const colorSetting: colorSetting = {
    colors: ["#00a539", "#fff453", "#fd7900", "#ff001f"],
    thresholds: [0, 0.3333, 0.66666, 1],
    gamma: 1.0
};

const treemapSetting: treemapSetting = {
    width: 100,
    height: 100,
    paddings: [0.3, 0.3, 0.3, 0.3],
    color: d3.scaleLinear<string>()
                .domain(colorSetting.thresholds)
                .range(colorSetting.colors)
                .interpolate(d3.interpolateRgb.gamma(colorSetting.gamma)),
    sizeOption: defaultSizeOption,
    colorOption: defaultColorOption,
    fileOption: defaultfileOption
};

// Process Data
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

// TreemapData
const processedData: TreemapData = mD.toTreemapData(treemapSetting.sizeOption, treemapSetting.colorOption);

// display treemap
const treemap = new Treemap(processedData, treemapSetting);

// treemap Options
const fileSelector = new FileSelector(processedData, treemap);

const colorSelector = new ColorSelector(treemap);

const sizeSelector = new SizeSelector(treemap);

fileSelector.createOptions();
colorSelector.createOptions();
sizeSelector.createOptions();

// update treemap on change
fileSelector.updateOnChange(data, treemapSetting);
colorSelector.updateOnChange(data, treemapSetting);
sizeSelector.updateOnChange(data, treemapSetting);

new InterfaceEventController();
console.log(treemap);
treemap.drawTreemap();

