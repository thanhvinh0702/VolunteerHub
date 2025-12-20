import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProfileCompleteness, useUpdateUserProfile, useProfile } from "../../hook/useUser";
import { User, Mail, Phone, Calendar, MapPin, FileText, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

function CompleteProfile() {
  const navigate = useNavigate();
  const { data: profileData, isLoading: isLoadingProfile } = useProfile();
  const { data: validation, isLoading: isValidating } = useProfileCompleteness();
  const updateProfileMutation = useUpdateUserProfile();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    address: "",
    bio: "",
  });

  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    if (profileData) {
      setFormData({
        fullName: profileData.fullName || "",
        email: profileData.email || "",
        phoneNumber: profileData.phoneNumber || "",
        dateOfBirth: profileData.dateOfBirth || "",
        address: profileData.address || "",
        bio: profileData.bio || "",
      });
    }
  }, [profileData]);

  useEffect(() => {
    // If profile is already complete, redirect to dashboard
    if (validation?.isComplete && !isValidating) {
      navigate("/dashboard");
    }
  }, [validation, isValidating, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    const missingFields = validation?.missingFields || [];
    const hasAllRequired = missingFields.every((field) => {
      return formData[field] && formData[field].trim() !== "";
    });

    if (!hasAllRequired && missingFields.length > 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    updateProfileMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("Profile completed successfully!");
        // Clear skip/dismiss flags
        localStorage.removeItem("profileSkipped");
        localStorage.removeItem("profileBannerDismissed");
        
        // Check if there's a redirect URL from event registration
        const redirectUrl = sessionStorage.getItem("redirectAfterProfile");
        if (redirectUrl) {
          sessionStorage.removeItem("redirectAfterProfile");
          navigate(redirectUrl);
        } else {
          navigate("/dashboard");
        }
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update profile");
      },
    });
  };

  const handleSkip = () => {
    // Store skip flag in localStorage
    localStorage.setItem("profileSkipped", "true");
    navigate("/dashboard");
  };

  if (isLoadingProfile || isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading profile...</span>
        </div>
      </div>
    );
  }

  const missingFields = validation?.missingFields || [];
  const isFieldRequired = (fieldName) => missingFields.includes(fieldName);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Profile
          </h1>
          <p className="text-gray-600">
            Help us personalize your experience by completing your profile
          </p>
          {missingFields.length > 0 && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <span className="font-semibold">Required fields:</span>{" "}
                {missingFields.join(", ")}
              </p>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name {isFieldRequired("fullName") && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your full name"
                required={isFieldRequired("fullName")}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email {isFieldRequired("email") && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                placeholder="Enter your email"
                disabled
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number {isFieldRequired("phoneNumber") && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your phone number"
                required={isFieldRequired("phoneNumber")}
              />
            </div>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth {isFieldRequired("dateOfBirth") && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={isFieldRequired("dateOfBirth")}
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address {isFieldRequired("address") && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your address"
                required={isFieldRequired("address")}
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio {isFieldRequired("bio") && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tell us about yourself..."
                required={isFieldRequired("bio")}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateProfileMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                "Complete Profile"
              )}
            </button>
            <button
              type="button"
              onClick={handleSkip}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Skip for Now
            </button>
          </div>
        </form>

        {/* Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            You can update your profile anytime from the settings page
          </p>
        </div>
      </div>
    </div>
  );
}

export default CompleteProfile;


