import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import AuthProvider from "./context/AuthContext";
import { QueryProvidor } from "./lib/react-query/QueryProvidor";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <QueryProvidor>
      <ReactQueryDevtools initialIsOpen={false} />
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryProvidor>
  </BrowserRouter>
);
