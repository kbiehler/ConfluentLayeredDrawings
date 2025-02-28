import React from "react";
import GraphSvg from "@/components/GraphSvg";
import { useEffect, useState } from "react";
import { ConfigDto, mapToRenderCfg } from "@/cfg/ConfigDtos";
import { GraphLayout } from "@/model/layout/GraphLayout";
import { InteractionManager, MarkVertexInteractionManager } from "@/model/renderer/InteractionManager";
import { Graph } from "@/model/ds";
import { draw, redrawImpl, redrawNbr } from "@/model/DrawModel";
import { RedrawState } from "@/model/redraw/RedrawState";

interface GraphsPanelProps {
  config: ConfigDto;
}

const GraphsPanel: React.FC<GraphsPanelProps> = ({ config }) => {
  const [layout, setLayout] = useState(() => new GraphLayout());
  const [redrawState, setRedrawState] = useState(() => new RedrawState(new Graph()));
  const [interactMgr, setInteractMgr] = useState(() => new InteractionManager());
  const [renderCfg, setRenderCfg] = useState(() => mapToRenderCfg(config));
  const [panelSelect, setPanelSelect] = useState<"main" | "nbr" | "impl">("main");

  useEffect(() => {
    const [redrawState, tmpLayout, tmpInteractInfo] = draw(config);
    setRedrawState(redrawState);
    setLayout(tmpLayout);
    setInteractMgr(new InteractionManager(tmpInteractInfo));
    setRenderCfg(mapToRenderCfg(config));
  }, [config]);

  const [nbrLayout, setNbrLayout] = useState(() => new GraphLayout());
  const [nbrInteractMgr, setNbrInteractMgr] = useState(() => new InteractionManager());

  const [implLayout, setImplLayout] = useState(() => new GraphLayout());
  const [implInteractMgr, setImplInteractMgr] = useState(() => new InteractionManager());

  useEffect(() => {
    if (panelSelect === "main") {
      return;
    } else if (panelSelect === "nbr") {
      const tmpLayout = redrawNbr(redrawState, interactMgr.state.selectedVertices, config);
      setNbrInteractMgr(new MarkVertexInteractionManager(interactMgr.state.selectedVertices));
      setNbrLayout(tmpLayout);
    } else if (panelSelect === "impl") {
      const [, tmpLayout, _] = redrawImpl(redrawState, interactMgr.state.selectedVertices, config);
      setImplInteractMgr(new MarkVertexInteractionManager(interactMgr.state.selectedVertices));
      setImplLayout(tmpLayout);
    }
  }, [panelSelect]);

  return (
    <div>
      <div style={{ flexShrink: 0, padding: "10px", display: "flex", gap: "10px" }}>
        <button onClick={() => setPanelSelect("main")} style={{ background: panelSelect === "main" ? "#ddd" : "#fff" }}>
          Main Graph
        </button>
        <button onClick={() => setPanelSelect("nbr")} style={{ background: panelSelect === "nbr" ? "#ddd" : "#fff" }}>
          Show selected + neighbours
        </button>
        <button onClick={() => setPanelSelect("impl")} style={{ background: panelSelect === "impl" ? "#ddd" : "#fff" }}>
          Show implied
        </button>
      </div>
      <div style={{ flexGrow: 1 }}>
        {panelSelect === "main" ? (
          <GraphSvg graphLayout={layout} renderCfg={renderCfg} interactionManager={interactMgr} />
        ) : panelSelect === "nbr" ? (
          <GraphSvg graphLayout={nbrLayout} renderCfg={renderCfg} interactionManager={nbrInteractMgr} />
        ) : (
          <GraphSvg graphLayout={implLayout} renderCfg={renderCfg} interactionManager={implInteractMgr} />
        )}
      </div>
    </div>
  );
};

export default GraphsPanel;
