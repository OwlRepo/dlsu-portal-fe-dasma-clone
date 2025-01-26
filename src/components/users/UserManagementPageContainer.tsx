'use client';
import React, { useEffect, useState } from 'react';
import { Download, Filter } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Badge } from '../ui/badge';
import CustomTable from './CustomTable';
// import { ViewProfileDialog } from './view-profile-dialog';

interface User {
  id: string;
  username: string;
  userType: string;
}

export interface UserHeader {
  ID: string;
  USERNAME: string;
  FIRST_NAME: string;
  LAST_NAME: string;
  ROLE: string;
  DATE_ADDED: string;
}

const UserManagementPageContainer = () => {
  const [search, setSearch] = useState<string>('');
  const [userList, setUserList] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserHeader | null>(null);
  // const [dateAdded, setDateAdded] = useState<string>('');
  // const [showView, setShowView] = useState<boolean>(false);
  const [isViewProfileOpen, setIsViewProfileOpen] = useState(false);

  const usersHeaders: {
    header: string;
    accessor: keyof UserHeader | 'actions';
    cell?: (row: UserHeader) => React.ReactNode;
  }[] = [
    { header: 'ID', accessor: 'ID' },
    { header: 'Username', accessor: 'USERNAME' },
    { header: 'First Name', accessor: 'FIRST_NAME' },
    { header: 'Last Name', accessor: 'LAST_NAME' },
    { header: 'Role', accessor: 'ROLE' },
    { header: 'Date Added', accessor: 'DATE_ADDED' },
  ];

  const data = userList.map((row) => ({
    ID: row.id,
    USERNAME: row.username,
    FIRST_NAME: 'N/A',
    LAST_NAME: 'N/A',
    ROLE: row.userType,
    DATE_ADDED: 'N/A',
  }));

  const roleColors: Record<string, string> = {
    admin: 'bg-green-100 text-green-600',
    employee: 'bg-purple-100 text-purple-600',
  };

  const handleCloseView = () => {
    setSelectedUser(null);
    setIsViewProfileOpen(false);
  };

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

  const handleView = (user: UserHeader) => {
    setSelectedUser(user);
    setIsViewProfileOpen(true);
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => setIsViewProfileOpen(true)}>hi</button>
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

      <CustomTable
        columns={usersHeaders}
        data={data}
        onView={(user) => handleView(user)}
      />

      <Dialog open={isViewProfileOpen} onOpenChange={handleCloseView}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
            <DialogDescription>View user details</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* <div className="flex items-center gap-4">
              <div>
                <h3 className="text-lg font-semibold">
                  {selectedUser?.USERNAME}
                </h3>
              </div>
            </div> */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Username
                </p>
                <p className="text-sm">{selectedUser?.USERNAME}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  User ID
                </p>
                <p className="text-sm">{selectedUser?.ID}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Role
                </p>
                <Badge
                  variant="outline"
                  className={`mt-1 ${
                    roleColors[selectedUser?.ROLE.toLowerCase() || '']
                  }`}
                >
                  {selectedUser?.ROLE.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagementPageContainer;
