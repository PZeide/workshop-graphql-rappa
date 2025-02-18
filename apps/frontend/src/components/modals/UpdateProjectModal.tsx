import { useState } from "react";
import { extractErrorMessage } from "../../utils/error";
import { updateProject } from "../../services/api";

type UpdateProjectModalProps = {
  projectId: string;
  defaultName: string;
  defaultDescription: string;
  shouldClose: () => void;
  projectUpdated: () => void;
};

const UpdateProjectModal = ({
  projectId,
  defaultName,
  defaultDescription,
  shouldClose,
  projectUpdated,
}: UpdateProjectModalProps) => {
  const [name, setName] = useState(defaultName);
  const [description, setDescription] = useState(defaultDescription);

  const [error, setError] = useState("");

  const handleUpdateProject = async () => {
    if (!name || !description) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    try {
      await updateProject({
        project: projectId,
        input: {
          name,
          description,
        },
      });

      setName("");
      setDescription("");
      setError("");

      shouldClose();
      projectUpdated();
    } catch (e) {
      setError(extractErrorMessage(e));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className="w-full max-w-lg rounded-lg bg-white p-6 shadow-md"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <h3 className="mb-4 text-lg font-semibold">Mettre à jour le projet</h3>
        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Nom du projet
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName((e.target as HTMLInputElement).value)}
            className="mt-1 w-full rounded-lg border px-3 py-2"
            placeholder="Nouveau nom du projet"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) =>
              setDescription((e.target as HTMLTextAreaElement).value)
            }
            className="mt-1 w-full rounded-lg border px-3 py-2"
            placeholder="Nouvelle description du projet"
          ></textarea>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => shouldClose()}
            className="rounded-lg bg-gray-300 px-4 py-2"
          >
            Annuler
          </button>
          <button
            onClick={handleUpdateProject}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-white"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateProjectModal;
