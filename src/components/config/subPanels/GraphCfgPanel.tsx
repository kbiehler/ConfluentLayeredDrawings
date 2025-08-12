import React from "react";
import { GraphCfgDto } from "@/cfg/ConfigDtos";
import { ExampleGraphs } from "@/examples/ExampleGraphs";
import CSVUploader from "./CsvUploader";

type Props = {
  config: GraphCfgDto;
  handleChange: (field: keyof GraphCfgDto, value: any) => void;
};

const GraphConfigPanel: React.FC<Props> = ({ config, handleChange }) => {
  const handleFileUpload = (file: File) => {
    // Process the file (e.g., read contents)
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        handleChange("fileContent", e.target.result);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <h3>Graph Configuration</h3>
      <table className="config-table">
        <tbody>
          <tr>
            <td>Graph Type:</td>
            <td>
              <select value={config.type} onChange={(e) => handleChange("type", e.target.value as "example" | "random" | "file" | "csv")}>
                <option value="example">Example</option>
                <option value="random">Random</option>
                <option value="file">File</option>
                <option value="csv">CSV</option>
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

          {/* {config.type === "file" && (
            <tr>
              <td>Upload File:</td>
              <td>
                <input type="file" accept=".dot" onChange={handleFileUpload} />
              </td>
            </tr>
          )} */}

          {config.type === "csv" && (
            <tr>
              <td>Upload File:</td>
              <td>
                <CSVUploader handleFileUpload={handleFileUpload} />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GraphConfigPanel;
