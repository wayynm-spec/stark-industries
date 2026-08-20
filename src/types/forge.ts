export interface ForgePage {
  id: string;
  forgeProjectId: string;
  title: string;
  slug: string;
  content: PageContent;
  createdAt: Date;
  updatedAt: Date;
}

export interface PageContent {
  sections: Section[];
}

export interface Section {
  id: string;
  type: 'hero' | 'features' | 'services' | 'testimonials' | 'cta' | 'footer';
  props: Record<string, unknown>;
}

export interface ForgeProject {
  id: string;
  workspaceId: string;
  name: string;
  slug: string;
  description?: string;
  template: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateForgeProjectInput {
  name: string;
  description?: string;
  template: string;
  workspaceId: string;
}
