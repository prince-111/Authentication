import "./App.css";
import Navbar from "./components/Navbar";
import AppRouter from "./routes/AppRouter";

function App() {
  return (
    <>
      <div className="dark:bg-gray-800 dark:text-white">
        <Navbar />
        <AppRouter />
      </div>
    </>
  );
}

export default App;
