"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Download, Filter } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import CustomTable from "./CustomTable";
import ViewProfileDialog from "./ViewProfileDialog";
import EditDetailsDialog from "./EditDetailsDialog";
import { debounce } from "lodash";
import CustomFilter, { FilterItem } from "../custom/CustomFilter";
// import { ViewProfileDialog } from './view-profile-dialog';

interface User {
  id: string;
  username: string;
  userType: string;
  first_name: string;
  last_name: string;
  created_at: string;
  email?: string;
}

export interface UserHeader {
  // ID: string;
  EMPLOYEE_ID: string;
  USERNAME: string;
  FIRST_NAME: string;
  LAST_NAME: string;
  EMAIL?: string;
  ROLE: string;
  DATE_ADDED: string;
}

const UserManagementPageContainer = () => {
  const [search, setSearch] = useState<string>("");
  const [userList, setUserList] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserHeader | null>(null);
  const [isViewProfileOpen, setIsViewProfileOpen] = useState(false);
  const [isEditDetailsOpen, setIsEditDetailsOpen] = useState(false);
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [activeFilters, setActiveFilters] = useState<FilterItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    EMAIL: row.email ? row.email : "N/A",
  }));

  const roleColors: Record<string, string> = {
    admin: "bg-green-100 text-green-600",
    employee: "bg-purple-100 text-purple-600",
  };

  const typeOptions = ["super-admin", "admin", "employee"]

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

  const fetchUserList = async (
    searchTerm: string,
    newLimit?: number,
    newPage?: number,
    filters?: FilterItem[]
  ) => {
    try {
      setIsLoading(true);
      const user = Cookies.get("user");
      const token = user ? JSON.parse(user).token : null;

      // Use new values if provided, otherwise use state values
      const currentLimit = newLimit ?? limit;
      const currentPage = newPage ?? page;
      const currentFilters = filters ?? activeFilters;

      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (currentLimit) params.append("limit", currentLimit.toString());
      if (currentPage) params.append("page", currentPage.toString());
      // Add filter parameters only if they have complete values
      currentFilters.forEach((filter) => {
        if (filter.type === "type" && filter.value.type) {
          params.append("type", filter.value.type);
        }
  
        if (filter.type === "dateRange") {
          // Only append date parameters if BOTH dates are provided
          if (filter.value.dateFrom && filter.value.dateTo) {
            params.append("startDate", filter.value.dateFrom);
            params.append("endDate", filter.value.dateTo);
          }
        }
      });

      const queryString = params.toString();
      const url = `${process.env.NEXT_PUBLIC_API_URL}/users${
        queryString ? `?${queryString}` : ""
      }`;

      const res = await axios.get(url, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `${token}`,
        },
      });

      if (res.data) {
        setUserList(res.data.items);
        setTotal(res.data.total);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: FilterItem[]) => {
    // Log all filters for debugging
    console.log("All filters:", newFilters);
  
    // Only consider filters that have valid values
    const validFilters = newFilters.filter((filter) => {
      if (filter.type === "type") {
        return !!filter.value.type; // Only include if userType is set
      }
  
      if (filter.type === "dateRange") {
        // Include only if BOTH dates are set
        return !!filter.value.dateFrom && !!filter.value.dateTo;
      }
  
      return false; // Ignore other filter types
    });
  
    console.log("Valid filters for API:", validFilters);
  
    setActiveFilters(validFilters);
    // Reset to page 1 when filters change
    setPage(1);
    // Apply the filters
    fetchUserList(search, limit, 1, validFilters);
  };

  // Create memoized debounced search function
  const debouncedSearch = useMemo(
    () =>
      debounce((searchTerm: string) => {
        setPage(1); // Reset to first page on new search
        fetchUserList(searchTerm);
      }, 500),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Add handlers for pagination
  const handlePageChange = async (newPage: number) => {
    await fetchUserList(search, limit, newPage); // Call API first
    setPage(newPage); // Update page state after successful API call
  };

  const handleLimitChange = async (newLimit: number) => {
    await fetchUserList(search, newLimit, 1); // Call API first with page 1
    setLimit(newLimit);
    setPage(1);
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    debouncedSearch(value);
  };

  const refetchUserList = () => {
    fetchUserList(search, limit, page, activeFilters);
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  useEffect(() => {
    fetchUserList(search);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="flex items-center justify-between mb-8">
        <div className="w-[500px]">
          <Input
            placeholder="Search..."
            value={search}
            onChange={handleSearch}
          />
        </div>

        <div className="flex items-center gap-4">
          <CustomFilter onFiltersChange={handleFiltersChange} typeOptions={typeOptions} />
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
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        currentPage={page}
        total={total}
        limit={limit}
        isLoading={isLoading}
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
        refetchUserList={refetchUserList}
      />
    </div>
  );
};

export default UserManagementPageContainer;
