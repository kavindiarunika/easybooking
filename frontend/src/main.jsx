import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { TravelContextProvider } from "./Context/TravelContext.jsx";
import { Provider } from "react-redux";
import { store } from "./store";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <TravelContextProvider>
          <App />
        </TravelContextProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
