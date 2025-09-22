import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "./styles/table.css";
import App from "./App.tsx";
import { Provider } from "./components/ui/provider.tsx";
import { Toaster } from "./components/ui/toaster";

createRoot(document.getElementById("root")!).render(
  <>
    <Provider defaultTheme="light">
      <BrowserRouter>
        <App />
      </BrowserRouter>
      <Toaster />
    </Provider>
  </>
);
