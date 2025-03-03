import { RenderCfg } from "@/model/renderer/GraphSVGRenderer";
import { GraphLayoutCfg } from "../model/layout/GraphLayoutGenerator";
import { ExampleGraphs } from "@/examples/ExampleGraphs";
import { VertexPositionAlgorithm } from "@/model/layout/positioning/VertexPositioner";
import { FixedLayerSpacerCfg } from "@/model/layout/spacing/FixedLayerSpacer";
import { FixedVerticalSpacerCfg } from "@/model/layout/spacing/FixedVerticalSpacer";
import { vertexSpacingCfg, VertexSpacingCfgDto } from "./VertexSpacingCfgDto";
import { EdgeDrawingAlgorithm } from "@/model/layout/edges/EdgeDrawingAlgorithm";

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
  vertexSpacingCfg: VertexSpacingCfgDto = vertexSpacingCfg;
}

export class GraphCfgDto {
  type: "example" | "random" | "file" = "example";
  example_type: ExampleGraphs = ExampleGraphs.CENTER_2;
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
  yDist: number = 100;
  showCliqueCenter: boolean = true;
}

export class BiCliqueCfg {
  bicliqueDepth: number = 1;
  postProcessShift: boolean = true;
}

export class LayerSpacingCfgDto {
  type: "layerFix" | "vertLayerFix" = "vertLayerFix";

  vertLayerFix_verticalSpacing: number = 30;
  vertLayerFix_addVertexDist: number = 30;
  vertLayerFix_addCenterWidth: number = 0;

  layerFix_layerSpacing: number = 500;
}

export function mapToRenderCfg(cfgDto: ConfigDto): RenderCfg {
  return {
    vertexColor: cfgDto.uiCfg.vertexColor,
    highlightColor: cfgDto.uiCfg.highlightColor,
    edgeColor: cfgDto.uiCfg.edgeColor,
    showCliqueCenter: cfgDto.uiCfg.showCliqueCenter,
  };
}

export function mapToGraphLayoutCfg(cfgDto: ConfigDto): GraphLayoutCfg {
  let layerSpacingCfg: FixedLayerSpacerCfg | FixedVerticalSpacerCfg;
  if (cfgDto.layerSpacingCfg.type === "layerFix") {
    layerSpacingCfg = new FixedLayerSpacerCfg();
    layerSpacingCfg.layerSpacing = cfgDto.layerSpacingCfg.layerFix_layerSpacing;
  } else {
    layerSpacingCfg = new FixedVerticalSpacerCfg();
    layerSpacingCfg.verticalSpacing = cfgDto.layerSpacingCfg.vertLayerFix_verticalSpacing;
    layerSpacingCfg.addVertexDist = cfgDto.layerSpacingCfg.vertLayerFix_addVertexDist;
    layerSpacingCfg.addCenterWidth = cfgDto.layerSpacingCfg.vertLayerFix_addCenterWidth;
  }

  return {
    vertexPosition: {
      baryDepth: cfgDto.barycenterCfg.barycenterDepth,
      baryInitRandom: cfgDto.barycenterCfg.barycenterRandomInit,
      baryIdentConnected: cfgDto.barycenterCfg.identConnected,
      yDist: cfgDto.uiCfg.yDist,
      alg: cfgDto.algCfg.vertexPositioning,
    },
    biClique: {
      bicliqueDepth: cfgDto.biCliqueCfg.bicliqueDepth,
      postProcessShift: cfgDto.biCliqueCfg.postProcessShift,
    },
    edgeAlg: cfgDto.algCfg.edgeDrawing,
    layerSpacing: layerSpacingCfg,
    vertexSpacing: {
      type: cfgDto.vertexSpacingCfg.type,
      textPadding: cfgDto.vertexSpacingCfg.textPadding,
      v_height: cfgDto.vertexSpacingCfg.v_height,
      v_width: cfgDto.vertexSpacingCfg.v_width,
      width_min: cfgDto.vertexSpacingCfg.width_min,
      width_max: cfgDto.vertexSpacingCfg.width_max,
      show_percentage: cfgDto.vertexSpacingCfg.show_percentage,
    },
  };
}
