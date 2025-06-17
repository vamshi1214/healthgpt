/**
 * Theme Configuration System
 * 
 * This module provides a centralized way to configure and switch between multiple themes.
 * Applications can import these themes and set them as needed, either during initialization
 * or dynamically at runtime.
 */

// Define the theme interface for type safety
export interface ThemeConfig {
  name: string;
  light: Record<string, string>;
  dark: Record<string, string>;
}

/**
 * Default theme - Grayscale with OKLCH color format
 */
export const defaultTheme: ThemeConfig = {
  name: "default",
  light: {
    "--radius": "0.625rem",
    "--radius-sm": "calc(var(--radius) - 4px)",
    "--radius-md": "calc(var(--radius) - 2px)",
    "--radius-lg": "var(--radius)",
    "--radius-xl": "calc(var(--radius) + 4px)",
    
    "--background": "oklch(1 0 0)",
    "--foreground": "oklch(0.145 0 0)",
    "--card": "oklch(1 0 0)",
    "--card-foreground": "oklch(0.145 0 0)",
    "--popover": "oklch(1 0 0)",
    "--popover-foreground": "oklch(0.145 0 0)",
    "--primary": "oklch(0.205 0 0)",
    "--primary-foreground": "oklch(0.985 0 0)",
    "--secondary": "oklch(0.97 0 0)",
    "--secondary-foreground": "oklch(0.205 0 0)",
    "--muted": "oklch(0.97 0 0)",
    "--muted-foreground": "oklch(0.556 0 0)",
    "--accent": "oklch(0.97 0 0)",
    "--accent-foreground": "oklch(0.205 0 0)",
    "--destructive": "oklch(0.577 0.245 27.325)",
    "--destructive-foreground": "oklch(0.985 0 0)",
    "--border": "oklch(0.922 0 0)",
    "--input": "oklch(0.922 0 0)",
    "--ring": "oklch(0.708 0 0)",
    "--chart-1": "oklch(0.646 0.222 41.116)",
    "--chart-2": "oklch(0.6 0.118 184.704)",
    "--chart-3": "oklch(0.398 0.07 227.392)",
    "--chart-4": "oklch(0.828 0.189 84.429)",
    "--chart-5": "oklch(0.769 0.188 70.08)",
    
    /* Sidebar variables */
    "--sidebar": "oklch(0.985 0 0)",
    "--sidebar-foreground": "oklch(0.145 0 0)",
    "--sidebar-primary": "oklch(0.205 0 0)",
    "--sidebar-primary-foreground": "oklch(0.985 0 0)",
    "--sidebar-accent": "oklch(0.97 0 0)",
    "--sidebar-accent-foreground": "oklch(0.205 0 0)",
    "--sidebar-border": "oklch(0.922 0 0)",
    "--sidebar-ring": "oklch(0.708 0 0)",
  },
  dark: {
    "--radius": "0.625rem",
    "--radius-sm": "calc(var(--radius) - 4px)",
    "--radius-md": "calc(var(--radius) - 2px)",
    "--radius-lg": "var(--radius)",
    "--radius-xl": "calc(var(--radius) + 4px)",
    
    "--background": "oklch(0.145 0 0)",
    "--foreground": "oklch(0.985 0 0)",
    "--card": "oklch(0.205 0 0)",
    "--card-foreground": "oklch(0.985 0 0)",
    "--popover": "oklch(0.205 0 0)",
    "--popover-foreground": "oklch(0.985 0 0)",
    "--primary": "oklch(0.922 0 0)",
    "--primary-foreground": "oklch(0.205 0 0)",
    "--secondary": "oklch(0.269 0 0)",
    "--secondary-foreground": "oklch(0.985 0 0)",
    "--muted": "oklch(0.269 0 0)",
    "--muted-foreground": "oklch(0.708 0 0)",
    "--accent": "oklch(0.269 0 0)",
    "--accent-foreground": "oklch(0.985 0 0)",
    "--destructive": "oklch(0.704 0.191 22.216)",
    "--destructive-foreground": "oklch(0.985 0 0)",
    "--border": "oklch(1 0 0 / 10%)",
    "--input": "oklch(1 0 0 / 15%)",
    "--ring": "oklch(0.556 0 0)",
    "--chart-1": "oklch(0.488 0.243 264.376)",
    "--chart-2": "oklch(0.696 0.17 162.48)",
    "--chart-3": "oklch(0.769 0.188 70.08)",
    "--chart-4": "oklch(0.627 0.265 303.9)",
    "--chart-5": "oklch(0.645 0.246 16.439)",
    
    /* Sidebar variables */
    "--sidebar": "oklch(0.205 0 0)",
    "--sidebar-foreground": "oklch(0.985 0 0)",
    "--sidebar-primary": "oklch(0.488 0.243 264.376)",
    "--sidebar-primary-foreground": "oklch(0.985 0 0)",
    "--sidebar-accent": "oklch(0.269 0 0)",
    "--sidebar-accent-foreground": "oklch(0.985 0 0)",
    "--sidebar-border": "oklch(1 0 0 / 10%)",
    "--sidebar-ring": "oklch(0.556 0 0)",
  }
};

/**
 * Purple theme with OKLCH color format
 */
export const purpleTheme: ThemeConfig = {
  name: "purple",
  light: {
    "--radius": "0.625rem",
    "--radius-sm": "calc(var(--radius) - 4px)",
    "--radius-md": "calc(var(--radius) - 2px)",
    "--radius-lg": "var(--radius)",
    "--radius-xl": "calc(var(--radius) + 4px)",
    
    "--background": "oklch(1 0 0)",
    "--foreground": "oklch(0.145 0 0)",
    "--card": "oklch(1 0 0)",
    "--card-foreground": "oklch(0.145 0 0)",
    "--popover": "oklch(1 0 0)",
    "--popover-foreground": "oklch(0.145 0 0)",
    "--primary": "oklch(0.7 0.2 300)",
    "--primary-foreground": "oklch(0.985 0 0)",
    "--secondary": "oklch(0.97 0 0)",
    "--secondary-foreground": "oklch(0.205 0 0)",
    "--muted": "oklch(0.97 0 0)",
    "--muted-foreground": "oklch(0.556 0 0)",
    "--accent": "oklch(0.97 0 0)",
    "--accent-foreground": "oklch(0.205 0 0)",
    "--destructive": "oklch(0.577 0.245 27.325)",
    "--destructive-foreground": "oklch(0.985 0 0)",
    "--border": "oklch(0.922 0 0)",
    "--input": "oklch(0.922 0 0)",
    "--ring": "oklch(0.7 0.2 300)",
    "--chart-1": "oklch(0.646 0.222 41.116)",
    "--chart-2": "oklch(0.6 0.118 184.704)",
    "--chart-3": "oklch(0.398 0.07 227.392)",
    "--chart-4": "oklch(0.828 0.189 84.429)",
    "--chart-5": "oklch(0.769 0.188 70.08)",
    
    "--sidebar": "oklch(0.985 0 0)",
    "--sidebar-foreground": "oklch(0.145 0 0)",
    "--sidebar-primary": "oklch(0.7 0.2 300)",
    "--sidebar-primary-foreground": "oklch(0.985 0 0)",
    "--sidebar-accent": "oklch(0.97 0 0)",
    "--sidebar-accent-foreground": "oklch(0.205 0 0)",
    "--sidebar-border": "oklch(0.922 0 0)",
    "--sidebar-ring": "oklch(0.708 0 0)",
  },
  dark: {
    "--radius": "0.625rem",
    "--radius-sm": "calc(var(--radius) - 4px)",
    "--radius-md": "calc(var(--radius) - 2px)",
    "--radius-lg": "var(--radius)",
    "--radius-xl": "calc(var(--radius) + 4px)",
    
    "--background": "oklch(0.145 0 0)",
    "--foreground": "oklch(0.985 0 0)",
    "--card": "oklch(0.205 0 0)",
    "--card-foreground": "oklch(0.985 0 0)",
    "--popover": "oklch(0.205 0 0)",
    "--popover-foreground": "oklch(0.985 0 0)",
    "--primary": "oklch(0.7 0.25 300)",
    "--primary-foreground": "oklch(0.985 0 0)",
    "--secondary": "oklch(0.269 0 0)",
    "--secondary-foreground": "oklch(0.985 0 0)",
    "--muted": "oklch(0.269 0 0)",
    "--muted-foreground": "oklch(0.708 0 0)",
    "--accent": "oklch(0.269 0 0)",
    "--accent-foreground": "oklch(0.985 0 0)",
    "--destructive": "oklch(0.704 0.191 22.216)",
    "--destructive-foreground": "oklch(0.985 0 0)",
    "--border": "oklch(1 0 0 / 10%)",
    "--input": "oklch(1 0 0 / 15%)",
    "--ring": "oklch(0.7 0.25 300)",
    "--chart-1": "oklch(0.488 0.243 264.376)",
    "--chart-2": "oklch(0.696 0.17 162.48)",
    "--chart-3": "oklch(0.769 0.188 70.08)",
    "--chart-4": "oklch(0.627 0.265 303.9)",
    "--chart-5": "oklch(0.645 0.246 16.439)",
    
    "--sidebar": "oklch(0.205 0 0)",
    "--sidebar-foreground": "oklch(0.985 0 0)",
    "--sidebar-primary": "oklch(0.7 0.25 300)",
    "--sidebar-primary-foreground": "oklch(0.985 0 0)",
    "--sidebar-accent": "oklch(0.269 0 0)",
    "--sidebar-accent-foreground": "oklch(0.985 0 0)",
    "--sidebar-border": "oklch(1 0 0 / 10%)",
    "--sidebar-ring": "oklch(0.556 0 0)",
  }
};

/**
 * Blue theme with OKLCH color format
 */
export const blueTheme: ThemeConfig = {
  name: "blue",
  light: {
    "--radius": "0.625rem",
    "--radius-sm": "calc(var(--radius) - 4px)",
    "--radius-md": "calc(var(--radius) - 2px)",
    "--radius-lg": "var(--radius)",
    "--radius-xl": "calc(var(--radius) + 4px)",
    
    "--background": "oklch(1 0 0)",
    "--foreground": "oklch(0.145 0 0)",
    "--card": "oklch(1 0 0)",
    "--card-foreground": "oklch(0.145 0 0)",
    "--popover": "oklch(1 0 0)",
    "--popover-foreground": "oklch(0.145 0 0)",
    "--primary": "oklch(0.65 0.2 240)",
    "--primary-foreground": "oklch(0.985 0 0)",
    "--secondary": "oklch(0.97 0 0)",
    "--secondary-foreground": "oklch(0.205 0 0)",
    "--muted": "oklch(0.97 0 0)",
    "--muted-foreground": "oklch(0.556 0 0)",
    "--accent": "oklch(0.97 0 0)",
    "--accent-foreground": "oklch(0.205 0 0)",
    "--destructive": "oklch(0.577 0.245 27.325)",
    "--destructive-foreground": "oklch(0.985 0 0)",
    "--border": "oklch(0.922 0 0)",
    "--input": "oklch(0.922 0 0)",
    "--ring": "oklch(0.65 0.2 240)",
    "--chart-1": "oklch(0.65 0.2 240)",
    "--chart-2": "oklch(0.6 0.118 184.704)",
    "--chart-3": "oklch(0.398 0.07 227.392)",
    "--chart-4": "oklch(0.828 0.189 84.429)",
    "--chart-5": "oklch(0.769 0.188 70.08)",
    
    "--sidebar": "oklch(0.985 0 0)",
    "--sidebar-foreground": "oklch(0.145 0 0)",
    "--sidebar-primary": "oklch(0.65 0.2 240)",
    "--sidebar-primary-foreground": "oklch(0.985 0 0)",
    "--sidebar-accent": "oklch(0.97 0 0)",
    "--sidebar-accent-foreground": "oklch(0.205 0 0)",
    "--sidebar-border": "oklch(0.922 0 0)",
    "--sidebar-ring": "oklch(0.708 0 0)",
  },
  dark: {
    "--radius": "0.625rem",
    "--radius-sm": "calc(var(--radius) - 4px)",
    "--radius-md": "calc(var(--radius) - 2px)",
    "--radius-lg": "var(--radius)",
    "--radius-xl": "calc(var(--radius) + 4px)",
    
    "--background": "oklch(0.145 0 0)",
    "--foreground": "oklch(0.985 0 0)",
    "--card": "oklch(0.205 0 0)",
    "--card-foreground": "oklch(0.985 0 0)",
    "--popover": "oklch(0.205 0 0)",
    "--popover-foreground": "oklch(0.985 0 0)",
    "--primary": "oklch(0.65 0.25 240)",
    "--primary-foreground": "oklch(0.985 0 0)",
    "--secondary": "oklch(0.269 0 0)",
    "--secondary-foreground": "oklch(0.985 0 0)",
    "--muted": "oklch(0.269 0 0)",
    "--muted-foreground": "oklch(0.708 0 0)",
    "--accent": "oklch(0.269 0 0)",
    "--accent-foreground": "oklch(0.985 0 0)",
    "--destructive": "oklch(0.704 0.191 22.216)",
    "--destructive-foreground": "oklch(0.985 0 0)",
    "--border": "oklch(1 0 0 / 10%)",
    "--input": "oklch(1 0 0 / 15%)",
    "--ring": "oklch(0.65 0.25 240)",
    "--chart-1": "oklch(0.65 0.25 240)",
    "--chart-2": "oklch(0.696 0.17 162.48)",
    "--chart-3": "oklch(0.769 0.188 70.08)",
    "--chart-4": "oklch(0.627 0.265 303.9)",
    "--chart-5": "oklch(0.645 0.246 16.439)",
    
    "--sidebar": "oklch(0.205 0 0)",
    "--sidebar-foreground": "oklch(0.985 0 0)",
    "--sidebar-primary": "oklch(0.65 0.25 240)",
    "--sidebar-primary-foreground": "oklch(0.985 0 0)",
    "--sidebar-accent": "oklch(0.269 0 0)",
    "--sidebar-accent-foreground": "oklch(0.985 0 0)",
    "--sidebar-border": "oklch(1 0 0 / 10%)",
    "--sidebar-ring": "oklch(0.556 0 0)",
  }
};

/**
 * Green theme with OKLCH color format
 */
export const greenTheme: ThemeConfig = {
  name: "green",
  light: {
    "--radius": "0.625rem",
    "--radius-sm": "calc(var(--radius) - 4px)",
    "--radius-md": "calc(var(--radius) - 2px)",
    "--radius-lg": "var(--radius)",
    "--radius-xl": "calc(var(--radius) + 4px)",
    
    "--background": "oklch(1 0 0)",
    "--foreground": "oklch(0.145 0 0)",
    "--card": "oklch(1 0 0)",
    "--card-foreground": "oklch(0.145 0 0)",
    "--popover": "oklch(1 0 0)",
    "--popover-foreground": "oklch(0.145 0 0)",
    "--primary": "oklch(0.65 0.2 150)",
    "--primary-foreground": "oklch(0.985 0 0)",
    "--secondary": "oklch(0.97 0 0)",
    "--secondary-foreground": "oklch(0.205 0 0)",
    "--muted": "oklch(0.97 0 0)",
    "--muted-foreground": "oklch(0.556 0 0)",
    "--accent": "oklch(0.97 0 0)",
    "--accent-foreground": "oklch(0.205 0 0)",
    "--destructive": "oklch(0.577 0.245 27.325)",
    "--destructive-foreground": "oklch(0.985 0 0)",
    "--border": "oklch(0.922 0 0)",
    "--input": "oklch(0.922 0 0)",
    "--ring": "oklch(0.65 0.2 150)",
    "--chart-1": "oklch(0.65 0.2 150)",
    "--chart-2": "oklch(0.6 0.118 184.704)",
    "--chart-3": "oklch(0.398 0.07 227.392)",
    "--chart-4": "oklch(0.828 0.189 84.429)",
    "--chart-5": "oklch(0.769 0.188 70.08)",
    
    "--sidebar": "oklch(0.985 0 0)",
    "--sidebar-foreground": "oklch(0.145 0 0)",
    "--sidebar-primary": "oklch(0.65 0.2 150)",
    "--sidebar-primary-foreground": "oklch(0.985 0 0)",
    "--sidebar-accent": "oklch(0.97 0 0)",
    "--sidebar-accent-foreground": "oklch(0.205 0 0)",
    "--sidebar-border": "oklch(0.922 0 0)",
    "--sidebar-ring": "oklch(0.708 0 0)",
  },
  dark: {
    "--radius": "0.625rem",
    "--radius-sm": "calc(var(--radius) - 4px)",
    "--radius-md": "calc(var(--radius) - 2px)",
    "--radius-lg": "var(--radius)",
    "--radius-xl": "calc(var(--radius) + 4px)",
    
    "--background": "oklch(0.145 0 0)",
    "--foreground": "oklch(0.985 0 0)",
    "--card": "oklch(0.205 0 0)",
    "--card-foreground": "oklch(0.985 0 0)",
    "--popover": "oklch(0.205 0 0)",
    "--popover-foreground": "oklch(0.985 0 0)",
    "--primary": "oklch(0.65 0.25 150)",
    "--primary-foreground": "oklch(0.985 0 0)",
    "--secondary": "oklch(0.269 0 0)",
    "--secondary-foreground": "oklch(0.985 0 0)",
    "--muted": "oklch(0.269 0 0)",
    "--muted-foreground": "oklch(0.708 0 0)",
    "--accent": "oklch(0.269 0 0)",
    "--accent-foreground": "oklch(0.985 0 0)",
    "--destructive": "oklch(0.704 0.191 22.216)",
    "--destructive-foreground": "oklch(0.985 0 0)",
    "--border": "oklch(1 0 0 / 10%)",
    "--input": "oklch(1 0 0 / 15%)",
    "--ring": "oklch(0.65 0.25 150)",
    "--chart-1": "oklch(0.65 0.25 150)",
    "--chart-2": "oklch(0.696 0.17 162.48)",
    "--chart-3": "oklch(0.769 0.188 70.08)",
    "--chart-4": "oklch(0.627 0.265 303.9)",
    "--chart-5": "oklch(0.645 0.246 16.439)",
    
    "--sidebar": "oklch(0.205 0 0)",
    "--sidebar-foreground": "oklch(0.985 0 0)",
    "--sidebar-primary": "oklch(0.65 0.25 150)",
    "--sidebar-primary-foreground": "oklch(0.985 0 0)",
    "--sidebar-accent": "oklch(0.269 0 0)",
    "--sidebar-accent-foreground": "oklch(0.985 0 0)",
    "--sidebar-border": "oklch(1 0 0 / 10%)",
    "--sidebar-ring": "oklch(0.556 0 0)",
  }
};

/**
 * Red theme with OKLCH color format
 */
export const redTheme: ThemeConfig = {
  name: "red",
  light: {
    "--radius": "0.625rem",
    "--radius-sm": "calc(var(--radius) - 4px)",
    "--radius-md": "calc(var(--radius) - 2px)",
    "--radius-lg": "var(--radius)",
    "--radius-xl": "calc(var(--radius) + 4px)",
    
    "--background": "oklch(1 0 0)",
    "--foreground": "oklch(0.145 0 0)",
    "--card": "oklch(1 0 0)",
    "--card-foreground": "oklch(0.145 0 0)",
    "--popover": "oklch(1 0 0)",
    "--popover-foreground": "oklch(0.145 0 0)",
    "--primary": "oklch(0.65 0.2 25)",
    "--primary-foreground": "oklch(0.985 0 0)",
    "--secondary": "oklch(0.97 0 0)",
    "--secondary-foreground": "oklch(0.205 0 0)",
    "--muted": "oklch(0.97 0 0)",
    "--muted-foreground": "oklch(0.556 0 0)",
    "--accent": "oklch(0.97 0 0)",
    "--accent-foreground": "oklch(0.205 0 0)",
    "--destructive": "oklch(0.577 0.245 27.325)",
    "--destructive-foreground": "oklch(0.985 0 0)",
    "--border": "oklch(0.922 0 0)",
    "--input": "oklch(0.922 0 0)",
    "--ring": "oklch(0.65 0.2 25)",
    "--chart-1": "oklch(0.65 0.2 25)",
    "--chart-2": "oklch(0.6 0.118 184.704)",
    "--chart-3": "oklch(0.398 0.07 227.392)",
    "--chart-4": "oklch(0.828 0.189 84.429)",
    "--chart-5": "oklch(0.769 0.188 70.08)",
    
    "--sidebar": "oklch(0.985 0 0)",
    "--sidebar-foreground": "oklch(0.145 0 0)",
    "--sidebar-primary": "oklch(0.65 0.2 25)",
    "--sidebar-primary-foreground": "oklch(0.985 0 0)",
    "--sidebar-accent": "oklch(0.97 0 0)",
    "--sidebar-accent-foreground": "oklch(0.205 0 0)",
    "--sidebar-border": "oklch(0.922 0 0)",
    "--sidebar-ring": "oklch(0.708 0 0)",
  },
  dark: {
    "--radius": "0.625rem",
    "--radius-sm": "calc(var(--radius) - 4px)",
    "--radius-md": "calc(var(--radius) - 2px)",
    "--radius-lg": "var(--radius)",
    "--radius-xl": "calc(var(--radius) + 4px)",
    
    "--background": "oklch(0.145 0 0)",
    "--foreground": "oklch(0.985 0 0)",
    "--card": "oklch(0.205 0 0)",
    "--card-foreground": "oklch(0.985 0 0)",
    "--popover": "oklch(0.205 0 0)",
    "--popover-foreground": "oklch(0.985 0 0)",
    "--primary": "oklch(0.65 0.25 25)",
    "--primary-foreground": "oklch(0.985 0 0)",
    "--secondary": "oklch(0.269 0 0)",
    "--secondary-foreground": "oklch(0.985 0 0)",
    "--muted": "oklch(0.269 0 0)",
    "--muted-foreground": "oklch(0.708 0 0)",
    "--accent": "oklch(0.269 0 0)",
    "--accent-foreground": "oklch(0.985 0 0)",
    "--destructive": "oklch(0.704 0.191 22.216)",
    "--destructive-foreground": "oklch(0.985 0 0)",
    "--border": "oklch(1 0 0 / 10%)",
    "--input": "oklch(1 0 0 / 15%)",
    "--ring": "oklch(0.65 0.25 25)",
    "--chart-1": "oklch(0.65 0.25 25)",
    "--chart-2": "oklch(0.696 0.17 162.48)",
    "--chart-3": "oklch(0.769 0.188 70.08)",
    "--chart-4": "oklch(0.627 0.265 303.9)",
    "--chart-5": "oklch(0.645 0.246 16.439)",
    
    "--sidebar": "oklch(0.205 0 0)",
    "--sidebar-foreground": "oklch(0.985 0 0)",
    "--sidebar-primary": "oklch(0.65 0.25 25)",
    "--sidebar-primary-foreground": "oklch(0.985 0 0)",
    "--sidebar-accent": "oklch(0.269 0 0)",
    "--sidebar-accent-foreground": "oklch(0.985 0 0)",
    "--sidebar-border": "oklch(1 0 0 / 10%)",
    "--sidebar-ring": "oklch(0.556 0 0)",
  }
};

// Collection of all available themes
export const availableThemes: ThemeConfig[] = [
  defaultTheme,
  purpleTheme,
  blueTheme,
  greenTheme,
  redTheme,
];

// Function to apply a theme programmatically
export function applyTheme(theme: ThemeConfig, darkMode: boolean = false): void {
  const root = document.documentElement;
  const mode = darkMode ? 'dark' : 'light';
  const variables = theme[mode];
  
  // Remove existing theme classes
  root.classList.remove('light', 'dark');
  root.classList.add(mode);
  
  // Apply CSS variables
  Object.entries(variables).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}

// Export a simple utility to get a theme by name
export function getThemeByName(name: string): ThemeConfig | undefined {
  return availableThemes.find(theme => theme.name === name);
}