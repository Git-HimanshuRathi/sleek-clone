import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initializeMockData } from "./data/mockData";

// Load theme from localStorage on app start
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  document.documentElement.classList.add("light");
} else {
  document.documentElement.classList.remove("light");
}

// Initialize realistic mock data
initializeMockData();

createRoot(document.getElementById("root")!).render(<App />);
