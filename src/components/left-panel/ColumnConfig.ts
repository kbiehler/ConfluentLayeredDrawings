import { v4 as uuidv4 } from "uuid";

export type ColumnCfg = { id: string; csvName: string; legendName: string; color: string };

export const defaultColumns: ColumnCfg[] = [
  { id: uuidv4(), csvName: "function", legendName: "Function", color: "#3b82f6" },
  { id: uuidv4(), csvName: "failure mode", legendName: "Failure Mode", color: "#ef4444" },
  { id: uuidv4(), csvName: "failure cause", legendName: "Failure Cause", color: "#f59e0b" },
  { id: uuidv4(), csvName: "failure detection", legendName: "Failure Detection", color: "#10b981" },
  { id: uuidv4(), csvName: "compensation provision", legendName: "Compensation Provision", color: "#8b5cf6" },
];
