import { GraphCfgDto } from "@/cfg/ConfigDtos";
import { Graph, Edge } from "@/model/ds";
import { createRandomLayeredGraph } from "@/examples/GraphGenerator";
import { generateExampleGraph } from "@/examples/ExampleGraphs";
import { readDotFile } from "./DotReader";
import { readGraphFromDot } from "./GraphParser";

export function loadFromCfg(cfg: GraphCfgDto): Graph<any, any> {
  if (cfg.type === "example") {
    return generateExampleGraph(cfg.example_type);
  } else if (cfg.type === "random") {
    return createRandomLayeredGraph([5, 5, 5], 0.2);
  } else if (cfg.type === "file") {
    if (!cfg.fileContent) {
      return createRandomLayeredGraph([5, 5, 5], 0.2);
    } else {
      return readGraphFromDot(cfg.fileContent!);
    }
  }

  throw new Error("Invalid configuration");
}
