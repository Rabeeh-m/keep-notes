
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';

export default function Register() {
  const [user_name, setUserName] = useState('');
  const [user_email, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const success = await register(user_name, user_email, password);
      if (success) {
        router.push('/login');
      } else {
        setError('Registration failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-white/95 max-w-md w-full rounded-2xl shadow-2xl p-8 border border-black">
        <h1 className="text-3xl font-bold text-black mb-6 text-center">Sign Up</h1>
        {error && (
          <p className="text-red-600 bg-red-100 p-3 rounded-lg mb-6 text-center font-medium">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={user_email}
              onChange={(e) => setUserEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 
                         focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
                         text-black placeholder-gray-500"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={user_name}
              onChange={(e) => setUserName(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 
                         focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
                         text-black placeholder-gray-500"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 
                         focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
                         text-black placeholder-gray-500"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 
                         focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent
                         text-black placeholder-gray-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg font-semibold
                       hover:bg-gray-800 transition-colors duration-200
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-800 font-bold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}