/**
 * Common types and interfaces used across the application
 */

// Navigation item type for sidebar menu
export interface NavItem {
  title: string;
  path: string;
  icon?: string;
}

// Common response type for API calls
export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// User preferences type
export interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  notifications: boolean;
}

// Common props for layout components
export interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}