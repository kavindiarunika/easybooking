import { Banner, BannerCollapseButton, Button } from "flowbite-react";
import { HiX } from "react-icons/hi";
import React from "react";
import { useNavigate } from "react-router-dom";

export function VehicleHero() {
  const navigate = useNavigate();
  const token = localStorage.getItem("vehicleToken");

  return (
    <Banner>
      <div className="flex w-[calc(100%-2rem)] flex-col justify-between rounded-lg border border-gray-100 bg-white/80 p-4 shadow-sm md:flex-row lg:max-w-7xl dark:border-gray-600 dark:bg-gray-700">
        <div className="mb-3 mr-4 flex flex-col items-start md:mb-0 md:flex-row md:items-center">
          <p className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
            Create your acount and start renting vehicle with us
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {token ? (
            <Button
              className="text-black border-2 border-black/50 hover:bg-black/40"
              onClick={() => navigate("/vehicle/dashboard")}
            >
              Dashboard
            </Button>
          ) : (
            <Button
              className="text-black border-2 border-black/50 hover:bg-black/40"
              onClick={() => navigate("/vehiclesignup")}
            >
              Sign up
            </Button>
          )}
          <BannerCollapseButton
            color="gray"
            className="border-0 bg-transparent text-gray-500 dark:text-gray-400"
          >
            <HiX className="h-4 w-4" />
          </BannerCollapseButton>
        </div>
      </div>
    </Banner>
  );
}
