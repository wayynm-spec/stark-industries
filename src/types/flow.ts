export interface FlowProject {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  slug: string;
  status: 'ACTIVE' | 'ARCHIVED' | 'DELETED';
  createdAt: Date;
  updatedAt: Date;
}

export interface FlowTask {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: 'BACKLOG' | 'TODO' | 'DOING' | 'REVIEW' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assignedTo?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
  workspaceId: string;
}

export interface CreateTaskInput {
  projectId: string;
  title: string;
  description?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: Date;
}
