import React, { useEffect, useMemo, useState } from 'react';
import { Card, Badge, Spinner } from '../components/ui';
import { api } from '../services/api';
import './UserPanel.css';

const STATUS_LABELS = {
  pending: 'Pending',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  rejected: 'Rejected',
  escalated: 'Escalated'
};

const PRIORITY_POINTS = {
  low: 5,
  medium: 10,
  high: 20,
  critical: 30
};

const STATUS_BONUS = {
  pending: 0,
  in_progress: 8,
  resolved: 25,
  rejected: -5,
  escalated: 12
};

const UserPanel = () => {
  const [profile, setProfile] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [meRes, complaintsRes] = await Promise.all([
          api.getMe(),
          api.getUserComplaints()
        ]);

        const complaintData = complaintsRes?.data || [];
        setProfile(meRes?.data || null);
        setComplaints(complaintData);

        if (complaintData.length > 0) {
          setSelectedComplaintId(complaintData[0].id);
        }
      } catch (error) {
        console.error('Failed to load user panel data', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!selectedComplaintId) return;

    const loadTimeline = async () => {
      try {
        const response = await api.getComplaintTimeline(selectedComplaintId);
        setTimeline(response?.data || []);
      } catch (error) {
        console.error('Failed to load complaint timeline', error);
      }
    };

    loadTimeline();
  }, [selectedComplaintId]);

  const reportsWithPoints = useMemo(() => {
    return complaints.map((complaint) => {
      const basePoints = PRIORITY_POINTS[complaint.priority] || 5;
      const statusBonus = STATUS_BONUS[complaint.status] || 0;
      const communityPoints = (complaint.upvotes || 0) * 2;
      const total = Math.max(basePoints + statusBonus + communityPoints, 0);

      return {
        ...complaint,
        points: {
          base: basePoints,
          status: statusBonus,
          community: communityPoints,
          total
        }
      };
    });
  }, [complaints]);

  const reportPointSummary = useMemo(() => {
    return reportsWithPoints.reduce((acc, complaint) => {
      acc.base += complaint.points.base;
      acc.status += complaint.points.status;
      acc.community += complaint.points.community;
      acc.total += complaint.points.total;
      return acc;
    }, { base: 0, status: 0, community: 0, total: 0 });
  }, [reportsWithPoints]);

  const selectedReport = reportsWithPoints.find((complaint) => complaint.id === selectedComplaintId) || null;

  if (loading) {
    return (
      <div className="loading-page user-panel-loading">
        <Spinner size="lg" />
        <p>Loading your profile dashboard...</p>
      </div>
    );
  }

  return (
    <div className="user-panel-page fade-in">
      <header className="user-panel-header">
        <div>
          <h1>User Panel</h1>
          <p>Track every report, its status journey, and your full points performance.</p>
        </div>
      </header>

      <section className="user-panel-grid">
        <Card>
          <h2>Profile Overview</h2>
          <div className="profile-card">
            <div>
              <p className="profile-name">{profile?.name || 'Citizen'}</p>
              <p className="profile-meta">{profile?.email}</p>
              <p className="profile-meta">City: {profile?.city || 'Not set'}</p>
            </div>
            <div className="profile-points">
              <span>Total Reports</span>
              <strong>{reportsWithPoints.length}</strong>
              <span>Resolved: {reportsWithPoints.filter((report) => report.status === 'resolved').length}</span>
            </div>
          </div>
        </Card>

        <Card>
          <h2>Points Summary</h2>
          <div className="points-breakdown-grid">
            <div className="points-tile">
              <span>Total Points</span>
              <strong>{reportPointSummary.total}</strong>
            </div>
            <div className="points-tile">
              <span>Base Points</span>
              <strong>{reportPointSummary.base}</strong>
            </div>
            <div className="points-tile">
              <span>Status Bonus</span>
              <strong>{reportPointSummary.status}</strong>
            </div>
            <div className="points-tile">
              <span>Community Points</span>
              <strong>{reportPointSummary.community}</strong>
            </div>
          </div>
        </Card>

        <Card>
          <h2>All Reports & Status</h2>
          <div className="reports-list report-table-list">
            {reportsWithPoints.length === 0 && <p>No reports yet. Submit your first issue!</p>}
            {reportsWithPoints.map((complaint) => (
              <button
                key={complaint.id}
                className={`report-item ${selectedComplaintId === complaint.id ? 'active' : ''}`}
                onClick={() => setSelectedComplaintId(complaint.id)}
              >
                <div>
                  <span className="report-title">{complaint.title}</span>
                  <span className="report-meta">{complaint.category?.name || 'General'} • {complaint.address}</span>
                  <span className="report-meta">Total Points: {complaint.points.total}</span>
                </div>
                <Badge variant="secondary">{STATUS_LABELS[complaint.status] || complaint.status}</Badge>
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <h2>Selected Report Details</h2>
          {!selectedReport && <p>Select a report to see detailed status and points split.</p>}
          {selectedReport && (
            <div className="selected-report-details">
              <div className="selected-header">
                <h3>{selectedReport.title}</h3>
                <Badge variant="primary">{STATUS_LABELS[selectedReport.status] || selectedReport.status}</Badge>
              </div>
              <p className="report-meta">Priority: {selectedReport.priority || 'medium'}</p>
              <p className="report-meta">Department: {selectedReport.department?.name || 'Unassigned'}</p>
              <div className="points-breakdown-row">
                <span>Base</span>
                <strong>{selectedReport.points.base}</strong>
              </div>
              <div className="points-breakdown-row">
                <span>Status Bonus</span>
                <strong>{selectedReport.points.status}</strong>
              </div>
              <div className="points-breakdown-row">
                <span>Community</span>
                <strong>{selectedReport.points.community}</strong>
              </div>
              <div className="points-breakdown-row total">
                <span>Report Total</span>
                <strong>{selectedReport.points.total}</strong>
              </div>
            </div>
          )}
        </Card>

        <Card>
          <h2>Status Timeline</h2>
          <div className="timeline">
            {timeline.length === 0 && <p>No tracking history yet. Select a report.</p>}
            {timeline.map((entry) => (
              <div key={entry.id} className="timeline-entry">
                <span className="timeline-status">{STATUS_LABELS[entry.status] || entry.status}</span>
                <span className="timeline-meta">
                  {entry.actor?.name || 'System'} • {new Date(entry.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
};

export default UserPanel;
