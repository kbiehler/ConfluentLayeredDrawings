import { GraphCfgDto } from "@/cfg/ConfigDtos";
import { Graph } from "@/model/ds";
import { createRandomLayeredGraph } from "@/examples/GraphGenerator";
import { generateExampleGraph } from "@/examples/ExampleGraphs";
import { parseDotFile } from "./DotParser";
import { readCsv } from "./CsvParser";
import { NumberFilterCfgDto } from "@/components/csv/NumberFilterPanel";

export function loadFromCfg(cfg: GraphCfgDto, numberCfg: NumberFilterCfgDto): Graph<any> {
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
  } else if (cfg.type === "csv") {
    return readCsv(cfg.fileContent!, numberCfg);
  }

  throw new Error("Invalid configuration");
}
