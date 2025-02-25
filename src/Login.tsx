import React, { useState } from 'react';
import { useUser } from './context/UserContext';
import { isMobileOnly } from 'react-device-detect';
import { useLogin } from './hooks/useLogin';
import { LoadingFormButton } from './shared/LoadingFormButton';

export const Login = () => {
  const { setUserAndToken } = useUser();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const mutation = useLogin(username, password);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await mutation.mutateAsync();
      setUserAndToken(response.accessToken, username);
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className={`flex items-center justify-center ${isMobileOnly ? "flex mt-32" : "flex min-h-screen"}`}>
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <LoadingFormButton text="Login" isLoading={mutation.isPending} />
        </form>
      </div>
    </div>
  );
};