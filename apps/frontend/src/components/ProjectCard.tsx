import { Folder, ChevronRight, Clock } from "lucide-react";
import { GetProjectsQuery } from "@workshop-graphql-rappa/graphql-schema/src/client/graphql";

const getRelativeTime = (dateInput: string | Date) => {
  const now = new Date();
  const updatedDate = new Date(dateInput);
  const diffInMs = now.getTime() - updatedDate.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return "Mis à jour aujourd'hui";
  } else if (diffInDays === 1) {
    return "Mis à jour hier";
  } else {
    return `Mis à jour il y a ${diffInDays} jours`;
  }
};

interface ProjectCardProps {
  project: GetProjectsQuery["projects"][number];
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <div className="group rounded-lg border border-gray-200 bg-white p-6 transition-all duration-200 hover:shadow-lg">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="rounded-lg bg-indigo-50 p-2 transition-colors duration-200 group-hover:bg-indigo-100">
            <Folder className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            {project.name}
          </h3>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400 transition-colors duration-200 group-hover:text-indigo-600" />
      </div>
      <p className="mb-4 text-gray-600">{project.description}</p>
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center">
          <Clock className="mr-1 h-4 w-4" />
          <span>{getRelativeTime(project.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
