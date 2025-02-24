import React from "react";
import { GraphCfgDto } from "@/cfg/ConfigDtos";
import { ExampleGraphs } from "@/examples/ExampleGraphs";

type Props = {
  config: GraphCfgDto;
  handleChange: (field: keyof GraphCfgDto, value: any) => void;
};

const GraphConfigPanel: React.FC<Props> = ({ config, handleChange }) => {
  return (
    <div>
      <h3>Graph Configuration</h3>
      <table className="config-table">
        <tbody>
          <tr>
            <td>Graph Type:</td>
            <td>
              <select value={config.type} onChange={(e) => handleChange("type", e.target.value as "example" | "random")}>
                <option value="example">Example</option>
                <option value="random">Random</option>
              </select>
            </td>
          </tr>
          {config.type === "example" && (
            <tr>
              <td>Example Type:</td>
              <td>
                <select value={config.example_type} onChange={(e) => handleChange("example_type", e.target.value as ExampleGraphs)}>
                  {Object.values(ExampleGraphs).map((graph) => (
                    <option key={graph} value={graph}>
                      {graph}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GraphConfigPanel;
