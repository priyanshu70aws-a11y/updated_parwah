// const API_URL = 'http://localhost:5000/api';

// export const api = {
//   // Complaints
//   getAllComplaints: async () => {
//     const response = await fetch(`${API_URL}/complaints`);
//     return response.json();
//   },

//   getComplaintById: async (id) => {
//     const response = await fetch(`${API_URL}/complaints/${id}`);
//     return response.json();
//   },

//   getComplaintsByStatus: async (status) => {
//     const response = await fetch(`${API_URL}/complaints/status/${status}`);
//     return response.json();
//   },

//   // Users
//   getAllUsers: async () => {
//     const response = await fetch(`${API_URL}/users`);
//     return response.json();
//   },

//   getLeaderboard: async () => {
//     const response = await fetch(`${API_URL}/users/leaderboard`);
//     return response.json();
//   },

//   // Stats
//   getDashboardStats: async () => {
//     const response = await fetch(`${API_URL}/stats/dashboard`);
//     return response.json();
//   }
// };








// const API_URL = 'http://localhost:5000/api';

// export const api = {
//   // Complaints
//   getAllComplaints: async () => {
//     const response = await fetch(`${API_URL}/complaints`);
//     return response.json();
//   },

//   getComplaintById: async (id) => {
//     const response = await fetch(`${API_URL}/complaints/${id}`);
//     return response.json();
//   },

//   getComplaintsByStatus: async (status) => {
//     const response = await fetch(`${API_URL}/complaints/status/${status}`);
//     return response.json();
//   },

//   // Users
//   getAllUsers: async () => {
//     const response = await fetch(`${API_URL}/users`);
//     return response.json();
//   },

//   getLeaderboard: async () => {
//     const response = await fetch(`${API_URL}/users/leaderboard`);
//     return response.json();
//   },

//   // Stats
//   getDashboardStats: async () => {
//     const response = await fetch(`${API_URL}/stats/dashboard`);
//     return response.json();
//   }
// };



















const API_URL = 'http://localhost:5000/api';

// Helper to get token
const getToken = () => localStorage.getItem('token');

// Helper to set headers
const getHeaders = () => ({
  'Content-Type': 'application/json',
  ...(getToken() && { 'Authorization': `Bearer ${getToken()}` })
});

export const api = {
  // Auth
  register: async (userData) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return response.json();
  },

  login: async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return response.json();
  },

  getMe: async () => {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: getHeaders()
    });
    return response.json();
  },

   getAllComplaints: async () => {
    const response = await fetch(`${API_URL}/complaints`);
    return response.json();
  },

  getComplaintById: async (id) => {
    const response = await fetch(`${API_URL}/complaints/${id}`);
    return response.json();
  },

  getComplaintsByStatus: async (status) => {
    const response = await fetch(`${API_URL}/complaints/status/${status}`);
    return response.json();
  },

  // Create complaint (needs auth)
  createComplaint: async (complaintData) => {
    const response = await fetch(`${API_URL}/complaints`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(complaintData)
    });
    return response.json();
  },

  // // Complaints (keep existing + update to use auth)
  // getAllComplaints: async () => {
  //   const response = await fetch(`${API_URL}/complaints`);
  //   return response.json();
  // },

  // getComplaintById: async (id) => {
  //   const response = await fetch(`${API_URL}/complaints/${id}`);
  //   return response.json();
  // },

  // getComplaintsByStatus: async (status) => {
  //   const response = await fetch(`${API_URL}/complaints/status/${status}`);
  //   return response.json();
  // },

  // Users
  getAllUsers: async () => {
    const response = await fetch(`${API_URL}/users`);
    return response.json();
  },

  getLeaderboard: async () => {
    const response = await fetch(`${API_URL}/users/leaderboard`);
    return response.json();
  },

  getUserComplaints: async () => {
    const response = await fetch(`${API_URL}/users/me/complaints`, {
      headers: getHeaders()
    });
    return response.json();
  },

  // Stats
  getDashboardStats: async () => {
    const response = await fetch(`${API_URL}/stats/dashboard`);
    return response.json();
  },
  getHeatmapData: async () => {
    const response = await fetch(`${API_URL}/complaints/heatmap`);
    return response.json();
  },
  getComplaintTimeline: async (complaintId) => {
    const response = await fetch(`${API_URL}/complaints/${complaintId}/timeline`);
    return response.json();
  },
  getNiegGroups: async () => {
    const response = await fetch(`${API_URL}/complaints/groups/nieg`);
    return response.json();
  },
  getRealtimeStream: () => new EventSource(`${API_URL}/realtime/stream`),
  // Add these functions:

// Votes
toggleVote: async (complaintId, voteType) => {
  const response = await fetch(`${API_URL}/votes/${complaintId}`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ voteType })
  });
  return response.json();
},

getUserVote: async (complaintId) => {
  const response = await fetch(`${API_URL}/votes/${complaintId}/user`, {
    headers: getHeaders()
  });
  return response.json();
},
// Comments
addComment: async (complaintId, content) => {
  const response = await fetch(`${API_URL}/comments/${complaintId}`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ content })
  });
  return response.json();
},

getComments: async (complaintId) => {
  const response = await fetch(`${API_URL}/comments/${complaintId}`);
  return response.json();
},
// Update complaint (admin)
updateComplaint: async (id, updates) => {
  const response = await fetch(`${API_URL}/complaints/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(updates)
  });
  return response.json();
},
// Categories
getCategories: async () => {
  const response = await fetch(`${API_URL}/categories`);
  return response.json();
},
// Upload images
uploadImages: async (files) => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('images', file);
  });

  const response = await fetch(`${API_URL}/upload/images`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken()}`
    },
    body: formData
  });
  return response.json();
},

};
