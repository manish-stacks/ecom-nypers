import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
// import toast from 'react-hot-toast';

const ProfileUpdate = () => {
    const token = sessionStorage.getItem("token_login");

    const [formData, setFormData] = useState({
        Name: '',
        Email: '',
        ContactNumber: '',
    });
    const [loading, setLoading] = useState(false);

    // Fetch profile when component mounts
    const fetchProfile = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('https://api.nypers.in/api/v1/my-details', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (data?.data) {
                setFormData({
                    Name: data.data.Name || '',
                    Email: data.data.Email || '',
                    ContactNumber: data.data.ContactNumber || '',
                });
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
            toast.error("Failed to fetch profile data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdate = async () => {
        try {
            setLoading(true);
            const { data } = await axios.put(
                'https://api.nypers.in/api/v1/update-user-profile',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success(data.message || "Profile updated successfully.");
            fetchProfile();
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error(
                error.response?.data?.message || "Failed to update profile."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Update Profile</h2>

            <div className="space-y-4">
                <input
                    type="text"
                    name="Name"
                    placeholder="Name"
                    value={formData.Name}
                    onChange={handleChange}
                    className="w-full border px-4 py-2 rounded-lg"
                />
                <input
                    type="email"
                    name="Email"
                    placeholder="Email"
                    value={formData.Email}
                    onChange={handleChange}
                    className="w-full border px-4 py-2 rounded-lg"
                />
                <input
                    type="text"
                    name="ContactNumber"
                    placeholder="Contact Number"
                    value={formData.ContactNumber}
                    onChange={handleChange}
                    className="w-full border px-4 py-2 rounded-lg"
                />
            </div>

            <button
                onClick={handleUpdate}
                disabled={loading}
                className="w-full bg-[#000000] text-white px-4 py-2 rounded-lg hover:bg-[#1D1D1D] disabled:opacity-50"
            >
                {loading ? "Updating..." : "Update Profile"}
            </button>
        </div>
    );
};

export default ProfileUpdate;
