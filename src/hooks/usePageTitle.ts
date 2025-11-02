import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';

// Map routes to page titles
const routeTitleMap: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/inbox': 'Inbox',
  '/my-issues': 'My issues',
  '/my-issues/assigned': 'Assigned',
  '/my-issues/created': 'Created',
  '/my-issues/subscribed': 'Subscribed',
  '/my-issues/activity': 'Activity',
  '/projects': 'Projects',
  '/views': 'Views',
  '/teams': 'Teams',
  '/members': 'Members',
  '/team/issues': 'Team issues',
  '/team/issues/active': 'Active',
  '/team/issues/backlog': 'Backlog',
  '/team/projects': 'Team projects',
  '/team/views': 'Team views',
  '/import': 'Import issues',
  '/invite': 'Invite people',
  '/github': 'Connect GitHub',
  '/settings': 'Settings',
  '/more': 'More',
};

// Helper function to get page title from route
const getPageTitle = (pathname: string, params?: Record<string, string | undefined>): string => {
  // Check exact matches first
  if (routeTitleMap[pathname]) {
    return routeTitleMap[pathname];
  }

  // Check for dynamic routes (e.g., /my-issues/issue/:id)
  if (pathname.startsWith('/my-issues/issue/')) {
    // Try to get issue number from params or pathname
    const issueId = params?.issueId || pathname.split('/').pop();
    if (issueId) {
      // If we have access to the issue, we'll need to get it from the page component
      // For now, just return a generic title
      return 'Issue';
    }
    return 'Issue details';
  }
  
  if (pathname.startsWith('/projects/') && pathname !== '/projects') {
    const projectId = params?.projectId || pathname.split('/').pop();
    if (projectId) {
      return 'Project';
    }
    return 'Project details';
  }

  // Check prefix matches (for nested routes)
  for (const [route, title] of Object.entries(routeTitleMap)) {
    if (pathname.startsWith(route) && route !== '/') {
      return title;
    }
  }

  // Default fallback
  return 'Linear';
};

/**
 * Hook to set page title dynamically based on current route
 * @param customTitle - Optional custom title to override the route-based title
 */
export const usePageTitle = (customTitle?: string) => {
  const location = useLocation();
  const params = useParams();

  useEffect(() => {
    const pageTitle = customTitle || getPageTitle(location.pathname, params);
    document.title = pageTitle;
  }, [location.pathname, customTitle, params]);
};

