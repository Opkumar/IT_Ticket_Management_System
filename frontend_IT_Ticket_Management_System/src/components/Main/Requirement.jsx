import React, { useState, Fragment, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { db } from "../config/firebaseConfig"; // Import your Firebase config
import { ref, set } from "firebase/database"; // Import Firebase database functions
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Adjust according to your Dropdown component import
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Requirement = () => {
  const [startingDate, setStartingDate] = useState("");
  const [startingTime, setStartingTime] = useState("");
  const [endingDate, setEndingDate] = useState("");
  const [endingTime, setEndingTime] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [customAddress, setCustomAddress] = useState(""); // State for custom address
  const [isOpenAddress, setIsOpenAddress] = useState(false);
  const [openSubMenuAddress, setOpenSubMenuAddress] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [requirements, setRequirements] = useState([""]);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const today = new Date().toISOString().split("T")[0];


  const calculateMinFromTime = () => {
    if (!startingTime) return ''; // Return empty if no starting time is selected
    
    const [hours, minutes] = startingTime.split(':').map(Number);
    const startDateTime = new Date();
    startDateTime.setHours(hours, minutes);
    
    // Add one hour to the starting time
    startDateTime.setHours(startDateTime.getHours() + 1);
    
    // Format the result to HH:MM (24-hour format)
    const minTime = startDateTime.toTimeString().split(' ')[0].slice(0, 5);
    return minTime;
  };

  const handleInputChange = (index, value) => {
    const newRequirements = [...requirements];
    newRequirements[index] = value;
    setRequirements(newRequirements);
  };

  const addInputField = () => {
    setRequirements([...requirements, ""]);
  };


  // Sample address options
  const addressOptions = [
    {
      label: "Block A",
      value: "A",
      subOption: [
        { label: "A001", value: "Block A / A001" },
        { label: "A101", value: "Block A / A101" },
        { label: "A201", value: "Block A / A201" },
      ],
    },
    {
      label: "Block B",
      value: "B",
      subOption: [
        { label: "B001", value: "Block B / B001" },
        { label: "B101", value: "Block B / B101" },
        { label: "B201", value: "Block B / B201" },
      ],
    },
    {
      label: "Block C",
      value: "C",
      subOption: [
        { label: "C001", value: "Block C / C001" },
        { label: "C101", value: "Block C / C101" },
        { label: "C201", value: "Block C / C201" },
      ],
    },
    { label: "Other", value: "Other" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true); // Set loading state

    // Validate fields
    if (!selectedAddress) {
      alert("Please fill out all fields, including selecting an address."); // Show error message
      setSubmitLoading(false); // Reset loading state
      return; // Stop the submission process
    }
    const selectAddress =
      selectedAddress === "Other" ? customAddress : selectedAddress;

    const requirementId = Date.now(); // Generate a unique ID for the requirement

    try {
      await set(ref(db, `requirement/${requirementId}`), {
        requirementId,
        components: requirements,
        startingDate,
        startingTime,
        endingDate,
        endingTime,
        address: selectAddress, // Use custom address if "Other" is selected
        userId: currentUser?.uid,
        fullName: currentUser?.displayName,
        email: currentUser?.email,
      });
      alert("Requirement raise successfully!");
      console.log("Requirement saved successfully!");
      setRequirements([""]);
      setStartingDate("");
      setStartingTime("");
      setEndingDate("");
      setEndingTime("");
      setSelectedAddress("");
      setCustomAddress(""); // Clear custom address after submission
    } catch (error) {
      console.error("Error saving requirement: ", error);
      alert("Error saving requirement. Please try again."); // Show error message
    } finally {
      setSubmitLoading(false); // Reset loading state
    }
  };

  const handleSelectAddress = (value) => {
    setSelectedAddress(value);
    if (value === "Other") {
      setCustomAddress(""); // Clear custom address input if "Other" is selected
    }
    setIsOpenAddress(false); // Close the dropdown after selection
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-lg w-full mx-4">
      <form onSubmit={handleSubmit} className="grid gap-4">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Requirement Form
        </h2>
        <div className="mb-4">
          <label
            htmlFor="requirement"
            className="block font-bold  text-gray-700"
          >
            Requirements<span className="text-red-400">*</span>
          </label>
          <div className="ml-1">
            {requirements.map((requirement, index) => (
              <div key={index} className="">
                <p>component {index + 1}:-</p>
                <input
                  key={index}
                  type="text"
                  value={requirement}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  placeholder={`Enter your component ${index + 1}`}
                  className="mt-1 block w-full p-3 border rounded-md focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            ))}
            <button
              onClick={addInputField}
              className="mt-2 p-2 bg-blue-500 text-white rounded"
            >
              +Add
            </button>
          </div>
        </div>
        <div className="">
          <p className="font-bold">To</p>
          <div className="flex pl-1 gap-1 bg-slate-100 rounded-sm">
            <div className="mb-4 ">
              <label
                htmlFor="date"
                className="block text-[12px] font-medium text-gray-700"
              >
                Select Date<span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                id="date"
                value={startingDate}
                onChange={(e) => setStartingDate(e.target.value)}
                className="mt-1 block w-full p-3 border rounded-md focus:border-blue-500 focus:ring-blue-500"
                min={today} // Set the minimum date to today's date
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="time"
                className="block text-[12px] font-medium text-gray-700"
              >
                Select Time<span className="text-red-400">*</span>
              </label>
              <input
                type="time"
                id="time"
                value={startingTime}
                onChange={(e) => setStartingTime(e.target.value)}
                className="mt-1 block w-full p-3 border rounded-md focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>
        <div className="">
          <p className="font-bold">From</p>
          <div className="flex pl-1 gap-1 bg-slate-100 rounded-sm">
            <div className="mb-4 ">
              <label
                htmlFor="date"
                className="block text-[12px] font-medium text-gray-700"
              >
                Select Date<span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                id="date"
                value={endingDate}
                onChange={(e) => setEndingDate(e.target.value)}
                className="mt-1 block w-full p-3 border rounded-md focus:border-blue-500 focus:ring-blue-500"
                min={today} // Set the minimum date to today's date
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="time"
                className="block text-[12px] font-medium text-gray-700"
              >
                Select Time<span className="text-red-400">*</span>
              </label>
              <input
                type="time"
                id="time"
                value={endingTime}
                min={calculateMinFromTime()}
                onChange={(e) => setEndingTime(e.target.value)}
                className="mt-1 block w-full p-3 border rounded-md focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block  font-bold text-gray-700">
            Select Address<span className="text-red-400">*</span>
          </label>
          <DropdownMenu
            open={isOpenAddress}
            onOpenChange={(isOpenAddress) => {
              setIsOpenAddress(isOpenAddress);
            }}
          >
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {selectedAddress || "Select an address"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[280px]">
              {addressOptions.map((address) => (
                <Fragment key={address.value}>
                  <DropdownMenuItem
                    className="flex items-center justify-between"
                    onSelect={(event) => {
                      event.preventDefault();
                      if (address.subOption) {
                        setOpenSubMenuAddress(
                          openSubMenuAddress === address.value
                            ? null
                            : address.value
                        );
                      } else {
                        handleSelectAddress(address.value);
                      }
                    }}
                  >
                    {address.label}
                    {address.subOption && (
                      <ChevronRight className="ml-2 h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                  {openSubMenuAddress === address.value &&
                    address.subOption &&
                    address.subOption.map((subOption) => (
                      <DropdownMenuItem
                        key={subOption.value}
                        className="pl-4"
                        onSelect={() => handleSelectAddress(subOption.value)}
                      >
                        {subOption.label}
                      </DropdownMenuItem>
                    ))}
                </Fragment>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* Input field for custom address when "Other" is selected */}
        {selectedAddress === "Other" && (
          <div className="mb-4">
            <label
              htmlFor="customAddress"
              className="block text-sm font-medium text-gray-700"
            >
              Specify your address
            </label>
            <input
              type="text"
              id="customAddress"
              value={customAddress}
              onChange={(e) => setCustomAddress(e.target.value)}
              placeholder="Enter custom address"
              className="mt-1 block w-full p-3 border rounded-md focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        )}
        <div className="flex justify-center items-center">
          <button
            type="submit"
            className={`bg-blue-600 text-white px-4 py-2 rounded-sm transition-opacity duration-300 ${
              submitLoading ? "opacity-50" : ""
            }`}
            disabled={submitLoading}
          >
            {submitLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Requirement;
