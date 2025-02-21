import uniWueLogo from "/uni-wuerzburg-logo.svg";
import Graph from "@/components/Graph";
import { GraphDrawing } from "@/model/drawing/GraphDrawing";

function App() {
  const g = new GraphDrawing();
  g.addVertex("1", 10, 10, true, "1");
  g.addVertex("2", 80, 10, true, "2");
  g.addVertex("3", 50, 50, true, "3");
  g.addEdgeDrawing({
    id: "1",
    sourceVertex: "1",
    targetVertex: "2",
    points: [
      [10, 10],
      [80, 10],
    ],
  });
  g.addEdgeDrawing({
    id: "2",
    sourceVertex: "1",
    targetVertex: "3",
    points: [
      [10, 10],
      [50, 50],
    ],
  });
  g.addEdgeDrawing({
    id: "3",
    sourceVertex: "2",
    targetVertex: "3",
    points: [
      [80, 10],
      [50, 50],
    ],
  });
  return (
    <>
      <Graph graphDrawing={g} title={"test"} />
    </>
  );
}

export default App;
