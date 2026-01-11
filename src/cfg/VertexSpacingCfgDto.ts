import { VertexSpacerType } from "@/model/layout/spacing/VertexSpacer";

export type VertexSpacingCfgDto = {
  type: VertexSpacerType;
  textPadding: number;
  v_height: number;
  v_width?: number; // Only for FixedSizeVertexSpacer
  width_min?: number; // Only for MinMaxVertexSpacer and DynamicVertexSpacer
  width_max?: number; // Only for MinMaxVertexSpacer and DynamicVertexSpacer
  show_percentage?: number; // Only for DynamicVertexSpacer
};

// Example configuration
export const vertexSpacingCfg: VertexSpacingCfgDto = {
  type: VertexSpacerType.DYNAMIC,
  textPadding: 10,
  v_height: 50,
  v_width: 0,
  width_min: 150,
  width_max: 800,
  show_percentage: 0.8,
};
