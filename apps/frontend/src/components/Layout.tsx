import { Link, useNavigate } from "react-router";
import { LogOut, Briefcase } from "lucide-react";
import { getAuthInfo, removeAuthToken } from "../services/token";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const authInfo = getAuthInfo();

  const handleLogout = () => {
    removeAuthToken();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2">
                <Briefcase className="h-6 w-6 text-indigo-600" />
                <span className="text-xl font-semibold text-gray-900">
                  ProjectHub
                </span>
              </Link>
              <nav className="hidden items-center space-x-6 md:flex">
                <Link
                  to="/"
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
                >
                  Projets
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {authInfo?.email}
                </p>
                <p className="text-xs text-gray-500">{authInfo?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-100"
              >
                <LogOut className="h-4 w-4" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
