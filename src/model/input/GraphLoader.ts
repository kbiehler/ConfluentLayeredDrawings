import { GraphCfgDto } from "@/cfg/ConfigDtos";
import { Graph, Edge } from "@/model/ds";
import { createRandomLayeredGraph } from "@/examples/GraphGenerator";
import { generateExampleGraph } from "@/examples/ExampleGraphs";

export function loadFromCfg(cfg: GraphCfgDto): Graph<Number, Edge<Number>> {
  if (cfg.type === "example") {
    return generateExampleGraph(cfg.example_type);
  } else if (cfg.type === "random") {
    return createRandomLayeredGraph([5, 5, 5], 0.2);
  }

  throw new Error("Invalid configuration");
}
