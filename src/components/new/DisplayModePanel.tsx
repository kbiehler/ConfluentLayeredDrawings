type Props = {
  displayMode: string;
  setDisplayMode: (viewMode: string) => void;
};

const DisplayModePanel: React.FC<Props> = ({ displayMode, setDisplayMode }) => {
  return (
    <div className="absolute bottom-2 right-2 z-30 pointer-events-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded p-2 text-xs shadow">
      <div className="font-semibold mb-1">View Mode</div>
      <div className="flex flex-col gap-1">
        <label className="flex items-center gap-1">
          <input type="radio" name="viewmode_overlay" value="main" checked={displayMode === "main"} onChange={() => setDisplayMode("main")} />
          Main Graph
        </label>
        <label className="flex items-center gap-1">
          <input type="radio" name="DisplayMode_overlay" value="neighbors" checked={displayMode === "neighbors"} onChange={() => setDisplayMode("neighbors")} />
          Selected + Neighbors
        </label>
        <label className="flex items-center gap-1">
          <input type="radio" name="DisplayMode_overlay" value="implied" checked={displayMode === "implied"} onChange={() => setDisplayMode("implied")} />
          Implied (neighbors-of-neighbors)
        </label>
      </div>
    </div>
  );
};

export default DisplayModePanel;
