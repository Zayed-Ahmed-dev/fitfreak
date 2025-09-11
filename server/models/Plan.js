// models/Plan.js
const mongoose = require('mongoose');

const planSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    goal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Goal',
      required: true,
    },
    weekNumber: {
      type: Number, // useful if you want to track week-wise separately
      default: 1,
    },
    dailyPlans: [
      {
        day: { type: Number }, // 1,2,3,...7
        calories: { type: Number },
        macros: {
          protein: Number,
          carbs: Number,
          fats: Number,
        },
        exercises: [
          {
            name: String,
            sets: Number,
            reps: Number,
            durationMinutes: Number,
          },
        ],
        meals: [
          {
            name: String,
            calories: Number,
            protein: Number,
            carbs: Number,
            fats: Number,
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Plan', planSchema);
