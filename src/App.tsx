import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { TestPage } from "./pages/Test";
import { OptionsPage } from "./pages/Options";

const router = createBrowserRouter([
  {
    path: "/sarutype/",
    element: <TestPage />,
    children: [],
  },
  {
    path: "/sarutype/options",
    element: <OptionsPage />,
  },
  {
    path: "/sarutype/stats",
    lazy: async () => {
      const Component = (await import("./pages/Stats")).default;
      return { Component };
    },
  },
  {
    path: "/sarutype/memorize",
    lazy: async () => {
      const Component = (await import("./pages/Memorize")).default;
      return { Component };
    },
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
