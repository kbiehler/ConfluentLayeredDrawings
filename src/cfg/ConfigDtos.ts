import { RenderCfg } from "@/model/renderer/GraphSVGRenderer";
import { GraphLayoutCfg } from "../model/layout/GraphLayoutGenerator";
import { ExampleGraphs } from "@/examples/ExampleGraphs";
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
  vertexPositionCfg: VertexPositionCfgDto = new VertexPositionCfgDto();
  uiCfg: UiCfgDto = new UiCfgDto();
}

export class GraphCfgDto {
  type: "example" | "random" = "random";
  example_type: ExampleGraphs = ExampleGraphs.GRAPH_1;
}

export class VertexPositionCfgDto {
  barycenterDepth: number = 0;
  barycenterRandomStart: boolean = false;
  layerSpacing: number = 400;
  vertexSpacing: number = 100;
}

export class EdgeDrawingDto {
  alg: "straightLine" | "singleVerticalLayer" = "straightLine";
}

export class UiCfgDto {
  vertexColor: string = "#FF0000";
  highlightColor: string = "#0000FF";
}

export function mapToDrawCfg(cfgDto: ConfigDto): RenderCfg {
  return {
    vertexColor: cfgDto.uiCfg.vertexColor,
    highlightColor: cfgDto.uiCfg.highlightColor,
  };
}

export function mapToGraphLayoutCfg(cfgDto: ConfigDto): GraphLayoutCfg {
  return {
    vertexPosition: {
      barycenterDepth: cfgDto.vertexPositionCfg.barycenterDepth,
      barycenterRandomStart: cfgDto.vertexPositionCfg.barycenterRandomStart,
      layerSpacing: cfgDto.vertexPositionCfg.layerSpacing,
      vertexSpacing: cfgDto.vertexPositionCfg.vertexSpacing,
    },
  };
}
