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

const UserPanel = () => {
  const [profile, setProfile] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [heatmap, setHeatmap] = useState([]);
  const [niegGroups, setNiegGroups] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [realtimeEvents, setRealtimeEvents] = useState([]);
  const [realtimeStatus, setRealtimeStatus] = useState('Connecting…');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [meRes, complaintsRes, heatmapRes, niegRes] = await Promise.all([
          api.getMe(),
          api.getUserComplaints(),
          api.getHeatmapData(),
          api.getNiegGroups()
        ]);

        const complaintData = complaintsRes?.data || [];
        setProfile(meRes?.data || null);
        setComplaints(complaintData);
        setHeatmap(heatmapRes?.data || []);
        setNiegGroups(niegRes?.data || []);

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

  useEffect(() => {
    if (!('EventSource' in window)) {
      setRealtimeStatus('Realtime updates not supported in this browser.');
      return;
    }

    const stream = api.getRealtimeStream();
    stream.onopen = () => setRealtimeStatus('Live updates connected');
    stream.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        setRealtimeEvents((prev) => [
          { ...payload, receivedAt: new Date().toISOString() },
          ...prev
        ].slice(0, 8));
      } catch (error) {
        console.error('Failed to parse realtime event', error);
      }
    };
    stream.onerror = () => {
      setRealtimeStatus('Live updates disconnected');
    };

    return () => stream.close();
  }, []);

  const honorTier = useMemo(() => {
    const points = profile?.points?.totalPoints || 0;
    if (points >= 1000) return { label: 'Platinum Guardian', color: 'success' };
    if (points >= 600) return { label: 'Gold Guardian', color: 'warning' };
    if (points >= 250) return { label: 'Silver Guardian', color: 'primary' };
    return { label: 'Rising Reporter', color: 'secondary' };
  }, [profile]);

  const automationInsights = useMemo(() => {
    const insights = [];
    const now = Date.now();

    const overdue = complaints.filter((complaint) => {
      if (!complaint?.createdAt || complaint.status !== 'pending') return false;
      const createdAt = new Date(complaint.createdAt).getTime();
      return now - createdAt > 7 * 24 * 60 * 60 * 1000;
    });

    if (overdue.length > 0) {
      insights.push({
        title: 'Auto-escalation ready',
        detail: `${overdue.length} pending issues are older than 7 days and ready for escalation.`
      });
    }

    const duplicates = complaints.filter((complaint) => (complaint.duplicateCount || 0) > 0);
    if (duplicates.length > 0) {
      insights.push({
        title: 'AI duplicate radar',
        detail: `${duplicates.length} of your reports have supporters. Leverage them for faster resolution.`
      });
    }

    const critical = complaints.filter((complaint) => ['high', 'critical'].includes(complaint.priority));
    if (critical.length > 0) {
      insights.push({
        title: 'Priority routing',
        detail: `${critical.length} reports are high priority. Auto-route to senior responders.`
      });
    }

    if (insights.length === 0) {
      insights.push({
        title: 'Automation steady-state',
        detail: 'No urgent automation actions right now. Keep reporting to unlock more smart insights.'
      });
    }

    return insights;
  }, [complaints]);

  const topHeatmap = [...heatmap].sort((a, b) => b.count - a.count).slice(0, 5);

  if (loading) {
    return (
      <div className="loading-page user-panel-loading">
        <Spinner size="lg" />
        <p>Loading your civic command center...</p>
      </div>
    );
  }

  return (
    <div className="user-panel-page fade-in">
      <header className="user-panel-header">
        <div>
          <h1>User Panel</h1>
          <p>Your reports, points, and live transparency dashboard.</p>
        </div>
        <div className="honor-tier">
          <span>Honor Tier</span>
          <Badge variant={honorTier.color}>{honorTier.label}</Badge>
        </div>
      </header>

      <section className="user-panel-grid">
        <Card>
          <h2>Profile & Points</h2>
          <div className="profile-card">
            <div>
              <p className="profile-name">{profile?.name || 'Citizen'}</p>
              <p className="profile-meta">{profile?.email}</p>
              <p className="profile-meta">City: {profile?.city || 'Not set'}</p>
            </div>
            <div className="profile-points">
              <span>Total Points</span>
              <strong>{profile?.points?.totalPoints || 0}</strong>
              <span>Reports: {profile?.points?.complaintsReported || 0}</span>
            </div>
          </div>
        </Card>

        <Card>
          <h2>Honor System</h2>
          <div className="honor-list">
            <div className="honor-item">
              <span>🏅 {honorTier.label}</span>
              <small>Earned with {profile?.points?.totalPoints || 0} points</small>
            </div>
            <div className="honor-item">
              <span>🤝 Community Supporter</span>
              <small>{profile?.points?.upvotesReceived || 0} upvotes received</small>
            </div>
            <div className="honor-item">
              <span>📌 Consistent Reporter</span>
              <small>{profile?.points?.complaintsReported || 0} issues filed</small>
            </div>
          </div>
        </Card>

        <Card>
          <h2>Your Reports</h2>
          <div className="reports-list">
            {complaints.length === 0 && <p>No reports yet. Submit your first issue!</p>}
            {complaints.slice(0, 6).map((complaint) => (
              <button
                key={complaint.id}
                className={`report-item ${selectedComplaintId === complaint.id ? 'active' : ''}`}
                onClick={() => setSelectedComplaintId(complaint.id)}
              >
                <div>
                  <span className="report-title">{complaint.title}</span>
                  <span className="report-meta">{complaint.category?.name || 'General'}</span>
                </div>
                <Badge variant="secondary">{STATUS_LABELS[complaint.status] || complaint.status}</Badge>
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <h2>Live Tracking & Timeline</h2>
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

        <Card>
          <h2>Real-time Transparency</h2>
          <p className="realtime-status">{realtimeStatus}</p>
          <div className="realtime-feed">
            {realtimeEvents.length === 0 && <p>Waiting for live updates…</p>}
            {realtimeEvents.map((event, index) => (
              <div key={`${event.event || 'event'}-${index}`} className="realtime-item">
                <span className="realtime-title">{event.event || 'Update'}</span>
                <span className="realtime-meta">
                  {event.message || 'A civic update just happened.'}
                </span>
                <small>{new Date(event.receivedAt).toLocaleTimeString()}</small>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2>Smart Automation (AI)</h2>
          <div className="automation-list">
            {automationInsights.map((insight, index) => (
              <div key={`${insight.title}-${index}`} className="automation-item">
                <strong>{insight.title}</strong>
                <p>{insight.detail}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2>Live Heatmap Highlights</h2>
          <div className="heatmap-list">
            {topHeatmap.length === 0 && <p>No hotspots yet.</p>}
            {topHeatmap.map((spot, index) => (
              <div key={`${spot.latitude}-${spot.longitude}-${index}`} className="heatmap-item">
                <span>📍 {spot.latitude}, {spot.longitude}</span>
                <Badge variant="primary">{spot.count} reports</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2>NIEG Issue Grouping</h2>
          <div className="nieg-grid">
            {niegGroups.length === 0 && <p>Grouping will appear as more reports arrive.</p>}
            {niegGroups.slice(0, 6).map((group) => (
              <div key={`${group.neighborhoodId}-${group.categoryId}`} className="nieg-card">
                <div className="nieg-header" style={{ background: group.color }}>
                  <span>{group.icon}</span>
                  <div>
                    <strong>{group.category}</strong>
                    <p>{group.neighborhood}</p>
                  </div>
                </div>
                <div className="nieg-body">
                  <span>Total: {group.total}</span>
                  <small>Pending: {group.statusCounts?.pending || 0}</small>
                  <small>In progress: {group.statusCounts?.in_progress || 0}</small>
                  <small>Resolved: {group.statusCounts?.resolved || 0}</small>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
};

export default UserPanel;
