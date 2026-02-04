import React, { useState, useEffect } from 'react';
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

  if (loading) return <div className="loading-page">Loading...</div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>🛠️ Admin Panel</h1>
        <p>Manage complaints and assignments</p>
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