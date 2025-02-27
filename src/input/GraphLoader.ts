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

export function loadFromSelection(g: Graph<any, any>, selection: Set<any>): Graph<any, any> {
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
