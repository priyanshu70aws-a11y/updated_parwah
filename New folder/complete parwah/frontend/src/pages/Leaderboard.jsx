import React, { useState, useEffect } from 'react';
import { Card, Badge } from '../components/ui';
import { api } from '../services/api';
import './Leaderboard.css';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await api.getLeaderboard();
      setLeaderboard(response.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  if (loading) return <div className="loading-page">Loading leaderboard...</div>;

  return (
  <div className="complaints-page fade-in">  {/* Add fade-in class */}
    <div className="leaderboard-page">
      <div className="leaderboard-header">
        <h1>🏆 Leaderboard</h1>
        <p>Top contributors making a difference in the community</p>
      </div>
    </div>

      <div className="leaderboard-grid">
        {/* Top 3 Podium */}
        {leaderboard.length >= 3 && (
          <div className="podium">
            {/* 2nd Place */}
            <Card hover className="podium-card second">
              <div className="podium-rank">🥈</div>
              <div className="podium-info">
                <h3>{leaderboard[1]?.user?.name}</h3>
                <div className="podium-points">{leaderboard[1]?.totalPoints} pts</div>
                <div className="podium-stats">
                  <span>📝 {leaderboard[1]?.complaintsReported}</span>
                  <span>✅ {leaderboard[1]?.complaintsResolved}</span>
                </div>
              </div>
            </Card>

            {/* 1st Place */}
            <Card hover className="podium-card first">
              <div className="podium-rank">🥇</div>
              <div className="podium-info">
                <h3>{leaderboard[0]?.user?.name}</h3>
                <div className="podium-points">{leaderboard[0]?.totalPoints} pts</div>
                <div className="podium-stats">
                  <span>📝 {leaderboard[0]?.complaintsReported}</span>
                  <span>✅ {leaderboard[0]?.complaintsResolved}</span>
                </div>
              </div>
            </Card>

            {/* 3rd Place */}
            <Card hover className="podium-card third">
              <div className="podium-rank">🥉</div>
              <div className="podium-info">
                <h3>{leaderboard[2]?.user?.name}</h3>
                <div className="podium-points">{leaderboard[2]?.totalPoints} pts</div>
                <div className="podium-stats">
                  <span>📝 {leaderboard[2]?.complaintsReported}</span>
                  <span>✅ {leaderboard[2]?.complaintsResolved}</span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Full Leaderboard Table */}
        <Card>
          <h2>All Contributors</h2>
          <div className="leaderboard-table">
            <div className="table-header">
              <div className="col-rank">Rank</div>
              <div className="col-name">Name</div>
              <div className="col-stats">Stats</div>
              <div className="col-badges">Badges</div>
              <div className="col-points">Points</div>
            </div>

            {leaderboard.map((entry, index) => (
              <div key={entry.id} className="table-row">
                <div className="col-rank">
                  <span className="rank-badge">{getRankIcon(index + 1)}</span>
                </div>
                <div className="col-name">
                  <div className="user-info">
                    <div className="user-name">{entry.user?.name}</div>
                    <div className="user-location">{entry.user?.city}</div>
                  </div>
                </div>
                <div className="col-stats">
                  <div className="stat-item">
                    <span className="stat-icon">📝</span>
                    <span>{entry.complaintsReported} reported</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon">✅</span>
                    <span>{entry.complaintsResolved} resolved</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon">👍</span>
                    <span>{entry.upvotesReceived} upvotes</span>
                  </div>
                </div>
                <div className="col-badges">
                  {entry.badges?.length > 0 ? (
                    entry.badges.map((badge, i) => (
                      <Badge key={i} variant="primary" size="sm">
                        {badge}
                      </Badge>
                    ))
                  ) : (
                    <span className="no-badges">No badges yet</span>
                  )}
                </div>
                <div className="col-points">
                  <div className="points-badge">{entry.totalPoints}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;