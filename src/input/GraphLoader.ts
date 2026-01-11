import { GraphCfgDto } from "@/cfg/ConfigDtos";
import { Graph } from "@/model/ds";
import { createRandomLayeredGraph } from "@/examples/GraphGenerator";
import { generateExampleGraph } from "@/examples/ExampleGraphs";
import { parseDotFile } from "./DotParser";
import { readCsv } from "./CsvParser";
import { NumberFilterDto } from "@/components/left-panel/NumberFilterPanel";
import { ColumnCfg } from "@/components/left-panel/ColumnConfig";
import InputError from "./InputError";

export function loadFromCfg(cfg: GraphCfgDto, numberCfg: NumberFilterDto, columnCfg: ColumnCfg[]): Graph<any> | InputError {
  if (cfg.type === "example") {
    return generateExampleGraph(cfg.example_type);
  } else if (cfg.type === "random") {
    return createRandomLayeredGraph([10, 10], 0.5);
  } else if (cfg.type === "file") {
    if (!cfg.fileContent) {
      return createRandomLayeredGraph([5, 5, 5], 0.2);
    } else {
      return parseDotFile(cfg.fileContent!);
    }
  } else if (cfg.type === "csv") {
    return readCsv(cfg.fileContent!, columnCfg, numberCfg);
  }

  throw new Error("Invalid configuration");
}
