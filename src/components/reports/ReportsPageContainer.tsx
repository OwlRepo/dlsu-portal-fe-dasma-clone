"use client";
import React, { useEffect, useMemo, useState } from "react";
// import CustomTable from "../custom/CustomTable";
import { headers } from "@/lib/column-headers";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Download, Filter } from "lucide-react";
import { ReportData } from "@/lib/types";
import axios from "axios";
import Cookies from "js-cookie";
import { debounce } from "lodash";
import ReportsTable from "./ReportsTable";

export interface ReportsHeader {
  STATUS: string;
  ID: string;
  NAME: string;
  ACTIVITY: string;
}

const ReportsPageContainer = () => {
  const [search, setSearch] = useState<string>("");
  const [reportsList, setReportsList] = useState<ReportData[]>([]);
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const fetchReportsList = async (
    searchTerm: string = "",
    newLimit?: number,
    newPage?: number
  ) => {
    try {
      const user = Cookies.get("user");
      const token = user ? JSON.parse(user).token : null;

      // Use new values if provided, otherwise use state values
      const currentLimit = newLimit ?? limit;
      const currentPage = newPage ?? page;

      // Build query parameters
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (currentLimit) params.append("limit", currentLimit.toString());
      if (currentPage) params.append("page", currentPage.toString());

      const queryString = params.toString();
      const url = `${process.env.NEXT_PUBLIC_API_URL}/reports${
        queryString ? `?${queryString}` : ""
      }`;

      const res = await axios.get(url, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `${token}`,
        },
      });

      if (res.data) {
        setReportsList(res.data.items);
        setTotal(res.data.total);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Create memoized debounced search function
  const debouncedSearch = useMemo(
    () =>
      debounce((searchTerm: string) => {
        setPage(1); // Reset to first page on new search
        fetchReportsList(searchTerm);
      }, 500),
      // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Add handlers for pagination
  const handlePageChange = async (newPage: number) => {
    await fetchReportsList(search, limit, newPage); // Call API first
    setPage(newPage); // Update page state after successful API call
  };
  
  const handleLimitChange = async (newLimit: number) => {
    await fetchReportsList(search, newLimit, 1); // Call API first with page 1
    setLimit(newLimit);
    setPage(1);
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const data = reportsList.map((row) => ({
    STATUS: row.status ? row.status : "N/A",
    ID: row.user_id ? row.user_id : "N/A",
    NAME: row.name ? row.name : "N/A",
    ACTIVITY: "N/A",
  }));

  useEffect(() => {
    fetchReportsList(search);
    
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    debouncedSearch(value);
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="flex items-center justify-between mb-8">
        <div className="w-[500px]">
          <Input
            placeholder="Search by name..."
            value={search}
            onChange={handleSearch}
          />
        </div>

        <div className="flex items-center gap-4">
          <Button className="flex items-center gap-2 text-green-500 bg-white border-[1px] border-green-500 hover:text-green-500 hover:bg-gray-50">
            <Filter />
            Filter
          </Button>
          <Button className="flex items-center gap-2">
            <Download />
            Export
          </Button>
        </div>
      </div>
      <ReportsTable
        columns={headers}
        data={data}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        currentPage={page}
        total={total}
        limit={limit}
      />
    </div>
  );
};

export default ReportsPageContainer;
