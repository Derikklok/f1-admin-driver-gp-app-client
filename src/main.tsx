import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "./components/ui/provider.tsx";

createRoot(document.getElementById("root")!).render(
  <>
    <Provider defaultTheme="light">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </>
);
