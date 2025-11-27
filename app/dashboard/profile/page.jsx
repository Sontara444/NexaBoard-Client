"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import Cookies from "js-cookie";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Profile() {
  const router = useRouter();
  const { updateUser } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    createdAt: "",
    lastLogin: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/");
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/auth/profile");
        setFormData({
          username: data.username,
          email: data.email,
          createdAt: data.createdAt,
          lastLogin: data.lastLogin,
          password: "",
        });
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setSaving(true);

    try {
      const updateData = {
        username: formData.username,
      };

      if (formData.password) updateData.password = formData.password;

      const { data } = await api.patch("/auth/profile", updateData);

      setFormData({ ...formData, password: "" });

      setMessage("Profile updated successfully");
      setError("");

      updateUser(data);

      if (data.token) {
        Cookies.set("token", data.token, { expires: 30 });
      }

      router.push("/dashboard");
    } catch (err) {
      setMessage("");
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <div className="text-center py-10">Loading profile...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {formData.username?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <h2 className="font-bold text-2xl text-gray-800">
                {formData.username}
              </h2>
              <p className="text-gray-600">{formData.email}</p>
              <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
                <span>Member since {formatDate(formData.createdAt)}</span>
                <span className="text-gray-300">•</span>
                <span>Last login {formatDateTime(formData.lastLogin)}</span>
              </div>
            </div>
          </div>
          <span className="px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
            Active
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 font-semibold transition ${
              activeTab === "profile"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            Profile Info
          </button>

          <button
            className={`ml-6 px-4 py-2 font-semibold transition ${
              activeTab === "password"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab("password")}
          >
            Change Password
          </button>
        </div>

        {message && (
          <div className="bg-green-50 text-green-700 p-3 rounded mb-4">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {activeTab === "profile" && (
            <>
              <div>
                <label className="block text-gray-700 mb-1 font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={handleChange("username")}
                  className="w-full text-gray-500 border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1 font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full border text-gray-500 border-gray-200 rounded-xl px-4 py-2.5 bg-gray-100 cursor-not-allowed"
                />
                <p className="text-gray-400 text-sm mt-1">
                  Email cannot be changed
                </p>
              </div>
            </>
          )}

          {activeTab === "password" && (
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                New Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={handleChange("password")}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          )}

          <button
            type="submit"
            className={`bg-blue-600 text-white px-6 py-2.5 rounded-xl transition font-semibold shadow-md mt-4 ${
              saving ? "opacity-75 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
            disabled={saving}
          >
            {saving ? (
              <span className="inline-flex items-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              "Save Changes"
            )}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <h3 className="font-semibold text-gray-800 text-lg mb-4">
          Account Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-gray-700">
          <div className="rounded-xl border border-gray-200 p-4">
            <p className="text-gray-400 text-sm">Status</p>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm mt-1 inline-block">
              Active
            </span>
          </div>
          <div className="rounded-xl border border-gray-200 p-4">
            <p className="text-gray-400 text-sm">Role</p>
            <p>User</p>
          </div>
          <div className="rounded-xl border border-gray-200 p-4">
            <p className="text-gray-400 text-sm">Joined</p>
            <p>{formatDate(formData.createdAt)}</p>
          </div>
          <div className="rounded-xl border border-gray-200 p-4">
            <p className="text-gray-400 text-sm">Last Login</p>
            <p>{formatDateTime(formData.lastLogin)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
