export type LayoutMetrics = {
  totalVerticalLayer: number;
  bends: number;
  crossings: number;
  ink: number;
};

export const Empty_Layout_Metric: LayoutMetrics = {
  totalVerticalLayer: 0,
  bends: 0,
  crossings: 0,
  ink: 0,
};
