import { useEffect, useState, Fragment, useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CameraIcon, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import RequirementPage from "./RequirementPage";
import useTicketStore from "@/store/useTicketStore";
import useAuthStore from "@/store/useAuthStore";
import { Label } from "@/components/ui/label";

function TicketPage() {
  const [typeIssue, setTypeIssue] = useState("");
  const [otherIssueType, setOtherIssueType] = useState("");
  const [issueImage, setIssueImage] = useState(null);
  const [issueDetail, setIssueDetail] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [issueAddress, setIssueAddress] = useState("");
  const [otherAddress, setOtherAddress] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isOpenAddress, setIsOpenAddress] = useState(false);
  const [openSubMenuAddress, setOpenSubMenuAddress] = useState(null);
  const [isOpenView, setIsOpenView] = useState(true);
  const [requireIssue, setRequireIssue] = useState(false);
  const [requireIssue2, setRequireIssue2] = useState(false);
  const [firstAddress, setFirstAddress] = useState("");
  const [secondAddress, setSecondAddress] = useState("");
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const imageInputRef = useRef(null);
  const { createTicket } = useTicketStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    setOtherAddress(`${firstAddress} / ${secondAddress}`.trim());
  }, [firstAddress, secondAddress]);

  const options = [
    {
      label: "Network / Connectivity",
      value: "Network / Connectivity",
      subOptions: [
        {
          label: "Internet is very slow",
          value: "Network / Connectivity / Internet is very slow",
        },
        {
          label: "Weak Signal / Bad Signal",
          value: "Network / Connectivity / Weak Signal / Bad Signal",
        },
        {
          label: "Router Configuration and Troubleshooting",
          value:
            "Network / Connectivity / Router Configuration and Troubleshooting",
        },
        {
          label: "VPN access and Setup Issues",
          value: "Network / Connectivity / VPN access and Setup Issues",
        },
        {
          label:
            "Network Security Vulnerabilities (Firewall and Malware Protection)",
          value:
            "Network / Connectivity / Network Security Vulnerabilities (Firewall and Malware Protection)",
        },
        {
          label: "Other Network / Connectivity Issues",
          value: "Network / Connectivity / Other Network / Connectivity Issues",
        },
      ],
    },
    {
      label: "Laptop",
      value: "Laptop",
      subOptions: [
        {
          label: "Laptop is not starting",
          value: "Laptop / Laptop is not starting",
        },
        {
          label: "Laptop is overheating",
          value: "Laptop / Laptop is overheating",
        },
        {
          label: "Laptop is shutting down automatically",
          value: "Laptop / Laptop is shutting down automatically",
        },
        {
          label: "Laptop is very slow / lagging",
          value: "Laptop / Laptop is very slow / lagging",
        },
        {
          label: "OS not booting (Blue Screen of Death or Black Screen)",
          value:
            "Laptop / OS not booting (Blue Screen of Death or Black Screen)",
        },
        { label: "Display Issue", value: "Laptop / Display Issue" },
        {
          label: "Issue in installing / uninstalling a program",
          value: "Laptop / Issue in installing / uninstalling a program",
        },
        {
          label: "Storage / Data Issue",
          value: "Laptop / Storage / Data Issue",
        },
        {
          label: "Peripheral Device Issue (mouse etc.)",
          value: "Laptop / Peripheral Device Issue (mouse etc.)",
        },
        {
          label: "Security and Privacy Issue",
          value: "Laptop / Security and Privacy Issue",
        },
        { label: "Battery Issue", value: "Laptop / Battery Issue" },
        { label: "User Account Issue", value: "Laptop / User Account Issue" },
        {
          label: "Backup & Recovery Issue",
          value: "Laptop / Backup & Recovery Issue",
        },
      ],
    },
    {
      label: "Printer",
      value: "Printer",
      subOptions: [
        {
          label: "Printer not detected by the Computer / Laptop",
          value: "Printer / Printer not detected by the Computer / Laptop",
        },
        {
          label: "Printing Quality Issues",
          value: "Printer / Printing Quality Issues",
        },
        {
          label: "Paper Jam inside Printer",
          value: "Printer / Paper Jam inside Printer",
        },
        {
          label: "Paper not Feeding / multiple feeding papers",
          value: "Printer / Paper not Feeding / multiple feeding papers",
        },
        {
          label: "Slow Printing over Network",
          value: "Printer / Slow Printing over Network",
        },
      ],
    },
    {
      label: "Desktop",
      value: "Desktop",
      subOptions: [
        {
          label: "Desktop is not starting",
          value: "Desktop  Desktop is not starting",
        },
        {
          label: "Desktop is very slow",
          value: "Desktop   Desktop is very slow",
        },
        { label: "Hardware Issues", value: "Desktop  Hardware Issues" },
        {
          label: "Desktop is overheating",
          value: "Desktop  Desktop is overheating",
        },
        {
          label: "Desktop is shutting down automatically",
          value: "Desktop  Desktop is shutting down automatically",
        },
        {
          label: "OS not booting (Blue Screen of Death or Black Screen)",
          value:
            "Desktop  OS not booting (Blue Screen of Death or Black Screen)",
        },
        {
          label: "Missing or Corrupt Drivers",
          value: "Desktop  Missing or Corrupt Drivers",
        },
        { label: "Display Issue", value: "Desktop  Display Issue" },
        {
          label: "Issue in installing / uninstalling a program",
          value: "Desktop  Issue in installing / uninstalling a program",
        },
        {
          label: "Storage / Data Issue",
          value: "Desktop  Storage / Data Issue",
        },
        {
          label: "Peripheral Device Issue (mouse etc.)",
          value: "Desktop  Peripheral Device Issue (mouse etc.)",
        },
        {
          label: "Security and Privacy Issue",
          value: "Desktop  Security and Privacy Issue",
        },
        { label: "User Account Issue", value: "Desktop  User Account Issue" },
        {
          label: "Backup & Recovery Issue",
          value: "Desktop  Backup & Recovery Issue",
        },
      ],
    },
    {
      label: "CCTV Camera",
      value: "CCTV Camera",
      subOptions: [
        {
          label: "Camera not working",
          value: "CCTV Camera / Camera not working",
        },
        {
          label: "Camera has become loose / hanging",
          value: "CCTV Camera /  Camera has become loose / hanging",
        },
        {
          label: "Camera not detected by the system",
          value: "CCTV Camera / Camera not detected by the system",
        },
        {
          label: "Low-resolution Video Output",
          value: "CCTV Camera / Low-resolution Video Output",
        },
        {
          label: "Night Vision not working properly",
          value: "CCTV Camera / Night Vision not working properly",
        },
        {
          label: "Frequent disconnections or downtime",
          value: "CCTV Camera / Frequent disconnections or downtime",
        },
        {
          label: "Ethernet cable or power supply failure in wired cameras",
          value:
            "CCTV Camera / Ethernet cable or power supply failure in wired cameras",
        },
        { label: "Recording Issues", value: "CCTV Camera  Recording Issues" },
        {
          label: "Power Supply Issues",
          value: "CCTV Camera / Power Supply Issues",
        },
        { label: "Storage Issues", value: "CCTV Camera  Storage Issues" },
        {
          label: "Unauthorized access to the CCTV system",
          value: "CCTV Camera / Unauthorized access to the CCTV system",
        },
      ],
    },
    {
      label: "Software Issue",
      value: "Software Issue",
      subOptions: [
        {
          label: "Operating System Crashed",
          value: "Software Issue / Operating System Crashed",
        },
        {
          label: "Software Incompatibility (Versions not supported)",
          value:
            "Software Issue / Software Incompatibility (Versions not supported)",
        },
        {
          label: "Application Crashed (unable to open/run apps)",
          value:
            "Software Issue / Application Crashed (unable to open/run apps)",
        },
        {
          label: "Software Updates & Patches (Installation Failure)",
          value:
            "Software Issue / Software Updates & Patches (Installation Failure)",
        },
        {
          label: "License and Activation Issues",
          value: "Software Issue / License and Activation Issues",
        },
      ],
    },
    {
      label: "IT Security Issue",
      value: "IT Security Issue",
      subOptions: [
        {
          label: "Virus / Malware Infections",
          value: "IT Security Issue / Virus / Malware Infections",
        },
        {
          label: "Phishing Attacks",
          value: "IT Security Issue / Phishing Attacks",
        },
        {
          label: "Unauthorized Access",
          value: "IT Security Issue / Unauthorized Access",
        },
      ],
    },
    {
      label: "Cloud Service Issue",
      value: "Cloud Service Issue",
      subOptions: [
        {
          label: "Data Synchronization Issues",
          value: "Cloud Service Issue / Data Synchronization Issues",
        },
        {
          label: "Backup Failures",
          value: "Cloud Service Issue / Backup Failures",
        },
        {
          label: "Account Configuration Issue",
          value: "Cloud Service Issue / Account Configuration Issue",
        },
      ],
    },
    {
      label: "Email & Communication Issue",
      value: "Email & Communication Issue",
      subOptions: [
        {
          label: "Unable to send  / receive Email",
          value:
            "Email & Communication Issue / Unable to send  / receive Email",
        },
        {
          label: "Spam Filtering Issues",
          value: "Email & Communication Issue / Spam Filtering Issues",
        },
        {
          label: "Calendar Syncing Issues",
          value: "Email & Communication Issue / Calendar Syncing Issues",
        },
        {
          label: "Attachment Size Limit Issue",
          value: "Email & Communication Issue / Attachment Size Limit Issue",
        },
      ],
    },
    {
      label: "User Account & Access Issue",
      value: "User Account & Access Issue",
      subOptions: [
        {
          label: "Password reset and recovery",
          value: "User Account & Access Issue / Password reset and recovery",
        },
        {
          label: "Account lockouts",
          value: "User Account & Access Issue / Account lockouts",
        },
        {
          label: "Single sign-on issues",
          value: "User Account & Access Issue / Single sign-on issues",
        },
      ],
    },

    {
      label: "IT Support Services",
      value: "IT Support Services",
      subOptions: [
        {
          label: "Remote Desktop Support",
          value: "IT Support Services / Remote Desktop Support",
        },
        {
          label: "Ticket Resolution Delay",
          value: "IT Support Services / Ticket Resolution Delay",
        },
        {
          label: "Hardware Replacement",
          value: "IT Support Services / Hardware Replacement",
        },
      ],
    },

    {
      label: "Backup & Recovery Issues",
      value: "Backup & Recovery Issues",
      subOptions: [
        {
          label: "Backup Schedule Failures",
          value: "Backup & Recovery Issues / Backup Schedule Failures",
        },
        {
          label: "Data Recovery Problems",
          value: "Backup & Recovery Issues / Data Recovery Problems",
        },
        {
          label: "Storage Capacity Limits",
          value: "Backup & Recovery Issues / Storage Capacity Limits",
        },
      ],
    },

    { label: "Other", value: "Other" },
  ];

  const handleSelect = (value) => {
    setSelectedOption(value);
    setTypeIssue(value);
    setIsOpen(false);
    setOpenSubMenu(null);
  };

  const toggleSubMenu = (value) => {
    setOpenSubMenu(openSubMenu === value ? null : value);
  };

  const handleSelectAddress = (value) => {
    setSelectedAddress(value);
    setIssueAddress(value);
    setIsOpenAddress(false);
    setOpenSubMenuAddress(null);
  };

  const toggleSubMenuAddress = (value) => {
    setOpenSubMenuAddress(openSubMenuAddress === value ? null : value);
  };
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

  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file && !file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      setIssueImage(null);
      setImagePreview(null);
      return;
    }
    setError(null); // Clear previous errors
    setIssueImage(file);
    // Convert image to Base64 for preview
    const previewURL = await convertImageToBase64(file);
    setImagePreview(previewURL);
  };
  const handleRemoveImage = () => {
    setImagePreview(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = ""; // Clear file input
    }
  };

  const handleSubmitIssue = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    const selectedIssueType =
      typeIssue === "Other" ? otherIssueType : typeIssue;
    if (selectedIssueType === "" || null) {
      setRequireIssue(true);
      setSubmitLoading(false);
      return;
    }
    const selectedAddressIn =
      issueAddress === "Other" ? otherAddress : selectedAddress;

    if (issueAddress === "Other") {
      if (!firstAddress || !secondAddress) {
        setError("Both Block selection and Address input are required.");
        return;
      }
    }
    // console.log(selectedAddressIn);
    if (selectedAddressIn === null || "") {
      setRequireIssue2(true);
      setSubmitLoading(false);
      return;
    }
    if (!authUser) {
      console.error("User is not authenticated");
      setSubmitLoading(false);
      return;
    }

    try {
      let issueImageURL = null;

      if (issueImage) {
        issueImageURL = await convertImageToBase64(issueImage);
      }
      await createTicket({
        typeIssue: selectedIssueType,
        issueImage: issueImageURL,
        issueDetail,
        issueAddress: selectedAddressIn,
        urgent: "normal",
      });
      setSubmitLoading(false); // Reset the loading state of the submit button
      alert("Ticket submitted successfully!");
      setSelectedOption(""); // Reset dropdown selection for Issue With
      setIsOpen(false); // Close the dropdown
      setOtherIssueType(""); // Clear the "Other" issue type input
      setIssueDetail(""); // Clear the issue description
      setSelectedAddress(""); // Reset dropdown selection for Address
      setIsOpenAddress(false); // Close the address dropdown
      setOtherAddress(""); // Clear the "Other" address input
      setRequireIssue(false); // Reset validation error for issue selection
      setRequireIssue2(false); // Reset validation error for address selection
      setImagePreview(null); // Clear the image preview
      if (imageInputRef.current) {
        imageInputRef.current.value = null; // Clear the file input
      }
    } catch (error) {
      alert("Error submitting ticket:", error);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-76px)] bg-gray-100 flex flex-col ">
      <div className="flex  w-screen h-10 bg-white shadow-sm">
        <button
          className={`px-5  ${
            isOpenView
              ? "text-blue-700 border-b-4 border-blue-600 rounded-md"
              : "   "
          }`}
          onClick={() => setIsOpenView(true)}
        >
          Raise Issue{" "}
        </button>
        <button
          className={`px-5   ${
            !isOpenView
              ? "text-blue-700  border-b-4 border-blue-600 rounded-md "
              : "    "
          }`}
          onClick={() => setIsOpenView(false)}
        >
          Raise Requirement
        </button>
      </div>
      <div className="flex justify-center  items-center w-screen  py-10">
        {isOpenView ? (
          <div className="bg-white shadow-md rounded-lg p-6 max-w-lg w-full mx-4">
            <form className="grid gap-4" onSubmit={handleSubmitIssue}>
              <h1 className="text-center text-3xl font-bold border-b border-gray-300 pb-3">
                Issue Report
              </h1>
              {/* Issue Type Dropdown */}
              <div className="mt-5 w-full">
                <label className="block text-sm font-medium text-gray-700">
                  Issue With<span className="text-red-400">*</span>
                </label>
                <DropdownMenu
                  open={isOpen}
                  onOpenChange={(isOpen) => {
                    setIsOpen(isOpen);
                    if (isOpen) {
                      setRequireIssue(false); // Set the state when dropdown opens
                    }
                  }}
                >
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {selectedOption
                        ? options.find((opt) => opt.value === selectedOption)
                            ?.label ||
                          options
                            .flatMap((opt) => opt.subOptions || [])
                            .find((subOpt) => subOpt.value === selectedOption)
                            ?.label
                        : "Select an option"}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-[280px] max-h-60 md:max-h-96 overflow-y-auto">
                    {options.map((option) => (
                      <Fragment key={option.value}>
                        <DropdownMenuItem
                          className="flex items-center justify-between"
                          onSelect={(event) => {
                            event.preventDefault();
                            if (option.subOptions) {
                              toggleSubMenu(option.value);
                            } else {
                              handleSelect(option.value);
                            }
                          }}
                        >
                          {option.label}
                          {option.subOptions && (
                            <ChevronRight className="ml-2 h-4 w-4" />
                          )}
                        </DropdownMenuItem>

                        {openSubMenu === option.value &&
                          option.subOptions &&
                          option.subOptions.map((subOption) => (
                            <DropdownMenuItem
                              key={subOption.value}
                              className="pl-4"
                              onSelect={() => handleSelect(subOption.value)}
                            >
                              {subOption.label}
                            </DropdownMenuItem>
                          ))}
                      </Fragment>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {typeIssue === "Other" && (
                  <input
                    type="text"
                    value={otherIssueType}
                    onChange={(e) => setOtherIssueType(e.target.value)}
                    placeholder="Specify the issue type"
                    className="border border-gray-300 p-2 rounded-sm mt-2 w-full"
                    required
                  />
                )}
                {requireIssue ? (
                  <p className="text-[10px] text-red-400">
                    Please Select Issue
                  </p>
                ) : (
                  ""
                )}
              </div>

              {/* Image Upload */}
              <div className="flex flex-col items-center gap-4 p-6 border rounded-lg shadow-sm">
                <label className="block text-sm font-medium text-gray-700">
                  Upload Image of Issue (Optional)
                </label>

                <div className="flex items-center space-x-3">
                  {/* Clickable Camera Icon */}
                  {!imagePreview && (
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full shadow-md hover:bg-gray-200 transition duration-200"
                    >
                      <CameraIcon className="w-6 h-6 text-gray-500" />
                    </label>
                  )}

                  {/* Hidden Input Field */}
                  <input
                    id="image-upload"
                    type="file"
                    ref={imageInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                  />
                </div>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="relative inline-block mt-4">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-36 h-36 object-cover border rounded-xl shadow-lg"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm shadow-md hover:bg-red-600 transition duration-200"
                      aria-label="Remove image"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {/* Issue Description */}
              <div>
                <label
                  htmlFor="describe"
                  className="block text-sm font-medium text-gray-700"
                >
                  Describe your issue in detail
                  <span className="text-red-400">*</span>
                </label>
                <textarea
                  type="text"
                  value={issueDetail}
                  onChange={(e) => setIssueDetail(e.target.value)}
                  className="border border-gray-300 p-2 rounded-sm mt-1 w-full"
                  placeholder="Enter Your Description"
                  required
                />
              </div>

              {/* Address Dropdown */}

              <div className="">
                <label className="block text-sm font-medium text-gray-700">
                  Select Venue<span className="text-red-400">*</span>
                </label>
                <DropdownMenu
                  open={isOpenAddress}
                  onOpenChange={(isOpenAddress) => {
                    setIsOpenAddress(isOpenAddress);
                    if (isOpenAddress) {
                      setRequireIssue2(false); // Set the state when dropdown opens
                    }
                  }}
                >
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {selectedAddress
                        ? addressOptions.find(
                            (opt) => opt.value === selectedAddress
                          )?.label ||
                          addressOptions
                            .flatMap((opt) => opt.subOption || [])
                            .find((subOpt) => subOpt.value === selectedAddress)
                            ?.label
                        : "Select an address"}
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
                              toggleSubMenuAddress(address.value);
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
                              onSelect={() =>
                                handleSelectAddress(subOption.value)
                              }
                            >
                              {subOption.label}
                            </DropdownMenuItem>
                          ))}
                      </Fragment>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                {issueAddress === "Other" && (
                  <div className="p-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Select Block: <span className="text-red-400">*</span>
                    </label>
                    <div className="flex space-x-4 mt-2">
                      {["Block A", "Block B", "Block C"].map((block) => (
                        <label
                          key={block}
                          className="flex items-center gap-2 cursor-pointer text-gray-600"
                        >
                          <input
                            type="radio"
                            name="venue"
                            value={block}
                            className="accent-orange-500"
                            checked={firstAddress === block}
                            onChange={(e) => setFirstAddress(e.target.value)}
                          />
                          {block}
                        </label>
                      ))}
                    </div>

                    <input
                      type="text"
                      placeholder="Specify your address"
                      value={secondAddress}
                      onChange={(e) => setSecondAddress(e.target.value)}
                      className="mt-2 p-2 border border-gray-300 rounded w-full"
                    />

                    {error && <p className="text-red-500 mt-2">{error}</p>}
                  </div>
                )}

                {requireIssue2 ? (
                  <p className="text-[10px] text-red-400">
                    Please Select Address
                  </p>
                ) : (
                  ""
                )}
              </div>

              {/* Urgency Toggle */}
              {/* <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className={`w-14 h-7 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                      isOn ? "bg-green-500" : ""
                    }`}
                    onClick={toggleSwitch}
                  >
                    <div
                      className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                        isOn ? "translate-x-7" : ""
                      }`}
                    ></div>
                  </div>
                  <span className="ml-3 text-gray-700">Is it urgent?</span>
                </div>
              </div> */}

              {/* Submit Button */}
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
        ) : (
          <RequirementPage />
        )}
      </div>
    </div>
  );
}

export default TicketPage;
