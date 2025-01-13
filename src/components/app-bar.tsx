'use client'; // Mark this component as a client component

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation'; // Import usePathname
import { useAuth } from '@/lib/auth-context';

export function AppBar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const pathname = usePathname(); // Get the current pathname

  const { user, logout, isLoggedIn } = useAuth();

  // Determine the title based on the current pathname
  const getTitle = () => {
    return (
      pathname
        .replace(/^\/|\/$/g, '') // Remove leading and trailing slashes
        .split('-') // Split by hyphens
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        ) // Capitalize first letter
        .join(' ') || 'App Title' // Default title if pathname is empty
    );
  };

  // Update the date every second
  useEffect(() => {
    const updateDate = () => {
      setCurrentDate(new Date());
    };

    const intervalId = setInterval(updateDate, 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Format the date in the user's locale
  useEffect(() => {
    if (isLoggedIn) {
      const formattedDate = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }).format(currentDate);
      setFormattedDate(formattedDate);
    }
  }, [currentDate, isLoggedIn]);

  if (!isLoggedIn) {
    return null;
  }

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    logout(); // Call the logout function
    setDropdownOpen(false); // Close the dropdown after logout
  };

  return (
    <header className="sticky top-0 z-10 bg-white border-b">
      <div className="flex justify-between items-center px-6 py-2">
        <div>
          <h1 className="text-xl font-semibold">{getTitle()}</h1>
          <p className="text-sm text-muted-foreground">As of {formattedDate}</p>
        </div>
        <div className="relative">
          <button onClick={toggleDropdown} className="flex items-center">
            <span className="mr-2">{user?.username}</span>{' '}
            {/* Display username */}
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 9l6 6 6-6"
              />
            </svg>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
