import GraphSvg from "@/components/GraphSvg";
import { generateLayout } from "@/model/layout/GraphLayoutGenerator";
import { useEffect, useState } from "react";
import ConfigPanel from "@/components/config/ConfigPanel";
import { ConfigDto, mapToDrawCfg, mapToGraphLayoutCfg } from "./cfg/ConfigDtos";
import { loadFromCfg } from "@/model/input/GraphLoader";
import { LayerGraph } from "@/model/ds";

function App() {
  const [config, setConfig] = useState(new ConfigDto());
  const G: LayerGraph<Number, any> = loadFromCfg(config.graphCfg) as LayerGraph<Number, any>;
  const [drawing, setDrawing] = useState(generateLayout(G, mapToGraphLayoutCfg(config)));
  const [drawCfg, setDrawCfg] = useState(mapToDrawCfg(config));

  useEffect(() => {
    setDrawing(generateLayout(G, mapToGraphLayoutCfg(config)));
    setDrawCfg(mapToDrawCfg(config));
  }, [config]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {" "}
      <div style={{ flexShrink: 0 }}>
        {" "}
        <ConfigPanel config={config} setConfig={setConfig} />{" "}
      </div>{" "}
      <div style={{ flexGrow: 1 }}>
        {" "}
        <GraphSvg graphDrawing={drawing} renderCfg={drawCfg} />{" "}
      </div>{" "}
    </div>
  );
}

export default App;
