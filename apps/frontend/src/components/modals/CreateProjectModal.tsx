import { useState } from "react";
import { createProject } from "../../services/api";
import { extractErrorMessage } from "../../utils/error";

type CreateProjectModalProps = {
  shouldClose: () => void;
  projectCreated: () => void;
};

const CreateProjectModal = ({
  shouldClose,
  projectCreated,
}: CreateProjectModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [error, setError] = useState("");

  const handleNewProject = async () => {
    if (!name || !description) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    try {
      await createProject({
        input: {
          name,
          description,
        },
      });

      setName("");
      setDescription("");
      setError("");

      shouldClose();
      projectCreated();
    } catch (e) {
      setError(extractErrorMessage(e));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-md">
        <h3 className="mb-4 text-lg font-semibold">Créer un Nouveau Projet</h3>
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
            placeholder="Nom du projet"
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
            placeholder="Description du projet"
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
            onClick={handleNewProject}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-white"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;
