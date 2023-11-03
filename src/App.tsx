import { TestComponent } from "./components/Test";
import { OptionsPanel } from "./components/OptionsPanel";
import { useOptions } from "./hooks/useOptions";

function App() {
  const { loading: optionsLoading } = useOptions();
  return (
    <>
      <h1>Sarutype</h1>
      <main>
        {!optionsLoading ? (
          <>
            <TestComponent />
            <OptionsPanel />
          </>
        ) : (
          <div>Loading options...</div>
        )}
      </main>
    </>
  );
}

export default App;