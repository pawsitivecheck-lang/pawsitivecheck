import { useEffect } from "react";

export default function ThemeToggle() {
  useEffect(() => {
    // Force dark mode - site is dark mode only
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }, []);

  // Return null - no toggle needed since site is dark mode only
  return null;
}