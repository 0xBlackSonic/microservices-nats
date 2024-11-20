import { Outlet } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { ThemeProvider } from "./components/providers/theme-provider";
import { SessionProvider } from "./components/providers/session-provider";

function App() {
  return (
    <SessionProvider>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Navbar />
        <div className="pt-20 px-6 h-[100vh]">
          <Outlet />
        </div>
      </ThemeProvider>
    </SessionProvider>
  );
}

export default App;
