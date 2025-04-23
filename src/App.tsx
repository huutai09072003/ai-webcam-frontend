import React from "react";
import { BrowserRouter } from "react-router-dom";
import AuthRouter from "./app/AuthRouter";

const App: React.FC = () => (
  <BrowserRouter>
    <AuthRouter />
  </BrowserRouter>
);

export default App;
