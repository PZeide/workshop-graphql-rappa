import { useState } from "react";
import { extractErrorMessage } from "../../utils/error";
import { createTask } from "../../services/api";

type CreateTaskModalProps = {
  projectId: string;
  shouldClose: () => void;
  taskCreated: () => void;
};

const CreateTaskModal = ({
  projectId,
  shouldClose,
  taskCreated,
}: CreateTaskModalProps) => {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  const handleNewTask = async () => {
    if (!title) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    try {
      await createTask({
        project: projectId,
        input: {
          name: title,
        },
      });

      setTitle("");
      setError("");

      shouldClose();
      taskCreated();
    } catch (e) {
      setError(extractErrorMessage(e));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-md">
        <h3 className="mb-4 text-lg font-semibold">Créer une nouvelle Tâche</h3>
        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Nom de la tâche
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle((e.target as HTMLInputElement).value)}
            className="mt-1 w-full rounded-lg border px-3 py-2"
            placeholder="Nom de la Tâche"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => shouldClose()}
            className="rounded-lg bg-gray-300 px-4 py-2"
          >
            Annuler
          </button>
          <button
            onClick={handleNewTask}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-white"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;
