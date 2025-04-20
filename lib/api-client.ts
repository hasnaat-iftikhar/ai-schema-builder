// API client for interacting with the backend

// Base URL for API requests
const API_BASE_URL = "/api"

// Helper function for making API requests
async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      // In a real app, you would include authentication headers here
      "x-user-id": "test-user-id", // For development only
    },
  }

  const response = await fetch(url, {
    ...defaultOptions,
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error || `API request failed with status ${response.status}`)
  }

  return response.json()
}

// Projects API
export const projectsApi = {
  // Get all projects
  getAll: () => fetchAPI<any[]>("/projects"),

  // Get a specific project
  getById: (projectId: string) => fetchAPI<any>(`/projects/${projectId}`),

  // Get a project with all its tables, columns, and relationships
  getComplete: (projectId: string) => fetchAPI<any>(`/projects/${projectId}/complete`),

  // Create a new project
  create: (data: { name: string; description?: string }) =>
    fetchAPI<any>("/projects", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Update a project
  update: (projectId: string, data: { name: string; description?: string }) =>
    fetchAPI<any>(`/projects/${projectId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Delete a project
  delete: (projectId: string) =>
    fetchAPI<any>(`/projects/${projectId}`, {
      method: "DELETE",
    }),
}

// Tables API
export const tablesApi = {
  // Get all tables for a project
  getAll: (projectId: string) => fetchAPI<any[]>(`/projects/${projectId}/tables`),

  // Create a new table
  create: (projectId: string, data: { name: string; x: number; y: number }) =>
    fetchAPI<any>(`/projects/${projectId}/tables`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
}

// Columns API
export const columnsApi = {
  // Get all columns for a table
  getAll: (projectId: string, tableId: string) => fetchAPI<any[]>(`/projects/${projectId}/tables/${tableId}/columns`),

  // Create a new column
  create: (
    projectId: string,
    tableId: string,
    data: {
      name: string
      type: string
      is_primary?: boolean
      is_unique?: boolean
      is_foreign?: boolean
    },
  ) =>
    fetchAPI<any>(`/projects/${projectId}/tables/${tableId}/columns`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
}

// Relationships API
export const relationshipsApi = {
  // Get all relationships for a project
  getAll: (projectId: string) => fetchAPI<any[]>(`/projects/${projectId}/relationships`),

  // Create a new relationship
  create: (
    projectId: string,
    data: {
      source_id: string
      target_id: string
      source_key: string
      target_key: string
      through?: string
      type?: string
    },
  ) =>
    fetchAPI<any>(`/projects/${projectId}/relationships`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
}

// Health check API
export const healthApi = {
  check: () => fetchAPI<any>("/health"),
}
