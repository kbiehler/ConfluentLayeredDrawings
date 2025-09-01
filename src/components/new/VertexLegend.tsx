import { csvPropDefs } from "@/cfg/CsvProps";
import React from "react";

export const VertexLegend: React.FC = () => {
  return (
    <div className="absolute bottom-5 left-2 z-20 pointer-events-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded p-2 text-xs shadow">
      {csvPropDefs.map((p) => (
        <div className="flex items-center gap-1 mb-1" key={p.label}>
          <div className="w-4 h-3 border" style={{ backgroundColor: p.color }}></div>
          {p.label}
        </div>
      ))}
    </div>
  );
};
export default VertexLegend;
