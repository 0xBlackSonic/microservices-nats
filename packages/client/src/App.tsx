import { Outlet } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { ThemeProvider } from "./components/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Navbar />
      <div className="pt-20 px-6 h-[100vh]">
        <Outlet />
      </div>
    </ThemeProvider>
  );
}

export default App;
