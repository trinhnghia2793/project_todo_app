import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      requred: true,
      trim: true, // Delete spaces from start & end 
    },
    status: {
      type: String,
      enum: ["active", "complete"],
      default: "active",
    },
    completedAt: {
      type: Date,
      default: null,
    }
  },
  {
    timestamps: true, // createdAt & updatedAt tự động thêm vào
  }
);

const Task = mongoose.model("Task", taskSchema); // Từ taskSchema vừa định nghĩa, sinh ra một model tên "Task"

export default Task;