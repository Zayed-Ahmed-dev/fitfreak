import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./CurrentStreak.css";

const CurrentStreak = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);

  const leaderboard = [
    { username: "JohnDoe", streak: 120 },
    { username: "FitQueen", streak: 95 },
    { username: "IronMan", streak: 75 },
    { username: "Zayed", streak: 60 },
    { username: "Alex", streak: 45 },
  ];

  // Badge tiers
  const badges = [
    { day: 1, title: "Squire", image: "/images/squire.png" },
    { day: 3, title: "Page", image: "/images/page.png" },
    { day: 7, title: "Knight", image: "/images/knight.png" },
    { day: 14, title: "Champion", image: "/images/champion.png" },
    { day: 30, title: "Lord / Lady", image: "/images/lord.png" },
    { day: 50, title: "Baron / Baroness", image: "/images/baron.png" },
    { day: 100, title: "Royalty", image: "/images/royalty.png" },
  ];

  useEffect(() => {
    const fetchStreak = async () => {
      if (!token) return;

      try {
        const res = await axios.get("http://localhost:8000/api/progress/streak", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentStreak(res.data.currentStreak);
        setLongestStreak(res.data.longestStreak);
      } catch (err) {
        console.error("Error fetching streak:", err);
      }
    };

    fetchStreak();
  }, [token]);

  return (
    <div className="current-streak-container">
      <button className="back-btn" onClick={() => navigate(-1)}>⬅ Back</button>

      {/* Streak Info */}
      <div className="streak-info-box">
        <h2>Your Streak</h2>
        <p className="streak-count">{currentStreak} Days</p>
        <p className="longest-streak">Longest Streak: {longestStreak} Days</p>

        {/* Motivational Message */}
        <p className="streak-message">
          {(() => {
            const nextBadge = badges.find(badge => badge.day > currentStreak);
            if (nextBadge) {
              const daysLeft = nextBadge.day - currentStreak;
              return `Keep going! Only ${daysLeft} more day${daysLeft > 1 ? "s" : ""} to unlock your "${nextBadge.title}" badge!`;
            } else {
              return "You're a champion! Keep maintaining your streak!";
            }
          })()}
        </p>
      </div>

      {/* Badge Tier Box */}
      <div className="badges-box">
        <h2>Badge Tiers</h2>
        <div className="badges-grid">
          {badges.map((badge, idx) => {
            const unlocked = currentStreak >= badge.day;
            return (
              <div
                key={idx}
                className={`badge-item ${unlocked ? "unlocked" : "locked"}`}
              >
                <div className="badge-shield">
                  <img
                    src={badge.image}
                    alt={badge.title}
                    className="badge-image"
                  />
                </div>
                <div className="badge-info">
                  {unlocked
                    ? "Unlocked"
                    : `Unlocks at ${badge.day} day${badge.day > 1 ? "s" : ""}`}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leaderboard Box */}
      <div className="leaderboard-box">
        <h2>Streak Leaderboard</h2>
        <ul className="leaderboard-list">
          {leaderboard.map((user, index) => {
            const userBadge = [...badges]
              .reverse()
              .find(b => user.streak >= b.day);

            return (
              <li key={index} className="leaderboard-item">
                <span className="rank">#{index + 1}</span>

                <span className="username">
                  {user.username}{" "}
                  {userBadge && (
                    <img
                      src={userBadge.image}
                      alt={userBadge.title}
                      title={userBadge.title}
                      className="leaderboard-badge"
                    />
                  )}
                </span>

                <span className="streak">{user.streak} Days</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default CurrentStreak;
