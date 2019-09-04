import TreemapSetting from "../Treemap/treemapSetting";
import Treemap from "../Treemap/treemap";
import d3 = require("d3");
import TreemapData from "../Data/treemapData";
import { MetricData } from "../Data/metricData";

abstract class Selector {
    treemap: Treemap;

    constructor(treemap: Treemap) {
        this.treemap = treemap;
    }

    protected updateTreemap(data, treemapSetting: TreemapSetting) {
        const metricData = new MetricData(data);
        treemapSetting.sizeOption = d3.select("#sizeSelector").property("value");
        treemapSetting.colorOption = d3.select("#colorSelector").property("value");
        treemapSetting.fileOption = d3.select("#fileSelector").property("value");
        if (treemapSetting.fileOption !== "none") {
            metricData.ignore(treemapSetting.fileOption);
        }
        const processedData: TreemapData = metricData.toTreemapData(treemapSetting.sizeOption, treemapSetting.colorOption);
        const treemap = new Treemap(processedData, treemapSetting);
        // console.log(treemap);
        treemap.drawTreemap();
    }

    abstract createOptions(): void;

    abstract updateOnChange(metricData: MetricData, treemapSetting: TreemapSetting): void;
}

export default Selector;