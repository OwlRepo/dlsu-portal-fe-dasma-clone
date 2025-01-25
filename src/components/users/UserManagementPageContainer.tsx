'use client';
import React, { useEffect, useState } from 'react';
import { Download, Filter } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';

import { usersHeaders } from '@/lib/column-headers';
import CustomTable from '../custom/CustomTable';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface User {
  id: string;
  username: string;
  userType: string;
}

const UserManagementPageContainer = () => {
  const [search, setSearch] = useState<string>('');
  const [userList, setUserList] = useState<User[]>([]);

  const data = userList.map((row) => ({
    ID: row.id,
    USERNAME: row.username,
    FIRST_NAME: 'N/A',
    LAST_NAME: 'N/A',
    ROLE: row.userType,
    DATE_ADDED: 'N/A',
  }));

  useEffect(() => {
    try {
      const user = Cookies.get('user');
      const token = user ? JSON.parse(user).token : null;

      const fetchUserList = async () => {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/users`,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `${token}`,
            },
          },
        );

        if (res.data) {
          setUserList(res.data);
        }
      };

      fetchUserList();
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="flex items-center justify-between mb-8">
        <div className="w-[500px]">
          <Input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="flex items-center gap-2 text-green-500 bg-white border-[1px] border-green-500 hover:text-green-500 hover:bg-gray-50"
          >
            <Filter />
            Filter
          </Button>
          <Button className="flex items-center gap-2">
            <Download />
            Export
          </Button>
        </div>
      </div>
      <CustomTable columns={usersHeaders} data={data} />
    </div>
  );
};

export default UserManagementPageContainer;
