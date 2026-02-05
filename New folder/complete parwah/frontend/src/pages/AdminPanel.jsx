import React, { useState, useEffect, useMemo } from 'react';
import { Card, Badge, Button } from '../components/ui';
import { api } from '../services/api';
import './AdminPanel.css';

const AdminPanel = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await api.getAllComplaints();
      setComplaints(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // const updateStatus = (id, newStatus) => {
  //   // Mock update - will connect to API later
  //   console.log('Update status:', id, newStatus);
  //   setComplaints(complaints.map(c => 
  //     c.id === id ? { ...c, status: newStatus } : c
  //   ));
  // };

  // const updatePriority = (id, newPriority) => {
  //   console.log('Update priority:', id, newPriority);
  //   setComplaints(complaints.map(c => 
  //     c.id === id ? { ...c, priority: newPriority } : c
  //   ));
  // };
  const updateStatus = async (id, newStatus) => {
    try {
      const response = await api.updateComplaint(id, { status: newStatus });
      if (response.success) {
        setComplaints(complaints.map(c =>
          c.id === id ? { ...c, status: newStatus } : c
        ));
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const updatePriority = async (id, newPriority) => {
    try {
      const response = await api.updateComplaint(id, { priority: newPriority });
      if (response.success) {
        setComplaints(complaints.map(c =>
          c.id === id ? { ...c, priority: newPriority } : c
        ));
      } else {
        alert('Failed to update priority');
      }
    } catch (error) {
      console.error('Error updating priority:', error);
      alert('Failed to update priority');
    }
  };

  const statusCounts = useMemo(() => {
    return complaints.reduce((acc, complaint) => {
      const status = complaint.status || 'pending';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
  }, [complaints]);

  const priorityCounts = useMemo(() => {
    return complaints.reduce((acc, complaint) => {
      const priority = complaint.priority || 'medium';
      acc[priority] = (acc[priority] || 0) + 1;
      return acc;
    }, {});
  }, [complaints]);

  const departmentStats = useMemo(() => {
    const map = new Map();
    complaints.forEach((complaint) => {
      const department = complaint.department?.name || 'Unassigned';
      if (!map.has(department)) {
        map.set(department, { department, total: 0, resolved: 0, escalated: 0 });
      }
      const record = map.get(department);
      record.total += 1;
      if (complaint.status === 'resolved') record.resolved += 1;
      if (complaint.status === 'escalated') record.escalated += 1;
    });
    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, [complaints]);

  const categoryHighlights = useMemo(() => {
    const map = new Map();
    complaints.forEach((complaint) => {
      const category = complaint.category?.name || 'General';
      if (!map.has(category)) {
        map.set(category, { category, total: 0, critical: 0 });
      }
      const record = map.get(category);
      record.total += 1;
      if (['high', 'critical'].includes(complaint.priority)) record.critical += 1;
    });
    return Array.from(map.values()).sort((a, b) => b.total - a.total).slice(0, 4);
  }, [complaints]);

  const totalComplaints = complaints.length;
  const resolvedComplaints = statusCounts.resolved || 0;
  const pendingComplaints = statusCounts.pending || 0;
  const inProgressComplaints = statusCounts.in_progress || 0;
  const escalatedComplaints = statusCounts.escalated || 0;

  const resolutionRate = totalComplaints
    ? Math.round((resolvedComplaints / totalComplaints) * 100)
    : 0;

  const statusGraph = [
    { key: 'pending', label: 'Pending' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'resolved', label: 'Resolved' },
    { key: 'rejected', label: 'Rejected' },
    { key: 'escalated', label: 'Escalated' }
  ];

  if (loading) return <div className="loading-page">Loading...</div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>🛠️ Admin Panel</h1>
        <p>Manage complaints, track departmental performance, and oversee live operations.</p>
      </div>

      <div className="admin-insights">
        <Card>
          <div className="insight-card">
            <p>Total Complaints</p>
            <strong>{totalComplaints}</strong>
            <span>{pendingComplaints} pending • {inProgressComplaints} in progress</span>
          </div>
        </Card>
        <Card>
          <div className="insight-card">
            <p>Resolution Rate</p>
            <strong>{resolutionRate}%</strong>
            <span>{resolvedComplaints} resolved</span>
          </div>
        </Card>
        <Card>
          <div className="insight-card">
            <p>Escalations</p>
            <strong>{escalatedComplaints}</strong>
            <span>Requires senior intervention</span>
          </div>
        </Card>
        <Card>
          <div className="insight-card">
            <p>Priority Watch</p>
            <strong>{(priorityCounts.high || 0) + (priorityCounts.critical || 0)}</strong>
            <span>High/Critical reports</span>
          </div>
        </Card>
      </div>

      <div className="admin-analytics-grid">
        <Card>
          <h2>Departmental Report</h2>
          <div className="department-list">
            {departmentStats.length === 0 && <p>No departmental data yet.</p>}
            {departmentStats.slice(0, 6).map((department) => (
              <div key={department.department} className="department-row">
                <div>
                  <strong>{department.department}</strong>
                  <span>{department.total} reports</span>
                </div>
                <div className="department-metrics">
                  <Badge variant="success">{department.resolved} resolved</Badge>
                  <Badge variant="warning">{department.escalated} escalated</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2>Statistic Graph</h2>
          <div className="status-graph">
            {statusGraph.map((status) => {
              const count = statusCounts[status.key] || 0;
              const percent = totalComplaints ? Math.round((count / totalComplaints) * 100) : 0;
              return (
                <div key={status.key} className="status-row">
                  <div className="status-row-header">
                    <span>{status.label}</span>
                    <span>{count} ({percent}%)</span>
                  </div>
                  <div className="status-bar">
                    <div className="status-bar-fill" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <h2>Category Hotspots</h2>
          <div className="category-grid">
            {categoryHighlights.length === 0 && <p>No category data yet.</p>}
            {categoryHighlights.map((category) => (
              <div key={category.category} className="category-card">
                <div>
                  <strong>{category.category}</strong>
                  <span>{category.total} total reports</span>
                </div>
                <Badge variant="danger">{category.critical} high priority</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className="admin-table">
          <div className="table-header-admin">
            <div>Complaint</div>
            <div>Reporter</div>
            <div>Status</div>
            <div>Priority</div>
            <div>Actions</div>
          </div>

          {complaints.map(complaint => (
            <div key={complaint.id} className="table-row-admin">
              <div className="complaint-info">
                <div className="complaint-category-small">
                  {complaint.category?.icon} {complaint.category?.name}
                </div>
                <div className="complaint-title-small">{complaint.title}</div>
                <div className="complaint-location-small">📍 {complaint.address}</div>
              </div>

              <div className="reporter-info">
                <div>{complaint.reporter?.name}</div>
                <div className="reporter-email">{complaint.reporter?.email}</div>
              </div>

              <div>
                <select 
                  value={complaint.status}
                  onChange={(e) => updateStatus(complaint.id, e.target.value)}
                  className="status-select"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="rejected">Rejected</option>
                  <option value="escalated">Escalated</option>
                </select>
              </div>

              <div>
                <select 
                  value={complaint.priority}
                  onChange={(e) => updatePriority(complaint.id, e.target.value)}
                  className="priority-select"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div className="action-buttons">
                <Button size="sm" variant="primary">
                  Assign
                </Button>
                <Button size="sm" variant="outline">
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AdminPanel;
