import Papa from "papaparse";
import { Edge, Graph } from "@/model/ds/Graph";
import { Vertex } from "@/model/ds";
import { NumberFilterCfgDto } from "@/components/csv/NumberFilterPanel";

interface Row {
  [key: string]: string;
}

export class CsvVertex extends Vertex {
  function = false;
  failureMode = false;
  failureCause = false;
  failureDetection = false;
  compensationProvision = false;
  severity_number = 0;
  probability_number = 0;
  criticality_number = 0;

  constructor(label: string) {
    super(label);
  }

  public isFunction(): boolean {
    return this.function;
  }

  public isFailureMode(): boolean {
    return this.failureMode;
  }

  public isFailureCause(): boolean {
    return this.failureCause;
  }

  public isFailureDetection(): boolean {
    return this.failureDetection;
  }

  public isCompensationProvision(): boolean {
    return this.compensationProvision;
  }

  public setFunction(value: boolean): void {
    this.function = value;
  }

  public setFailureMode(value: boolean): void {
    this.failureMode = value;
  }

  public setFailureCause(value: boolean): void {
    this.failureCause = value;
  }

  public setFailureDetection(value: boolean): void {
    this.failureDetection = value;
  }

  public setCompensationProvision(value: boolean): void {
    this.compensationProvision = value;
  }

  public setSeverityNumber(value: number): void {
    this.severity_number = value;
  }

  public setProbabilityNumber(value: number): void {
    this.probability_number = value;
  }

  public setCriticalityNumber(value: number): void {
    this.criticality_number = value;
  }

  public getSeverityNumber(): number {
    return this.severity_number;
  }

  public getProbabilityNumber(): number {
    return this.probability_number;
  }

  public getCriticalityNumber(): number {
    return this.criticality_number;
  }

  public copy(): Vertex {
    const copy = new CsvVertex(this.label);
    copy.setFunction(this.function);
    copy.setFailureMode(this.failureMode);
    copy.setFailureCause(this.failureCause);
    copy.setFailureDetection(this.failureDetection);
    copy.setCompensationProvision(this.compensationProvision);
    copy.setSeverityNumber(this.severity_number);
    copy.setProbabilityNumber(this.probability_number);
    copy.setCriticalityNumber(this.criticality_number);
    return copy;
  }
}

function getOrCreate(map: Map<string, CsvVertex>, key: string): CsvVertex {
  if (!map.has(key)) {
    const value = new CsvVertex(key);
    map.set(key, value);
    return value;
  }
  return map.get(key)!;
}

/**
 * Parse CSV text using PapaParse and build your Graph.
 * Assumes `content` is the full CSV string (e.g., result of File.text() in the browser).
 */
export function readCsv(content: string, cfg: NumberFilterCfgDto): Graph {
  const parsed = Papa.parse<Row>(content, {
    header: true, // first row as headers -> objects
    skipEmptyLines: true,
    dynamicTyping: false, // keep strings unless you prefer automatic numbers/booleans
  });

  if (parsed.errors.length) {
    console.error("CSV parse errors:", parsed.errors);
  }

  const rows = parsed.data;

  const nodeMap = new Map<string, CsvVertex>();
  const edges = new Set<Edge<CsvVertex>>();

  for (const r of rows) {
    if (ignoreNumbers(r, cfg)) {
      continue; // Skip rows based on filter criteria
    }

    const func = getOrCreate(nodeMap, r["function"]);
    func.setFunction(true);
    const mode = getOrCreate(nodeMap, r["failure mode"]);
    mode.setFailureMode(true);
    const cause = getOrCreate(nodeMap, r["failure cause"]);
    cause.setFailureCause(true);

    cause.setSeverityNumber(parseFloat(r["severity number"]));
    cause.setProbabilityNumber(parseFloat(r["probability number"]));
    cause.setCriticalityNumber(parseFloat(r["criticality number"]));

    const detection = getOrCreate(nodeMap, r["failure detection"]);
    detection.setFailureDetection(true);
    const compensation = getOrCreate(nodeMap, r["compensation provision"]);
    compensation.setCompensationProvision(true);

    edges.add(new Edge(func, mode));
    edges.add(new Edge(mode, cause));
    edges.add(new Edge(cause, detection));
    edges.add(new Edge(detection, compensation));
  }

  const graph = new Graph<Vertex>();
  nodeMap.forEach((node) => {
    graph.addVertex(node);
  });

  edges.forEach((edge) => {
    if (!graph.getAdjacentOut(edge.source).includes(edge.target)) {
      graph.addEdge(edge);
    }
  });

  const emptyVertex = getOrCreate(nodeMap, "");
  if (graph.containsVertex(emptyVertex)) {
    graph.getIncident(emptyVertex).forEach((edge) => {
      graph.deleteEdge(edge);
    });
    graph.deleteVertex(emptyVertex);
  }

  const noneVertex = getOrCreate(nodeMap, "none");
  if (graph.containsVertex(noneVertex)) {
    graph.getIncident(noneVertex).forEach((edge) => {
      graph.deleteEdge(edge);
    });
    graph.deleteVertex(noneVertex);
  }

  return graph;
}
function ignoreNumbers(r: Row, cfg: NumberFilterCfgDto) {
  if (cfg.filterType === "all") {
    return false; // No filtering, show all
  }
  const relevantNumber =
    cfg.filterType === "severity"
      ? parseFloat(r["severity number"])
      : cfg.filterType === "probability"
      ? parseFloat(r["probability number"])
      : cfg.filterType === "criticality"
      ? parseFloat(r["criticality number"])
      : 0;

  if (cfg.smallerGreaterEqual === ">=") {
    return relevantNumber < cfg.filterNumber;
  } else if (cfg.smallerGreaterEqual === "<=") {
    return relevantNumber > cfg.filterNumber;
  } else if (cfg.smallerGreaterEqual === "=") {
    return relevantNumber !== cfg.filterNumber;
  }
  return false;
}
