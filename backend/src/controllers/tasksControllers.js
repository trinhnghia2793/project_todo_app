import Task from "../models/Task.js";

// R - Read all tasks
export const getAllTasks = async (req, res) => {
  const { filter = 'today'} = req.query;
  const now = new Date();
  let startDate;

  switch(filter) {
    case 'today': {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    }
    case 'week': {
      const mondayDate = now.getDate() - (now.getDay() - 1) - (now.getDay() === 0 ? 7 : 0);
      startDate = new Date(now.getFullYear(), now.getMonth(), mondayDate);
      break;
    }
    case 'month': {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    }
    case "all":
    default: {
      startDate = null;
    }
  }

  const query = startDate ? { createdAt: { $gte: startDate } } : { };


  try {
    const result = await Task.aggregate([
      // Mỗi ngoặc nhọn tương đương với 1 pipeline riêng
      {
        $match: query,
      },
      {
        // Mỗi facet là một nhánh, cho phép chúng ta chạy nhiều pipeline song song, sau đó gom kết quả lại cùng 1 lúc
        $facet: {
          tasks: [{ $sort: {createdAt: -1} }],
          activeCount: [{ $match: {status: "active"} }, { $count: "count" }],
          completeCount: [{ $match: {status: "complete"} }, { $count: "count" }],
        }
      }
    ]);

    const tasks = result[0].tasks;
    const activeCount = result[0].activeCount[0]?.count || 0;
    const completeCount = result[0].completeCount[0]?.count || 0;

    res.status(200).json({ tasks, activeCount, completeCount });
  } catch (error) {
    console.error("Lỗi khi gọi getAllTasks", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
}

// C - Create a task
export const createTask = async (req, res) => {
  try {
    const { title } = req.body;
    const task = new Task({ title });
    const newTask = await task.save();

    res.status(201).json(newTask);
  } catch (error) {
    console.error("Lỗi khi gọi createTask", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// U - Update a task
export const updateTask = async (req, res) => {
  try {
    const { title, status, completedAt } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id, // get id from request url
      {
        title,
        status,
        completedAt,
      }, // get from request body
      { new: true }, // return data after update: true
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task không tồn tại" });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Lỗi khi gọi updateTask", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// D - Delete a task
export const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ message: "Task không tồn tại" });
    }

    res.status(200).json(deletedTask);
  } catch (error) {
    console.error("Lỗi khi gọi deleteTask", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};