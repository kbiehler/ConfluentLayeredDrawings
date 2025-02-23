import { DrawCfg } from "@/components/Graph";
import { DrawingAlgorithmCfg } from "../drawing/Drawer";
/**
 * Data Transfer Object (DTO) for configuration settings.
 *
 * The `ConfigDto` class serves as a container for configuration settings that are mapped
 * into actual configurations required by various components and classes. This approach
 * maintains a separation between the structure of the input configuration and the
 * configuration used by individual components and algorithms.
 */
export class ConfigDto {
  vertexPositionCfg: VertexPositionCfgDto = new VertexPositionCfgDto();
  uiConfig: UiCfgDto = new UiCfgDto();
}

export class VertexPositionCfgDto {
  barycenterDepth: number = 0;
  barycenterRandomStart: boolean = false;
  layerSpacing: number = 400;
  vertexSpacing: number = 100;
}

export class UiCfgDto {
  vertexColor: string = "#FF0000";
  highlightColor: string = "#0000FF";
}

export function mapToDrawCfg(cfgDto: ConfigDto): DrawCfg {
  return {
    vertexColor: cfgDto.uiConfig.vertexColor,
    highlightColor: cfgDto.uiConfig.highlightColor,
  };
}

export function mapToDrawingAlgorithmCfg(cfgDto: ConfigDto): DrawingAlgorithmCfg {
  return {
    vertexPosition: {
      barycenterDepth: cfgDto.vertexPositionCfg.barycenterDepth,
      barycenterRandomStart: cfgDto.vertexPositionCfg.barycenterRandomStart,
      layerSpacing: cfgDto.vertexPositionCfg.layerSpacing,
      vertexSpacing: cfgDto.vertexPositionCfg.vertexSpacing,
    },
  };
}
