import Graph from "@/components/Graph";
import { createRandomLayeredGraph } from "./model/ExampleGraphs";
import { straightLineDrawing } from "./model/drawing/SimpleDrawer";

function App() {
  const G = createRandomLayeredGraph([5, 5, 5], 0.5);
  const drawing = straightLineDrawing(G);
  return (
    <>
      <Graph graphDrawing={drawing} title={"test"} />
    </>
  );
}

export default App;
