interface TreemapChild {
  name: string;
  value: number;
  value2: number;
  children: TreemapChild[];
}

interface FunctionData {
  name: string;
  nloc: number;
  ccn: number;
  tokens: number;
  params: number;
  length: number;
}

interface FileData {
  filename: string;
  functions: FunctionData[];
}

interface AnalysisData {
  path: string;
  files: FileData[];
}

export enum Metrics {
  NLOC = "nloc",
  CCN = "ccn",
  TOKENS = "tokens",
  PARAMS = "params",
  LENGTH = "length"
}

export class MetricData {
  private allFiles: string[] = [];
  private filterList: string[] = [];
  private inverseFilterList: string[] = [];
  private listToggle = "black";

  constructor(private rawData: AnalysisData) {
    // Preprocess data recieved
    for (const file of rawData.files) {
      this.allFiles.push(this.parseFileName(file.filename, rawData.path));
    }
    console.log(this.allFiles);
    this.inverseFilterList = this.allFiles.slice();
  }

  public clearFilterList() {
    this.filterList = [];
    this.inverseFilterList = this.allFiles.slice();
  }

  /**
   * add/remove filenames names to filter when creating data
   * @param name filename(s) to add or remove from list of files to filter.
   *  Filenames should come from the filename list provided by this class
   * @param remove toggle whether name is being added or removed
   */
  public addToFilterList(names: string | string[], remove = false) {
    if (typeof names === "string") {
      this.addToFilterListHelper(names, remove);
    }
    else {
      for (const name of names) {
        this.addToFilterListHelper(name, remove);
      }
    }
  }

  /**
   * Deprecated held for compatiblity.
   * TODO: remove this function
   */
  public ignore(names: string | string[], remove = false) {
    this.addToFilterList(names, remove);
  }

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
   */
  public toTreemapData(metricA: string, metricB: string) {
    let ignoreList;
    if (this.listToggle === "white") {
      ignoreList = this.inverseFilterList;
    } else {
      ignoreList = this.filterList;
    }
    return this.createTreemapData(metricA, metricB, ignoreList);
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
  ) {
    const data: TreemapChild = {
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
        const fileChild: TreemapChild = {
          name: "",
          value: 0,
          value2: 0,
          children: []
        };
        const cValues = [];
        const cValue2s = [];
        fileChild.name = filename;
        for (const func of file.functions) {
          const funcChild: TreemapChild = {
            name: func.name,
            value: func[metricA],
            value2: func[metricB],
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
