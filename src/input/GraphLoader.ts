import { GraphCfgDto } from "@/cfg/ConfigDtos";
import { Graph, LayerGraph } from "@/model/ds";
import { createRandomLayeredGraph } from "@/examples/GraphGenerator";
import { generateExampleGraph } from "@/examples/ExampleGraphs";
import { parseDotFile } from "./DotParser";

export function loadFromCfg(cfg: GraphCfgDto): Graph<any, any> {
  if (cfg.type === "example") {
    return generateExampleGraph(cfg.example_type);
  } else if (cfg.type === "random") {
    return createRandomLayeredGraph([5, 5, 5], 0.2);
  } else if (cfg.type === "file") {
    if (!cfg.fileContent) {
      return createRandomLayeredGraph([5, 5, 5], 0.2);
    } else {
      return parseDotFile(cfg.fileContent!);
    }
  }

  throw new Error("Invalid configuration");
}

/**
 * selected vertices + nachbarschaft in g
 * @param g
 * @param selection
 * @returns
 */
export function loadFromSelectionNbr(g: Graph<any, any>, selection: Set<any>): Graph<any, any> {
  const newGraph = new Graph<any, any>();
  const addedVertices = new Set<any>();
  selection.forEach((v) => {
    if (!addedVertices.has(v)) {
      newGraph.addVertex(v);
      addedVertices.add(v);
    }
    g.getIncident(v).forEach((e) => {
      if (!addedVertices.has(e.source)) {
        newGraph.addVertex(e.source);
        addedVertices.add(e.source);
      }
      if (!addedVertices.has(e.target)) {
        newGraph.addVertex(e.target);
        addedVertices.add(e.target);
      }
      newGraph.addEdge(e);
    });
  });
  return newGraph;
}

/**
 * selected vertices + all edges and vertices in g that lie on a directed path from a selected vertex
 * @param g
 * @param selection
 * @returns
 */
export function loadFromSelectionImpl(g: Graph<any, any>, selection: Set<any>): Graph<any, any> {
  const newGraph = new Graph<any, any>();
  const q = new Set<any>(selection);
  const addedVertices = new Set<any>();
  while (q.size > 0) {
    const v = q.values().next().value;
    q.delete(v);
    if (!addedVertices.has(v)) {
      newGraph.addVertex(v);
      addedVertices.add(v);
    }
    g.getIncidentOut(v).forEach((e) => {
      if (!addedVertices.has(e.target)) {
        newGraph.addVertex(e.target);
        addedVertices.add(e.target);
      }
      q.add(e.target);
      newGraph.addEdge(e);
    });
  }
  return newGraph;
}
