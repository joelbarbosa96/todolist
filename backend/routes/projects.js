const router = require("express").Router();
const auth = require("../middleware/auth");
const Project = require("../models/Project");

// @route   POST /
// @desc    Create a project
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    const { title, tasks } = req.body;

    // Validation
    if (!title) {
      return res
        .status(400)
        .json({ msg: "Please enter all the required fields." });
    }

    const existingProject = await Project.findOne({ title: title });
    if (existingProject) {
      return res.status(400).json({ msg: "Project already exist." });
    }

    // Create Project
    const newProject = new Project({
      title,
      userId: req.user,
      tasks,
    });

    const savedProject = await newProject.save();
    res.json(savedProject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   GET /all
// @desc    Get all projects for current user
// @access  Private
router.get("/all", auth, async (req, res) => {
  const projects = await Project.find({ userId: req.user });
  res.json(projects);
});

// @route   DELETE /delete/:id
// @desc    Delete project for current user
// @access  Private
router.delete("/delete/:id", auth, async (req, res) => {
  //Validation
  const project = await Project.findOne({
    userId: req.user,
    _id: req.params.id,
  });
  if (!project) {
    return res.status(400).json({ msg: "Project not found." });
  }
  // Delete project
  const deletedProject = await Project.findByIdAndDelete(req.params.id);
  res.json(deletedProject);
});

// @route   PUT /edit/:id
// @desc    Edit project for current user
// @access  Private
router.put("/edit/:id", auth, async (req, res) => {
  //Validation
  const project = await Project.findOne({
    userId: req.user,
    _id: req.params.id,
  });
  if (!project) {
    return res.status(400).json({ msg: "Project not found." });
  }

  const editedProject = await Project.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
  });
  res.json(editedProject);
});

// @route   PUT /task/add/:id
// @desc    Add task to project
// @access  Private
router.put("/task/add/:id", auth, async (req, res) => {
  //Validation
  const project = await Project.findOne({
    userId: req.user,
    _id: req.params.id,
  });
  if (!project) {
    return res.status(400).json({ msg: "Project not found." });
  }

  const addedTask = await Project.findByIdAndUpdate(req.params.id, {
    $push: { tasks: { description: req.body.description } },
  });
  res.json(addedTask);
});

// @route   DELETE /task/delete/:id
// @desc    Delete task from project
// @access  Private
router.delete("/task/delete/:id", auth, async (req, res) => {
  //Validation
  const project = await Project.findOne({
    userId: req.user,
    _id: req.params.id,
  });
  if (!project) {
    return res.status(400).json({ msg: "Project not found." });
  }

  const addedTask = await Project.findByIdAndUpdate(req.params.id, {
    $pull: { tasks: { _id: req.body.id } },
  });
  res.json(addedTask);
});

/* // @route   PUT /task/edit/:id
// @desc    Edit task from project
// @access  Private
router.put("/task/edit/:id", auth, async (req, res) => {
  //Validation
  const project = await Project.findOne({
    userId: req.user,
    _id: req.params.id,
  });
  if (!project) {
    return res.status(400).json({ msg: "Project not found." });
  }

  const editedTask = await Project.findByIdAndUpdate(req.params.id, {
    $set: { tasks: { description: req.body.description } },
  });
  res.json(editedTask);
}); */

module.exports = router;
