// import React from "react";
import Header from "@/components/Header";
import AddTask from "@/components/AddTask";
import StatsAndFilters from "@/components/StatsAndFilters";
import TaskList from "@/components/TaskList";
import TaskListPagination from "@/components/TaskListPagination";
import DateTimeFilter from "@/components/DateTimeFilter";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { visibleTaskLimit } from "@/lib/data";

const HomePage = () => {
  const [taskBuffer, setTaskBuffer] = useState([]);
  const [activeTaskCount, setActiveTaskCount]  = useState(0);
  const [completeTaskCount, setCompleteTaskCount] = useState(0);
  const [filter, setFilter] = useState("all");
  const [dateQuery, setDateQuery] = useState("all");
  const [page, setPage] = useState(1);
  
  useEffect(() => {
    fetchTasks();
  }, [dateQuery]);

  useEffect(() => {
    setPage(1);
  }, [filter, dateQuery]);

  // logic
  const fetchTasks = async () => {
    try {
      const res = await api.get(`/tasks?filter=${dateQuery}`);
      
      setTaskBuffer(res.data.tasks);
      setActiveTaskCount(res.data.activeCount);
      setCompleteTaskCount(res.data.completeCount);
    } catch (error) {
      console.error("Lỗi xảy ra khi truy xuất tasks:", error);
      toast.error("Lỗi xảy ra khi truy xuất tasks");
    }
  };

  // task change handler (create, update, delete)
  const handleTaskChanged = () => {
    fetchTasks();
  };

  // pagination chage handler
  const handleNextPage = () => {
    if(page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };
  const handlePrevPage = () => {
    if(page > 1) {
      setPage((prev) => prev - 1);
    }
  }
  const handlePageChange = (newPage) => {
    setPage(newPage);
  }

  // biến
  const filteredTasks = taskBuffer.filter((task) => {
    switch(filter) {
      case "active": 
        return task.status === "active";
      case "completed":
        return task.status === "complete";
      default:
        return true;
    }
  });

  // pagination
  const visibleTasks = filteredTasks.slice(
    (page - 1) * visibleTaskLimit,
    page * visibleTaskLimit
  );
  if(visibleTasks.length === 0) {
    handlePrevPage();
  }
  const totalPages = Math.ceil(filteredTasks.length / visibleTaskLimit);

  return (
    <div className="min-h-screen w-full relative">
      {/* Minty Cloud Drift Gradient */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `linear-gradient(120deg, #C8E6C9 0%, #DCEDC8 20%, #F1F8E9 40%, #FFFDE7 60%, #FFF9C4 80%, #F0F4C3 100%)`,
        }}
      />

      {/* Content Here */}
      <div className="container mt-8 mx-auto relative z-10">
        <div className="w-full max-w-2xl p-6 mx-auto space-y-6">

          {/* Header */}
          <Header />

          {/* Add task */}
          <AddTask 
            handleNewTaskAdded={handleTaskChanged} 
          />

          {/* Stats & Filters */}
          <StatsAndFilters
            filter={filter}
            setFilter={setFilter}
            activeTaskCount={activeTaskCount}
            completedTasksCount={completeTaskCount}
          />

          {/* Task list */}
          <TaskList
            filteredTasks={visibleTasks}
            filter={filter}
            handleTaskChanged={handleTaskChanged}
          />

          {/* Pagination & filter by date */}
          <div className="flex flex-col item-center justify-between gap-6 sm:flex-row">
            <TaskListPagination
              page={page}
              totalPages={totalPages}
              handleNextPage={handleNextPage}
              handlePrevPage={handlePrevPage}
              handlePageChange={handlePageChange}
            />
            <DateTimeFilter 
              dateQuery={dateQuery}
              setDateQuery={setDateQuery}
            />
          </div>

          {/* Footer */}
          <Footer
            activeTasksCount={activeTaskCount}
            completedTasksCount={completeTaskCount}
          />

        </div>
      </div>
    </div>
  );
};

export default HomePage;

