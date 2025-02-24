"use client";
import React, { useEffect, useState } from "react";
import { Download, Filter } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import CustomTable from "./CustomTable";
import ViewProfileDialog from "./ViewProfileDialog";
import EditDetailsDialog from "./EditDetailsDialog";
// import { ViewProfileDialog } from './view-profile-dialog';

interface User {
  id: string;
  username: string;
  userType: string;
  first_name: string;
  last_name: string;
  created_at: string;
}

export interface UserHeader {
  // ID: string;
  EMPLOYEE_ID: string;
  USERNAME: string;
  FIRST_NAME: string;
  LAST_NAME: string;
  ROLE: string;
  DATE_ADDED: string;
}

const UserManagementPageContainer = () => {
  const [search, setSearch] = useState<string>("");
  const [userList, setUserList] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserHeader | null>(null);
  const [isViewProfileOpen, setIsViewProfileOpen] = useState(false);
  const [isEditDetailsOpen, setIsEditDetailsOpen] = useState(false);
  // const [limit, setLimit] = useState<number>(10);
  // const [page, setPage] = useState<number>(1);

  const usersHeaders: {
    header: string;
    accessor: keyof UserHeader | "";
    cell?: (row: UserHeader) => React.ReactNode;
  }[] = [
    { header: "Employee ID", accessor: "EMPLOYEE_ID" },
    { header: "Username", accessor: "USERNAME" },
    { header: "First Name", accessor: "FIRST_NAME" },
    { header: "Last Name", accessor: "LAST_NAME" },
    { header: "Role", accessor: "ROLE" },
    { header: "Date Added", accessor: "DATE_ADDED" },
  ];

  const data = userList.map((row) => ({
    EMPLOYEE_ID: row.id ? row.id : "N/A",
    USERNAME: row.username ? row.username : "N/A",
    FIRST_NAME: row.first_name ? row.first_name : "N/A",
    LAST_NAME: row.last_name ? row.last_name : "N/A",
    ROLE: row.userType ? row.userType : "N/A",
    DATE_ADDED: row.created_at ? row.created_at : "N/A",
  }));

  const roleColors: Record<string, string> = {
    admin: "bg-green-100 text-green-600",
    employee: "bg-purple-100 text-purple-600",
  };

  const handleCloseView = () => {
    setSelectedUser(null);
    setIsViewProfileOpen(false);
  };

  const handleCloseEdit = () => {
    setSelectedUser(null);
    setIsEditDetailsOpen(false);
  };

  const handleView = (user: UserHeader) => {
    setSelectedUser(user);
    setIsViewProfileOpen(true);
  };

  const handleEdit = (user: UserHeader) => {
    setSelectedUser(user);
    setIsEditDetailsOpen(true);
  };

  useEffect(() => {
    try {
      const user = Cookies.get("user");
      const token = user ? JSON.parse(user).token : null;

      const fetchUserList = async () => {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/users`,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `${token}`,
            },
          }
        );

        if (res.data) {
          setUserList(res.data.items);
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

      <CustomTable
        columns={usersHeaders}
        data={data}
        onView={(user) => handleView(user)}
        onEdit={(user) => handleEdit(user)}
      />

      <ViewProfileDialog
        isOpen={isViewProfileOpen}
        onClose={handleCloseView}
        user={selectedUser}
        roleColors={roleColors}
      />

      <EditDetailsDialog
        isOpen={isEditDetailsOpen}
        onClose={handleCloseEdit}
        user={selectedUser}
        // onSave={handleSaveEdit}
      />
    </div>
  );
};

export default UserManagementPageContainer;
