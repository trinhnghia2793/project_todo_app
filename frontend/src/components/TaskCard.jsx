import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Calendar, CheckCircle2, Circle, SquarePen, Trash2 } from "lucide-react";
import { Input } from "./ui/input";
import api from "@/lib/axios";
import { toast } from "sonner";
import { useState } from "react";

const TaskCard = ({ task, index, handleTaskChanged }) => {

  const [isEditing, setIsEditing] = useState(false);
  const [udpateTaskTitle, setUpdateTaskTitle] = useState(task.title || "");

  // 
  const deleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      toast.success("Đã xóa task");
      handleTaskChanged();
    } catch (error) {
      console.error("Lỗi xảy ra khi xóa task", error);
      toast.error("Có lỗi xảy ra khi xóa task")
    }
  }

  // 
  const updateTask = async () => {
    try {
      setIsEditing(false);
      await api.put(`/tasks/${task._id}`, {
        title: udpateTaskTitle,
      });
      toast.success(`Nhiệm vụ đã đổi thành ${udpateTaskTitle}`);
      handleTaskChanged();
    } catch (error) {
      console.error("Lỗi xảy ra khi cập nhật task", error);
      toast.error("Có lỗi xảy ra khi cập nhật task")
    }
  }

  // mark task as completed
  const toggleTaskCompleteButton = async () => {
    try {
      if(task.status === "active") {
        await api.put(`/tasks/${task._id}`, {
          status: "complete",
          completedAt: new Date().toISOString(), // Lưu với giờ quốc tế
        });
        toast.success(`${task.title} đã hoàn thành`);
      } else {
        await api.put(`/tasks/${task._id}`, {
          status: "active",
          completedAt: null,
        });
        toast.success(`${task.title} đã đổi sang chưa hoàn thành`);
      }
      handleTaskChanged();
    } catch (error) {
      console.error("Lỗi xảy ra khi cập nhật task", error);
      toast.error("Có lỗi xảy ra khi cập nhật task")
    }
  }


  //
  const handleKeyPress = (event) => {
    if(event.key === 'Enter') {
      updateTask();
    }
  }

  return (
    <Card
      className={cn(
        "p-4 bg-gradient-card border-0 shadow-custom-md hover:shadow-custom-lg transition-all duration-200 animate-fade-in group",
        task.status === 'complete' && 'opacity-75'
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex item-center gap-4">

        {/* Nút tròn */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "shrink-0 size-8 rounded-full transition-all duration-200",
            task.status === "complete"
              ? "text-success hover:text-success/80"
              : "text-muted-foreground hover:text-primary"            
          )}
          onClick={toggleTaskCompleteButton}
        >
          { task.status === 'complete' ? (
            <CheckCircle2 className="size-5" />
          ) : (
            <Circle className="size-5" />
          )}
        </Button>

        {/* Hiển thị / chỉnh sửa tiêu đề */}
        <div className="flex-1 min-w-0">
          { isEditing ? (
            <Input 
              placeholder="Cần phải làm gì?"
              className="flex-1 h-12 text-base border-border/50 focus:border-primary/50 focus:ring-primary/20"
              type="text"
              value={udpateTaskTitle}
              onChange={(e) => setUpdateTaskTitle(e.target.value)}
              onKeyPress={handleKeyPress}
              onBlur={() => { // Khi người dùng bấm ra ngoài phạm vi của ô nhập
                setIsEditing(false);
                setUpdateTaskTitle(task.title || '');
              }}
            />
          ) : (
            <p
              className={cn(
                "text-base transition-all duration-200",
                task.status === "complete"
                  ? "line-through text-muted-foreground"
                  : "text-foreground"
              )}
            >
              {task.title}
            </p>
          ) }

          {/* Thời gian tạo / Thời gian hoàn thành */}
          <div className="flex item-center gap-1.5 mt-1">
            <Calendar className="size-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              { new Date(task.createdAt).toLocaleString() }
            </span>

            { task.completedAt && (
              <>
                <span className="text-xs text-muted-foreground"> - </span>
                <Calendar className="size-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  { new Date(task.completedAt).toLocaleString() }
                </span>
              </>
            )}
          </div>
        </div>

        {/* Edit & Create button */}
        <div className="hidden gap-2 group-hover:inline-flex animate-slide-up">
          {/* Edit */}
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 transition-colors size-8 text-muted-foreground hover:text-info"
            onClick={() => {
              setIsEditing(true);
              setUpdateTaskTitle(task.title || "");
            }}
          >
            <SquarePen className="size-4" />
          </Button>

          {/* Delete */}
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 transition-colors size-8 text-muted-foreground hover:text-destructive"
            onClick={() => deleteTask(task._id)}
          >
            <Trash2 className="size-4" />
          </Button>

        </div>

      </div>
    </Card>
  )
}

export default TaskCard