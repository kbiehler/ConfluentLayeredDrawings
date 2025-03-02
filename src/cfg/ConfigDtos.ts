import { RenderCfg } from "@/model/renderer/GraphSVGRenderer";
import { GraphLayoutCfg } from "../model/layout/GraphLayoutGenerator";
import { ExampleGraphs } from "@/examples/ExampleGraphs";
import { EdgeDrawingAlgorithm } from "@/model/layout/edges/plan/EdgePlanner";
import { VertexPositionAlgorithm } from "@/model/layout/positioning/VertexPositioner";

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
  algCfg: AlgorithmCfgDto = new AlgorithmCfgDto();
  biCliqueCfg: BiCliqueCfg = new BiCliqueCfg();
  layerSpacingCfg: LayerSpacingCfgDto = new LayerSpacingCfgDto();
}

export class GraphCfgDto {
  type: "example" | "random" | "file" = "example";
  example_type: ExampleGraphs = ExampleGraphs.POS_4;
  fileContent?: string; // Store uploaded file contents
}

export class BarycenterCfgDto {
  barycenterDepth: number = 100;
  barycenterRandomInit: boolean = true;
  identConnected: boolean = true;
}

export class AlgorithmCfgDto {
  edgeDrawing: EdgeDrawingAlgorithm = EdgeDrawingAlgorithm.VERTICAL_BUNDELING;
  vertexPositioning: VertexPositionAlgorithm = VertexPositionAlgorithm.LP;
}

export class UiCfgDto {
  vertexColor: string = "#ADD8E6";
  highlightColor: string = "#FF6347";
  edgeColor: string = "#999999";
  layerSpacing: number = 500;
  vertexSpacing: number = 100;
}

export class BiCliqueCfg {
  bicliqueDepth: number = 1;
}

export class LayerSpacingCfgDto {
  type: "layerFix" | "vertLayerFix" = "layerFix";

  vertLayerFix_verticalSpacing: number = 25;
  vertLayerFix_vertexToFirstVertical: number = 30;
  vertLayerFix_centerWidth: number = 20;

  layerFix_layerSpacing: number = 500;
  layerFix_centerWidth: number = 200;
}

export function mapToRenderCfg(cfgDto: ConfigDto): RenderCfg {
  return {
    vertexColor: cfgDto.uiCfg.vertexColor,
    highlightColor: cfgDto.uiCfg.highlightColor,
    edgeColor: cfgDto.uiCfg.edgeColor,
  };
}

export function mapToGraphLayoutCfg(cfgDto: ConfigDto): GraphLayoutCfg {
  let layerSpacing: any;
  if (cfgDto.layerSpacingCfg.type === "layerFix") {
    layerSpacing = {
      layerSpacing: cfgDto.layerSpacingCfg.layerFix_layerSpacing,
      centerWidth: cfgDto.layerSpacingCfg.layerFix_centerWidth,
    };
  } else if (cfgDto.layerSpacingCfg.type === "vertLayerFix") {
    layerSpacing = {
      minVerticalSpacing: cfgDto.layerSpacingCfg.vertLayerFix_verticalSpacing,
      vertexToFirstVertical: cfgDto.layerSpacingCfg.vertLayerFix_vertexToFirstVertical,
      centerWidth: cfgDto.layerSpacingCfg.vertLayerFix_centerWidth,
    };
  }

  return {
    vertexPosition: {
      baryDepth: cfgDto.barycenterCfg.barycenterDepth,
      baryInitRandom: cfgDto.barycenterCfg.barycenterRandomInit,
      baryIdentConnected: cfgDto.barycenterCfg.identConnected,
      layerSpacing: cfgDto.uiCfg.layerSpacing,
      vertexSpacing: cfgDto.uiCfg.vertexSpacing,
      alg: cfgDto.algCfg.vertexPositioning,
    },
    biCliqueDepth: cfgDto.biCliqueCfg.bicliqueDepth,
    edgeAlg: cfgDto.algCfg.edgeDrawing,
    layerSpacing: layerSpacing,
  };
}
