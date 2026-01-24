import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../../App.jsx";
import StayFilter from "../../components/StayFilter.jsx";
import StaySearch from "../../components/StaySearch.jsx";

const TrendingPaid = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [searchName , setSearchname] = useState("");



  // 🔹 Fetch ALL accounts
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await axios.get(
          `${backendUrl}/api/trending/trenddata`
        );

        const normalized = res.data.map(item => ({
          ...item,
          paid: item.paid ?? false,
        }));

        setAccounts(normalized);
      } catch (error) {
        toast.error("Failed to load accounts");
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);


  const searchAccounts =accounts.filter(item =>
    item.name?.toLowerCase().includes(searchName.toLocaleLowerCase())
  )
 
  const togglePaid = async (id, currentPaid) => {
    try {
      setUpdatingId(id);

      await axios.patch(
        `${backendUrl}/api/trending/updatetrending/${id}`,
        { paid: !currentPaid }
      );

    
      setAccounts(prev =>
        prev.map(item =>
          item._id === id
            ? { ...item, paid: !currentPaid }
            : item
        )
      );

      toast.success("Payment status updated");
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <p className="text-center text-gray-500 py-10">
        Loading accounts...
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {accounts.length === 0 && (
        <p className="text-center text-gray-500">
          No accounts found
        </p>
      )}

<div className="flex flex-row items-center justify-between gap-4">
    <StayFilter/>
   <StaySearch searchName={searchName} setSearchName={setSearchname}/>
</div>
  
      {searchAccounts.map(item => (
        <div
          key={item._id}
          className="flex items-center justify-between gap-4 bg-pink-300/50 p-4 rounded-xl"
        >
          {/* Left info */}
          <div>
            <h2 className="font-semibold text-lg">
              {item.name}
            </h2>
            <p className="text-sm">
              {item.contact}
            </p>
          
          </div>

          {/* Toggle */}
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={item.paid} 
              disabled={updatingId === item._id}
              onChange={() =>
                togglePaid(item._id, item.paid)
              }
            />

            {/* Track */}
            <div
              className={`w-16 h-8 rounded-full transition-colors duration-200
                ${
                  item.paid
                    ? "bg-gray-400"
                    : "bg-black"
                }
                ${
                  updatingId === item._id
                    ? "opacity-50"
                    : ""
                }`}
            ></div>

            {/* Dot */}
            <span
              className={`absolute left-1 top-1 w-6 h-6 bg-white rounded-full
                transition-transform duration-200
                ${
                  item.paid
                    ? "translate-x-8"
                    : ""
                }`}
            ></span>
          </label>
        </div>
      ))}
    </div>
  );
};

export default TrendingPaid;
