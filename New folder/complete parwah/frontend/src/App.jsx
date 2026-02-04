
// import React from 'react';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import './styles/globalStyles.css';
// import Layout from './components/layout/Layout';
// import ComplaintsList from './pages/ComplaintsList';
// import ComplaintDetail from './pages/ComplaintDetail';
// import SubmitComplaint from './pages/SubmitComplaint';
// import Dashboard from './pages/Dashboard';

// function App() {
//   return (
//     <BrowserRouter>
//       <Layout>
//         <Routes>
//           <Route path="/" element={<ComplaintsList />} />
//           <Route path="/complaint/:id" element={<ComplaintDetail />} />
//           <Route path="/submit" element={<SubmitComplaint />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//         </Routes>
//       </Layout>
//     </BrowserRouter>
//   );
// }

// export default App;























// import React from 'react';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import './styles/globalStyles.css';
// import Layout from './components/layout/Layout';
// import ComplaintsList from './pages/ComplaintsList';
// import ComplaintDetail from './pages/ComplaintDetail';
// import SubmitComplaint from './pages/SubmitComplaint';
// import Dashboard from './pages/Dashboard';
// import Leaderboard from './pages/Leaderboard';

// function App() {
//   return (
//     <BrowserRouter>
//       <Layout>
//         <Routes>
//           <Route path="/" element={<ComplaintsList />} />
//           <Route path="/complaint/:id" element={<ComplaintDetail />} />
//           <Route path="/submit" element={<SubmitComplaint />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/leaderboard" element={<Leaderboard />} />
//           {/* <Route path="*" element={<NotFound />} /> */}
//         </Routes>
//       </Layout>
//     </BrowserRouter>
//   );
// }

// export default App;






















// import React from 'react';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import './styles/globalStyles.css';
// import Layout from './components/layout/Layout';
// import ComplaintsList from './pages/ComplaintsList';
// import ComplaintDetail from './pages/ComplaintDetail';
// import SubmitComplaint from './pages/SubmitComplaint';
// import Dashboard from './pages/Dashboard';
// import Leaderboard from './pages/Leaderboard';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import AdminPanel from './pages/AdminPanel';
// import NotFound from './pages/NotFound';

// function App() {
//   return (
//     <BrowserRouter>
//       <Layout>
//         <Routes>
//           <Route path="/" element={<ComplaintsList />} />
//           <Route path="/complaint/:id" element={<ComplaintDetail />} />
//           <Route path="/submit" element={<SubmitComplaint />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/leaderboard" element={<Leaderboard />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/admin" element={<AdminPanel />} />
//           <Route path="*" element={<NotFound />} />
//         </Routes>
//       </Layout>
//     </BrowserRouter>
//   );
// }

// export default App;
















import React from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/globalStyles.css';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ComplaintsList from './pages/ComplaintsList';
import ComplaintDetail from './pages/ComplaintDetail';
import SubmitComplaint from './pages/SubmitComplaint';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';
import NotFound from './pages/NotFound';


function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Layout>
        <Routes>
          <Route path="/" element={<ComplaintsList />} />
          <Route path="/complaint/:id" element={<ComplaintDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route 
            path="/submit" 
            element={
              <ProtectedRoute>
                <SubmitComplaint />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Only Route */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute adminOnly>
                <AdminPanel />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;