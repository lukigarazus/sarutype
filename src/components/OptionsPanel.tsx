import { useOptions } from "../hooks/useOptions";
import {
  pickDisplaySignSystem,
  pickDisplaySign,
  pickInputSignSystem,
  switchReverseSignSystems,
} from "../models/Options";
import {
  allSignSystems,
  availableSignSystemPairs,
} from "../models/signSystems/types";

export const OptionsPanel = () => {
  const { options, setOptions } = useOptions();

  return (
    <div style={{ width: "100%" }}>
      <div>
        <label htmlFor="displaySigns">I want to learn:</label>
        <select
          id="displaySignSystem"
          value={options.displaySignSystem.kind}
          onChange={(e) =>
            setOptions(pickDisplaySignSystem(e.target.value, options))
          }
        >
          {allSignSystems.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="inputSignSystem">I type using:</label>
        <select
          id="inputSignSystem"
          value={options.inputSignSystem}
          onChange={(ev) => {
            setOptions(pickInputSignSystem(ev.target.value, options));
          }}
        >
          {availableSignSystemPairs
            .filter(({ display }) => display === options.displaySignSystem.kind)
            .map(({ input }) => (
              <option key={input} value={input}>
                {input}
              </option>
            ))}
        </select>
      </div>
      <div style={{ width: "100%" }}>
        <label htmlFor="displaySigns">
          I want to learn the following signs:
        </label>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            padding: "10px 0",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          {options.displaySignSystem.possibleDisplaySigns.map((s, i) => (
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
                checked={(
                  options.displaySignSystem.allowedDisplaySigns as Set<string>
                ).has(s)}
                onChange={(ev) => {
                  console.log(ev);
                  // @ts-expect-error error
                  const isShiftClicked = ev.nativeEvent.shiftKey;
                  const selected = ev.target.checked;
                  setOptions(
                    isShiftClicked
                      ? options.displaySignSystem.possibleDisplaySigns
                          .slice(0, i + 1)
                          .reduce((acc, el) => {
                            return pickDisplaySign(
                              {
                                kind: selected ? "add" : "remove",
                                sign: el,
                              },
                              acc,
                            );
                          }, options)
                      : pickDisplaySign(
                          {
                            kind: selected ? "add" : "remove",
                            sign: s,
                          },
                          options,
                        ),
                  );
                }}
              />
              <label htmlFor={s}>{s}</label>
              <label htmlFor={s}>
                {options.displaySignSystem.convertToInputSigns(
                  // @ts-expect-error string
                  s as unknown as string,
                )}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div>
        <label>
          I want to reverse the sign system (type in what I want to learn)
        </label>
        <input
          type="checkbox"
          checked={options.reverseSignSystems}
          onChange={() => setOptions(switchReverseSignSystems(options))}
        />
      </div>
      <div>
        <label>I want to be shown a hint after _ milliseconds:</label>
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
      <div>
        <label>I want a test to consist of _ words:</label>
        <input
          type="number"
          value={options.numberOfWordsPerTest}
          onChange={(ev) =>
            setOptions({
              ...options,
              numberOfWordsPerTest: +ev.target.value,
            })
          }
        />
      </div>
      <div>
        <label>I want to see the event log (dev)</label>
        <input
          type="checkbox"
          checked={options.showLog}
          onChange={() =>
            setOptions({
              ...options,
              showLog: !options.showLog,
            })
          }
        />
      </div>
    </div>
  );
};
