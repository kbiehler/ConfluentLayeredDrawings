import React from "react";
import { LayerSpacingCfgDto } from "@/cfg/ConfigDtos";

type Props = {
  config: LayerSpacingCfgDto;
  handleChange: (field: keyof LayerSpacingCfgDto, value: any) => void;
};

const LayerSpacingConfigPanel: React.FC<Props> = ({ config, handleChange }) => {
  return (
    <div>
      <h3>Layer Spacing Configuration</h3>
      <table className="config-table">
        <tbody>
          <tr>
            <td>Layout Type:</td>
            <td>
              <select value={config.type} onChange={(e) => handleChange("type", e.target.value as "layerFix" | "vertLayerFix")}>
                <option value="layerFix">Layer Fix</option>
                <option value="vertLayerFix">Vertical Layer Fix</option>
              </select>
            </td>
          </tr>

          {config.type === "layerFix" && (
            <>
              <tr>
                <td>Layer Width:</td>
                <td>
                  <input type="number" value={config.layerFix_layerSpacing} onChange={(e) => handleChange("layerFix_layerSpacing", parseFloat(e.target.value))} />
                </td>
              </tr>
            </>
          )}

          {config.type === "vertLayerFix" && (
            <>
              <tr>
                <td>Min Vertical Spacing:</td>
                <td>
                  <input type="number" value={config.vertLayerFix_verticalSpacing} onChange={(e) => handleChange("vertLayerFix_verticalSpacing", parseFloat(e.target.value))} />
                </td>
              </tr>
              <tr>
                <td>Additional dist to vertex:</td>
                <td>
                  <input type="number" value={config.vertLayerFix_addVertexDist} onChange={(e) => handleChange("vertLayerFix_addVertexDist", parseFloat(e.target.value))} />
                </td>
              </tr>
              <tr>
                <td>Additional center width:</td>
                <td>
                  <input type="number" value={config.vertLayerFix_addCenterWidth} onChange={(e) => handleChange("vertLayerFix_addCenterWidth", parseFloat(e.target.value))} />
                </td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LayerSpacingConfigPanel;
