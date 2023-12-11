import "./App.css";
import { Route, Routes } from "react-router-dom";
import Chat from "./components/chat/chat";
import store from "./store";
import { Provider } from "react-redux";
import Login from "./components/login/login";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Routes>
          <Route path="/" element={<Chat />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Provider>
  );
}

export default App;
