import Papa from "papaparse";
import { Edge, Graph } from "@/model/ds/Graph";
import { v4 as uuidv4 } from "uuid";
import { Vertex } from "@/model/ds";

interface Row {
  [key: string]: string;
}

function getOrCreate(map: Map<string, Vertex>, key: string): Vertex {
  if (!map.has(key)) {
    const value = new Vertex(key);
    map.set(key, value);
    return value;
  }
  return map.get(key)!;
}

/**
 * Parse CSV text using PapaParse and build your Graph.
 * Assumes `content` is the full CSV string (e.g., result of File.text() in the browser).
 */
export function readCsv(content: string): Graph {
  const parsed = Papa.parse<Row>(content, {
    header: true, // first row as headers -> objects
    skipEmptyLines: true,
    dynamicTyping: false, // keep strings unless you prefer automatic numbers/booleans
  });

  if (parsed.errors.length) {
    console.error("CSV parse errors:", parsed.errors);
  }

  const rows = parsed.data;

  const nodeMap = new Map<string, Vertex>();
  const edges = new Set<Edge<Vertex>>();

  for (const r of rows) {
    const func = getOrCreate(nodeMap, r["function"]);
    const mode = getOrCreate(nodeMap, r["failure mode"]);
    const cause = getOrCreate(nodeMap, r["failure cause"]);
    const detection = getOrCreate(nodeMap, r["failure detection"]);
    const compensation = getOrCreate(nodeMap, r["compensation provision"]);

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
  graph.getIncident(emptyVertex).forEach((edge) => {
    graph.deleteEdge(edge);
  });
  graph.deleteVertex(emptyVertex);

  const noneVertex = getOrCreate(nodeMap, "none");
  graph.getIncident(noneVertex).forEach((edge) => {
    graph.deleteEdge(edge);
  });
  graph.deleteVertex(noneVertex);

  return graph;
}
