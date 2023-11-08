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
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
