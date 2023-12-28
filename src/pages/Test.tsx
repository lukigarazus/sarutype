import { LogComponent } from "../components/Log";
import { TestComponent } from "../components/Test";
import { useOptions } from "../hooks/useOptions";
import { Layout } from "./Layout";

export const TestPage = () => {
  const { options } = useOptions();
  return (
    <Layout>
      <TestComponent />
      {options.showLog && <LogComponent />}
    </Layout>
  );
};
