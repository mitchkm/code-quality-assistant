import { FunctionData } from "./metricData";

interface TreemapData {
    name: string;
    value: number;
    value2: number;
    funcData?: FunctionData;
    children: TreemapData[];
}

export default TreemapData;