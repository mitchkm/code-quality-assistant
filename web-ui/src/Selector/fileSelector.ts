import d3 = require("d3");
import Selector from "./selector";
import Treemap from "../Treemap/treemap";
import TreemapData from "../Data/treemapData";
import TreemapSetting from "../Treemap/treemapSetting";
import { MetricData } from "../Data/metricData";

class FileSelector extends Selector {

    processedData: TreemapData;

    constructor(processedData: TreemapData, treemap: Treemap) {
        super(treemap);
        this.processedData = processedData;
    }

    createOptions() {
        const fileNames = this.listOptions();

        // delete existing dropdown options
        if (d3.select("#fileOptions").select("option") !== undefined) {
            d3.select("#fileOptions").selectAll("option").remove();
        }

        d3.select("#fileOptions")
            .selectAll("option")
            .data(fileNames)
            .enter()
            .append("option")
            .attr("value", function(d) { return d; });
    }

    updateOnChange(data: any, treemapSetting: TreemapSetting) {
        d3.select("#fileFilterButton")
            .on("click", () => {
                super.updateTreemap(data, treemapSetting);
            });
    }

    private listOptions() {
        const fileList = ["none"];
        let i;
        for (i = 0; i < this.processedData.children.length; i++) {
            fileList.push(this.processedData.children[i].name);
        }
        return fileList;
    }
}

export default FileSelector;