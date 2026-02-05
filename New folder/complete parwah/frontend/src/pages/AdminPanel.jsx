import React, { useState, useEffect, useMemo } from 'react';
import { Card, Badge, Button } from '../components/ui';
import { api } from '../services/api';
import './AdminPanel.css';

const workers = [
  { id: 'w-1', name: 'Aarav Singh', department: 'Roads & Transport' },
  { id: 'w-2', name: 'Fatima Khan', department: 'Water & Sanitation' },
  { id: 'w-3', name: 'Rohan Patel', department: 'Electricity & Lighting' },
  { id: 'w-4', name: 'Neha Sharma', department: 'Public Safety' }
];

const statusGraph = [
  { key: 'pending', label: 'Pending' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'resolved', label: 'Resolved' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'escalated', label: 'Escalated' }
];

const AdminPanel = () => {
  const [complaints, setComplaints] = useState([]);
  const [heatmap, setHeatmap] = useState([]);
  const [niegGroups, setNiegGroups] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPanelData();
  }, []);

  const fetchPanelData = async () => {
    try {
      const [complaintsRes, heatmapRes, niegRes] = await Promise.all([
        api.getAllComplaints(),
        api.getHeatmapData(),
        api.getNiegGroups()
      ]);

      setComplaints(complaintsRes?.data || []);
      setHeatmap(heatmapRes?.data || []);
      setNiegGroups(niegRes?.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const response = await api.updateComplaint(id, { status: newStatus });
      if (response.success) {
        setComplaints(complaints.map((c) => (
          c.id === id ? { ...c, status: newStatus } : c
        )));
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const updatePriority = async (id, newPriority) => {
    try {
      const response = await api.updateComplaint(id, { priority: newPriority });
      if (response.success) {
        setComplaints(complaints.map((c) => (
          c.id === id ? { ...c, priority: newPriority } : c
        )));
      }
    } catch (error) {
      console.error('Error updating priority:', error);
    }
  };

  const handleWorkerChange = (complaintId, workerId) => {
    setAssignments((prev) => ({ ...prev, [complaintId]: workerId }));
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
        map.set(department, { department, total: 0, resolved: 0, pending: 0 });
      }
      const record = map.get(department);
      record.total += 1;
      if (complaint.status === 'resolved') record.resolved += 1;
      if (complaint.status === 'pending') record.pending += 1;
    });
    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, [complaints]);

  const totalComplaints = complaints.length;
  const resolvedComplaints = statusCounts.resolved || 0;
  const pendingComplaints = statusCounts.pending || 0;
  const inProgressComplaints = statusCounts.in_progress || 0;
  const resolutionRate = totalComplaints ? Math.round((resolvedComplaints / totalComplaints) * 100) : 0;
  const topHeatmap = [...heatmap].sort((a, b) => b.count - a.count).slice(0, 10);

  if (loading) return <div className="loading-page">Loading...</div>;

  return (
    <div className="admin-page fade-in">
      <div className="admin-header glass-panel">
        <h1>🛠️ Admin Panel</h1>
        <p>Operations dashboard with heatmap intelligence, NIEG grouping, and work assignment control.</p>
      </div>

      <div className="admin-insights">
        <Card><div className="insight-card"><p>Total Complaints</p><strong>{totalComplaints}</strong><span>{pendingComplaints} pending • {inProgressComplaints} in progress</span></div></Card>
        <Card><div className="insight-card"><p>Resolution Rate</p><strong>{resolutionRate}%</strong><span>{resolvedComplaints} resolved</span></div></Card>
        <Card><div className="insight-card"><p>High/Critical</p><strong>{(priorityCounts.high || 0) + (priorityCounts.critical || 0)}</strong><span>Priority watchlist</span></div></Card>
      </div>

      <div className="admin-analytics-grid">
        <Card>
          <h2>Heatmap + NIEG Issue Grouping</h2>
          <div className="heatmap-map">
            {topHeatmap.length === 0 && <p>No heatmap data available.</p>}
            {topHeatmap.map((spot, index) => {
              const left = ((Number(spot.longitude) + 180) / 360) * 100;
              const top = ((90 - Number(spot.latitude)) / 180) * 100;
              return (
                <div
                  key={`${spot.latitude}-${spot.longitude}-${index}`}
                  className="map-dot"
                  style={{ left: `${left}%`, top: `${top}%` }}
                  title={`Reports: ${spot.count}`}
                >
                  <span>{spot.count}</span>
                </div>
              );
            })}
          </div>
          <div className="nieg-summary-grid">
            {niegGroups.slice(0, 4).map((group) => (
              <div key={`${group.neighborhoodId}-${group.categoryId}`} className="nieg-summary-card">
                <strong>{group.category}</strong>
                <small>{group.neighborhood}</small>
                <Badge variant="warning">{group.total} reports</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2>Department Static Report (Graph)</h2>
          <div className="department-graph">
            {departmentStats.length === 0 && <p>No departmental data yet.</p>}
            {departmentStats.map((department) => {
              const totalWidth = totalComplaints ? Math.round((department.total / totalComplaints) * 100) : 0;
              const resolvedWidth = department.total ? Math.round((department.resolved / department.total) * 100) : 0;
              return (
                <div key={department.department} className="department-graph-row">
                  <div className="department-graph-header">
                    <span>{department.department}</span>
                    <span>{department.total} reports</span>
                  </div>
                  <div className="status-bar"><div className="status-bar-fill" style={{ width: `${totalWidth}%` }} /></div>
                  <small>{resolvedWidth}% resolved • {department.pending} pending</small>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <h2>Status Distribution</h2>
          <div className="status-graph">
            {statusGraph.map((status) => {
              const count = statusCounts[status.key] || 0;
              const percent = totalComplaints ? Math.round((count / totalComplaints) * 100) : 0;
              return (
                <div key={status.key} className="status-row">
                  <div className="status-row-header"><span>{status.label}</span><span>{count} ({percent}%)</span></div>
                  <div className="status-bar"><div className="status-bar-fill" style={{ width: `${percent}%` }} /></div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card>
        <h2>Work Assignment Board</h2>
        <div className="admin-table">
          <div className="table-header-admin">
            <div>Complaint</div>
            <div>Status</div>
            <div>Priority</div>
            <div>Assign Worker</div>
            <div>Actions</div>
          </div>

          {complaints.map((complaint) => (
            <div key={complaint.id} className="table-row-admin">
              <div className="complaint-info">
                <div className="complaint-category-small">{complaint.category?.icon} {complaint.category?.name}</div>
                <div className="complaint-title-small">{complaint.title}</div>
                <div className="complaint-location-small">📍 {complaint.address}</div>
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

              <div>
                <select
                  className="priority-select"
                  value={assignments[complaint.id] || ''}
                  onChange={(e) => handleWorkerChange(complaint.id, e.target.value)}
                >
                  <option value="">Select Worker</option>
                  {workers.map((worker) => (
                    <option key={worker.id} value={worker.id}>{worker.name} ({worker.department})</option>
                  ))}
                </select>
              </div>

              <div className="action-buttons">
                <Button size="sm" variant="primary">Save Assignment</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AdminPanel;
