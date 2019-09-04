import d3 = require("d3");
import { MetricData, Metrics } from "./Data/metricData";
import { exampleData } from "./Data/example";
import Treemap from "./Treemap/treemap";
import TreemapData from "./Data/treemapData";
import colorSetting from "./Treemap/colorSetting";
import treemapSetting from "./Treemap/treemapSetting";
import FileSelector from "./Selector/fileSelector";
import ColorSelector from "./Selector/colorSelector";
import SizeSelector from "./Selector/sizeSelector";
import InterfaceEventController from "./InterfaceEventController";

const defaultSizeOption = Metrics.NLOC;
const defaultColorOption = Metrics.CCN;
const defaultfileOption = "none";

const treemapSetting: treemapSetting = {
    width: 100,
    height: 100,
    paddings: [0.3, 0.3, 0.3, 0.3],
    color: {
        colors: ["#00a539", "#fff453", "#fd7900", "#ff001f"],
        thresholds: [0, 0.3333, 0.66666, 1],
        gamma: 1.0
    },
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
    console.log("Displaying example data. NOT meaningful data!");
    data = exampleData;
}

// process data:
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

InterfaceEventController.init();
console.log(treemap);
treemap.drawTreemap();
// treemap.drawTreemap(mD.toTreemapData(Metrics.CCN, Metrics.NLOC));

