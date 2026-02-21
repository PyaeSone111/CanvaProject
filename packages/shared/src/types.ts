// Shared domain types (sync with API as needed)

export interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  slug: string;
  thumbnailUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Portfolio {
  slug: string;
  projectId: string;
  publishedAt: string;
}
