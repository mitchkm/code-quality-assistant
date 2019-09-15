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
  fanIn: number;
  fanOut: number;
  generalFanOut: number;
  maxNestingDepth: number;
  maxNestedStructures: number;
}

export interface Duplicate {
  filename: string;
  startLine: number;
  endLine: number;
}

export interface DuplicateInfo {
  duplicates: Duplicate[][];
  duplicateRate: number;
  uniqueRate: number;
}

export interface FileData {
  filename: string;
  filetype: string;
  functions: FunctionData[];
}

export interface AnalysisData {
  path: string;
  duplicateInfo: DuplicateInfo;
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

const ZERO_STAT: FileStatistics = {
  min: 0,
  mean: 0,
  stdDev: 0,
  median: 0,
  mode: 0,
  max: 0,
  allValues: []
};

export enum Metrics {
  NLOC = "nloc",
  CCN = "ccn",
  TOKENS = "tokens",
  PARAMS = "params",
  LENGTH = "length",
  FAN_IN = "fanIn",
  FAN_OUT = "fanOut",
  GENERAL_FAN_OUT = "generalFanOut",
  MAX_NESTING_DEPTH = "maxNestingDepth",
  MAX_NESTED_STRUCTURES = "maxNestedStructures"
}
export const allMetrics: string[] = [
  Metrics.NLOC,
  Metrics.CCN,
  Metrics.TOKENS,
  Metrics.PARAMS,
  Metrics.LENGTH,
  Metrics.FAN_IN,
  Metrics.FAN_OUT,
  Metrics.GENERAL_FAN_OUT,
  Metrics.MAX_NESTING_DEPTH,
  Metrics.MAX_NESTED_STRUCTURES
];

export class MetricData {
  private _allFiles: string[] = [];
  public get allFiles() {
    return this._allFiles;
  }
  private _allTypes = new Set<string>();
  public get allTypes() {
    return Array.from(this._allTypes);
  }

  private statistics: Map<string, Map<string, FileStatistics>> = new Map();
  private fileLookup: Map<string, FileData> = new Map();
  public get duplicateInfo() {
    return this.rawData.duplicateInfo;
  }
  private filterList: string[] = [];
  private inverseFilterList: string[] = [];
  private listToggle = "black";

  private fileTypeFilter: string[] = [];

  constructor(private rawData: AnalysisData) {
    // Preprocess data recieved
    for (const file of rawData.files) {
      const relativeName = this.parseFileName(file.filename, rawData.path);
      this._allFiles.push(relativeName);
      this._allTypes.add(file.filetype);
      this.processFile(file, relativeName);
      this.fileLookup.set(relativeName, file);
    }
    this.inverseFilterList = this._allFiles.slice();
  }

  private processFile(file: FileData, relativeName: string) {
    const valuesMap: Map<string, number[]> = new Map();
    for (const m of allMetrics) {
      valuesMap.set(m, []);
    }
    // Iterate through functions to build lookup and statistics maps
    for (const func of file.functions) {
      // Collect values
      for (const m of allMetrics) {
        valuesMap.get(m).push(func[m]);
      }
    }
    // Calculate statistics
    const statMap = new Map();
    for (const m of allMetrics) {
      if (valuesMap.get(m).length <= 0) {
        statMap.set(m, ZERO_STAT);
        continue;
      }
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
    this.inverseFilterList = this._allFiles.slice();
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
   * clear list of files that should be filter
   */
  public clearFileTypeFilterList() {
    this.fileTypeFilter = [];
  }

  /**
   * add/remove filetypes to filter when creating data
   * @param fileType filentype to add or remove from list of files to filter.
   * @param remove toggle whether tyoe is being added or removed
   */
  public addToFileTypeFilterList(fileType: string, remove = false) {
    const index = this.fileTypeFilter.indexOf(fileType);
    if (remove && index !== -1) {
      this.fileTypeFilter.splice(index, 1);
    } else if (index === -1) {
      this.fileTypeFilter.push(fileType);
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
   * See if filter is set to whitelist
   */
  private isWhiteList() {
    return this.listToggle === "white";
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
    const fileList = this.createFileList();
    return this.createTreemapData(metricA, metricB, fileList);
  }

  private createFileList() {
    const files = new Set<string>();
    if (this.isWhiteList()) {
      this.filterList.forEach(file => {
        files.add(file);
      });
      this.inverseFilterList.forEach(file => {
        if (this.fileTypeFilter.indexOf(file.split(".")[1]) !== -1) {
          files.add(file);
        }
      });
    }
    else {
      this.inverseFilterList.forEach(file => {
        if (this.fileTypeFilter.indexOf(file.split(".")[1]) === -1) {
          files.add(file);
        }
      });
    }
    return Array.from(files);
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
   * @param fileList list of files to use to create treemap data
   * @param aggregateA potential aggregate functions for metricA (default is SUM)
   * @param aggregateB potential aggregate functions for metricB (default is SUM)
   */
  private createTreemapData(
    metricA: string,
    metricB: string,
    fileList: string[] = [],
    aggregateA: (arr: number[]) => number = this.sumArray,
    aggregateB: (arr: number[]) => number = this.sumArray
  ): TreemapData {
    const data: TreemapData = {
      name: "",
      value: 0,
      value2: 0,
      children: []
    };
    if (!this.rawData.files[0] || !fileList[0]) {
      return data;
    }
    data.name = metricA + " x " + metricB;
    const values = [];
    const value2s = [];
    for (const filename of fileList) {
      const file: FileData = this.fileLookup.get(filename);
      const fileChild: TreemapData = {
        name: "",
        value: 0,
        value2: 0,
        children: []
      };
      fileChild.name = filename;
      // Add function information
      for (const func of file.functions) {
        const funcChild: TreemapData = {
          name: func.name,
          value: func[metricA],
          value2: func[metricB],
          funcData: func,
          children: undefined
        };
        fileChild.children.push(funcChild);
      }
      fileChild.value = aggregateA(this.statistics.get(filename).get(metricA).allValues);
      fileChild.value2 = aggregateB(this.statistics.get(filename).get(metricB).allValues);
      values.push(fileChild.value);
      value2s.push(fileChild.value2);
      data.children.push(fileChild);
    }
    data.value = aggregateA(values);
    data.value2 = aggregateB(value2s);

    return data;
  }

  /**
   * finds the minimum value of selected color option among entire files.
   * @param fileList list of files to find the minimum value among.
   * @param colorMetric colorOption to find the minimum value of.
   */
  public getMinColorMetric(colorMetric: string, fileList?: string[]) {
    let overallMin;
    let file;

    if (!fileList) {
      fileList = this._allFiles;
    }

    for (file of fileList) {
      const min = this.getMetricStatitistics(file).get(colorMetric).min;
      if (!overallMin) {
        overallMin = min;
      } else if (overallMin > min) {
        overallMin = min;
      }
    }
    return overallMin;
  }

  /**
   * finds the maximum value of selected color option among entire files.
   * @param fileList list of files to find the maximum value among.
   * @param colorMetric colorOption to find the maximum value of.
   */
  public getMaxColorMetric(colorMetric: string, fileList?: string[]) {
    let overallMax;
    let file;

    if (!fileList) {
      fileList = this._allFiles;
    }

    for (file of fileList) {
      const max = this.getMetricStatitistics(file).get(colorMetric).max;
      if (!overallMax) {
        overallMax = max;
      } else if (overallMax < max) {
        overallMax = max;
      }
    }
    return overallMax;
  }
}
