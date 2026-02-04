// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Card, Badge } from '../components/ui';
// import { api } from '../services/api';
// import './Dashboard.css';

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchStats();
//   }, []);

//   const fetchStats = async () => {
//     try {
//       const response = await api.getDashboardStats();
//       setStats(response.data);
//     } catch (error) {
//       console.error('Error fetching stats:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <div className="loading-page">Loading dashboard...</div>;

//   return (
//   <div className="complaints-page fade-in">  
//     <div className="dashboard-page">
//       <div className="dashboard-header">
//         <h1>Dashboard</h1>
//         <p>Overview of civic complaints and resolutions</p>
//       </div>
//   </div>

//       <div className="stats-grid">
//         <Card hover>
//           <div className="stat-card">
//             <div className="stat-icon total">📊</div>
//             <div className="stat-content">
//               <div className="stat-value">{stats?.totalComplaints || 0}</div>
//               <div className="stat-label">Total Complaints</div>
//             </div>
//           </div>
//         </Card>

//         <Card hover>
//           <div className="stat-card">
//             <div className="stat-icon pending">⏳</div>
//             <div className="stat-content">
//               <div className="stat-value">{stats?.pending || 0}</div>
//               <div className="stat-label">Pending</div>
//             </div>
//           </div>
//         </Card>

//         <Card hover>
//           <div className="stat-card">
//             <div className="stat-icon progress">🔄</div>
//             <div className="stat-content">
//               <div className="stat-value">{stats?.inProgress || 0}</div>
//               <div className="stat-label">In Progress</div>
//             </div>
//           </div>
//         </Card>

//         <Card hover>
//           <div className="stat-card">
//             <div className="stat-icon resolved">✅</div>
//             <div className="stat-content">
//               <div className="stat-value">{stats?.resolved || 0}</div>
//               <div className="stat-label">Resolved</div>
//             </div>
//           </div>
//         </Card>
//       </div>

//       <div className="dashboard-grid">
//         <Card>
//           <h2>Statistics Summary</h2>
//           <div className="summary-list">
//             <div className="summary-item">
//               <span className="summary-label">Total Users</span>
//               <Badge variant="primary">{stats?.totalUsers || 0}</Badge>
//             </div>
//             <div className="summary-item">
//               <span className="summary-label">Resolution Rate</span>
//               <Badge variant="success">
//                 {stats?.totalComplaints 
//                   ? Math.round((stats.resolved / stats.totalComplaints) * 100) 
//                   : 0}%
//               </Badge>
//             </div>
//             <div className="summary-item">
//               <span className="summary-label">Active Issues</span>
//               <Badge variant="warning">
//                 {(stats?.pending || 0) + (stats?.inProgress || 0)}
//               </Badge>
//             </div>
//           </div>
//         </Card>

//         <Card>
//           <h2>Quick Actions</h2>
//           <div className="quick-actions">
//             <button 
//               className="action-btn"
//               onClick={() => navigate('/submit')}
//             >
//               <span className="action-icon">➕</span>
//               <span>Report New Issue</span>
//             </button>
//             <button 
//               className="action-btn"
//               onClick={() => navigate('/')}
//             >
//               <span className="action-icon">📋</span>
//               <span>View All Complaints</span>
//             </button>
//             <button 
//               className="action-btn"
//               onClick={() => navigate('/leaderboard')}
//             >
//               <span className="action-icon">🏆</span>
//               <span>View Leaderboard</span>
//             </button>
//           </div>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;














import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Badge } from '../components/ui';
import { api } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔢 Animated counters state
  const [animatedStats, setAnimatedStats] = useState({
    totalComplaints: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0
  });

  // Fetch stats once
  useEffect(() => {
    fetchStats();
  }, []);

  // Animate when stats change
  useEffect(() => {
    if (!stats) return;

    const duration = 1000; // ms
    const steps = 50;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;

      setAnimatedStats({
        totalComplaints: Math.floor(stats.totalComplaints * progress),
        pending: Math.floor(stats.pending * progress),
        inProgress: Math.floor(stats.inProgress * progress),
        resolved: Math.floor(stats.resolved * progress)
      });

      if (step >= steps) {
        clearInterval(timer);
        setAnimatedStats({
          totalComplaints: stats.totalComplaints,
          pending: stats.pending,
          inProgress: stats.inProgress,
          resolved: stats.resolved
        });
      }
    }, interval);

    return () => clearInterval(timer);
  }, [stats]);

  const fetchStats = async () => {
    try {
      const response = await api.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-page">Loading dashboard...</div>;
  }

  return (
    <div className="complaints-page fade-in">
      <div className="dashboard-page">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Overview of civic complaints and resolutions</p>
        </div>

        {/* STATS GRID */}
        <div className="stats-grid">
          <Card hover>
            <div className="stat-card">
              <div className="stat-icon total">📊</div>
              <div className="stat-content">
                <div className="stat-value">{animatedStats.totalComplaints}</div>
                <div className="stat-label">Total Complaints</div>
              </div>
            </div>
          </Card>

          <Card hover>
            <div className="stat-card">
              <div className="stat-icon pending">⏳</div>
              <div className="stat-content">
                <div className="stat-value">{animatedStats.pending}</div>
                <div className="stat-label">Pending</div>
              </div>
            </div>
          </Card>

          <Card hover>
            <div className="stat-card">
              <div className="stat-icon progress">🔄</div>
              <div className="stat-content">
                <div className="stat-value">{animatedStats.inProgress}</div>
                <div className="stat-label">In Progress</div>
              </div>
            </div>
          </Card>

          <Card hover>
            <div className="stat-card">
              <div className="stat-icon resolved">✅</div>
              <div className="stat-content">
                <div className="stat-value">{animatedStats.resolved}</div>
                <div className="stat-label">Resolved</div>
              </div>
            </div>
          </Card>
        </div>

        {/* DASHBOARD GRID */}
        <div className="dashboard-grid">
          <Card>
            <h2>Statistics Summary</h2>
            <div className="summary-list">
              <div className="summary-item">
                <span className="summary-label">Total Users</span>
                <Badge variant="primary">{stats?.totalUsers || 0}</Badge>
              </div>

              <div className="summary-item">
                <span className="summary-label">Resolution Rate</span>
                <Badge variant="success">
                  {stats?.totalComplaints
                    ? Math.round((stats.resolved / stats.totalComplaints) * 100)
                    : 0}
                  %
                </Badge>
              </div>

              <div className="summary-item">
                <span className="summary-label">Active Issues</span>
                <Badge variant="warning">
                  {(stats?.pending || 0) + (stats?.inProgress || 0)}
                </Badge>
              </div>
            </div>
          </Card>

          <Card>
            <h2>Quick Actions</h2>
            <div className="quick-actions">
              <button className="action-btn" onClick={() => navigate('/submit')}>
                <span className="action-icon">➕</span>
                <span>Report New Issue</span>
              </button>

              <button className="action-btn" onClick={() => navigate('/')}>
                <span className="action-icon">📋</span>
                <span>View All Complaints</span>
              </button>

              <button
                className="action-btn"
                onClick={() => navigate('/leaderboard')}
              >
                <span className="action-icon">🏆</span>
                <span>View Leaderboard</span>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
