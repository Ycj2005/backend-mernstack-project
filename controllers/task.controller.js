import Task from "../models/task.model.js";

export async function taskCreated(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        status: 401,
        msg: "Unauthorized. Missing user reference token profile.",
      });
    }

    const userId = req.user.id;

    const { title, description, priority, date } = req.body;

    const taskCreation = Task.create({
      title,
      description,
      priority,
      status: "pending",
      userId,
      date,
    });

    res.json({
      status: 200,
      msg: "task created !",
      data: taskCreation,
    });
  } catch (error) {
    res.json({
      status: 500,
      msg: "Task not created !",
    });
  }
}

export async function taskListGet(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        status: 401,
        msg: "Unauthorized. Missing user reference token profile.",
      });
    }

    const authenticatedUserId = req.user.id;

    const tasklist = await Task.find({ userId: authenticatedUserId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      status: 200,
      msg: "Tasks fetched successfully",
      count: tasklist.length,
      data: tasklist,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      msg: "Internal server error while fetching tasks",
    });
  }
}

export async function taskDelete(req, res) {
  try {
    const id = req.params.id;
    const deleteres = await Task.findByIdAndDelete(id);

    return res.status(200).json({
      status: 200,
      msg: "Tasks deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      msg: "Internal server error while deleting tasks",
    });
  }
}
export async function taskUpdated(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        status: 401,
        msg: "Unauthorized. Missing user reference token profile.",
      });
    }

    const authenticatedUserId = req.user.id;

    const id = req.params.id;
    const { title, description, priority, date, status } = req.body;

    const resupdated = await Task.findByIdAndUpdate(id, {
      title,
      description,
      priority,
      date,
      status,
      userId: authenticatedUserId,
    });

    return res.status(200).json({
      status: 200,
      msg: "Tasks updated successfully",
      resupdated,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      msg: "Internal server error while updating tasks",
    });
  }
}

export async function taskParticular(req, res) {
  try {
    const id = req.params.id;
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        status: 401,
        msg: "Unauthorized. Missing user reference token profile.",
      });
    }

    const authenticatedUserId = req.user.id;

    let response = await Task.findOne({
      _id: id,
      userId: authenticatedUserId,
    });

    if (!response) {
      return res.status(404).json({
        status: 404,
        msg: "Task not found",
      });
    }

    res.json({
      status: 200,
      msg: "task created !",
      data: response,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      msg: "Internal server error while deleting tasks",
    });
  }
}

export async function taskfilterBypriority(req, res) {
  try {
    const { search, priority, status, sortBy, page = 1, limit = 5 } = req.query;

    if (!req.user || !req.user.id) {
      return res
        .status(400)
        .json({ success: false, message: "User ID missing from request" });
    }

    let queryFilter = { userId: req.user.id };

    if (search) {
      queryFilter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (priority) queryFilter.priority = priority;
    if (status) queryFilter.status = status;

    let sortOrder = {};
    if (sortBy === "priority") {
      sortOrder.priority = 1;
    } else if (sortBy === "status") {
      sortOrder.status = 1;
    } else {
      sortOrder.createdAt = -1;
    }

    const skipIndex = (parseInt(page) - 1) * parseInt(limit);

    // 4. Execute queries
    const [tasks, totalTasks] = await Promise.all([
      Task.find(queryFilter)
        .sort(sortOrder)
        .limit(parseInt(limit))
        .skip(skipIndex),
      Task.countDocuments(queryFilter),
    ]);

    return res.status(200).json({
      success: true,
      tasks,
      pagination: {
        total: totalTasks,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalTasks / parseInt(limit)) || 1,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("CRITICAL BACKEND ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
