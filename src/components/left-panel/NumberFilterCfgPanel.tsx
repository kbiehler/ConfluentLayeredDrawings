import { v4 as uuidv4 } from "uuid";

type Props = {
  filterCfg: NumberFilterCfg[];
  setFilterCfg: React.Dispatch<React.SetStateAction<NumberFilterCfg[]>>;
};

export type NumberFilterCfg = { id: string; csvName: string; filterName: string };

export const defaultNumberFilterCfg: NumberFilterCfg[] = [
  { id: uuidv4(), csvName: "criticality number", filterName: "Criticality Number" },
  { id: uuidv4(), csvName: "probability number", filterName: "Probability Number" },
  { id: uuidv4(), csvName: "severity number", filterName: "Severity Number" },
];

const NumberFilterCfgPanel: React.FC<Props> = ({ filterCfg, setFilterCfg }) => {
  const addFilter = () => setFilterCfg([...(filterCfg ?? []), { id: uuidv4(), csvName: "", filterName: "" }]);
  const removeFilter = (id: string) => setFilterCfg(filterCfg.filter((c) => c.id !== id));
  const updateFilter = (id: string, patch: Partial<NumberFilterCfg>) => setFilterCfg(filterCfg.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  return (
    <div className="mt-3">
      <div className="font-semibold text-base mb-2">Number Filters:</div>
      <div className="space-y-2">
        {filterCfg.map((col) => (
          <div key={col.id} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto_auto] gap-2 items-center">
            <input className="input" placeholder="CSV column" value={col.csvName} onChange={(e) => updateFilter(col.id, { csvName: e.target.value })} />
            <input className="input" placeholder="Filter Name" value={col.filterName} onChange={(e) => updateFilter(col.id, { filterName: e.target.value })} />
            <button
              type="button"
              className="px-2 py-1 h-8 border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800 mt-2"
              onClick={() => removeFilter(col.id)}
              title="Delete this column"
            >
              ✕
            </button>
          </div>
        ))}

        <button
          type="button"
          className="px-3 py-1 border rounded border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
          onClick={addFilter}
        >
          ＋ Add Filter
        </button>
      </div>
    </div>
  );
};

export default NumberFilterCfgPanel;
