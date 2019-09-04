import d3 = require("d3");
import Selector from "./selector";
import Treemap from "../Treemap/treemap";
import TreemapSetting from "../Treemap/treemapSetting";
import { MetricData } from "../Data/metricData";

class SizeSelector extends Selector {

    constructor(treemap: Treemap) {
        super(treemap);
    }

    createOptions() {
        const sizeOptions = ["nloc", "ccn", "tokens", "params", "length"];

        // delete existing dropdown options
        if (d3.select("#sizeSelector").select("option") !== undefined) {
            d3.select("#sizeSelector").selectAll("option").remove();
        }

        const defaultOption = "nloc";

        d3.select("#sizeSelector")
            .selectAll("option")
            .data(sizeOptions)
            .enter()
            .append("option")
            .attr("value", function(d) { return d; })
            .property("selected", function(d) { return d === defaultOption; })
            .text(function(d) { return d; });
    }

    updateOnChange(data: any, treemapSetting: TreemapSetting) {
        d3.select("#sizeSelector")
            .on("change", () => {
                super.updateTreemap(data, treemapSetting);
            });
    }
}

export default SizeSelector;