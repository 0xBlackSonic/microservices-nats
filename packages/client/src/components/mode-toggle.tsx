import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/providers/theme-provider";

enum Options {
  Light = "light",
  Dark = "dark",
}

export function ModeToggle() {
  const { setTheme } = useTheme();

  const handleChange = () => {
    console.log("here");
    const root = window.document.documentElement;

    if (root.classList.contains("light")) {
      setTheme(Options.Dark);
    } else {
      setTheme(Options.Light);
    }
  };

  return (
    <Button variant="link" size="icon" onClick={handleChange}>
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
