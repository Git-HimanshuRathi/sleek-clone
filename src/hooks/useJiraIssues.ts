import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { fetchJiraIssues, searchJiraIssues } from "@/services/jiraApi";
import { Issue } from "@/components/NewIssueModal";

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
 * Hook to get issues from JIRA and merge with localStorage issues
 * Checks localStorage first - if data exists, uses it. Only makes API call if localStorage is empty.
 */
export const useIssues = (options: UseJiraIssuesOptions = {}) => {
  // Get local issues from localStorage first
  const getLocalIssues = (): Issue[] => {
    try {
      const stored = localStorage.getItem("issues");
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) return [];
      // Ensure all issues have required fields
      return parsed.map((issue: Issue) => ({
        ...issue,
        createdBy: issue.createdBy || issue.assignee || "Unknown",
      }));
    } catch {
      return [];
    }
  };

  const localIssues = getLocalIssues();
  const hasLocalData = localIssues.length > 0;

  // If API is disabled or no query params, return only local issues
  if (!options.enabled || (!options.projectKey && !options.jql)) {
    return {
      ...useJiraIssues({ ...options, enabled: false }),
      data: localIssues,
      localIssues,
      jiraIssues: [],
      isLoading: false,
      isError: false,
      error: null,
    };
  }

  // Only enable API call if localStorage is empty and API is enabled
  const shouldFetch = options.enabled && !hasLocalData;
  
  const jiraQuery = useJiraIssues({
    ...options,
    enabled: shouldFetch,
  });

  // Store API data in localStorage when it arrives (only if localStorage was empty)
  useEffect(() => {
    if (jiraQuery.data && jiraQuery.data.length > 0 && !hasLocalData && options.enabled) {
      localStorage.setItem("issues", JSON.stringify(jiraQuery.data));
    }
  }, [jiraQuery.data, hasLocalData, options.enabled]);

  // If we have local data, return only local issues
  if (hasLocalData) {
    return {
      ...jiraQuery,
      data: localIssues,
      localIssues,
      jiraIssues: [],
      isLoading: false,
      isError: false,
      error: null,
    };
  }

  // Merge JIRA issues with local issues (avoid duplicates by ID)
  const jiraIssues = jiraQuery.data || [];
  
  // Create a map of JIRA issue IDs to avoid duplicates
  const jiraIssueIds = new Set(jiraIssues.map(issue => issue.id));
  
  // Only include local issues that don't have a corresponding JIRA issue
  const uniqueLocalIssues = localIssues.filter(issue => !jiraIssueIds.has(issue.id));
  
  const mergedIssues = [...jiraIssues, ...uniqueLocalIssues];

  return {
    ...jiraQuery,
    data: mergedIssues.length > 0 ? mergedIssues : localIssues,
    localIssues,
    jiraIssues,
  };
};

