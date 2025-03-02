import React from "react";
import { VertexSpacingCfgDto } from "@/cfg/VertexSpacingCfgDto";
import { VertexSpacerType } from "@/model/layout/spacing/VertexSpacer";

type Props = {
  config: VertexSpacingCfgDto;
  handleChange: (field: keyof VertexSpacingCfgDto, value: any) => void;
};

const VertexSpacingCfgPanel: React.FC<Props> = ({ config, handleChange }) => {
  return (
    <div>
      <h3>Vertex Spacing Configuration</h3>
      <table className="config-table">
        <tbody>
          <tr>
            <td>Vertex Spacer Type:</td>
            <td>
              <select value={config.type} onChange={(e) => handleChange("type", e.target.value as VertexSpacerType)}>
                <option value={VertexSpacerType.FIXED_SIZE}>Fixed Size</option>
                <option value={VertexSpacerType.MIN_MAX}>Min Max</option>
                <option value={VertexSpacerType.DYNAMIC}>Dynamic</option>
              </select>
            </td>
          </tr>

          <tr>
            <td>Text Padding:</td>
            <td>
              <input type="number" value={config.textPadding} onChange={(e) => handleChange("textPadding", parseFloat(e.target.value))} />
            </td>
          </tr>

          <tr>
            <td>Vertex Height:</td>
            <td>
              <input type="number" value={config.v_height} onChange={(e) => handleChange("v_height", parseFloat(e.target.value))} />
            </td>
          </tr>

          {config.type === VertexSpacerType.FIXED_SIZE && (
            <tr>
              <td>Vertex Width:</td>
              <td>
                <input type="number" value={config.v_width} onChange={(e) => handleChange("v_width", parseFloat(e.target.value))} />
              </td>
            </tr>
          )}

          {(config.type === VertexSpacerType.MIN_MAX || config.type === VertexSpacerType.DYNAMIC) && (
            <>
              <tr>
                <td>Width Min:</td>
                <td>
                  <input type="number" value={config.width_min} onChange={(e) => handleChange("width_min", parseFloat(e.target.value))} />
                </td>
              </tr>
              <tr>
                <td>Width Max:</td>
                <td>
                  <input type="number" value={config.width_max} onChange={(e) => handleChange("width_max", parseFloat(e.target.value))} />
                </td>
              </tr>
            </>
          )}

          {config.type === VertexSpacerType.DYNAMIC && (
            <tr>
              <td>Show Percentage:</td>
              <td>
                <input type="number" value={config.show_percentage} onChange={(e) => handleChange("show_percentage", parseFloat(e.target.value))} />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VertexSpacingCfgPanel;
