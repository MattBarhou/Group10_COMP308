"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, gql } from "@apollo/client";
import { useAuth } from "../../../lib/auth";
import {
  FaUser,
  FaEnvelope,
  FaMapMarkerAlt,
  FaInfoCircle,
} from "react-icons/fa";

const UPDATE_USER = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      username
      email
      bio
      location
      profileImage
    }
  }
`;

const CHANGE_PASSWORD = gql`
  mutation ChangePassword($currentPassword: String!, $newPassword: String!) {
    changePassword(currentPassword: $currentPassword, newPassword: $newPassword)
  }
`;

export default function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm({
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      bio: user?.bio || "",
      location: user?.location || "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm();

  const [updateUser, { loading: updateLoading }] = useMutation(UPDATE_USER, {
    onCompleted: () => {
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    },
    onError: (error) => {
      setUpdateError(error.message);
    },
  });

  const [changePassword, { loading: passwordLoading }] = useMutation(
    CHANGE_PASSWORD,
    {
      onCompleted: () => {
        setPasswordSuccess(true);
        resetPassword();
        setTimeout(() => setPasswordSuccess(false), 3000);
      },
      onError: (error) => {
        setPasswordError(error.message);
      },
    }
  );

  const onProfileSubmit = (data) => {
    setUpdateError("");
    updateUser({
      variables: {
        input: {
          username: data.username,
          email: data.email,
          bio: data.bio,
          location: data.location,
        },
      },
    });
  };

  const onPasswordSubmit = (data) => {
    setPasswordError("");
    changePassword({
      variables: {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      },
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800">
        <div className="flex border-b dark:border-gray-700">
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === "profile"
                ? "bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-blue-400"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            Profile Information
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === "password"
                ? "bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-blue-400"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("password")}
          >
            Change Password
          </button>
        </div>

        <div className="p-6">
          {activeTab === "profile" && (
            <div>
              {updateSuccess && (
                <div
                  className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6"
                  role="alert"
                >
                  <p>Profile updated successfully!</p>
                </div>
              )}

              {updateError && (
                <div
                  className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
                  role="alert"
                >
                  <p>{updateError}</p>
                </div>
              )}

              <form
                onSubmit={handleProfileSubmit(onProfileSubmit)}
                className="space-y-6"
              >
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    <FaUser className="inline mr-2" /> Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    {...registerProfile("username", {
                      required: "Username is required",
                    })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                  {profileErrors.username && (
                    <p className="mt-1 text-sm text-red-600">
                      {profileErrors.username.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    <FaEnvelope className="inline mr-2" /> Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...registerProfile("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                  {profileErrors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {profileErrors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="bio"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    <FaInfoCircle className="inline mr-2" /> Bio
                  </label>
                  <textarea
                    id="bio"
                    rows="4"
                    {...registerProfile("bio")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  ></textarea>
                </div>

                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    <FaMapMarkerAlt className="inline mr-2" /> Location
                  </label>
                  <input
                    id="location"
                    type="text"
                    {...registerProfile("location")}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={updateLoading}
                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {updateLoading ? "Updating..." : "Update Profile"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "password" && (
            <div>
              {passwordSuccess && (
                <div
                  className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6"
                  role="alert"
                >
                  <p>Password changed successfully!</p>
                </div>
              )}

              {passwordError && (
                <div
                  className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
                  role="alert"
                >
                  <p>{passwordError}</p>
                </div>
              )}

              <form
                onSubmit={handlePasswordSubmit(onPasswordSubmit)}
                className="space-y-6"
              >
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Current Password
                  </label>
                  <input
                    id="currentPassword"
                    type="password"
                    {...registerPassword("currentPassword", {
                      required: "Current password is required",
                    })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                  {passwordErrors.currentPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {passwordErrors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    {...registerPassword("newPassword", {
                      required: "New password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                  {passwordErrors.newPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {passwordErrors.newPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    {...registerPassword("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) => {
                        const { newPassword } = registerPassword.getValues();
                        return (
                          newPassword === value || "Passwords do not match"
                        );
                      },
                    })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {passwordErrors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {passwordLoading
                      ? "Changing Password..."
                      : "Change Password"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
