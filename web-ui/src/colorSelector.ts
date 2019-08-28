import d3 = require("d3");

class ColorSelector implements Selector {

    createDropDown() {
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
}

export default ColorSelector;