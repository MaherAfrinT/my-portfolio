import React from 'react';
import { Link } from 'react-router-dom';
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection';
import { useAdminDelete } from '../../hooks/useAdminDelete';
import { COLLECTIONS } from '../../lib/constants';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';

export function AdminProjects() {
  const {
    data: projects,
    loading,
    error: fetchError,
  } = useFirestoreCollection(COLLECTIONS.PROJECTS, 'createdAt', 'desc');

  const { handleDelete, isDeleting } = useAdminDelete(COLLECTIONS.PROJECTS);

  if (loading) return <div>Loading projects...</div>;
  if (fetchError) return <div>Error loading projects.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button as={Link} to="/admin/projects/new">
          Add New Project
        </Button>
      </div>

      <div className="grid gap-4">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-4">
                {project.coverImage ? (
                  <img
                    src={project.coverImage}
                    alt=""
                    className="h-16 w-16 rounded-md object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-md bg-slate-200 text-xs text-slate-500 dark:bg-slate-700">
                    No Img
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold">{project.title}</h3>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {project.categories?.join(', ')}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  as={Link}
                  to={`/admin/projects/${project.id}`}
                  variant="outline"
                  size="sm"
                  disabled={isDeleting}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(project.id, 'project')}
                  disabled={isDeleting}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {projects.length === 0 && (
          <div className="rounded-lg border border-dashed py-12 text-center text-slate-500">
            No projects found. Create one!
          </div>
        )}
      </div>
    </div>
  );
}
