import React, { useRef, useState } from "react";

// ---------- Helpers --------------------------------------------------------
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

// Compute fit scale for a fixed logical canvas with independent scroll area
function computeFitScaleAndScroll(elW, elH, contentW, contentH, minScale = 0.1, maxScale = 8) {
  const kx = elW / contentW;
  const ky = elH / contentH;
  const k = clamp(Math.min(kx, ky), minScale, maxScale);
  const left = Math.max(0, (contentW - elW) / 2);
  const top = Math.max(0, (contentH - elH) / 2);
  return { k, left, top };
}

// ---------- Component -------------------------------------------------------
export default function GraphFrontendProposal() {
  // Demo data
  const [nodes] = useState(() => {
    const demoNodes = Array.from({ length: 30 }).map((_, i) => ({
      id: `n${i + 1}`,
      label: `Node ${i + 1}`,
      raw: { id: `n${i + 1}`, label: `Node ${i + 1}`, type: "node" },
    }));
    return demoNodes;
  });
  const [edges] = useState(() => {
    const demoEdges = [];
    for (let i = 1; i < 30; i++) {
      demoEdges.push({ id: `e${i}`, source: `n${i}`, target: `n${(i % 30) + 1}`, raw: { type: "edge" } });
    }
    return demoEdges;
  });

  // UI state
  const [filters, setFilters] = useState({ search: "", degreeMin: 0, degreeMax: Infinity });
  const [configOpen, setConfigOpen] = useState(true);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [viewMode, setViewMode] = useState("main");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Viewport/zoom
  const graphContainerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const cols = 6;
  const gridWidth = 200 + (cols - 1) * 220;
  const rows = Math.ceil(nodes.length / cols);
  const gridHeight = 200 + (rows - 1) * 100;
  const margin = 300;
  const contentWidth = gridWidth + margin * 2;
  const contentHeight = gridHeight + margin * 2;

  function zoom(factor) {
    setScale((k) => clamp(k * factor, 0.1, 8));
  }
  function reset() {
    setScale(1);
    const el = graphContainerRef.current;
    if (el) el.scrollTo({ left: 0, top: 0, behavior: "auto" });
  }
  function fit() {
    const el = graphContainerRef.current;
    if (!el) return;
    const { k, left, top } = computeFitScaleAndScroll(el.clientWidth, el.clientHeight, contentWidth, contentHeight);
    setScale(k);
    el.scrollTo({ left, top, behavior: "auto" });
  }

  function ConfigPanel() {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded p-2 shadow-sm">
        <div className="flex items-center justify-between sticky top-0 bg-gray-50 dark:bg-gray-900 z-10">
          <h3 className="font-semibold">Config</h3>
          <button
            className="text-sm px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
            onClick={() => setConfigOpen((s) => !s)}
            aria-expanded={configOpen}
          >
            {configOpen ? "Hide" : "Show"}
          </button>
        </div>
        {configOpen && (
          <div className="mt-2 space-y-2">
            <label className="block text-xs">Layout algorithm</label>
            <div className="relative">
              <select className="w-full p-2 pr-10 border rounded appearance-none bg-white dark:bg-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700">
                <option>Force-directed (worker)</option>
                <option>Precomputed (CSV)</option>
                <option>Hierarchical</option>
                <option>Random</option>
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-500 dark:text-gray-300">▾</span>
            </div>

            <label className="block text-xs">Level-of-detail</label>
            <input type="range" min="0" max="1" step="0.01" defaultValue="0.5" className="w-full accent-indigo-600 dark:accent-indigo-400" />

            <label className="block text-xs">Edge bundling</label>
            <input type="checkbox" className="accent-indigo-600 dark:accent-indigo-400" />

            <label className="block text-xs">Node size by</label>
            <div className="relative">
              <select className="w-full p-2 pr-10 border rounded appearance-none bg-white dark:bg-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700">
                <option>degree</option>
                <option>attribute value</option>
                <option>constant</option>
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-500 dark:text-gray-300">▾</span>
            </div>

            <div className="flex gap-2 mt-2">
              <button className="px-3 py-1 rounded bg-blue-600 text-white">Apply</button>
              <button className="px-3 py-1 rounded border border-gray-300 dark:border-gray-700">Reset</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <style>{`
        /* Firefox */
        @media (prefers-color-scheme: dark) {
          * { scrollbar-color: #4b5563 #0b0f19; }
        }
        /* WebKit */
        @media (prefers-color-scheme: dark) {
          ::-webkit-scrollbar { width: 12px; height: 12px; }
          ::-webkit-scrollbar-track { background: #0b0f19; }
          ::-webkit-scrollbar-thumb { background: #4b5563; border-radius: 8px; border: 2px solid #0b0f19; }
          ::-webkit-scrollbar-thumb:hover { background: #6b7280; }
        }
      `}</style>

      <div className="h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        {/* Header */}
        <header className="flex items-center gap-4 p-3 border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-xl font-bold">Graph Studio</h1>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border rounded border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800" onClick={fit}>
              Fit
            </button>
            <button className="px-3 py-1 border rounded border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800" onClick={() => zoom(1.1)}>
              ＋
            </button>
            <button className="px-3 py-1 border rounded border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800" onClick={() => zoom(0.9)}>
              －
            </button>
            <button className="px-3 py-1 border rounded border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800" onClick={reset}>
              Reset
            </button>
          </div>
        </header>

        <main className="flex-1 flex overflow-hidden">
          {/* Left sidebar (collapsible) */}
          <aside
            className="relative border-r border-gray-200 dark:border-gray-800 flex-none transition-all duration-200 ease-in-out bg-white dark:bg-gray-900"
            style={{ width: sidebarOpen ? 384 : 28, overflowY: sidebarOpen ? "auto" : "hidden" }}
            aria-expanded={sidebarOpen}
          >
            {/* Toggle pill always visible inside rail */}
            <button
              className="absolute right-1 top-4 w-8 h-8 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow flex items-center justify-center z-20"
              title={sidebarOpen ? "Collapse" : "Expand"}
              aria-label={sidebarOpen ? "Collapse left panel" : "Expand left panel"}
              onClick={() => setSidebarOpen((s) => !s)}
            >
              {sidebarOpen ? "⟨" : "⟩"}
            </button>

            <div
              className={
                "p-3 flex flex-col gap-3 transition-opacity duration-150 " + (sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none select-none")
              }
            >
              <ConfigPanel />

              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded p-2">
                <h3 className="font-semibold mb-2">Data</h3>
                <div className="p-3 border-2 border-dashed rounded text-center hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-300 dark:border-gray-700">
                  <p className="text-sm">Drag & drop CSV here</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Or</p>
                  <input id="csv-file-input" type="file" accept=".csv" className="hidden" />
                  <button className="mt-2 px-3 py-1 border rounded border-gray-300 dark:border-gray-700">Upload CSV</button>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded p-2">
                <h3 className="font-semibold">Filters</h3>
                <input
                  placeholder="Search label or id"
                  className="w-full p-2 border rounded mt-2 bg-white dark:bg-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                  value={filters.search}
                  onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                />
                <div className="flex gap-2 mt-2">
                  <input
                    type="number"
                    className="w-1/2 p-2 border rounded bg-white dark:bg-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                    placeholder="min deg"
                    onChange={(e) => setFilters((f) => ({ ...f, degreeMin: Number(e.target.value || 0) }))}
                  />
                  <input
                    type="number"
                    className="w-1/2 p-2 border rounded bg-white dark:bg-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                    placeholder="max deg"
                    onChange={(e) => setFilters((f) => ({ ...f, degreeMax: Number(e.target.value || Infinity) }))}
                  />
                </div>
                <button
                  className="w-full mt-2 px-3 py-1 rounded bg-indigo-600 text-white"
                  onClick={() => setFilters({ search: "", degreeMin: 0, degreeMax: Infinity })}
                >
                  Clear filters
                </button>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  <div>Nodes: {nodes.length}</div>
                  <div>Edges: {edges.length}</div>
                </div>
              </div>

              <div className="mt-auto text-xs text-gray-500 dark:text-gray-400">
                Tips: For very large graphs, precompute layout or use server-side clustering. SVG + scrollbars + toolbar zoom keeps interactions simple.
              </div>
            </div>
          </aside>

          {/* Center: fixed scroll canvas; zoom only affects inner <g> */}
          <section className="flex-1 min-w-0 relative bg-gray-100 dark:bg-gray-950 overflow-hidden">
            <div ref={graphContainerRef} id="graph-canvas" className="w-full h-full overflow-auto bg-white dark:bg-gray-900">
              <svg width={contentWidth} height={contentHeight} className="block">
                <g transform={`translate(${margin},${margin}) scale(${scale})`}>
                  {nodes.map((n, i) => (
                    <g
                      key={n.id}
                      className="vertex-group cursor-pointer text-gray-900 dark:text-gray-100"
                      transform={`translate(${200 + (i % 6) * 220}, ${200 + Math.floor(i / 6) * 100})`}
                      onClick={() => setSelectedNodes([n.id])}
                    >
                      <rect
                        width="200"
                        height="50"
                        x="-100"
                        y="-25"
                        rx="5"
                        ry="5"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="fill-[tomato] dark:fill-pink-600"
                      />
                      <text className="vertex-label" x="0" y="5" textAnchor="middle">
                        {n.label}
                      </text>
                    </g>
                  ))}
                </g>
              </svg>
            </div>
          </section>

          {/* Right sidebar */}
          <aside className="w-80 border-l border-gray-200 dark:border-gray-800 p-3 overflow-y-auto flex-shrink-0 bg-white dark:bg-gray-900">
            <h3 className="font-semibold">Details</h3>
            {selectedNodes.length ? (
              <div className="mt-2">
                <div className="font-medium">{selectedNodes.join(", ")}</div>
                <pre className="text-xs mt-2 bg-gray-50 dark:bg-gray-900 p-2 rounded">
                  {JSON.stringify(nodes.find((n) => n.id === selectedNodes[0])?.raw, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">No node selected. Click a node in the graph to view details.</div>
            )}
            <div className="mt-4">
              <h4 className="font-semibold">View Mode</h4>
              <div className="flex flex-col gap-1 mt-2">
                <label>
                  <input type="radio" name="viewmode" value="main" checked={viewMode === "main"} onChange={() => setViewMode("main")} /> Main Graph
                </label>
                <label>
                  <input type="radio" name="viewmode" value="neighbors" checked={viewMode === "neighbors"} onChange={() => setViewMode("neighbors")} /> Selected
                  + Neighbors
                </label>
                <label>
                  <input type="radio" name="viewmode" value="implied" checked={viewMode === "implied"} onChange={() => setViewMode("implied")} /> Implied
                  (neighbors-of-neighbors)
                </label>
              </div>
            </div>
          </aside>
        </main>

        <footer className="p-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800">
          Dark mode supported; fixed scroll canvas; sidebar collapse improved.
        </footer>
      </div>
    </>
  );
}
