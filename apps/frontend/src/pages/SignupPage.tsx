import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router";
import { signup } from "../services/api";
import { extractErrorMessage } from "../utils/error";
import SignupFailedModal from "../components/modals/SignupFailedModal";

export const SignupPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isModalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleEmailChange = (e: ChangeEvent) => {
    setEmail((e.target as HTMLInputElement).value);
  };

  const handlePasswordChange = (e: ChangeEvent) => {
    setPassword((e.target as HTMLInputElement).value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setModalVisible(true);
      return;
    }

    try {
      await signup({
        email,
        password,
      });

      await navigate("/");
    } catch (e) {
      setModalMessage(extractErrorMessage(e));
      setModalVisible(true);
    }
  };

  return (
    <div className="mx-auto mt-48 max-w-md rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">
        Inscription
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleEmailChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Mot de passe
          </label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
        >
          S&apos;inscrire
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Déjà inscrit ?{" "}
        <Link
          to="/login"
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          Connectez-vous
        </Link>
      </p>

      {isModalVisible && (
        <SignupFailedModal
          message={modalMessage}
          shouldClose={() => setModalVisible(false)}
        />
      )}
    </div>
  );
};
