import d3 = require("d3");

class SizeSelector implements Selector {

    createDropDown() {
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
}

export default SizeSelector;