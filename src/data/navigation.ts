export interface SiteNavigationItem {
  id: string;
  label: string;
  href: string;
}

export const siteNavigation: SiteNavigationItem[] = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'stories', label: 'Stories', href: '/stories' },
  { id: 'essentials', label: 'Essentials', href: '/essentials' },
  { id: 'possibilities', label: 'Possibilities', href: '/possibilities' },
  { id: 'vault', label: 'Vault', href: '/vault' },
  
  { id: 'about', label: 'About Us', href: '/about' },
  { id: 'login', label: 'Login', href: '/login' },
];

// Legacy export for backward compatibility during transition
export const navigationItems = siteNavigation;
export type NavigationItem = SiteNavigationItem;
