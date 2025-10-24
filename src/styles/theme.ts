/**
 * Theme Definition for Joyful Sudoku
 *
 * Soft, calming color palette with pastel tones
 */

export const theme = {
  colors: {
    // Primary palette - soft purples for main UI
    primary: {
      light: '#f3e5f5',     // Very light purple background
      main: '#e1bee7',      // Light purple for accents
      dark: '#ce93d8',      // Medium purple for highlights
      darker: '#ba68c8'     // Darker purple for emphasis
    },

    // Background colors
    background: {
      main: '#ffffff',
      secondary: '#fafafa',
      grid: '#f9f9f9',
      cell: '#ffffff',
      cellGiven: '#f3e5f5'  // Soft purple for given numbers
    },

    // Text colors
    text: {
      primary: '#2c2c2c',
      secondary: '#5f5f5f',
      disabled: '#9e9e9e',
      given: '#6a1b9a',     // Dark purple for given numbers
      user: '#1976d2'       // Blue for user-entered numbers
    },

    // State colors (gentle, non-aggressive)
    state: {
      selected: '#e1bee7',  // Soft purple when cell selected
      conflicting: '#ffcdd2', // Soft pink for conflicts (NOT aggressive red)
      completed: '#c8e6c9',   // Soft green for completed sections
      hover: '#f3e5f5'        // Very light purple on hover
    },

    // Notes (pencil marks)
    notes: {
      color: '#9e9e9e',     // Gray for notes
      background: 'transparent'
    },

    // UI elements
    button: {
      primary: '#e1bee7',
      primaryHover: '#ce93d8',
      secondary: '#f5f5f5',
      secondaryHover: '#eeeeee',
      disabled: '#e0e0e0'
    },

    // Borders
    border: {
      light: '#e0e0e0',
      medium: '#bdbdbd',
      dark: '#757575',
      grid: '#9e9e9e',      // Grid lines
      box: '#424242'        // 3x3 box boundaries (darker)
    }
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px'
  },

  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    full: '9999px'
  },

  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.12)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 20px rgba(0, 0, 0, 0.15)',
    cell: '0 2px 4px rgba(0, 0, 0, 0.08)',
    cellSelected: '0 4px 8px rgba(225, 190, 231, 0.4)'
  },

  typography: {
    fontFamily: {
      base: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      numbers: '"SF Pro Display", "Segoe UI", Roboto, -apple-system, sans-serif'
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '20px',
      xl: '24px',
      xxl: '32px',
      cellNumber: '28px',
      cellNote: '10px'
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  },

  transitions: {
    fast: '150ms ease',
    medium: '300ms ease',
    slow: '600ms ease'
  },

  zIndex: {
    modal: 1000,
    overlay: 900,
    dropdown: 800,
    header: 100,
    default: 1
  }
};

export type Theme = typeof theme;
