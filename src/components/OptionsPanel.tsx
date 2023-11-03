import { useOptions } from "../hooks/useOptions";
import {
  availableDisplaySignSystems,
  availableInputSignsystems,
  pickDisplaySignSystem,
  pickDisplaySign,
  pickInputSignSystem,
} from "../models/Options";

export const OptionsPanel = () => {
  const { options, setOptions } = useOptions();

  return (
    <div>
      <div>
        <label htmlFor="displaySigns">Display sign system</label>
        <select
          id="displaySignSystem"
          value={options.displaySignSystem.kind}
          onChange={(e) =>
            setOptions(pickDisplaySignSystem(e.target.value, options))
          }
        >
          {availableDisplaySignSystems.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="inputSignSystem">Input sign system</label>
        <select
          id="inputSignSystem"
          value={options.inputSignSystem}
          onChange={(ev) => {
            setOptions(pickInputSignSystem(ev.target.value, options));
          }}
        >
          {availableInputSignsystems.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="displaySigns">Which signs do you want to learn?</label>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          {options.displaySignSystem.possibleDisplaySigns.map((s) => (
            <div
              key={s}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <input
                id={s}
                type="checkbox"
                value={s}
                checked={options.displaySignSystem.allowedDisplaySigns.has(s)}
                onChange={(ev) => {
                  const selected = ev.target.checked;
                  const value = ev.target.value;
                  setOptions(
                    pickDisplaySign(
                      {
                        kind: selected ? "add" : "remove",
                        sign: value,
                      },
                      options,
                    ),
                  );
                }}
              />
              <label htmlFor={s}>{s}</label>
            </div>
          ))}
        </div>
      </div>
      <div>
        <label>How long should we wait before we show transliteration?</label>
        <input
          type="number"
          value={options.showTransliterationTimeout}
          onChange={(ev) =>
            setOptions({
              ...options,
              showTransliterationTimeout: +ev.target.value,
            })
          }
        />
      </div>
    </div>
  );
};
