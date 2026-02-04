// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Card, Badge, Button } from '../components/ui';
// import { api } from '../services/api';
// import './ComplaintDetail.css';

// const ComplaintDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [complaint, setComplaint] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [userVote, setUserVote] = useState(null);
//   const [votes, setVotes] = useState({ upvotes: 0, downvotes: 0 });
//   const [newComment, setNewComment] = useState('');
//   const [addingComment, setAddingComment] = useState(false);

//   useEffect(() => {
//     fetchComplaintDetail();
//     fetchUserVote();
//   }, [id]);

//   const fetchComplaintDetail = async () => {
//     try {
//       const response = await api.getComplaintById(id);
//       setComplaint(response.data);
//       setVotes({
//         upvotes: response.data.upvotes,
//         downvotes: response.data.downvotes
//       });
//     } catch (error) {
//       console.error('Error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchUserVote = async () => {
//     const token = localStorage.getItem('token');
//     if (!token) return;

//     try {
//       const response = await api.getUserVote(id);
//       if (response.success) {
//         setUserVote(response.data);
//       }
//     } catch (error) {
//       console.error('Error fetching user vote:', error);
//     }
//   };

//   const handleVote = async (voteType) => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       alert('Please login to vote');
//       navigate('/login');
//       return;
//     }

//     try {
//       const response = await api.toggleVote(id, voteType);
//       if (response.success) {
//         // Refresh complaint data
//         fetchComplaintDetail();
//         fetchUserVote();
//       }
//     } catch (error) {
//       console.error('Error voting:', error);
//       alert('Failed to vote. Please try again.');
//     }
//   };

//   const handleAddComment = async (e) => {
//     e.preventDefault();
    
//     const token = localStorage.getItem('token');
//     if (!token) {
//       alert('Please login to comment');
//       navigate('/login');
//       return;
//     }

//     if (!newComment.trim()) return;

//     setAddingComment(true);
//     try {
//       const response = await api.addComment(id, newComment);
//       if (response.success) {
//         setNewComment('');
//         fetchComplaintDetail(); // Refresh to show new comment
//       } else {
//         alert(response.message || 'Failed to add comment');
//       }
//     } catch (error) {
//       console.error('Error adding comment:', error);
//       alert('Failed to add comment');
//     } finally {
//       setAddingComment(false);
//     }
//   };

//   if (loading) return <div className="loading-page">Loading...</div>;
//   if (!complaint) return <div className="error-page">Complaint not found</div>;

//   return (
//     <div className="detail-page">
//       <Button variant="secondary" onClick={() => navigate(-1)}>
//         ← Back
//       </Button>

//       <div className="detail-grid">
//         {/* Left Column */}
//         <div className="detail-main">
//           <Card>
//             <div className="detail-header">
//               <div className="category-badge">
//                 <span className="icon">{complaint.category?.icon}</span>
//                 <span>{complaint.category?.name}</span>
//               </div>
//               <Badge variant={complaint.status}>{complaint.status.replace('_', ' ')}</Badge>
//             </div>

//             <h1>{complaint.title}</h1>
//             <p className="description">{complaint.description}</p>

//             <div className="info-grid">
//               <div className="info-item">
//                 <span className="label">📍 Location</span>
//                 <span className="value">{complaint.address}</span>
//               </div>
//               {complaint.landmark && (
//                 <div className="info-item">
//                   <span className="label">🏛️ Landmark</span>
//                   <span className="value">{complaint.landmark}</span>
//                 </div>
//               )}
//               <div className="info-item">
//                 <span className="label">👤 Reported by</span>
//                 <span className="value">{complaint.reporter?.name}</span>
//               </div>
//               <div className="info-item">
//                 <span className="label">📅 Reported on</span>
//                 <span className="value">{new Date(complaint.createdAt).toLocaleDateString()}</span>
//               </div>
//             </div>

//             <div className="votes-section">
//               <button 
//                 className={`vote-btn upvote ${userVote === 'upvote' ? 'active' : ''}`}
//                 onClick={() => handleVote('upvote')}
//               >
//                 👍 Upvote ({votes.upvotes})
//               </button>
//               <button 
//                 className={`vote-btn downvote ${userVote === 'downvote' ? 'active' : ''}`}
//                 onClick={() => handleVote('downvote')}
//               >
//                 👎 Downvote ({votes.downvotes})
//               </button>
//             </div>
//           </Card>

//           {/* Add Comment Form */}
//           <Card style={{ marginTop: '1.5rem' }}>
//             <h2>Add Comment</h2>
//             <form onSubmit={handleAddComment} style={{ marginTop: '1rem' }}>
//               <textarea
//                 className="comment-textarea"
//                 placeholder="Write your comment here..."
//                 value={newComment}
//                 onChange={(e) => setNewComment(e.target.value)}
//                 rows="3"
//                 required
//               />
//               <Button 
//                 type="submit" 
//                 variant="primary" 
//                 disabled={addingComment}
//                 style={{ marginTop: '1rem' }}
//               >
//                 {addingComment ? 'Posting...' : 'Post Comment'}
//               </Button>
//             </form>
//           </Card>

//           {/* Comments Section */}
//           {complaint.comments?.length > 0 && (
//             <Card style={{ marginTop: '1.5rem' }}>
//               <h2>Comments ({complaint.comments.length})</h2>
//               <div className="comments-list">
//                 {complaint.comments.map(comment => (
//                   <div key={comment.id} className={`comment ${comment.isOfficial ? 'official' : ''}`}>
//                     <div className="comment-header">
//                       <strong>{comment.user?.name}</strong>
//                       {comment.isOfficial && <Badge variant="primary" size="sm">Official</Badge>}
//                     </div>
//                     <p>{comment.content}</p>
//                     <span className="comment-time">{new Date(comment.createdAt).toLocaleString()}</span>
//                   </div>
//                 ))}
//               </div>
//             </Card>
//           )}
//         </div>

//         {/* Right Sidebar */}
//         <div className="detail-sidebar">
//           <Card>
//             <h3>Status</h3>
//             <Badge variant={complaint.status} size="lg">
//               {complaint.status.replace('_', ' ').toUpperCase()}
//             </Badge>
            
//             <div className="sidebar-info">
//               <h3>Priority</h3>
//               <Badge variant={complaint.priority === 'critical' || complaint.priority === 'high' ? 'danger' : 'warning'}>
//                 {complaint.priority}
//               </Badge>
//             </div>

//             <div className="sidebar-info">
//               <h3>Department</h3>
//               <p>{complaint.department?.name}</p>
//             </div>

//             {complaint.assignedTo && (
//               <div className="sidebar-info">
//                 <h3>Assigned To</h3>
//                 <p>{complaint.assignee?.name}</p>
//               </div>
//             )}

//             {complaint.estimatedResolutionTime && (
//               <div className="sidebar-info">
//                 <h3>Expected Resolution</h3>
//                 <p>{new Date(complaint.estimatedResolutionTime).toLocaleDateString()}</p>
//               </div>
//             )}

//             {complaint.resolvedAt && (
//               <div className="sidebar-info">
//                 <h3>Resolved On</h3>
//                 <p>{new Date(complaint.resolvedAt).toLocaleDateString()}</p>
//               </div>
//             )}
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ComplaintDetail;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Badge, Button } from '../components/ui';
import { api } from '../services/api';
import './ComplaintDetail.css';

const ComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userVote, setUserVote] = useState(null);
  const [votes, setVotes] = useState({ upvotes: 0, downvotes: 0 });
  const [newComment, setNewComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);

  useEffect(() => {
    fetchComplaintDetail();
    fetchUserVote();
  }, [id]);

  const fetchComplaintDetail = async () => {
    try {
      const response = await api.getComplaintById(id);
      setComplaint(response.data);
      setVotes({
        upvotes: response.data.upvotes,
        downvotes: response.data.downvotes
      });
    } catch (error) {
      console.error('Error fetching complaint:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserVote = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await api.getUserVote(id);
      if (response.success) {
        setUserVote(response.data);
      }
    } catch (error) {
      console.error('Error fetching user vote:', error);
    }
  };

  const handleVote = async (voteType) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to vote');
      navigate('/login');
      return;
    }

    try {
      const response = await api.toggleVote(id, voteType);
      if (response.success) {
        fetchComplaintDetail();
        fetchUserVote();
      }
    } catch (error) {
      console.error('Error voting:', error);
      alert('Failed to vote');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to comment');
      navigate('/login');
      return;
    }

    if (!newComment.trim()) return;

    setAddingComment(true);
    try {
      const response = await api.addComment(id, newComment);
      if (response.success) {
        setNewComment('');
        fetchComplaintDetail();
      } else {
        alert(response.message || 'Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment');
    } finally {
      setAddingComment(false);
    }
  };

  if (loading) return <div className="loading-page">Loading...</div>;
  if (!complaint) return <div className="error-page">Complaint not found</div>;

  return (
    <div className="detail-page">
      <Button variant="secondary" onClick={() => navigate(-1)}>
        ← Back
      </Button>

      <div className="detail-grid">
        {/* LEFT COLUMN */}
        <div className="detail-main">
          <Card>
            <div className="detail-header">
              <div className="category-badge">
                <span className="icon">{complaint.category?.icon}</span>
                <span>{complaint.category?.name}</span>
              </div>
              <Badge variant={complaint.status}>
                {complaint.status.replace('_', ' ')}
              </Badge>
            </div>

            <h1>{complaint.title}</h1>
            <p className="description">{complaint.description}</p>

            {/* IMAGES GALLERY */}
            {complaint.images && complaint.images.length > 0 && (
              <div className="images-gallery">
                <h3>Images</h3>
                <div className="images-grid">
                  {complaint.images.map((image, index) => (
                    <div key={image.id} className="image-item">
                      <img
                        src={image.imageUrl}
                        alt={`Complaint image ${index + 1}`}
                        onClick={() => window.open(image.imageUrl, '_blank')}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="info-grid">
              <div className="info-item">
                <span className="label">📍 Location</span>
                <span className="value">{complaint.address}</span>
              </div>

              {complaint.landmark && (
                <div className="info-item">
                  <span className="label">🏛️ Landmark</span>
                  <span className="value">{complaint.landmark}</span>
                </div>
              )}

              <div className="info-item">
                <span className="label">👤 Reported by</span>
                <span className="value">{complaint.reporter?.name}</span>
              </div>

              <div className="info-item">
                <span className="label">📅 Reported on</span>
                <span className="value">
                  {new Date(complaint.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="votes-section">
              <button
                className={`vote-btn upvote ${userVote === 'upvote' ? 'active' : ''}`}
                onClick={() => handleVote('upvote')}
              >
                👍 Upvote ({votes.upvotes})
              </button>
              <button
                className={`vote-btn downvote ${userVote === 'downvote' ? 'active' : ''}`}
                onClick={() => handleVote('downvote')}
              >
                👎 Downvote ({votes.downvotes})
              </button>
            </div>
          </Card>

          {/* ADD COMMENT */}
          <Card style={{ marginTop: '1.5rem' }}>
            <h2>Add Comment</h2>
            <form onSubmit={handleAddComment}>
              <textarea
                className="comment-textarea"
                placeholder="Write your comment here..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows="3"
                required
              />
              <Button
                type="submit"
                variant="primary"
                disabled={addingComment}
                style={{ marginTop: '1rem' }}
              >
                {addingComment ? 'Posting...' : 'Post Comment'}
              </Button>
            </form>
          </Card>

          {/* COMMENTS LIST */}
          {complaint.comments?.length > 0 && (
            <Card style={{ marginTop: '1.5rem' }}>
              <h2>Comments ({complaint.comments.length})</h2>
              <div className="comments-list">
                {complaint.comments.map(comment => (
                  <div
                    key={comment.id}
                    className={`comment ${comment.isOfficial ? 'official' : ''}`}
                  >
                    <div className="comment-header">
                      <strong>{comment.user?.name}</strong>
                      {comment.isOfficial && (
                        <Badge variant="primary" size="sm">Official</Badge>
                      )}
                    </div>
                    <p>{comment.content}</p>
                    <span className="comment-time">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="detail-sidebar">
          <Card>
            <h3>Status</h3>
            <Badge variant={complaint.status} size="lg">
              {complaint.status.replace('_', ' ').toUpperCase()}
            </Badge>

            <div className="sidebar-info">
              <h3>Priority</h3>
              <Badge
                variant={
                  complaint.priority === 'critical' || complaint.priority === 'high'
                    ? 'danger'
                    : 'warning'
                }
              >
                {complaint.priority}
              </Badge>
            </div>

            <div className="sidebar-info">
              <h3>Department</h3>
              <p>{complaint.department?.name}</p>
            </div>

            {complaint.assignedTo && (
              <div className="sidebar-info">
                <h3>Assigned To</h3>
                <p>{complaint.assignee?.name}</p>
              </div>
            )}

            {complaint.estimatedResolutionTime && (
              <div className="sidebar-info">
                <h3>Expected Resolution</h3>
                <p>
                  {new Date(complaint.estimatedResolutionTime).toLocaleDateString()}
                </p>
              </div>
            )}

            {complaint.resolvedAt && (
              <div className="sidebar-info">
                <h3>Resolved On</h3>
                <p>
                  {new Date(complaint.resolvedAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetail;
