import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check if user has a theme preference in localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle('dark', newIsDark);
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
  };

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      size="sm"
      className="text-cosmic-300 hover:text-starlight-400 hover:bg-cosmic-800/50 dark:text-cosmic-300 dark:hover:text-starlight-400 dark:hover:bg-cosmic-800/50 
                 light:text-slate-600 light:hover:text-slate-800 light:hover:bg-slate-200/50"
      data-testid="button-theme-toggle"
    >
      {isDark ? (
        <Sun className="h-4 w-4" title="Switch to light mode" />
      ) : (
        <Moon className="h-4 w-4" title="Switch to dark mode" />
      )}
    </Button>
  );
}