import { Outlet } from "react-router-dom";
import Loader from "../../features/landing/components/Loader";
import {
  DashboardDataProvider,
  useDashboardData,
} from "../../features/dashboard/context/DashboardDataContext";

function PublicLayoutContent() {
  const { loading, initialized } = useDashboardData();

  if (!initialized) {
    return <Loader />;
  }

  return <Outlet />;
}

export default function PublicLayout() {
  return (
    <DashboardDataProvider>
      <PublicLayoutContent />
    </DashboardDataProvider>
  );
}