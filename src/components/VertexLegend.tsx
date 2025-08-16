import { csvPropDefs } from "@/cfg/CsvProps";
import React from "react";

export const VertexLegend: React.FC = () => {
  return (
    <div
      style={{
        display: "inline-flex", // <-- only as wide as content
        alignItems: "center",
        border: "1px solid #ccc",
        borderRadius: 6,
        padding: "8px 12px",
        fontFamily: "system-ui, sans-serif",
        fontSize: 14,
        lineHeight: 1.4,
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        gap: "16px",
      }}
    >
      {csvPropDefs.map((p) => (
        <div key={p.key} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div
            style={{
              width: 16,
              height: 16,
              backgroundColor: p.color,
              border: "1px solid black",
            }}
          />
          <span>{p.label}</span>
        </div>
      ))}
    </div>
  );
};
export default VertexLegend;
