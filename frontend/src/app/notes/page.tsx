
"use client";

import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '../../utils/api';

interface Note {
  note_id: string;
  note_title: string;
  note_content: string;
  last_update: string;
  created_on: string;
  user_id: string;
}

export default function Notes() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/notes', { note_title: noteTitle, note_content: noteContent });
      setNoteTitle('');
      setNoteContent('');
      setIsModalOpen(false);
      router.push('/'); // Redirect to home after creation
    } catch (err) {
      console.error('Failed to create note:', err);
      setError('Failed to create note');
    }
  };

  if (loading || !isAuthenticated) {
    return <div className="text-white text-center min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8 text-white">
      {/* Modal for Creating Note */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-white bg-opacity-30 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md border border-black">
            <h2 className="text-xl font-bold mb-4 text-black">Add New Note</h2>
            {error && <p className="text-gray-600 mb-4">{error}</p>}
            <form onSubmit={handleCreateNote} className="space-y-4">
              <input
                type="text"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Note Title"
                required
                className="w-full px-4 py-2 rounded-lg bg-white text-black border border-gray-600 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Note Content"
                required
                className="w-full px-4 py-2 rounded-lg bg-white text-black border border-gray-600 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
                rows={4}
              />
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-700 text-white py-2 rounded-lg font-semibold hover:bg-green-900 transition-colors border border-gray-700"
                >
                  Create Note
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    router.push('/'); // Go back to home if canceled
                  }}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-800 transition-colors border border-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}