const express = require('express');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
} = require('../controllers/taskController');
const protect = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

const router = express.Router();

const taskRules = [
  { field: 'title', label: 'Title', required: true, min: 2, max: 120 },
  { field: 'description', label: 'Description', max: 1000 },
  { field: 'status', label: 'Status', enum: ['Pending', 'Completed'] },
];

router.use(protect);
router.route('/').get(getTasks).post(validate(taskRules), createTask);
router.route('/:id').get(getTask).put(validate(taskRules), updateTask).delete(deleteTask);
router.patch('/:id/status', validate([
  { field: 'status', label: 'Status', required: true, enum: ['Pending', 'Completed'] },
]), updateTaskStatus);

module.exports = router;
