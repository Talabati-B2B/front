import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  ACCOUNT_STATUS,
  getAccountStatusForUser,
} from "../../services/accountApproval.mock";

function operationalPath(role) {
  return role === "store" ? "/store" : "/supplier-dashboard";
}

function pendingPath(role) {
  return role === "store" ? "/store/pending" : "/supplierpendingdashboard";
}

export default function AccountStatusGate({ role, children, pendingOnly = false }) {
  const { user } = useAuth();

  if (!user || user.role !== role || role === "admin") {
    return children;
  }

  const status = getAccountStatusForUser(user);

  if (status === ACCOUNT_STATUS.REJECTED) {
    return <Navigate to="/account-rejected" replace />;
  }

  if (status === ACCOUNT_STATUS.APPROVED) {
    return pendingOnly ? (
      <Navigate to={operationalPath(role)} replace />
    ) : (
      children
    );
  }

  if (
    status === ACCOUNT_STATUS.PENDING ||
    status === ACCOUNT_STATUS.NEEDS_CHANGES
  ) {
    return pendingOnly ? children : <Navigate to={pendingPath(role)} replace />;
  }

  return pendingOnly ? children : <Navigate to={pendingPath(role)} replace />;
}
