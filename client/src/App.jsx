import "./App.css";
import dotView from "./assets/dot-grid.svg";
import Home from "./pages/Home";

function App() {
  return (
    <>
      <div className="bg-[url('./assets/dot-grid.svg')] bg-repeat h-screen">
      <Home />
      </div>
    </>
  );
}

export default App;
