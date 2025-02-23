import Graph from "@/components/Graph";
import { createRandomLayeredGraph } from "./model/ExampleGraphs";
import { straightLineDrawing } from "./model/drawing/SimpleDrawer";
import { useEffect, useState } from "react";
import { VertexPositionCfg } from "./model/drawing/VertexPositioner";
import ConfigPanel from "./components/ConfigPanel";

function App() {
  const G = createRandomLayeredGraph([5, 5, 5], 0.5);
  const [config, setConfig] = useState(new VertexPositionCfg());
  const [drawing, setDrawing] = useState(straightLineDrawing(G, config));
  useEffect(() => {
    setDrawing(straightLineDrawing(G, config));
  }, [config]);

  return (
    <>
      <ConfigPanel cfg={config} setConfig={setConfig} />
      <Graph graphDrawing={drawing} title={"test"} />
    </>
  );
}

export default App;
