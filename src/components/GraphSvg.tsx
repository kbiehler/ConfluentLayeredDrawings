import * as d3 from "d3";
import { GraphLayout } from "@/model/layout/GraphLayout";
import React, { useEffect, useRef } from "react";
import { GraphSVGRenderer, RenderCfg } from "@/model/renderer/GraphSVGRenderer";
import { InteractionManager } from "@/model/renderer/InteractionManager";
import { SvgEventController } from "@/model/renderer/SvgEventController";

interface DrawingProps {
  graphLayout: GraphLayout;
  renderCfg: RenderCfg;
  interactionManager: InteractionManager;
}

const GraphSvg: React.FC<DrawingProps> = ({ graphLayout: graphDrawing, renderCfg, interactionManager }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  interactionManager.removeAllListeners("redraw");
  interactionManager.on("redraw", () => {
    console.log("redraw");
    draw(svgRef!, graphDrawing, renderCfg, interactionManager);
  });

  useEffect(() => {
    // interactionManager.reset();
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

  width += 250;
  height += 250;

  svg.attr("width", width).attr("height", height);
  //g contains actual drawing, shifted by 150, 150
  const g = svg.append("g").attr("transform", `translate(150, 150)`);

  new GraphSVGRenderer().render(
    g,
    graphDrawing,
    renderCfg,
    (vertexId) => interactionManager.highlightVertex(vertexId),
    (edgeId) => interactionManager.highlightEdge(edgeId),
    (vertexId) => interactionManager.isSelectedVertex(vertexId),
    (vertexID) => interactionManager.markVertex(vertexID)
  );
  new SvgEventController(interactionManager).attachListeners(g);
}

export default GraphSvg;
