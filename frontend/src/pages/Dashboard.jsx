import React, { useState, useEffect } from "react";
import { Gem, Sparkle, Loader2 } from "lucide-react";
import { Protect, useAuth, useUser } from "@clerk/clerk-react";
import CreationItem from "../components/CreationItem";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalCreations: 0,
    recentCreations: [],
    creationsByType: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const { getToken } = useAuth();

  const getDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();

      const response = await axios.get(
        `${BASE_URL}/api/user/get-dashboard-stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setDashboardData(response.data.data);
      } else {
        setError(response.data.message || "Failed to fetch dashboard data");
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      if (err.response) {
        setError(err.response.data.message || "Server error occurred");
      } else if (err.request) {
        setError("Failed to connect to server");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getDashboardData();
    }
  }, [user]);
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={getDashboardData}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-scroll p-6">
      <div className="flex justify-start gap-4 flex-wrap">
        {/* Total Creations  */}
        <div className="flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200">
          <div className="text-slate-600">
            <p className="text-sm">Total Creations</p>
            <h2 className="text-xl font-semibold">
              {dashboardData.totalCreations}
            </h2>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3588F2] to-[#0BB0D7] text-white flex justify-center items-center ">
            <Sparkle className="w-5 text-white" />
          </div>
        </div>

        {/* Active Plan 
        <div className="flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200">
          <div className="text-slate-600">
            <p className="text-sm">Active Plan</p>
            <h2 className="text-xl font-semibold">
              <Protect plan="premium" fallback="Free">
                Premium
              </Protect>
              Plan
            </h2>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF61C5] to-[#9E53EE] text-white flex justify-center items-center ">
            <Gem className="w-5 text-white" />
          </div>
        </div> */}

        {/* Creations by Type */}
        {dashboardData.creationsByType.length > 0 && (
          <div className="flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200">
            <div className="text-slate-600">
              <p className="text-sm">Most Used</p>
              <h2 className="text-xl font-semibold">
                {dashboardData.creationsByType[0]?.type || "N/A"}
              </h2>
            </div>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#10B981] to-[#059669] text-white flex justify-center items-center ">
              <Sparkle className="w-5 text-white" />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <p className="mt-6 mb-4">Recent Creations</p>
        {dashboardData.recentCreations.length > 0 ? (
          dashboardData.recentCreations.map((item) => (
            <CreationItem key={item.id} item={item} />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No creations yet. Start creating something amazing!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
