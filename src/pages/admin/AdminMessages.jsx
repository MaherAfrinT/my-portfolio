import React from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection';
import { useAdminDelete } from '../../hooks/useAdminDelete';
import { COLLECTIONS } from '../../lib/constants';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { formatDate } from '../../lib/utils';

export function AdminMessages() {
  const { data: messages, loading } = useFirestoreCollection(COLLECTIONS.MESSAGES);
  const { handleDelete, isDeleting } = useAdminDelete(COLLECTIONS.MESSAGES);

  const toggleRead = async (id, currentStatus) => {
    await updateDoc(doc(db, COLLECTIONS.MESSAGES, id), { read: !currentStatus });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Messages</h1>

      <div className="space-y-4">
        {messages.map((msg) => (
          <Card
            key={msg.id}
            className={!msg.read ? 'border-cyan-500 shadow-sm' : ''}
          >
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col justify-between gap-4 md:flex-row">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <h3 className="text-lg font-bold">{msg.name}</h3>
                    <span className="text-sm text-slate-500">
                      ({msg.email})
                    </span>
                    {!msg.read && (
                      <span className="rounded-full bg-cyan-100 px-2 py-0.5 text-xs font-medium text-cyan-800">
                        New
                      </span>
                    )}
                  </div>
                  <div className="mb-4 text-sm text-slate-400">
                    {formatDate(msg.createdAt)}
                  </div>
                  <p className="rounded-md bg-slate-50 p-4 whitespace-pre-wrap text-[#385361] dark:bg-slate-800/50 dark:text-slate-300">
                    {msg.message}
                  </p>
                </div>

                <div className="flex justify-end gap-2 md:flex-col">
                  <Button
                    variant={msg.read ? 'outline' : 'primary'}
                    size="sm"
                    onClick={() => toggleRead(msg.id, msg.read)}
                  >
                    {msg.read ? 'Mark Unread' : 'Mark Read'}
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(msg.id, 'message')}
                    disabled={isDeleting}
                  >
                    Delete
                  </Button>
                  <Button
                    as="a"
                    href={`mailto:${msg.email}`}
                    variant="outline"
                    size="sm"
                  >
                    Reply
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {messages.length === 0 && (
          <div className="py-12 text-center text-slate-500">
            No messages yet.
          </div>
        )}
      </div>
    </div>
  );
}
