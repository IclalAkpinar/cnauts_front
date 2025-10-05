import { Navigate, Route, Routes } from "react-router-dom";
import WelcomePage from "../pages/WelcomePage";
import DashboardPage from "../pages/DashboardPage";
import PhysicalAnalyzePage from "../pages/PhysicalAnalyzePage";
import NotFoundPage from "../pages/NotFoundPage";
import { Layout } from "../layout/Layout";
import StressAnalyzePage from "../pages/StressAnalyzePage";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/welcome" replace />} />
        <Route path="welcome" element={<WelcomePage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="physicalAnalyze" element={<PhysicalAnalyzePage />} />
        <Route path="404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
        <Route path="stressAnalyze" element={<StressAnalyzePage />} />

      </Route>
    </Routes>
  );
};