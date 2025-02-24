"use client";
import React, { useEffect, useMemo, useState } from "react";
import CustomTable from "../custom/CustomTable";
import { headers } from "@/lib/column-headers";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Download, Filter } from "lucide-react";
import { ReportData } from "@/lib/types";
import axios from "axios";
import Cookies from "js-cookie";
import { debounce } from "lodash";

export interface ReportsHeader {
  STATUS: string;
  ID: string;
  NAME: string;
  ACTIVITY: string;
}

const ReportsPageContainer = () => {
  const [search, setSearch] = useState<string>("");
  const [reportsList, setReportsList] = useState<ReportData[]>([]);
  // const [limit, setLimit] = useState<number>(10);
  // const [page, setPage] = useState<number>(1);

  const fetchReportsList = async (searchTerm: string = "") => {
    try {
      const user = Cookies.get("user");
      const token = user ? JSON.parse(user).token : null;

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/reports${
          searchTerm ? `?search=${searchTerm}` : ""
        }`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${token}`,
          },
        }
      );

      if (res.data) {
        setReportsList(res.data.items);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Create memoized debounced search function
  const debouncedSearch = useMemo(
    () =>
      debounce((searchTerm: string) => {
        fetchReportsList(searchTerm);
      }, 500),
    []
  );

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

  // Initial fetch
  useEffect(() => {
    fetchReportsList();
  }, []);

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
          <Input placeholder="Search by name..." value={search} onChange={handleSearch} />
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
      <CustomTable columns={headers} data={data} />
    </div>
  );
};

export default ReportsPageContainer;
