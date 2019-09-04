import { MetricData, Metrics } from "./Data/metricData";
import { exampleData } from "./Data/example";
import Treemap from "./Treemap/treemap";
import TreemapData from "./Data/treemapData";
import colorSetting from "./Treemap/colorSetting";
import treemapSetting from "./Treemap/treemapSetting";
import InterfaceEventController from "./InterfaceEventController";
import TreemapEventController from "./TreemapEventController";

const defaultSizeOption = Metrics.NLOC;
const defaultColorOption = Metrics.CCN;
const defaultfileOption = "none";

const treemapSettings: treemapSetting = {
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

// create metric data helper class
const mD = new MetricData(data);

// create treemap
const processedData: TreemapData = mD.toTreemapData(treemapSettings.sizeOption, treemapSettings.colorOption);
const treemap = new Treemap(processedData, treemapSettings);
treemap.drawTreemap();

// set up DOM elements
InterfaceEventController.init();

const treemapController = TreemapEventController.instance;
treemapController.setContext(mD, treemap, treemapSettings);
treemapController.init();
