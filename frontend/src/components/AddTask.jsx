import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";

const AddTask = ({ handleNewTaskAdded }) => {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const addTask = async () => {
    if(newTaskTitle.trim()) {
      try {
        await api.post("/tasks", { title: newTaskTitle });
        toast.success(`Nhiệm vụ ${newTaskTitle} đã được thêm vào`);
        handleNewTaskAdded();
      } catch (error) {
        console.error("Lỗi xảy ra khi thêm task", error);
        toast.error("Có lỗi xảy ra khi thêm mới task")
      }
      setNewTaskTitle("");
    } else {
      toast.error("Bạn cần nhập nội dung task");
    }
  };

  const handleKeyPress = (event) => {
    if(event.key === 'Enter') {
      addTask();
    }
  }

  return (
    <Card className="p-6 border-0 bg-gradient-card shadow-custom-lg">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          type="text"
          placeholder="What to do now?"
          className="h-12 text-base bg-slate-50 sm:flex-1 border-border/50 focus:border-primary-50 focus:ring-primary/20"
          value={newTaskTitle}
          onChange={(event) => setNewTaskTitle(event.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button
          variant="gradient"
          size="xl"
          className="px-6"
          onClick={addTask}
          disabled={!newTaskTitle}
        >
          <Plus className="size-5" />
          Thêm
        </Button>
      </div>
    </Card>
  );

}

export default AddTask

