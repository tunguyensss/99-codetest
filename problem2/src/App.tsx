import "./App.css";
import CurrencySwapForm from "./components/CurrencySwapForm";

function App() {
  return (
    <div className="app-container">
      <div className="background-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>
      <CurrencySwapForm />
    </div>
  );
}

export default App;
