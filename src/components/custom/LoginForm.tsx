'use client';
import React, { useState } from 'react';
import { Logo } from '../logo';
import { useAuth } from '@/lib/auth-context';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '../ui/select';
// import { Shield, UserCog, Users } from 'lucide-react';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    login(username, password);

    console.log('test');
    setError('');
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-col justify-between items-center w-[50%] p-8">
        {' '}
        {/* Use justify-between to push footer down */}
        <div className="my-auto">
          <h1 className="text-2xl font-bold text-[#00bc65]">
            Sign-in to your account
          </h1>
          <p className="text-sm text-gray-600">
            Ready to dive in? Just sign in to continue where you left off.
          </p>
          {error && <p className="text-red-500">{error}</p>}
          <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
            {/* <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">
                Role
              </label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      Employee
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      Admin
                    </div>
                  </SelectItem>
                  <SelectItem value="super-admin">
                    <div className="flex items-center">
                      <UserCog className="w-4 h-4 mr-2" />
                      Super Admin
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div> */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Employee ID
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#00bc65] text-white py-2 rounded-md"
            >
              Sign In
            </button>
          </form>
        </div>
        {/* Footer Section */}
        <footer className="mt-4 text-center text-sm text-gray-500">
          <p>Powered by ELID Technology Intl., Inc.</p>
          <p>Version 1.0.0</p>
        </footer>
      </div>
      {/* Right Side: Background Image */}
      <div className="relative w-[50%] h-[95vh] bg-[#02a65b] rounded-xl my-auto mr-6">
        <div
          style={{
            backgroundImage: 'url(/image-pattern.png)', // Adjust the path as needed
            // backgroundSize: 'cover',
            // backgroundPosition: 'center',
            opacity: 0.05, // Adjust opacity to make the image less noticeable
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
          }}
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full">
          <Logo />
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
