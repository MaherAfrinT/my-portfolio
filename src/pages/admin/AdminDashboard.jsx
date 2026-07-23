import React from 'react';
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { COLLECTIONS } from '../../lib/constants';

export function AdminDashboard() {
  const { data: projects, loading: projectsLoading } =
    useFirestoreCollection(COLLECTIONS.PROJECTS);
  const { data: messages, loading: messagesLoading } =
    useFirestoreCollection(COLLECTIONS.MESSAGES);
  const { data: career, loading: careerLoading } =
    useFirestoreCollection(COLLECTIONS.CAREER);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-4">
          <Button
            onClick={async () => {
              try {
                const { seedDatabase } = await import('../../lib/seedData');
                await seedDatabase();
                const Swal = (await import('sweetalert2')).default;
                Swal.fire('Success', 'Database seeded successfully', 'success');
              } catch (err) {
                console.error(err);
                const Swal = (await import('sweetalert2')).default;
                Swal.fire('Error', 'Failed to seed database', 'error');
              }
            }}
            variant="outline"
            className="border-cyan-500 text-cyan-500 hover:bg-cyan-50 dark:hover:bg-cyan-900/20"
          >
            Seed Database
          </Button>
          <Button
            onClick={async () => {
              const Swal = (await import('sweetalert2')).default;
              const result = await Swal.fire({
                title: 'Are you sure?',
                text: 'Are you sure you want to delete all seeded data? This cannot be undone.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ef4444',
                cancelButtonColor: '#64748b',
                confirmButtonText: 'Yes, delete it!'
              });
              
              if (result.isConfirmed) {
                try {
                  const { deleteSeededData } = await import('../../lib/seedData');
                  await deleteSeededData();
                  Swal.fire('Deleted!', 'Seeded data has been deleted.', 'success');
                } catch (err) {
                  console.error(err);
                  Swal.fire('Error', 'Failed to delete seed data', 'error');
                }
              }
            }}
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            Delete Seed Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard
          title="Total Projects"
          count={projects?.length}
          loading={projectsLoading}
          color="cyan"
        />
        <StatCard
          title="Career Entries"
          count={career?.length}
          loading={careerLoading}
          color="purple"
        />
        <StatCard
          title="Unread Messages"
          count={messages?.filter((m) => !m.read).length}
          loading={messagesLoading}
          color="pink"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardContent>
            <h2 className="mb-4 text-xl font-bold">Recent Messages</h2>
            {messagesLoading ? (
              <p>Loading...</p>
            ) : (
              <ul className="space-y-4">
                {messages?.slice(0, 5).map((msg) => (
                  <li
                    key={msg.id}
                    className="border-b border-slate-100 pb-2 dark:border-slate-800"
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-medium">{msg.name}</span>
                      {!msg.read && (
                        <span className="rounded-full bg-cyan-100 px-2 py-0.5 text-xs text-cyan-800">
                          New
                        </span>
                      )}
                    </div>
                    <p className="truncate text-sm text-slate-500">
                      {msg.message}
                    </p>
                  </li>
                ))}
                {messages?.length === 0 && (
                  <p className="text-slate-500">No messages yet.</p>
                )}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, count, loading, color }) {
  const colorMap = {
    cyan: 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400',
    purple:
      'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    pink: 'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400',
  };

  return (
    <Card>
      <CardContent className="flex items-center p-6">
        <div className={`rounded-full p-4 ${colorMap[color]} mr-4`}>
          <svg
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <p className="text-3xl font-bold">{loading ? '-' : count || 0}</p>
        </div>
      </CardContent>
    </Card>
  );
}
