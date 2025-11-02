import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { fetchJiraProjects } from "@/services/jiraApi";
import { Project } from "@/data/mockData";

export interface UseJiraProjectsOptions {
  enabled?: boolean;
}

/**
 * Hook to fetch projects from Apache JIRA
 */
export const useJiraProjects = (options: UseJiraProjectsOptions = {}) => {
  const { enabled = true } = options;

  return useQuery<Project[], Error>({
    queryKey: ["jira-projects"],
    queryFn: () => fetchJiraProjects(),
    enabled,
    staleTime: 10 * 60 * 1000, // Consider data fresh for 10 minutes (projects change less frequently)
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    retry: 2,
    retryDelay: 1000,
  });
};

/**
 * Hook to get projects from JIRA and merge with localStorage projects
 * Checks localStorage first - if data exists, uses it. Only makes API call if localStorage is empty.
 */
export const useProjects = (options: UseJiraProjectsOptions = {}) => {
  // Get local projects from localStorage first
  const getLocalProjects = (): Project[] => {
    try {
      const stored = localStorage.getItem("projects");
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const localProjects = getLocalProjects();
  const hasLocalData = localProjects.length > 0;

  // Only enable API call if localStorage is empty and API is enabled
  const shouldFetch = options.enabled && !hasLocalData;
  
  const jiraQuery = useJiraProjects({
    ...options,
    enabled: shouldFetch,
  });

  // Store API data in localStorage when it arrives (only if localStorage was empty)
  useEffect(() => {
    if (jiraQuery.data && jiraQuery.data.length > 0 && !hasLocalData && options.enabled) {
      localStorage.setItem("projects", JSON.stringify(jiraQuery.data));
    }
  }, [jiraQuery.data, hasLocalData, options.enabled]);

  // If API is disabled or we have local data, return only local projects
  if (!options.enabled || hasLocalData) {
    return {
      ...jiraQuery,
      data: localProjects,
      localProjects,
      jiraProjects: [],
      isLoading: false,
      isError: false,
      error: null,
    };
  }

  // Merge JIRA projects with local projects (avoid duplicates by ID)
  const jiraProjects = jiraQuery.data || [];
  
  // Create a map of JIRA project IDs to avoid duplicates
  const jiraProjectIds = new Set(jiraProjects.map(project => project.id));
  
  // Only include local projects that don't have a corresponding JIRA project
  const uniqueLocalProjects = localProjects.filter(project => !jiraProjectIds.has(project.id));
  
  const mergedProjects = [...jiraProjects, ...uniqueLocalProjects];

  return {
    ...jiraQuery,
    data: mergedProjects.length > 0 ? mergedProjects : localProjects,
    localProjects,
    jiraProjects,
  };
};

