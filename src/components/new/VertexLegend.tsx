import React from "react";
import { ColumnCfg } from "../left-panel/ColumnConfig";

export const VertexLegend: React.FC<{ columnCfg: ColumnCfg[] }> = ({ columnCfg }) => {
  return (
    <div className="absolute bottom-5 left-2 z-20 pointer-events-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded p-2 text-xs shadow">
      {columnCfg.map((col) => (
        <div className="flex items-center gap-1 mb-1" key={col.legendName}>
          <div className="w-4 h-3 border" style={{ backgroundColor: col.color }}></div>
          {col.legendName}
        </div>
      ))}
    </div>
  );
};
export default VertexLegend;
