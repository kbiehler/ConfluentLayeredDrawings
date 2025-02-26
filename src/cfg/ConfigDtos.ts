import { RenderCfg } from "@/model/renderer/GraphSVGRenderer";
import { GraphLayoutCfg } from "../model/layout/GraphLayoutGenerator";
import { ExampleGraphs } from "@/examples/ExampleGraphs";
import { EdgeDrawingAlgorithm } from "@/model/layout/EdgeDrawer";
/**
 * Data Transfer Object (DTO) for configuration settings.
 *
 * The `ConfigDto` class serves as a container for configuration settings that are mapped
 * into actual configurations required by various components and classes. This approach
 * maintains a separation between the structure of the input configuration and the
 * configuration used by individual components and algorithms.
 */
export class ConfigDto {
  graphCfg: GraphCfgDto = new GraphCfgDto();
  barycenterCfg: BarycenterCfgDto = new BarycenterCfgDto();
  uiCfg: UiCfgDto = new UiCfgDto();
  edgeCfg: EdgeDrawingCfgDto = new EdgeDrawingCfgDto();
}

export class GraphCfgDto {
  type: "example" | "random" | "file" = "example";
  example_type: ExampleGraphs = ExampleGraphs.POS_4;
  fileContent?: string; // Store uploaded file contents
}

export class BarycenterCfgDto {
  barycenterDepth: number = 0;
  barycenterRandomInit: boolean = false;
}

export class EdgeDrawingCfgDto {
  alg: EdgeDrawingAlgorithm = EdgeDrawingAlgorithm.VERTICAL_BUNDELING_ORDERING;
}

export class UiCfgDto {
  vertexColor: string = "#ADD8E6";
  highlightColor: string = "#FF6347";
  edgeColor: string = "#999999";
  layerSpacing: number = 600;
  vertexSpacing: number = 100;
}

export function mapToDrawCfg(cfgDto: ConfigDto): RenderCfg {
  return {
    vertexColor: cfgDto.uiCfg.vertexColor,
    highlightColor: cfgDto.uiCfg.highlightColor,
    edgeColor: cfgDto.uiCfg.edgeColor,
  };
}

export function mapToGraphLayoutCfg(cfgDto: ConfigDto): GraphLayoutCfg {
  return {
    vertexPosition: {
      baryDepth: cfgDto.barycenterCfg.barycenterDepth,
      baryInitRandom: cfgDto.barycenterCfg.barycenterRandomInit,
      layerSpacing: cfgDto.uiCfg.layerSpacing,
      vertexSpacing: cfgDto.uiCfg.vertexSpacing,
    },
    edgeAlg: cfgDto.edgeCfg.alg,
  };
}
