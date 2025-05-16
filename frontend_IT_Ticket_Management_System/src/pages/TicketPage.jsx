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
import options from "@/constants/issueType.js";
import addressOptions from "@/constants/issueAddress.js";

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
                      className="w-full justify-between focus:outline-none"
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
                      className="w-full justify-between focus:outline-none"
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

                  <DropdownMenuContent className="w-[280px] max-h-[234px] overflow-y-auto">
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
