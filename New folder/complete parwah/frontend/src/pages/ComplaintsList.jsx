// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Card, Badge, Button } from '../components/ui';
// import ComplaintCard from '../components/features/complaints/ComplaintCard';
// import { api } from '../services/api';
// import './ComplaintsList.css';

// const ComplaintsList = () => {
//   const navigate = useNavigate();  // ✅ Moved inside component
//   const [complaints, setComplaints] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState('all');

//   useEffect(() => {
//     fetchComplaints();
//   }, [filter]);

//   const fetchComplaints = async () => {
//     setLoading(true);
//     try {
//       const response = filter === 'all' 
//         ? await api.getAllComplaints()
//         : await api.getComplaintsByStatus(filter);
//       setComplaints(response.data);
//     } catch (error) {
//       console.error('Error fetching complaints:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filters = [
//     { value: 'all', label: 'All', count: complaints.length },
//     { value: 'pending', label: 'Pending' },
//     { value: 'in_progress', label: 'In Progress' },
//     { value: 'resolved', label: 'Resolved' },
//     { value: 'escalated', label: 'Escalated' }
//   ];

//   return (
//     <div className="complaints-page">
//       {/* <div className="page-header">
//         <div>
//           <h1>Civic Complaints</h1>
//           <p>Track and resolve community issues</p>
//         </div>
//         <Button variant="primary" size="lg" onClick={() => navigate('/submit')}>
//           + Report Issue
//         </Button>
//       </div> */}

//       <Card>
//         <div className="filters">
//           {filters.map(f => (
//             <button
//               key={f.value}
//               className={`filter-btn ${filter === f.value ? 'active' : ''}`}
//               onClick={() => setFilter(f.value)}
//             >
//               {f.label}
//             </button>
//           ))}
//         </div>
//       </Card>

//       {loading ? (
//         <div className="loading">
//     <Spinner size="lg" />
//     <p>Loading complaints...</p>
//   </div>
// ) : complaints.length === 0 ? (
//   <div className="empty-state">
//     <div className="empty-icon">📭</div>
//     <h3>No complaints found</h3>
//     <p>Be the first to report an issue in your community</p>
//     <Button variant="primary" onClick={() => navigate('/submit')}>
//       Report First Issue
//     </Button>
//   </div>
// ) : (
//   <div className="complaints-grid">
//     {complaints.map(complaint => (
//       <ComplaintCard 
//         key={complaint.id} 
//         complaint={complaint}
//       />
//     ))}
//   </div>
// )}
//       {/* {loading ? (
//         <div className="loading">Loading complaints...</div>
//       ) : (
//         <div className="complaints-grid">
//           {complaints.map(complaint => (
//             <ComplaintCard 
//               key={complaint.id} 
//               complaint={complaint}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   ); */};
// ;



// export default ComplaintsList;











// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Card, Badge, Button, Spinner } from '../components/ui';  // Add Spinner here
// import ComplaintCard from '../components/features/complaints/ComplaintCard';
// import { api } from '../services/api';
// import './ComplaintsList.css';

// const ComplaintsList = () => {
//   const navigate = useNavigate();
//   const [complaints, setComplaints] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState('all');

//   useEffect(() => {
//     fetchComplaints();
//   }, [filter]);

//   const fetchComplaints = async () => {
//     setLoading(true);
//     try {
//       const response = filter === 'all' 
//         ? await api.getAllComplaints()
//         : await api.getComplaintsByStatus(filter);
//       setComplaints(response.data);
//     } catch (error) {
//       console.error('Error fetching complaints:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filters = [
//     { value: 'all', label: 'All', count: complaints.length },
//     { value: 'pending', label: 'Pending' },
//     { value: 'in_progress', label: 'In Progress' },
//     { value: 'resolved', label: 'Resolved' },
//     { value: 'escalated', label: 'Escalated' }
//   ];

//   return (
//     <div className="complaints-page fade-in">
//       <Card>
//         <div className="filters">
//           {filters.map(f => (
//             <button
//               key={f.value}
//               className={`filter-btn ${filter === f.value ? 'active' : ''}`}
//               onClick={() => setFilter(f.value)}
//             >
//               {f.label}
//             </button>
//           ))}
//         </div>
//       </Card>

//       {loading ? (
//         <div className="loading">
//           <Spinner size="lg" />
//           <p>Loading complaints...</p>
//         </div>
//       ) : complaints.length === 0 ? (
//         <div className="empty-state">
//           <div className="empty-icon">📭</div>
//           <h3>No complaints found</h3>
//           <p>Be the first to report an issue in your community</p>
//           <Button variant="primary" onClick={() => navigate('/submit')}>
//             Report First Issue
//           </Button>
//         </div>
//       ) : (
//         <div className="complaints-grid">
//           {complaints.map(complaint => (
//             <ComplaintCard 
//               key={complaint.id} 
//               complaint={complaint}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ComplaintsList;














































import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Badge, Button, Spinner, Input } from '../components/ui';
import ComplaintCard from '../components/features/complaints/ComplaintCard';
import { api } from '../services/api';
import './ComplaintsList.css';

const ComplaintsList = () => {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, [filter]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const response =
        filter === 'all'
          ? await api.getAllComplaints()
          : await api.getComplaintsByStatus(filter);

      setComplaints(response.data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  // 🔍 SEARCH FILTER LOGIC
  const filteredComplaints = complaints.filter((complaint) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      complaint.title?.toLowerCase().includes(searchLower) ||
      complaint.description?.toLowerCase().includes(searchLower) ||
      complaint.address?.toLowerCase().includes(searchLower) ||
      complaint.category?.name?.toLowerCase().includes(searchLower)
    );
  });

  const filters = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'escalated', label: 'Escalated' }
  ];

  return (
    <div className="complaints-page fade-in">
      <Card>
        {/* 🔍 SEARCH BAR */}
        <div className="search-bar">
          <Input
            type="text"
            placeholder="🔍 Search complaints by title, description, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* FILTER BUTTONS */}
        <div className="filters">
          {filters.map((f) => (
            <button
              key={f.value}
              className={`filter-btn ${filter === f.value ? 'active' : ''}`}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </Card>

      {loading ? (
        <div className="loading">
          <Spinner size="lg" />
          <p>Loading complaints...</p>
        </div>
      ) : filteredComplaints.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No complaints found</h3>
          <p>Try adjusting filters or search keywords</p>
          <Button variant="primary" onClick={() => navigate('/submit')}>
            Report First Issue
          </Button>
        </div>
      ) : (
        <div className="complaints-grid">
          {filteredComplaints.map((complaint) => (
            <ComplaintCard
              key={complaint.id}
              complaint={complaint}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ComplaintsList;
