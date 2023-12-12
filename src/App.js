import "./App.css";
import { Route, Routes } from "react-router-dom";
import store from "./store";
import { Provider } from "react-redux";
import React, { Suspense } from "react";

const Chat = React.lazy(() => import("./components/chat/chat"));
const Login = React.lazy(() => import("./components/login/login"));

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Chat />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Suspense>
      </div>
    </Provider>
  );
}

export default App;
