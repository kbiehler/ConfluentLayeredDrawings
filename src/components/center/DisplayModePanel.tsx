type Props = {
  displayMode: string;
  setDisplayMode: React.Dispatch<React.SetStateAction<"main" | "nbr" | "impl">>;
};

const DisplayModePanel: React.FC<Props> = ({ displayMode, setDisplayMode }) => {
  return (
    <div className="absolute bottom-5 right-5 z-30 pointer-events-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded p-2 text-xs shadow">
      <div className="font-semibold mb-1">Display Mode</div>
      <div className="flex flex-col gap-1">
        <label className="flex items-center gap-1">
          <input type="radio" name="viewmode_overlay" value="main" checked={displayMode === "main"} onChange={() => setDisplayMode("main")} />
          Main Graph
        </label>
        <label className="flex items-center gap-1">
          <input type="radio" name="DisplayMode_overlay" value="neighbors" checked={displayMode === "nbr"} onChange={() => setDisplayMode("nbr")} />
          Selected + Neighbors
        </label>
        <label className="flex items-center gap-1">
          <input type="radio" name="DisplayMode_overlay" value="implied" checked={displayMode === "impl"} onChange={() => setDisplayMode("impl")} />
          Implied
        </label>
      </div>
    </div>
  );
};

export default DisplayModePanel;
