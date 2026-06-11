const Task = require('../models/Task');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middleware/asyncHandler');

const getTasks = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 8, 1), 50);
  const skip = (page - 1) * limit;
  const { search, status } = req.query;

  const query = { userId: req.user._id };

  if (status && status !== 'All') {
    query.status = status;
  }

  if (search) {
    query.title = { $regex: search.trim(), $options: 'i' };
  }

  const [tasks, total, stats] = await Promise.all([
    Task.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Task.countDocuments(query),
    Task.aggregate([
      { $match: { userId: req.user._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
  ]);

  const completed = stats.find((item) => item._id === 'Completed')?.count || 0;
  const pending = stats.find((item) => item._id === 'Pending')?.count || 0;

  res.json({
    success: true,
    tasks,
    stats: {
      total: completed + pending,
      completed,
      pending,
    },
    pagination: {
      page,
      limit,
      total,
      pages: Math.max(Math.ceil(total / limit), 1),
    },
  });
});

const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
  if (!task) throw new AppError('Task not found', 404);
  res.json({ success: true, task });
});

const createTask = asyncHandler(async (req, res) => {
  const task = await Task.create({
    title: req.body.title,
    description: req.body.description,
    status: req.body.status || 'Pending',
    userId: req.user._id,
  });

  res.status(201).json({ success: true, task });
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
    },
    { new: true, runValidators: true }
  );

  if (!task) throw new AppError('Task not found', 404);
  res.json({ success: true, task });
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!task) throw new AppError('Task not found', 404);
  res.json({ success: true, message: 'Task deleted' });
});

const updateTaskStatus = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { status: req.body.status },
    { new: true, runValidators: true }
  );

  if (!task) throw new AppError('Task not found', 404);
  res.json({ success: true, task });
});

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
};
