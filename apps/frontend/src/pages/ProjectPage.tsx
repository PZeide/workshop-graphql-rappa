import { useQuery, useSubscription } from "@apollo/client";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  GET_PROJECT,
  SUBSCRIBE_PROJECT_DELETED,
  SUBSCRIBE_PROJECT_UPDATED,
} from "../services/documents";
import {
  ArrowLeft,
  Calendar,
  CheckSquare,
  MessageSquare,
  Pen,
  PlusCircle,
  Trash,
} from "lucide-react";
import { getAuthInfo } from "../services/token";
import UpdateProjectModal from "../components/modals/UpdateProjectModal";
import { TaskItem } from "../components/TaskItem";
import { CommentList } from "../components/CommentList";
import { deleteProject } from "../services/api";
import { extractErrorMessage } from "../utils/error";
import CreateCommentModal from "../components/modals/CreateCommentModal";
import CreateTaskModal from "../components/modals/CreateTaskModal";
import { TaskState } from "@workshop-graphql-rappa/graphql-schema";

type FilterOptions = TaskState | "NO_FILTER";

const ProjectPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const authInfo = getAuthInfo();

  const [taskState, setTaskState] = useState<FilterOptions>("NO_FILTER");

  const { error, data, refetch } = useQuery(GET_PROJECT, {
    variables: {
      id: projectId ?? "",
      taskFilters: {
        state: taskState && taskState != "NO_FILTER" ? taskState : undefined,
      },
    },
  });

  useEffect(() => {
    if (error) {
      navigate("/");
    }
  }, [error]);

  useSubscription(SUBSCRIBE_PROJECT_UPDATED, {
    onData: (result) => {
      if (result.data.data?.projectUpdated.id == projectId) {
        refetch();
      }
    },
  });

  useSubscription(SUBSCRIBE_PROJECT_DELETED, {
    onData: (result) => {
      if (result.data.data?.projectDeleted == projectId) {
        navigate("/");
      }
    },
  });

  const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);
  const [isCreateTaskModalVisible, setCreateTaskModalVisible] = useState(false);
  const [isCreateCommentModalVisible, setCreateCommentModalVisible] =
    useState(false);

  const handleDeleteProject = async () => {
    try {
      await deleteProject({
        project: projectId ?? "",
      });

      navigate("/");
    } catch (e) {
      alert(`Impossible de changer la tâche ${extractErrorMessage(e)}`);
    }
  };

  const handleAddTask = () => {
    setCreateTaskModalVisible(true);
  };

  const handleAddComment = () => {
    setCreateCommentModalVisible(true);
  };

  if (!data || !authInfo) {
    return null;
  }

  const canUpdateOrDeleteProject =
    authInfo &&
    (authInfo.role == "ADMIN" || authInfo.id == data.project.owner.id);

  return (
    <div>
      <Link
        to="/"
        className="mb-6 inline-flex items-center text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour aux projets
      </Link>
      <div className="space-y-8">
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h2 className="mb-2 text-3xl font-bold text-gray-900">
                {data.project.name}
              </h2>
              <p className="text-gray-600">{data.project.description}</p>
            </div>
            <div className="flex flex-col items-center text-sm text-gray-500">
              <div className="flex flex-row">
                <Calendar className="mr-1 h-4 w-4" />
                <span>
                  Créer le{" "}
                  {new Date(data.project.createdAt).toLocaleDateString(
                    "fr-FR",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </span>
              </div>

              <div>
                {canUpdateOrDeleteProject && (
                  <div className="flex items-center space-x-8 pt-8 text-black">
                    <div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setUpdateModalVisible(true);
                        }}
                      >
                        <Pen />
                      </button>
                    </div>
                    <div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleDeleteProject();
                        }}
                      >
                        <Trash />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckSquare className="h-5 w-5 text-indigo-600" />
              <h3 className="text-xl font-semibold text-gray-900">Tâches</h3>
            </div>
            <div className="flex space-x-3">
              <select
                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700"
                value={taskState}
                onChange={(e) => {
                  setTaskState(e.target.value as FilterOptions);
                  refetch();
                }}
              >
                <option value="NO_FILTER">Filtres</option>
                <option value="TODO">À faire</option>
                <option value="IN_PROGRESS">En cours</option>
                <option value="DONE">Terminé</option>
              </select>

              <button
                onClick={handleAddTask}
                className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white transition-colors duration-200 hover:bg-indigo-700"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Ajouter une tâche
              </button>
            </div>
          </div>

          <ul className="space-y-3">
            {data.project.tasks.length > 0 ? (
              data.project.tasks.map((task) => (
                <li key={task.id}>
                  <TaskItem
                    task={task}
                    userRole={authInfo.role}
                    taskUpdated={refetch}
                    taskDeleted={refetch}
                  />
                </li>
              ))
            ) : (
              <p>Aucune tâche disponible.</p>
            )}
          </ul>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-indigo-600" />
              <h3 className="text-xl font-semibold text-gray-900">
                Commentaires
              </h3>
            </div>
            <button
              onClick={handleAddComment}
              className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white transition-colors duration-200 hover:bg-indigo-700"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter un commentaire
            </button>
          </div>

          {data.project.comments.length > 0 ? (
            <CommentList
              userRole={authInfo.role}
              comments={data.project.comments}
              commentDeleted={refetch}
            />
          ) : (
            <p>Aucun commentaire pour ce projet.</p>
          )}
        </div>
      </div>

      {isUpdateModalVisible && (
        <UpdateProjectModal
          projectId={data.project.id}
          defaultName={data.project.name}
          defaultDescription={data.project.description}
          shouldClose={() => setUpdateModalVisible(false)}
          projectUpdated={refetch}
        />
      )}

      {isCreateTaskModalVisible && (
        <CreateTaskModal
          projectId={data.project.id}
          shouldClose={() => setCreateTaskModalVisible(false)}
          taskCreated={refetch}
        />
      )}

      {isCreateCommentModalVisible && (
        <CreateCommentModal
          projectId={data.project.id}
          shouldClose={() => setCreateCommentModalVisible(false)}
          commentCreated={refetch}
        />
      )}
    </div>
  );
};

export default ProjectPage;
