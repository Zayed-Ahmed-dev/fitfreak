const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const authMiddleware = require('../middleware/authMiddleware'); 

/* -------------------- GET ALL PROGRESS FOR USER -------------------- */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const progress = await Progress.find({ user: req.user.id }).populate('plan');
    res.json(progress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* -------------------- GET SINGLE PROGRESS ENTRY -------------------- */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const progress = await Progress.findById(req.params.id).populate('plan');
    if (!progress) return res.status(404).json({ message: 'Progress not found' });
    if (progress.user.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });

    res.json(progress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* -------------------- UPDATE PROGRESS (tick exercise/meal) -------------------- */
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { completedExercises, completedMeals, status } = req.body;

    const progress = await Progress.findById(req.params.id);
    if (!progress) return res.status(404).json({ message: 'Progress not found' });
    if (progress.user.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });

    // Update only what’s provided
    if (completedExercises) progress.completedExercises = completedExercises;
    if (completedMeals) progress.completedMeals = completedMeals;
    if (status) progress.status = status;

    await progress.save();
    res.json(progress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* -------------------- DELETE PROGRESS (optional) -------------------- */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const progress = await Progress.findById(req.params.id);
    if (!progress) return res.status(404).json({ message: 'Progress not found' });
    if (progress.user.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });

    await progress.remove();
    res.json({ message: 'Progress deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
