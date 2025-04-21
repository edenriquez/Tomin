import React from 'react';
import { AuthProvider, useAuth } from '../../lib/auth';

const DashboardContent = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <div><h2>Access Denied</h2><p>Please log in to view the dashboard.</p></div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to the dashboard!</p>
    </div>
  );
};

const Dashboard = () => (
  <AuthProvider>
    <DashboardContent />
  </AuthProvider>
);

export default Dashboard;