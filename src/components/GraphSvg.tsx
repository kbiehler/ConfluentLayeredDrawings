import * as d3 from "d3";
import { GraphLayout, VertexLayout } from "@/model/layout/GraphLayout";
import React, { useEffect, useRef, useState } from "react";
import { GraphSVGRenderer, RenderCfg } from "@/model/renderer/GraphSVGRenderer";
import { InteractionManager, InteractionState } from "@/model/renderer/InteractionManager";
import { SvgEventController } from "@/model/renderer/SvgEventController";

interface DrawingProps {
  graphDrawing: GraphLayout;
  renderCfg: RenderCfg;
}

const GraphSvg: React.FC<DrawingProps> = ({ graphDrawing, renderCfg }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const interactionManager = new InteractionManager();
  interactionManager.on("redraw", () => {
    draw(svgRef!, graphDrawing, renderCfg, interactionManager);
  });

  useEffect(() => {
    interactionManager.reset();
    draw(svgRef!, graphDrawing, renderCfg, interactionManager);
  }, [graphDrawing]);

  return (
    <div style={{ display: "inline-block" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

function draw(
  svgRef: React.RefObject<SVGSVGElement | null>, //
  graphDrawing: GraphLayout,
  renderCfg: RenderCfg,
  interactionManager: InteractionManager
) {
  const svg = d3.select(svgRef.current);
  svg.selectAll("*").remove();

  let [width, height] = graphDrawing.getSize();

  width += 100;
  height += 100;

  svg.attr("width", width).attr("height", height);
  //g contains actual drawing, shifted by 50, 50
  const g = svg.append("g").attr("transform", `translate(50, 50)`);

  new GraphSVGRenderer().render(g, graphDrawing, renderCfg, (vertexId) => interactionManager.highlightVertex(vertexId));
  new SvgEventController(interactionManager).attachListeners(g);
}

export default GraphSvg;
