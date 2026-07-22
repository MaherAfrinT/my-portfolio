import React from 'react';
import { Link } from 'react-router-dom';
import { useAdminDelete } from '../../hooks/useAdminDelete';
import { COLLECTIONS } from '../../lib/constants';
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';

export function AdminTestimonials() {
  const {
    data: testimonials,
    loading,
    error,
  } = useFirestoreCollection(COLLECTIONS.TESTIMONIALS, 'createdAt', 'desc');

  const { handleDelete, isDeleting } = useAdminDelete(COLLECTIONS.TESTIMONIALS);

  if (loading) return <div>Loading testimonials...</div>;
  if (error) return <div>Error loading testimonials.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Testimonials</h1>
        <Button as={Link} to="/admin/testimonials/new">
          Add New Testimonial
        </Button>
      </div>

      <div className="grid gap-4">
        {testimonials.map((t) => (
          <Card key={t.id}>
            <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-4">
              <div className="flex items-center space-x-4 w-full sm:w-auto min-w-0">
                {t.avatarUrl ? (
                  <img
                    src={t.avatarUrl}
                    alt=""
                    className="h-12 w-12 flex-shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs text-slate-500 dark:bg-slate-700">
                    {t.author.charAt(0)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold truncate">{t.author}</h3>
                  <div className="text-sm text-slate-500 dark:text-slate-400 truncate">
                    {t.position}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2 w-full sm:w-auto justify-end">
                <Button
                  as={Link}
                  to={`/admin/testimonials/${t.id}`}
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none justify-center"
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(t.id, 'testimonial')}
                  disabled={isDeleting}
                  className="flex-1 sm:flex-none justify-center"
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {testimonials.length === 0 && (
          <div className="rounded-lg border border-dashed py-12 text-center text-slate-500">
            No testimonials found. Create one!
          </div>
        )}
      </div>
    </div>
  );
}
