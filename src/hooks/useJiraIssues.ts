import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { fetchJiraIssues, searchJiraIssues } from "@/services/jiraApi";
import { Issue } from "@/components/NewIssueModal";
import { db } from "@/db/database";
import { useDatabase } from "./useDatabase";

export interface UseJiraIssuesOptions {
  projectKey?: string;
  jql?: string;
  maxResults?: number;
  enabled?: boolean;
}

/**
 * Hook to fetch issues from Apache JIRA
 */
export const useJiraIssues = (options: UseJiraIssuesOptions = {}) => {
  const {
    projectKey = "FLINK",
    jql,
    maxResults = 50,
    enabled = true,
  } = options;

  return useQuery<Issue[], Error>({
    queryKey: ["jira-issues", projectKey, jql, maxResults],
    queryFn: () => {
      if (jql) {
        return searchJiraIssues(jql, maxResults);
      }
      return fetchJiraIssues(projectKey, maxResults);
    },
    enabled,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    retry: 2,
    retryDelay: 1000,
  });
};

/**
 * Hook to get issues from JIRA and merge with SQLite issues
 * Checks SQLite first - if data exists, uses it. Only makes API call if database is empty.
 */
export const useIssues = (options: UseJiraIssuesOptions = {}) => {
  const { isReady } = useDatabase();
  const [localIssues, setLocalIssues] = useState<Issue[]>([]);
  const [hasLocalData, setHasLocalData] = useState(false);

  // Function to load issues from SQLite
  const loadLocalIssues = () => {
    if (isReady) {
      try {
        const issues = db.getIssues();
        const normalizedIssues = issues.map((issue: any) => ({
          ...issue,
          createdBy: issue.createdBy || issue.assignee || "Unknown",
          labels: issue.labels || [],
          links: issue.links || [],
          subIssues: issue.subIssues || [],
          comments: issue.comments || [],
        }));
        setLocalIssues(normalizedIssues);
        setHasLocalData(normalizedIssues.length > 0);
      } catch (error) {
        console.error('Error loading issues from database:', error);
        setLocalIssues([]);
        setHasLocalData(false);
      }
    }
  };

  // Load issues from SQLite on mount and when database becomes ready
  useEffect(() => {
    loadLocalIssues();
  }, [isReady]);

  // Listen for database updates (when new issues are created/updated)
  useEffect(() => {
    if (isReady) {
      // Refresh local issues when storage changes
      const handleStorageChange = () => {
        loadLocalIssues();
      };
      
      // Listen for custom event when issues are updated
      const handleIssuesUpdated = () => {
        // Small delay to ensure database is saved
        setTimeout(loadLocalIssues, 100);
      };
      
      window.addEventListener('issuesUpdated', handleIssuesUpdated);
      // Also listen for storage events (for cross-tab sync)
      window.addEventListener('storage', handleStorageChange);
      
      return () => {
        window.removeEventListener('issuesUpdated', handleIssuesUpdated);
        window.removeEventListener('storage', handleStorageChange);
      };
    }
  }, [isReady]);

  // If API is disabled or no query params, return only local issues
  if (!options.enabled || (!options.projectKey && !options.jql)) {
    return {
      ...useJiraIssues({ ...options, enabled: false }),
      data: localIssues,
      localIssues,
      jiraIssues: [],
      isLoading: !isReady,
      isError: false,
      error: null,
    };
  }

  // Only enable API call if database is empty and API is enabled
  const shouldFetch = options.enabled && !hasLocalData && isReady;
  
  const jiraQuery = useJiraIssues({
    ...options,
    enabled: shouldFetch,
  });

  // Store API data in SQLite when it arrives (only if database was empty)
  useEffect(() => {
    if (isReady && jiraQuery.data && jiraQuery.data.length > 0 && !hasLocalData && options.enabled) {
      try {
        jiraQuery.data.forEach((issue: Issue) => {
          db.insertIssue(issue);
        });
        setLocalIssues(jiraQuery.data);
        setHasLocalData(true);
      } catch (error) {
        console.error('Error saving issues to database:', error);
      }
    }
  }, [jiraQuery.data, hasLocalData, options.enabled, isReady]);

  // Always prioritize local issues and merge with JIRA issues if they exist
  // Merge JIRA issues with local issues (avoid duplicates by ID)
  const jiraIssues = jiraQuery.data || [];
  
  // Create a map of JIRA issue IDs to avoid duplicates
  const jiraIssueIds = new Set(jiraIssues.map(issue => issue.id));
  
  // Always include all local issues (user-created issues should always appear)
  // Only include JIRA issues that don't have a corresponding local issue
  const uniqueJiraIssues = jiraIssues.filter(issue => !localIssues.some(li => li.id === issue.id));
  
  // Merge: local issues first (priority), then unique JIRA issues
  const mergedIssues = [...localIssues, ...uniqueJiraIssues];

  return {
    ...jiraQuery,
    data: mergedIssues,
    localIssues,
    jiraIssues,
    isLoading: !isReady || (shouldFetch && jiraQuery.isLoading),
    isError: jiraQuery.isError && !hasLocalData, // Only show error if no local data
    error: hasLocalData ? null : jiraQuery.error,
  };
};

