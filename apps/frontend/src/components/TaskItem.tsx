import { TaskState, UserRole } from "@workshop-graphql-rappa/graphql-schema";
import { Circle, Clock, CheckCircle2, Trash } from "lucide-react";
import { useState } from "react";
import { deleteTask, updateTask } from "../services/api";
import { extractErrorMessage } from "../utils/error";

type TaskItemProps = {
  userRole: UserRole;
  task: GetProjectQuery["project"]["tasks"][number];
  taskUpdated: () => void;
  taskDeleted: () => void;
};

export const TaskItem = ({
  userRole,
  task,
  taskUpdated,
  taskDeleted,
}: TaskItemProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const statusConfig = {
    TODO: {
      icon: Circle,
      color: "text-blue-500",
      bg: "bg-blue-50",
      text: "À faire",
    },
    IN_PROGRESS: {
      icon: Clock,
      color: "text-orange-500",
      bg: "bg-orange-50",
      text: "En cours",
    },
    DONE: {
      icon: CheckCircle2,
      color: "text-green-500",
      bg: "bg-green-50",
      text: "Terminé",
    },
  };

  const config = statusConfig[task.state];
  const StatusIcon = config.icon;

  const handleTaskStateChange = async (newState: TaskState) => {
    try {
      await updateTask({
        task: task.id,
        input: {
          state: newState,
        },
      });
      taskUpdated();
      setIsMenuOpen(false);
    } catch (e) {
      alert(`Impossible de changer la tâche ${extractErrorMessage(e)}`);
    }
  };

  const handleDeleteTask = async () => {
    try {
      await deleteTask({
        task: task.id,
      });
      taskDeleted();
    } catch (e) {
      alert(`Impossible de supprimer la tâche ${extractErrorMessage(e)}`);
    }
  };

  return (
    <div className="relative flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:shadow-sm">
      <div className="flex flex-col space-x-3">
        <div className="flex items-center space-x-3">
          <StatusIcon className={`h-5 w-5 ${config.color}`} />
          <span className="font-medium text-gray-900">{task.name}</span>
        </div>
        {userRole === "ADMIN" && (
          <button
            className={"pt-4"}
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteTask();
            }}
          >
            <Trash />
          </button>
        )}
      </div>
      <div className="relative">
        <button
          className={`rounded-full px-3 py-1 text-sm font-medium ${config.bg} ${config.color}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {config.text}
        </button>
        {isMenuOpen && (
          <div className="absolute right-0 z-10 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-md">
            {Object.entries(statusConfig).map(([stateKey, stateConfig]) => (
              <button
                key={stateKey}
                className={`flex w-full items-center px-4 py-2 text-left text-sm hover:bg-gray-100 ${
                  task.state === stateKey ? "bg-gray-100" : ""
                }`}
                onClick={() => handleTaskStateChange(stateKey as TaskState)}
              >
                <stateConfig.icon className={`h-5 w-5 ${stateConfig.color}`} />
                <span className="ml-2">{stateConfig.text}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
