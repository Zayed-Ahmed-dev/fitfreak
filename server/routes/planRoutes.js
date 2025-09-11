const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const Plan = require('../models/Plan');
const Goal = require('../models/Goal');
const authMiddleware = require('../middleware/authMiddleware');

/* -------------------- Load Exercises & Meals JSON -------------------- */
const exercises = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../data/excersies.json'))
);
const meals = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../data/meals.json'))
);

/* -------------------- Helper: pick random items -------------------- */
function pickRandom(arr, count = 2) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

/* -------------------- CREATE PLAN -------------------- */
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { goalId, weekNumber } = req.body;

        // Ensure goal exists & belongs to this user
        const goal = await Goal.findById(goalId);
        if (!goal) return res.status(404).json({ message: 'Goal not found' });

        // Convert req.user.id to string for comparison
        if (goal.user.toString() !== req.user.id.toString()) {
            console.log('goal.user:', goal.user.toString());
            console.log('req.user.id:', req.user.id.toString());
            return res
                .status(403)
                .json({ message: 'Not authorized to create plan for this goal' });
        }

        // Filter exercises & meals by goal + pace
        const filteredExercises = exercises.filter(
            (e) => e.tags.includes(goal.type) || e.tags.includes(goal.pace)
        );
        const filteredMeals = meals.filter(
            (m) => m.tags.includes(goal.type) || m.tags.includes(goal.pace)
        );

        // Build 7-day daily plan
        const dailyPlans = [];
        for (let day = 1; day <= 7; day++) {
            dailyPlans.push({
                day,
                calories: goal.dailyCalories || 2000, // fallback
                macros: goal.macros || { protein: 100, carbs: 200, fats: 70 },
                exercises: pickRandom(filteredExercises, 2), // 2 exercises/day
                meals: pickRandom(filteredMeals, 3), // 3 meals/day
            });
        }

        const plan = new Plan({
            user: req.user.id,
            goal: goalId,
            weekNumber: weekNumber || 1,
            dailyPlans,
        });

        await plan.save();
        res.status(201).json(plan);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

/* -------------------- GET ALL PLANS FOR USER -------------------- */
router.get('/', authMiddleware, async (req, res) => {
    try {
        const plans = await Plan.find({ user: req.user.id }).populate('goal');
        res.json(plans);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

/* -------------------- GET PLAN BY ID -------------------- */
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const plan = await Plan.findById(req.params.id).populate('goal');
        if (!plan) return res.status(404).json({ message: 'Plan not found' });

        // Convert req.user.id to string for comparison
        if (plan.user.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(plan);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

/* -------------------- UPDATE PLAN -------------------- */
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const plan = await Plan.findById(req.params.id);
        if (!plan) return res.status(404).json({ message: 'Plan not found' });

        if (plan.user.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        Object.assign(plan, req.body);
        await plan.save();

        res.json(plan);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

/* -------------------- DELETE PLAN -------------------- */
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const plan = await Plan.findById(req.params.id);
        if (!plan) return res.status(404).json({ message: 'Plan not found' });

        if (plan.user.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await plan.remove();
        res.json({ message: 'Plan deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
