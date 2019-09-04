import d3 = require("d3");
import Treemap from "../Treemap/treemap";
import Selector from "./selector";
import TreemapSetting from "../Treemap/treemapSetting";
import { MetricData } from "../Data/metricData";

class ColorSelector extends Selector {

    constructor(treemap: Treemap) {
        super(treemap);
    }

    createOptions() {
        const colorOptions = ["nloc", "ccn", "tokens", "params", "length"];
        // delete existing dropdown options
        if (d3.select("#colorSelector").select("option") !== undefined) {
            d3.select("#colorSelector").selectAll("option").remove();
        }

        const defaultOption = "ccn";

        d3.select("#colorSelector")
            .selectAll("option")
            .data(colorOptions)
            .enter()
            .append("option")
            .attr("value", function(d) { return d; })
            .property("selected", function(d) { return d === defaultOption; })
            .text(function(d) { return d; });
    }

    updateOnChange(data: any, treemapSetting: TreemapSetting) {
        d3.select("#colorSelector")
            .on("change", () => {
                super.updateTreemap(data, treemapSetting);
            });
    }
}

export default ColorSelector;