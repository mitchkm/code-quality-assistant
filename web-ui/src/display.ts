import d3 = require("d3");
import { exampleData } from "./example";
import Cells from "./cells";
import { MetricData } from "./metricData";

class Display {
    static display(sizeOption, colorOption) {
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
    const processedData: any = mD.toTreemapData(sizeOption, colorOption);

    // declare width and height of treemap
    const width = 100;
    const height = 100;

    // set up the color for treemap
    const color = d3.scaleLinear<string>()
                    .domain([0, 0.3333, 0.66666, 1])
                    .range(["green", "yellow", "orange", "red"])
                    .interpolate(d3.interpolateRgb.gamma(1.5));

    // create a cells object
    const cells = new Cells(width, height, processedData, color);

    // style cells
    cells.styleCells();
    }
}

export default Display;