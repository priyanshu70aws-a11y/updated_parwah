
// import React from 'react';
// import { Card, Badge } from '../../ui';
// import './ComplaintCard.css';
// import { useNavigate } from 'react-router-dom';

// const ComplaintCard = ({ complaint, onClick }) => {
//   const statusColors = {
//     pending: 'pending',
//     in_progress: 'in_progress',
//     resolved: 'resolved',
//     rejected: 'rejected',
//     escalated: 'escalated'
//   };

//   const priorityColors = {
//     low: 'success',
//     medium: 'warning',
//     high: 'danger',
//     critical: 'danger'
//   };

//   return (
//     <Card hover onClick={onClick}>
//       <div className="complaint-card">
//         <div className="complaint-header">
//           <div className="complaint-category">
//             <span className="category-icon">{complaint.category?.icon}</span>
//             <span className="category-name">{complaint.category?.name}</span>
//           </div>
//           <Badge variant={statusColors[complaint.status]}>
//             {complaint.status.replace('_', ' ')}
//           </Badge>
//         </div>

//         <h3 className="complaint-title">{complaint.title}</h3>
//         <p className="complaint-description">{complaint.description}</p>

//         <div className="complaint-meta">
//           <div className="meta-item">
//             <span className="meta-icon">📍</span>
//             <span className="meta-text">{complaint.address}</span>
//           </div>
//           <div className="meta-item">
//             <span className="meta-icon">👤</span>
//             <span className="meta-text">{complaint.reporter?.name}</span>
//           </div>
//         </div>

//         <div className="complaint-footer">
//           <div className="votes">
//             <span className="vote-item">
//               👍 {complaint.upvotes}
//             </span>
//             <span className="vote-item">
//               👎 {complaint.downvotes}
//             </span>
//           </div>
//           <Badge variant={priorityColors[complaint.priority]} size="sm">
//             {complaint.priority}
//           </Badge>
//         </div>
//       </div>
//     </Card>
//   );
// };

// export default ComplaintCard;































import React from 'react';
import { Card, Badge } from '../../ui';
import './ComplaintCard.css';
import { useNavigate } from 'react-router-dom';

const ComplaintCard = ({ complaint }) => {
  const navigate = useNavigate();
  
  const statusColors = {
    pending: 'pending',
    in_progress: 'in_progress',
    resolved: 'resolved',
    rejected: 'rejected',
    escalated: 'escalated'
  };

  const priorityColors = {
    low: 'success',
    medium: 'warning',
    high: 'danger',
    critical: 'danger'
  };

  return (
    <div onClick={() => navigate(`/complaint/${complaint.id}`)} style={{ cursor: 'pointer' }}>
      <Card hover>
        <div className="complaint-card">
          <div className="complaint-header">
            <div className="complaint-category">
              <span className="category-icon">{complaint.category?.icon}</span>
              <span className="category-name">{complaint.category?.name}</span>
            </div>
            <Badge variant={statusColors[complaint.status]}>
              {complaint.status.replace('_', ' ')}
            </Badge>
          </div>

          <h3 className="complaint-title">{complaint.title}</h3>
          <p className="complaint-description">{complaint.description}</p>

          <div className="complaint-meta">
            <div className="meta-item">
              <span className="meta-icon">📍</span>
              <span className="meta-text">{complaint.address}</span>
            </div>
            <div className="meta-item">
              <span className="meta-icon">👤</span>
              <span className="meta-text">{complaint.reporter?.name}</span>
            </div>
          </div>

          <div className="complaint-footer">
            <div className="votes">
              <span className="vote-item">
                👍 {complaint.upvotes}
              </span>
              <span className="vote-item">
                👎 {complaint.downvotes}
              </span>
            </div>
            <Badge variant={priorityColors[complaint.priority]} size="sm">
              {complaint.priority}
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ComplaintCard;