import { GraphCfgDto } from "@/cfg/ConfigDtos";
import { Graph  } from "@/model/ds";
import { createRandomLayeredGraph } from "@/examples/GraphGenerator";
import { generateExampleGraph } from "@/examples/ExampleGraphs";
import { parseDotFile } from "./DotParser";

export function loadFromCfg(cfg: GraphCfgDto): Graph<any> {
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



export function loadFromSelectionImpl(g: Graph<any>, selection: Set<any>): Graph<any> {
  const newGraph = new Graph<any>();
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
