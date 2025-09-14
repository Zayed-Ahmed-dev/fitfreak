import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; // ✅ Added for navigation
import "./Plan.css";

const Plan = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(null); // For modal open (contains day data + planId)

  const { token } = useAuth();
  const navigate = useNavigate(); // ✅ Hook for navigation

  const fetchPlans = async () => {
    if (!token) {
      console.error("No auth token found!");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get("http://localhost:8000/api/plan", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlans(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching plans:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const markItem = async (planId, day, type, itemId) => {
    if (!token) return;

    try {
      await axios.patch(
        `http://localhost:8000/api/plan/${planId}/daily/${day}/type/${type}/id/${itemId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedPlans = plans.map((plan) => {
        if (plan._id !== planId) return plan;

        return {
          ...plan,
          dailyPlans: plan.dailyPlans.map((d) => {
            if (d.day !== day) return d;

            if (type === "exercise") {
              return {
                ...d,
                exercises: d.exercises.map((ex) =>
                  ex._id === itemId ? { ...ex, done: true } : ex
                ),
              };
            } else {
              return {
                ...d,
                meals: d.meals.map((meal) =>
                  meal._id === itemId ? { ...meal, taken: true } : meal
                ),
              };
            }
          }),
        };
      });

      setPlans(updatedPlans);

      setActiveDay((prev) => {
        if (!prev) return prev;
        if (prev.planId !== planId || prev.day !== day) return prev;

        const updatedPlan = updatedPlans.find((p) => p._id === planId);
        if (!updatedPlan) return prev;
        const updatedDay = updatedPlan.dailyPlans.find((d) => d.day === day);
        return updatedDay ? { ...updatedDay, planId } : prev;
      });
    } catch (err) {
      console.error("Error marking item:", err);
    }
  };

  if (loading) return <div className="loading">Loading plans...</div>;
  if (!plans.length) return <div className="no-plans">No plans found</div>;

  return (
    <div className="plans-container">
      {/* ✅ Help Section */}
      <div className="help-section">
        <p>Having problems with your exercises?</p>
        <button className="help-btn" onClick={() => navigate("/help")}>
          Get Help
        </button>
      </div>

      {plans.map((plan) =>
        plan.dailyPlans.map((dayPlan) => {
          const totalItems =
            (dayPlan.exercises?.length || 0) + (dayPlan.meals?.length || 0);
          const completedItems =
            (dayPlan.exercises?.filter((ex) => ex.done).length || 0) +
            (dayPlan.meals?.filter((meal) => meal.taken).length || 0);
          const percentage = totalItems
            ? Math.round((completedItems / totalItems) * 100)
            : 100;

          return (
            <div key={`${plan._id}-${dayPlan.day}`} className="day-progress-card">
              <h2>Day {dayPlan.day}</h2>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <p className="progress-text">{percentage}% Completed</p>
              <button
                className="expand-btn"
                onClick={() => {
                  const latestPlan = plans.find((p) => p._id === plan._id);
                  const latestDay = latestPlan
                    ? latestPlan.dailyPlans.find((d) => d.day === dayPlan.day)
                    : dayPlan;
                  setActiveDay({ ...(latestDay || dayPlan), planId: plan._id });
                }}
              >
                View Details
              </button>
            </div>
          );
        })
      )}

      {activeDay && (
        <div className="modal-overlay" onClick={() => setActiveDay(null)}>
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-btn" onClick={() => setActiveDay(null)}>
              ✖
            </button>
            <h2>Day {activeDay.day}</h2>
            <p className="calories">Calories: {activeDay.calories}</p>

            <div className="section">
              <h3>Exercises</h3>
              {activeDay.exercises?.length ? (
                activeDay.exercises.map((ex) => (
                  <div key={ex._id} className="modal-item-row">
                    <span>
                      {ex.name} ({ex.sets}x{ex.reps})
                    </span>
                    <button
                      disabled={ex.done}
                      className={`mark-btn ${ex.done ? "done" : "pending"}`}
                      onClick={() =>
                        markItem(activeDay.planId, activeDay.day, "exercise", ex._id)
                      }
                    >
                      {ex.done ? "✅ Done" : "Mark Done"}
                    </button>
                  </div>
                ))
              ) : (
                <div className="recovery-day">🛌 Recovery Day</div>
              )}
            </div>

            <div className="section">
              <h3>Meals</h3>
              {activeDay.meals?.length ? (
                activeDay.meals.map((meal) => (
                  <div key={meal._id} className="modal-item-row">
                    <span>
                      {meal.name} ({meal.calories} cal)
                    </span>
                    <button
                      disabled={meal.taken}
                      className={`mark-btn ${meal.taken ? "done" : "pending"}`}
                      onClick={() =>
                        markItem(activeDay.planId, activeDay.day, "meal", meal._id)
                      }
                    >
                      {meal.taken ? "🍽 Taken" : "Mark Taken"}
                    </button>
                  </div>
                ))
              ) : (
                <div className="recovery-day">🛌 Recovery Day</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Plan;
