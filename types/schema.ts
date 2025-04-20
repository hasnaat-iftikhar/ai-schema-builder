export interface User {
  id: string
  name: string | null
  email: string | null
  email_verified: Date | null
  image: string | null
}

export interface Project {
  id: string
  name: string
  description: string | null
  created_at: Date
  updated_at: Date
  user_id: string
}

export interface Table {
  id: string
  name: string
  x: number
  y: number
  project_id: string
}

export interface Column {
  id: string
  name: string
  type: string
  is_primary: boolean
  is_unique: boolean
  is_foreign: boolean
  table_id: string
}

export interface Relationship {
  id: string
  source_id: string
  target_id: string
  source_key: string
  target_key: string
  through: string | null
  type: string | null
  project_id: string
}
