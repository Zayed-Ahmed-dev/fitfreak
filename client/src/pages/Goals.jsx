// pages/Goals.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./Goals.css";
import { useNavigate } from "react-router-dom";

export default function Goals() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false); // ✅ toggle form visibility
  const [form, setForm] = useState({
    type: "",
    targetWeight: "",
    pace: "",
    dailyCalories: "",
  });

  const goalTypeMap = {
    lose_weight: "Lose Weight",
    gain_weight: "Gain Weight",
    build_muscle: "Build Muscle",
    maintain: "Maintain",
    endurance: "Endurance",
  };

  const paceMap = {
    slow: "Slow",
    normal: "Normal",
    fast: "Fast",
  };

  useEffect(() => {
    async function fetchGoals() {
      try {
        const res = await axios.get("http://localhost:8000/api/goals", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGoals(res.data);
      } catch (err) {
        console.error("Error fetching goals:", err);
      }
    }
    fetchGoals();
  }, [token]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8000/api/goals",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const createdGoal = res.data;
      setGoals([...goals, createdGoal]);
      setForm({ type: "", targetWeight: "", pace: "", dailyCalories: "" });
      setShowForm(false); // ✅ hide form after creating goal

      try {
        await axios.post(
          "http://localhost:8000/api/plan",
          { goalId: createdGoal._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("✅ Plan successfully created for goal:", createdGoal._id);
      } catch (planError) {
        console.error("⚠️ Error creating plan automatically:", planError);
      }
    } catch (err) {
      console.error("Error creating goal:", err);
    }
  }

  async function handleDelete(id) {
    try {
      await axios.delete(`http://localhost:8000/api/goals/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGoals(goals.filter((g) => g._id !== id));
    } catch (err) {
      console.error("Error deleting goal:", err);
    }
  }

  return (
    <div className="goals-container">
      <h1 className="page-title">Your Goals</h1>

      {/* ✅ Empty state UI */}
      {goals.length === 0 && !showForm && (
        <div className="empty-state">
          <h2>No goals yet 🎯</h2>
          <p>Start your journey by creating your first goal.</p>
          <button className="primary-btn" onClick={() => setShowForm(true)}>
            + Create Goal
          </button>
        </div>
      )}

      {/* ✅ Toggleable Form */}
      {showForm && (
        <form className="goal-form" onSubmit={handleSubmit}>
          <select name="type" value={form.type} onChange={handleChange} required>
            <option value="">Select Goal Type</option>
            <option value="lose_weight">Lose Weight</option>
            <option value="gain_weight">Gain Weight</option>
            <option value="build_muscle">Build Muscle</option>
            <option value="maintain">Maintain</option>
            <option value="endurance">Endurance</option>
          </select>

          <input
            type="number"
            name="targetWeight"
            value={form.targetWeight}
            onChange={handleChange}
            placeholder="Target Weight (kg)"
            required
          />

          <select name="pace" value={form.pace} onChange={handleChange} required>
            <option value="">Select Pace</option>
            <option value="slow">Slow</option>
            <option value="normal">Normal</option>
            <option value="fast">Fast</option>
          </select>

          <input
            type="number"
            name="dailyCalories"
            value={form.dailyCalories}
            onChange={handleChange}
            placeholder="Daily Calories (optional)"
          />

          <div className="form-actions">
            <button type="submit">Create Goal</button>
            <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* ✅ Show Goals List */}
      {goals.length > 0 && (
        <div className="goals-list">
          {goals.map((goal) => (
            <div className="goal-card" key={goal._id}>
              <div className="goal-left">
                <h3 className="goal-type">{goalTypeMap[goal.type] || goal.type}</h3>
                <p><strong>Target Weight:</strong> {goal.targetWeight} kg</p>
                <p><strong>Pace:</strong> {paceMap[goal.pace] || goal.pace}</p>
                {goal.dailyCalories && <p><strong>Calories:</strong> {goal.dailyCalories}</p>}
                <button className="delete-btn" onClick={() => handleDelete(goal._id)}>Delete</button>
              </div>
              <div className="goal-right">
                <p>Your plan is ready</p>
                <button className="plan-btn" onClick={() => navigate("/plans")}>
                  View Plan
                </button>
              </div>
            </div>
          ))}

          {/* ✅ Add More Goal Button */}
          {!showForm && (
            <button className="add-goal-btn" onClick={() => setShowForm(true)}>
              + Add Goal
            </button>
          )}
        </div>
      )}
    </div>
  );
}
