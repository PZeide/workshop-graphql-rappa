import { Route, Routes } from "react-router";
import "./App.css";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import Protected from "./utils/Protected";
import Layout from "./components/Layout";
import ProjectListPage from "./pages/ProjectListPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProjectPage from "./pages/ProjectPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/"
        element={
          <Protected>
            <Layout>
              <ProjectListPage />
            </Layout>
          </Protected>
        }
      />
      <Route
        path="/projects/:projectId"
        element={
          <Protected>
            <Layout>
              <ProjectPage />
            </Layout>
          </Protected>
        }
      />
      <Route
        path="*"
        element={
          <Protected>
            <Layout>
              <NotFoundPage />
            </Layout>
          </Protected>
        }
      />
    </Routes>
  );
}

export default App;
