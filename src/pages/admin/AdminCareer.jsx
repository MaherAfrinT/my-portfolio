import React from 'react';
import { Link } from 'react-router-dom';
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection';
import { useAdminDelete } from '../../hooks/useAdminDelete';
import { COLLECTIONS } from '../../lib/constants';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { formatDate } from '../../lib/utils';

export function AdminCareer() {
  const { data: career, loading } = useFirestoreCollection(
    COLLECTIONS.CAREER,
    'startDate',
    'desc'
  );

  const { handleDelete, isDeleting } = useAdminDelete(COLLECTIONS.CAREER);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Career & Education</h1>
        <Button as={Link} to="/admin/career/new">
          Add New Entry
        </Button>
      </div>

      <div className="grid gap-4">
        {career.map((item) => (
          <Card key={item.id}>
            <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-4">
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-bold truncate">{item.role}</h3>
                <div className="text-sm text-slate-500 truncate">
                  {item.company} |{' '}
                  {item.type === 'education' ? 'Education' : 'Experience'}
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  {formatDate(item.startDate)} -{' '}
                  {item.current ? 'Present' : formatDate(item.endDate)}
                </div>
              </div>
              <div className="flex space-x-2 w-full sm:w-auto justify-end">
                <Button
                  as={Link}
                  to={`/admin/career/${item.id}`}
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none justify-center"
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(item.id, 'career entry')}
                  disabled={isDeleting}
                  className="flex-1 sm:flex-none justify-center"
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {career.length === 0 && (
          <div className="rounded-lg border border-dashed py-12 text-center text-slate-500">
            No career entries found.
          </div>
        )}
      </div>
    </div>
  );
}

