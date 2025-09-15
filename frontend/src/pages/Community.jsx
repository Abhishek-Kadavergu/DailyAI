import React, { useEffect, useState } from "react";
import { dummyPublishedCreationData } from "../assets/assets";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Heart, Loader2 } from "lucide-react";
import axios from "axios";

const Community = () => {
  const [creations, setCreations] = useState([]);
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const fetchCreations = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const { data } = await axios.get(
        `${BASE_URL}/api/user/get-published-creations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        console.log("✅ Creations fetched successfully:", data.creations);
        setCreations(data.creations);
      } else {
        console.log("❌ API returned error:", data.message);
      }
    } catch (error) {
      console.error("Error fetching creations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCreations();
    }
  }, [user]);
  return (
    <div className="flex-1 h-full flex flex-col gap-4 p-6">
      <h1 className="text-2xl font-bold text-gray-800">Community Creations</h1>
      <div className="bg-white h-full w-full rounded-xl overflow-y-scroll">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col m items-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <div className="text-gray-500 ">Loading creations...</div>
            </div>
          </div>
        ) : creations.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">No published creations found</div>
          </div>
        ) : (
          creations.map((creation, index) => (
            <div
              key={index}
              className="relative group inline-block pl-3 pt-3 w-full sm:max-w-1/2 lg:max-w-1/3"
            >
              {creation.type === "image" ? (
                <img
                  src={creation.content}
                  alt={creation.prompt}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center p-4">
                  <div className="text-center">
                    <div className="text-2xl mb-2">📝</div>
                    <p className="text-sm text-gray-600 truncate">
                      {creation.prompt}
                    </p>
                  </div>
                </div>
              )}
              <div className="absolute bottom-0 top-0 right-0 left-3 flex gap-2 items-end justify-end group-hover:justify-between p-3 group-hover:bg-gradient-to-b from-transparent to-black/80 text-white rounded-lg">
                <div className="hidden group-hover:block">
                  <p className="text-sm font-medium">{creation.prompt}</p>
                  <p className="text-xs opacity-75">
                    {creation.type} •{" "}
                    {new Date(creation.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <p className="text-sm">0</p>
                  <Heart className="min-w-5 h-5 hover:scale-110 cursor-pointer text-white" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Community;
