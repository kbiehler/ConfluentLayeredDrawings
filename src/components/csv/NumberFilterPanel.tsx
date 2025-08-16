import React from "react";
import "./NumberFilter.css";

export class NumberFilterCfgDto {
  filterType: "all" | "severity" | "probability" | "criticality" = "criticality";
  smallerGreaterEqual: ">=" | "<=" | "=" = ">=";
  filterNumber: number = 5;
}

type Props = {
  config: NumberFilterCfgDto;
  handleChange: (field: keyof NumberFilterCfgDto, value: any) => void;
};

const NumberCfgPanel: React.FC<Props> = ({ config, handleChange }) => {
  return (
    <div className="nf-row">
  <label className="nf-label">Number Filter:</label>

  <select
    className="nf-filter"
    value={config.filterType}
    onChange={(e) => handleChange("filterType", e.target.value)}
  >
    <option value="all">Show all</option>
    <option value="severity">Severity Number</option>
    <option value="probability">Probability Number</option>
    <option value="criticality">Criticality Number</option>
  </select>

  {config.filterType !== "all" && (
    <>
      <select
        className="nf-operator"
        value={config.smallerGreaterEqual}
        onChange={(e) => handleChange("smallerGreaterEqual", e.target.value)}
      >
        <option value=">=">&gt;=</option>
        <option value="<=">&lt;=</option>
        <option value="=">=</option>
      </select>

      <input
        className="nf-value"
        type="number"
        value={config.filterNumber}
        onChange={(e) => handleChange("filterNumber", parseFloat(e.target.value))}
        placeholder="Value"
      />
    </>
  )}
</div>
  );
};

export default NumberCfgPanel;
