import { CsvVertex } from "@/input/CsvParser";

export interface CsvProp {
  key: string;
  label: string;
  color: string;
  func: (v: CsvVertex) => boolean;
}

export const csvPropDefs: CsvProp[] = [
  { key: "isFunction", label: "Function", color: "#3b82f6", func: (v: CsvVertex) => v.isFunction() }, // blue
  { key: "failureMode", label: "Failure Mode", color: "#ef4444", func: (v: CsvVertex) => v.isFailureMode() }, // red
  { key: "failureCause", label: "Failure Cause", color: "#f59e0b", func: (v: CsvVertex) => v.isFailureCause() }, // amber
  { key: "failureDetection", label: "Failure Detection", color: "#10b981", func: (v: CsvVertex) => v.isFailureDetection() }, // green
  { key: "compensationProvision", label: "Compensation Provision", color: "#8b5cf6", func: (v: CsvVertex) => v.isCompensationProvision() }, // violet
];
