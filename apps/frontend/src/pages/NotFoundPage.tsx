import { Link } from "react-router";

const NotFoundPage = () => {
  return (
    <div className="mt-20 text-center">
      <h2 className="mb-4 text-4xl font-bold text-gray-900">
        Page introuvable
      </h2>
      <p className="mb-8 text-gray-600">
        La page que vous recherchez n&apos;existe pas.
      </p>
      <Link
        to="/"
        className="inline-block rounded-md bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
};

export default NotFoundPage;
