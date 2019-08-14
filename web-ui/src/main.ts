import d3 = require("d3");
import { exampleProcessedData } from "./example";
import Cells from "./cells";


// tslint:disable-next-line: whitespace
const data: any = "{$code_analysis_json}";

// TODO process data:

const processedData: any = exampleProcessedData;


// declare width and height of treemap
const width = 100;
const height = 100;

const color = d3.scaleLinear<string>()
                    .domain([0, 0.3333, 0.66666, 1])
                    .range(["green", "yellow", "orange", "red"])
                    .interpolate(d3.interpolateRgb.gamma(1.5));

const cells = new Cells(width, height, processedData, "cyclocomplexity", "nloc", color);

cells.styleCells();