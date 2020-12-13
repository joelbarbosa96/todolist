const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  title: { type: String, require: true, unique: true },
  userId: { type: String, require: true },
  tasks: [
    {
      description: { type: String, require: true },
      createdAt: { type: String, default: Date.now },
      isDone: { type: Boolean, default: false },
      doneDate: { type: String },
    },
  ],
});

module.exports = Project = mongoose.model("project", ProjectSchema);
