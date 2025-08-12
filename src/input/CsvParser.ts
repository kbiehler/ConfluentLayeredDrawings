import Papa from "papaparse";
import { Edge, Graph } from "@/model/ds/Graph";
import { BipartiteGraph, LayerGraph } from "@/model/ds";
import { v4 as uuidv4 } from "uuid";
import { fail } from "node:assert";

interface Row {
  [key: string]: string;
}

export interface Node {
  id: string; // UUID
  label: string; // The string label
}

export function createNode(label: string): Node {
  return {
    id: uuidv4(),
    label,
  };
}

function getOrCreate<K, V>(map: Map<K, V>, key: K, create: () => V): V {
  if (!map.has(key)) {
    const value = create();
    map.set(key, value);
    return value;
  }
  return map.get(key)!; // The ! tells TS it's not undefined here
}

/**
 * Parse CSV text using PapaParse and build your Graph.
 * Assumes `content` is the full CSV string (e.g., result of File.text() in the browser).
 */
export function readCsv(content: string): Graph<any> {
  const parsed = Papa.parse<Row>(content, {
    header: true, // first row as headers -> objects
    skipEmptyLines: true,
    dynamicTyping: false, // keep strings unless you prefer automatic numbers/booleans
  });

  if (parsed.errors.length) {
    console.error("CSV parse errors:", parsed.errors);
  }

  const rows = parsed.data;
  console.log("Rows:", rows);

  const graph = new LayerGraph<Node>();

  const functionMap = new Map<string, Node>();
  const failureModeMap = new Map<string, Node>();
  const failureCauseMap = new Map<string, Node>();
  const failureDetectionMap = new Map<string, Node>();
  const compensationProvisionMap = new Map<string, Node>();

  for (const r of rows) {
    if (
      functionMap.has(r["failure cause"]) ||
      failureModeMap.has(r["failure cause"]) ||
      // failureCauseMap.has(r["failure cause"]) ||
      failureDetectionMap.has(r["failure cause"]) ||
      compensationProvisionMap.has(r["failure cause"])
    ) {
      console.warn("Duplicate entry found", r["failure cause"]);
    }
    const func = getOrCreate(functionMap, r["function"], () => createNode(r["function"]));
    const mode = getOrCreate(failureModeMap, r["failure mode"], () => createNode(r["failure mode"]));
    const cause = getOrCreate(failureCauseMap, r["failure cause"], () => createNode(r["failure cause"]));
    const detection = getOrCreate(failureDetectionMap, r["failure detection"], () => createNode(r["failure detection"]));
    const compensation = getOrCreate(compensationProvisionMap, r["compensation provision"], () => createNode(r["compensation provision"]));

    graph.addVertexToLayer(func, 0);
    graph.addVertexToLayer(mode, 1);
    graph.addVertexToLayer(cause, 2);
    graph.addVertexToLayer(detection, 3);
    graph.addVertexToLayer(compensation, 4);
    graph.addEdge(new Edge(func, mode));
    graph.addEdge(new Edge(mode, cause));
    graph.addEdge(new Edge(cause, detection));
    graph.addEdge(new Edge(detection, compensation));
  }

  return graph;
}
