import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./UserProfile.css";

const UserProfile = () => {
  const { token, user: authUser } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function loadProfile() {
      if (!token) return;
      try {
        const res = await axios.get("http://localhost:8000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    }
    loadProfile();
  }, [token]);

  if (!profile)
    return (
      <div className="mini-profile">
        <div className="skeleton skeleton-avatar"></div>
        <div className="skeleton skeleton-line"></div>
        <div className="skeleton skeleton-line short"></div>
      </div>
    );

  // Choose gender icon
  const genderIcon =
    profile.gender?.toLowerCase() === "male"
      ? "♂"
      : profile.gender?.toLowerCase() === "female"
      ? "♀"
      : "⚧";

  return (
    <div className="mini-profile fade-in">
      {/* Image + Name/Age */}
      <div className="profile-header">
        <div className="avatar">
          {profile.profilePic ? (
            <img src={profile.profilePic} alt={profile.name} />
          ) : (
            <div className="avatar-placeholder">
              {(profile.name || "U").charAt(0)}
            </div>
          )}
        </div>
        <div className="name-age">
          <div className="name">{profile.name}</div>
          <div className="age">{profile.age ?? "N/A"} yrs</div>
        </div>
      </div>

      {/* Height, Weight, Gender (Now Normal Text) */}
      <div className="basic-info">
        <div><strong>Height:</strong> {profile.height ?? "N/A"} cm</div>
        <div><strong>Weight:</strong> {profile.currentWeight ?? "N/A"} kg</div>
        <div><strong>Gender:</strong> <span className="gender-icon">{genderIcon}</span></div>
      </div>

      {/* BMI, TDEE, Joined */}
      <div className="stats">
        <div><strong>BMI:</strong> {profile.bmi ?? "N/A"}</div>
        <div><strong>TDEE:</strong> {profile.tdee ?? "N/A"}</div>
        <div><strong>Joined:</strong> {new Date(profile.createdAt).toLocaleDateString()}</div>
      </div>
    </div>
  );
};
  
export default UserProfile;
