import TreemapData from "./treemapData";

export class MetricData {
  private ignoreList: string[] = [];

  constructor(private rawData: any) {}

  /**
   * add/remove filenames/function names to ignore when parsing data
   * @param name filename to ignore or remove from ignore
   * @param remove toggle whether name is being added or removed
   */
  public ignore(name: string, remove = false) {
    if (remove) {
      const index = this.ignoreList.indexOf(name);
      if (index !== -1) {
        this.ignoreList.splice(index, 1);
      }
    } else {
      this.ignoreList.push(name);
    }
  }

  private parseFileName(path: string) {
    return path;
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
  public toTreemapData(
    metricA: string,
    metricB: string,
    aggregateA: (arr: number[]) => number = this.sumArray,
    aggregateB: (arr: number[]) => number = this.sumArray
  ) {
    const data: TreemapData = {
      name: "",
      value: 0,
      value2: 0,
      children: []
    };
    data.name = metricA + "x" + metricB;
    const values = [];
    const value2s = [];
    for (const key in this.rawData.files) {
      const file = this.rawData.files[key];
      const filename = this.parseFileName(file.filename);
      if (this.ignoreList.indexOf(filename) === -1) {
        const fileChild: TreemapData = {
          name: "",
          value: 0,
          value2: 0,
          children: []
        };
        const cValues = [];
        const cValue2s = [];
        fileChild.name = filename;
        for (const key2 in file.functions) {
          const func = file.functions[key2];
          if (this.ignoreList.indexOf(func.name) === -1) {
            const funcChild: TreemapData = {
              name: func.name,
              value: func[metricA],
              value2: func[metricB],
              children: undefined
            };
            cValues.push(funcChild.value);
            cValue2s.push(funcChild.value2);
            fileChild.children.push(funcChild);
          }
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
