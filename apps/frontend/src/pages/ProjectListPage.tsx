import { useQuery, useSubscription } from "@apollo/client";
import { PlusCircle, Search, Filter } from "lucide-react";
import { useState } from "react";
import CreateProjectModal from "../components/modals/CreateProjectModal";
import {
  GET_PROJECTS,
  SUBSCRIBE_PROJECT_ADDED,
  SUBSCRIBE_PROJECT_DELETED,
  SUBSCRIBE_PROJECT_UPDATED,
} from "../services/documents";
import ProjectCard from "../components/ProjectCard";
import { Link } from "react-router";

const ProjectListPage = () => {
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState<string | undefined>(undefined);

  const { data, refetch } = useQuery(GET_PROJECTS, {
    variables: {
      filters: {
        offset,
        limit,
        search,
      },
    },
  });

  useSubscription(SUBSCRIBE_PROJECT_ADDED, { onData: () => refetch() });
  useSubscription(SUBSCRIBE_PROJECT_UPDATED, { onData: () => refetch() });
  useSubscription(SUBSCRIBE_PROJECT_DELETED, { onData: () => refetch() });

  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  return (
    <div>
      <div className="mb-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Projets</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
              className="inline-flex items-center rounded-lg bg-gray-200 px-4 py-2 text-gray-900 hover:bg-gray-300"
            >
              <Filter className="mr-2 h-5 w-5" />
              Filtres
            </button>
            <button
              onClick={() => setCreateModalVisible(true)}
              className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Nouveau Projet
            </button>
          </div>
        </div>
        {isFilterMenuOpen && (
          <div className="mb-4 rounded-lg border bg-white p-4 shadow-md">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-gray-700">Offset : {offset}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setOffset(Math.max(offset - 1, 0))}
                  className="rounded bg-gray-300 px-2 py-1 hover:bg-gray-400"
                >
                  -
                </button>
                <button
                  onClick={() => setOffset(offset + 1)}
                  className="rounded bg-gray-300 px-2 py-1 hover:bg-gray-400"
                >
                  `` +
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Limit : {limit}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setLimit(Math.max(limit - 1, 1))}
                  className="rounded bg-gray-300 px-2 py-1 hover:bg-gray-400"
                >
                  -
                </button>
                <button
                  onClick={() => setLimit(limit + 1)}
                  className="rounded bg-gray-300 px-2 py-1 hover:bg-gray-400"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un projet..."
            className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10"
            value={search}
            onChange={(e) => setSearch((e.target as HTMLInputElement).value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data &&
          data.projects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="block hover:no-underline"
            >
              <ProjectCard project={project} />
            </Link>
          ))}
      </div>

      {isCreateModalVisible && (
        <CreateProjectModal
          shouldClose={() => setCreateModalVisible(false)}
          projectCreated={refetch}
        />
      )}
    </div>
  );
};

export default ProjectListPage;
