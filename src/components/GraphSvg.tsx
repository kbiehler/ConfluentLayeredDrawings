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
  const [interactionState, setInteractionState] = useState(new InteractionState());

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    let [width, height] = graphDrawing.getSize();

    width += 100;
    height += 100;

    svg.attr("width", width).attr("height", height);
    //g contains actual drawing, shifted by 50, 50
    const g = svg.append("g").attr("transform", `translate(50, 50)`);

    const interactionManager = new InteractionManager(interactionState);
    new GraphSVGRenderer().render(g, graphDrawing, renderCfg, (vertexId) => interactionManager.highlightVertex(vertexId));
    new SvgEventController(interactionState, setInteractionState).attachListeners(g);
  }, [interactionState, graphDrawing]);

  return (
    <div style={{ display: "inline-block" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default GraphSvg;
