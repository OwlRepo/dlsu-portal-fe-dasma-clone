"use client";
import React, { useEffect, useMemo, useState } from "react";
// import CustomTable from "../custom/CustomTable";
import { headers } from "@/lib/column-headers";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Download } from "lucide-react";
import { ReportData } from "@/lib/types";
import axios from "axios";
import Cookies from "js-cookie";
import { debounce } from "lodash";
import ReportsTable from "./ReportsTable";
import CustomFilter, { FilterItem } from "../custom/CustomFilter";
import { useToast } from "@/hooks/use-toast";

export interface ReportsHeader {
  STATUS: string;
  ID: string;
  NAME: string;
  ACTIVITY: string;
}

const ReportsPageContainer = () => {
  const { toast } = useToast();

  const [search, setSearch] = useState<string>("");
  const [reportsList, setReportsList] = useState<ReportData[]>([]);
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [activeFilters, setActiveFilters] = useState<FilterItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const typeOptions = ["1", "2"];

  const fetchReportsList = async (
    searchTerm: string = "",
    newLimit?: number,
    newPage?: number,
    filters?: FilterItem[]
  ) => {
    setIsLoading(true);
    try {
      const user = Cookies.get("user");
      const token = user ? JSON.parse(user).token : null;

      // Use new values if provided, otherwise use state values
      const currentLimit = newLimit ?? limit;
      const currentPage = newPage ?? page;
      const currentFilters = filters ?? activeFilters;

      // Build query parameters
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
        // Optional success toast
        toast({
          title: "Success",
          description: "Reports fetched successfully",
          duration: 3000,
        });
      }
    } catch (error) {
      // Handle errors here
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          "An error occurred while fetching reports";
        const errorStatus = error.response?.status;

        // Show toast notification with the error message
        toast({
          variant: "destructive",
          title: `Error ${errorStatus || ""}`,
          description: errorMessage,
          duration: 5000,
        });

      } else {
        // Handle non-Axios errors
        toast({
          variant: "destructive",
          title: "Error",
          description: "An unexpected error occurred",
          duration: 5000,
        });
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: FilterItem[]) => {
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

    setActiveFilters(validFilters);
    // Reset to page 1 when filters change
    setPage(1);
    // Apply the filters
    fetchReportsList(search, limit, 1, validFilters);
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

  // const refetchReportsList = () => {
  //   fetchReportsList(search, limit, page, activeFilters);
  // };

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
          <CustomFilter
            onFiltersChange={handleFiltersChange}
            typeOptions={typeOptions}
          />
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
