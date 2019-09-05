import TreemapData from "./treemapData";
import * as stats from "simple-statistics";

export interface FunctionData {
  name: string;
  longName: string;
  startLine: number;
  nloc: number;
  ccn: number;
  tokens: number;
  params: number;
  length: number;
}

export interface FileData {
  filename: string;
  functions: FunctionData[];
}

export interface AnalysisData {
  path: string;
  files: FileData[];
}

export interface FileStatistics {
  min: number;
  mean: number;
  stdDev: number;
  median: number;
  mode: number;
  max: number;
  allValues: number[];
}

export enum Metrics {
  NLOC = "nloc",
  CCN = "ccn",
  TOKENS = "tokens",
  PARAMS = "params",
  LENGTH = "length"
}
export const allMetrics: string[] = [
  Metrics.NLOC,
  Metrics.CCN,
  Metrics.TOKENS,
  Metrics.PARAMS,
  Metrics.LENGTH,
];

export class MetricData {
  private allFiles: string[] = [];
  public get fileList() {
    return this.allFiles;
  }
  private statistics: Map<string, Map<string, FileStatistics>> = new Map();
  private funcLookup: Map<string, Map<string, FunctionData>> = new Map();
  public get functionLookup() {
    return this.funcLookup;
  }
  private filterList: string[] = [];
  private inverseFilterList: string[] = [];
  private listToggle = "black";

  constructor(private rawData: AnalysisData) {
    // Preprocess data recieved
    for (const file of rawData.files) {
      const relativeName = this.parseFileName(file.filename, rawData.path);
      this.allFiles.push(relativeName);
      this.processFile(file, relativeName);
    }
    this.inverseFilterList = this.allFiles.slice();
  }

  private processFile(file: FileData, relativeName: string) {
    const valuesMap: Map<string, number[]> = new Map();
    for (const m of allMetrics) {
      valuesMap.set(m, []);
    }
    const funcMap = new Map();
    // Iterate through functions to build lookup and statistics maps
    for (const func of file.functions) {
      funcMap.set(func.longName, func);
      // Collect values
      for (const m of allMetrics) {
        valuesMap.get(m).push(func[m]);
      }
    }
    // Calculate statistics
    const statMap = new Map();
    for (const m of allMetrics) {
      // Create sorted list of values lowest to highest
      const values = valuesMap.get(m).sort((a, b) => a - b);
      const metricStats: FileStatistics = {
        min: stats.minSorted(values),
        mean: stats.mean(values),
        stdDev: stats.standardDeviation(values),
        median: stats.medianSorted(values),
        mode: stats.modeSorted(values),
        max: stats.maxSorted(values),
        allValues: values
      };
      statMap.set(m, metricStats);
    }
    this.statistics.set(relativeName, statMap);
    this.funcLookup.set(relativeName, funcMap);
  }

  /**
   * Returns map of statistical information on each metric
   * @param filename relative name of file
   */
  public getMetricStatitistics(filename: string): Map<string, FileStatistics> {
    return this.statistics.get(filename);
  }

  /**
   * clear list of files that should be filter
   */
  public clearFilterList() {
    this.filterList = [];
    this.inverseFilterList = this.allFiles.slice();
  }

  /**
   * add/remove filenames to filter when creating data
   * @param name filename(s) to add or remove from list of files to filter.
   *  Filenames should come from the filename list provided by this class
   * @param remove toggle whether name is being added or removed
   */
  public addToFilterList(names: string | string[], remove = false) {
    if (typeof names === "string") {
      this.addToFilterListHelper(names, remove);
    } else {
      for (const name of names) {
        this.addToFilterListHelper(name, remove);
      }
    }
  }

  /**
   * add/remove filename to filter when creating data
   * @param name filename to add or remove from list of files to filter.
   *  Filenames should come from the filename list provided by this class
   * @param remove toggle whether name is being added or removed
   */
  private addToFilterListHelper(name: string, remove = false) {
    if (remove) {
      const index = this.filterList.indexOf(name);
      if (index !== -1) {
        this.filterList.splice(index, 1);
      }
      this.inverseFilterList.push(name);
    } else {
      const index = this.inverseFilterList.indexOf(name);
      if (index !== -1) {
        this.inverseFilterList.splice(index, 1);
      }
      this.filterList.push(name);
    }
  }

  /**
   * call to use filter list as a blackList
   */
  public useBlackList() {
    this.listToggle = "black";
  }

  /**
   * call to use filter list as a whiteList
   */
  public useWhiteList() {
    this.listToggle = "white";
  }

  /**
   * converts raw data to a d3 treemap readable format
   * @param metricA Metric to represent the size of treemap
   * @param metricB Metric to represent normalized value for color or other visual
   */
  public toTreemapData(metricA: string, metricB: string): TreemapData {
    if (allMetrics.indexOf(metricA) === -1) {
      metricA = Metrics.NLOC;
    }
    if (allMetrics.indexOf(metricB) === -1) {
      metricB = Metrics.NLOC;
    }
    let ignoreList;
    if (this.listToggle === "white") {
      ignoreList = this.inverseFilterList;
    } else {
      ignoreList = this.filterList;
    }
    return this.createTreemapData(metricA, metricB, ignoreList);
  }

  /**
   * parses filename relative to original specified directory
   * @param file full path to file
   * @param path full path to original specified directory
   */
  private parseFileName(file: string, path: string) {
    let relative = file.replace(path, "");
    if (relative === "") {
      relative = file;
    }
    return relative;
  }

  private sumArray(arr: number[]): number {
    if (arr.length < 2) {
      return arr[0] ? arr[0] : 0;
    }
    return arr.reduce((a, b) => a + b);
  }

  /**
   * converts raw data to a d3 treemap readable format
   * @param metricA Metric to represent the size of treemap
   * @param metricB Metric to represent normalized value for color or other visual
   * @param aggregateA potential aggregate functions for metricA (default is SUM)
   * @param aggregateB potential aggregate functions for metricB (default is SUM)
   */
  private createTreemapData(
    metricA: string,
    metricB: string,
    ignoreList: string[],
    aggregateA: (arr: number[]) => number = this.sumArray,
    aggregateB: (arr: number[]) => number = this.sumArray
  ): TreemapData {
    const data: TreemapData = {
      name: "",
      value: 0,
      value2: 0,
      children: []
    };
    if (!this.rawData.files[0]) {
      return data;
    }

    data.name = metricA + " x " + metricB;
    const values = [];
    const value2s = [];
    for (const file of this.rawData.files) {
      const filename = this.parseFileName(file.filename, this.rawData.path);
      if (ignoreList.indexOf(filename) === -1) {
        const fileChild: TreemapData = {
          name: "",
          value: 0,
          value2: 0,
          children: []
        };
        const cValues = [];
        const cValue2s = [];
        fileChild.name = filename;
        for (const func of file.functions) {
          const funcChild: TreemapData = {
            name: func.name,
            value: func[metricA],
            value2: func[metricB],
            funcData: func,
            children: undefined
          };
          cValues.push(funcChild.value);
          cValue2s.push(funcChild.value2);
          fileChild.children.push(funcChild);
        }
        fileChild.value = aggregateA(cValues);
        fileChild.value2 = aggregateB(cValue2s);
        values.push(fileChild.value);
        value2s.push(fileChild.value2);
        data.children.push(fileChild);
      }
    }
    data.value = aggregateA(values);
    data.value2 = aggregateB(value2s);

    return data;
  }
}
