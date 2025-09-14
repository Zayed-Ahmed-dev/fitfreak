import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Progress.css";

const Progress = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [calendar, setCalendar] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [coins, setCoins] = useState(0);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!token) return;

      try {
        // Fetch progress and streaks
        const res = await axios.get("http://localhost:8000/api/progress/calendar", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCalendar(res.data.calendar);
        setCurrentStreak(res.data.currentStreak);
        setLongestStreak(res.data.longestStreak);

        // Fetch coins from user profile
        const userRes = await axios.get("http://localhost:8000/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCoins(userRes.data.coins || 0);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProgress();
  }, [token]);

  const getColor = (completed) => (completed ? "#4caf50" : "#2a2a2a");

  // Group days by month
  const months = {};
  calendar.forEach((day) => {
    const date = new Date(day.date);
    const month = date.toLocaleString("default", { month: "short" });
    if (!months[month]) months[month] = [];
    months[month].push(day);
  });

  const year = new Date().getFullYear();

  return (
    <div className="progress-tracker-container">
      <div className="stats-container">
        {/* ✅ Made this box clickable to go to CurrentStreak.jsx */}
        <div
          className="streak-box clickable"
          onClick={() => navigate("/current-streak")}
        >
          <h3>Current Streak</h3>
          <p>{currentStreak} days</p>
          <h4>Longest Streak: {longestStreak} days</h4>
        </div>

        {/* Coin Wallet Box */}
        <div
          className="coins-box clickable"
          onClick={() => navigate("/coins")}
        >
          <h3>Coin Wallet</h3>
          <p>👜 {coins ? coins : "0"}</p>
        </div>
      </div>

      <div className="calendar-wrapper">
        <div className="year-label">{year}</div>
        <div className="months-container">
          {Object.keys(months).map((month) => {
            const days = months[month];
            const mid = Math.ceil(days.length / 2);
            const leftColumn = days.slice(0, mid);
            const rightColumn = days.slice(mid);

            return (
              <div key={month} className="month-block">
                <div className="month-label">{month}</div>
                <div className="month-days">
                  <div className="month-column">
                    {leftColumn.map((day, idx) => (
                      <div
                        key={idx}
                        className="day-cell"
                        style={{ backgroundColor: getColor(day.completed) }}
                        title={`${day.date} - ${day.completed ? "Completed" : "Not Completed"}`}
                      />
                    ))}
                  </div>
                  <div className="month-column">
                    {rightColumn.map((day, idx) => (
                      <div
                        key={idx}
                        className="day-cell"
                        style={{ backgroundColor: getColor(day.completed) }}
                        title={`${day.date} - ${day.completed ? "Completed" : "Not Completed"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Progress;
