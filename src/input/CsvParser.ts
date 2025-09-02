import Papa from "papaparse";
import { Edge, Graph } from "@/model/ds/Graph";
import { Vertex } from "@/model/ds";
import { NumberFilterDto } from "@/components/left-panel/NumberFilterPanel";
import { ColumnCfg } from "@/components/left-panel/ColumnConfig";

interface Row {
  [key: string]: string;
}

export class CsvVertex extends Vertex {
  constructor(label: string) {
    super(label);
  }

  columns: string[] = [];

  public getColumns(): string[] {
    return this.columns;
  }

  public addColumn(column: string) {
    this.columns.push(column);
  }

  public copy(): Vertex {
    const copy = new CsvVertex(this.label);
    copy.columns = [...this.columns];
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
export function readCsv(content: string, columnCfg: ColumnCfg[], cfg: NumberFilterDto): Graph {
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
    let prev = null;
    for (const colCfg of columnCfg) {
      const colValue = r[colCfg.csvName];
      if (colValue) {
        const vertex = getOrCreate(nodeMap, colValue);
        vertex.addColumn(colCfg.legendName);
        if (prev) {
          edges.add(new Edge(prev, vertex));
        }
        prev = vertex;
      }
    }
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
function ignoreNumbers(r: Row, cfg: NumberFilterDto) {
  if (cfg.filterType === "all") {
    return false; // No filtering, show all
  }
  const relevantNumber = parseFloat(r[cfg.filterType]) || 0;

  if (cfg.smallerGreaterEqual === ">=") {
    return relevantNumber < cfg.filterNumber;
  } else if (cfg.smallerGreaterEqual === "<=") {
    return relevantNumber > cfg.filterNumber;
  } else if (cfg.smallerGreaterEqual === "=") {
    return relevantNumber !== cfg.filterNumber;
  }
  return false;
}
