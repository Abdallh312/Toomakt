import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      // Check if specifically on admin route with saved preference
      const isAdmin = typeof window !== 'undefined' && 
        (window.location.pathname.includes('admin') || window.location.hash.includes('admin'));
      if (isAdmin) {
        const saved = localStorage.getItem('toomakt_admin_theme');
        if (saved === 'dark' || saved === 'light') return saved;
      }
      return 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    try {
      const root = document.documentElement;
      const isAdmin = window.location.pathname.includes('admin') || window.location.hash.includes('admin');
      
      if (isAdmin && theme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
        root.style.colorScheme = 'dark';
        localStorage.setItem('toomakt_admin_theme', 'dark');
      } else {
        // Enforce pristine Light Mode on storefront for all mobile devices
        root.classList.remove('dark');
        root.classList.add('light');
        root.style.colorScheme = 'light';
        if (isAdmin) {
          localStorage.setItem('toomakt_admin_theme', 'light');
        }
      }

      // Keep browser frame & status bar white
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', '#FFFFFF');
      }
    } catch {}
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === 'dark', toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
