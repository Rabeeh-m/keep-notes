
"use client";

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import TiptapEditor from '../components/TiptapEditor';

interface Note {
  note_id: string;
  note_title: string;
  note_content: string;
  last_update: string;
  created_on: string;
  user_id: string;
}

export default function Dashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    } else if (isAuthenticated) {
      fetchNotes();
    }
  }, [loading, isAuthenticated, router]);

  const fetchNotes = async () => {
    try {
      const { data } = await api.get('/notes');
      setNotes(data);
    } catch (err) {
      console.error('Failed to fetch notes:', err);
      setError('Failed to load notes');
    }
  };

  const handleUpdateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNote) return;
    try {
      const { data } = await api.put(`/notes/${selectedNote.note_id}`, {
        note_title: noteTitle,
        note_content: noteContent,
      });
      setNotes(notes.map((note) => (note.note_id === selectedNote.note_id ? data : note)));
      setIsModalOpen(false);
      setNoteTitle('');
      setNoteContent('');
    } catch (err) {
      console.error('Failed to update note:', err);
      setError('Failed to update note');
    }
  };

  const handleDeleteNote = async () => {
    if (!selectedNote) return;
    try {
      await api.delete(`/notes/${selectedNote.note_id}`);
      setNotes(notes.filter((note) => note.note_id !== selectedNote.note_id));
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to delete note:', err);
      setError('Failed to delete note');
    }
  };

  const openModal = (note: Note) => {
    setSelectedNote(note);
    setNoteTitle(note.note_title);
    setNoteContent(note.note_content);
    setIsModalOpen(true);
  };

  if (loading) {
    return <div className="text-white text-center min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white text-black p-8">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          className="text-3xl font-bold absolute top-20 left-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          Good Morning, {user?.user_name || 'User'}!
        </motion.h1>

        <div className="max-w-6xl mx-auto mt-12">
          {error && (
            <motion.p
              className="text-red-500 mb-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.p>
          )}
          {notes.length === 0 ? (
            <motion.p
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              
            </motion.p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {notes.map((note, index) => (
                <motion.div
                  key={note.note_id}
                  className="bg-white p-6 rounded-xl shadow-lg cursor-pointer hover:bg-gray-200 transition-colors border border-black min-h-[200px] flex flex-col justify-between "
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
                  whileHover={{ scale: 1.03, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)' }}
                  onClick={() => openModal(note)}
                >
                  <div className="flex flex-col space-y-4">
                    <div className="pb-2 border-b flex justify-between items-center">
                      <h3 className="text-xl font-semibold text-black truncate">{note.note_title}</h3>
                      <span role="img" aria-label="target">🎯</span>
                    </div>
                    <div className="flex items-start space-x-3 py-3">
                      <div
                        className="text-base text-gray-800 line-clamp-4 flex-1"
                        dangerouslySetInnerHTML={{ __html: note.note_content }}
                      />
                    </div>
                    <div className="flex items-center space-x-3 pt-3 -mx-6 px-6">
                      <p className="text-sm text-gray-600">
                        Last Updated: {new Date(note.last_update).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <AnimatePresence>
          {isModalOpen && selectedNote && (
            <motion.div
              className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="bg-white p-6 rounded-lg w-full max-w-md border border-black"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <h2 className="text-xl font-bold mb-4">Edit Note</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleUpdateNote} className="space-y-4">
                  <input
                    type="text"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    placeholder="Note Title"
                    required
                    className="w-full px-4 py-2 rounded-lg bg-white text-black border border-gray-600 focus:outline-none focus:ring-2 focus:ring-white"
                  />
                  <TiptapEditor content={noteContent} onChange={setNoteContent} />
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="flex-1 bg-green-700 text-white py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteNote}
                      className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </form>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="mt-4 w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}