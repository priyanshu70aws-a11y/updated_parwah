// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Card, Button, Input, Toast } from '../components/ui';
// import { api } from '../services/api';
// import './SubmitComplaint.css';

// const SubmitComplaint = () => {
//   const navigate = useNavigate();
//   const [toast, setToast] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [categories, setCategories] = useState([]);
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     categoryId: '',
//     address: '',
//     landmark: '',
//     latitude: '',
//     longitude: ''
//   });

//   useEffect(() => {
//     setCategories([
//       { id: '1', name: 'Pothole', icon: '🕳️' },
//       { id: '2', name: 'Garbage', icon: '🗑️' },
//       { id: '3', name: 'Streetlight', icon: '💡' },
//       { id: '4', name: 'Water Leakage', icon: '💧' },
//       { id: '5', name: 'Drainage', icon: '🚰' }
//     ]);
//   }, []);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       console.log('Submitting complaint:', formData);
      
//       setTimeout(() => {
//         setToast({ message: 'Complaint submitted successfully!', type: 'success' });
//         setTimeout(() => navigate('/'), 1500);
//       }, 1000);
//     } catch (error) {
//       console.error('Error submitting complaint:', error);
//       setToast({ message: 'Failed to submit complaint', type: 'error' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getCurrentLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setFormData({
//             ...formData,
//             latitude: position.coords.latitude.toString(),
//             longitude: position.coords.longitude.toString()
//           });
//           alert('Location captured successfully!');
//         },
//         (error) => {
//           alert('Error getting location: ' + error.message);
//         }
//       );
//     } else {
//       alert('Geolocation is not supported by your browser');
//     }
//   };
  
//   return (
//     <>
//       {toast && (
//         <Toast 
//           message={toast.message} 
//           type={toast.type} 
//           onClose={() => setToast(null)} 
//         />
//       )}
//       <div className="submit-page">
//         <Card>
//           <form onSubmit={handleSubmit} className="complaint-form">
//             <div className="form-section">
//               <h2>Issue Details</h2>
              
//               <Input
//                 label="Title"
//                 name="title"
//                 placeholder="Brief description of the issue"
//                 value={formData.title}
//                 onChange={handleChange}
//                 required
//               />

//               <div className="form-group">
//                 <label className="form-label">
//                   Description <span className="required">*</span>
//                 </label>
//                 <textarea
//                   name="description"
//                   className="form-textarea"
//                   placeholder="Provide detailed information about the issue"
//                   value={formData.description}
//                   onChange={handleChange}
//                   rows="5"
//                   required
//                 />
//               </div>

//               <div className="form-group">
//                 <label className="form-label">
//                   Category <span className="required">*</span>
//                 </label>
//                 <select
//                   name="categoryId"
//                   className="form-select"
//                   value={formData.categoryId}
//                   onChange={handleChange}
//                   required
//                 >
//                   <option value="">Select a category</option>
//                   {categories.map(cat => (
//                     <option key={cat.id} value={cat.id}>
//                       {cat.icon} {cat.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div className="form-section">
//               <h2>Location</h2>

//               <Input
//                 label="Address"
//                 name="address"
//                 placeholder="Street address or area"
//                 value={formData.address}
//                 onChange={handleChange}
//                 required
//               />

//               <Input
//                 label="Landmark (Optional)"
//                 name="landmark"
//                 placeholder="Nearby landmark for easy identification"
//                 value={formData.landmark}
//                 onChange={handleChange}
//               />

//               <div className="location-row">
//                 <Input
//                   label="Latitude"
//                   name="latitude"
//                   type="number"
//                   step="any"
//                   placeholder="28.4744"
//                   value={formData.latitude}
//                   onChange={handleChange}
//                 />

//                 <Input
//                   label="Longitude"
//                   name="longitude"
//                   type="number"
//                   step="any"
//                   placeholder="77.5040"
//                   value={formData.longitude}
//                   onChange={handleChange}
//                 />
//               </div>

//               <Button 
//                 type="button" 
//                 variant="outline" 
//                 onClick={getCurrentLocation}
//                 fullWidth
//               >
//                 📍 Use Current Location
//               </Button>
//             </div>

//             <div className="form-section">
//               <h2>Upload Images (Coming Soon)</h2>
//               <div className="upload-placeholder">
//                 <p>📷 Image upload feature will be added soon</p>
//               </div>
//             </div>

//             <div className="form-actions">
//               <Button 
//                 type="button" 
//                 variant="secondary" 
//                 onClick={() => navigate('/')}
//               >
//                 Cancel
//               </Button>
//               <Button 
//                 type="submit" 
//                 variant="primary" 
//                 disabled={loading}
//               >
//                 {loading ? 'Submitting...' : 'Submit Complaint'}
//               </Button>
//             </div>
//           </form>
//         </Card>
//       </div>
//     </>
//   );
// };

// export default SubmitComplaint;





























import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, Toast } from '../components/ui';
import { api } from '../services/api';
import './SubmitComplaint.css';


const SubmitComplaint = () => {
  const navigate = useNavigate();

  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  // ✅ Form data with images
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    address: '',
    landmark: '',
    latitude: '',
    longitude: '',
    images: []
  });

  // ✅ Image previews
  const [imagePreviews, setImagePreviews] = useState([]);

  // useEffect(() => {
  //   setCategories([
  //     { id: '1', name: 'Pothole', icon: '🕳️' },
  //     { id: '2', name: 'Garbage', icon: '🗑️' },
  //     { id: '3', name: 'Streetlight', icon: '💡' },
  //     { id: '4', name: 'Water Leakage', icon: '💧' },
  //     { id: '5', name: 'Drainage', icon: '🚰' }
  //   ]);
  // }, []);
//   useEffect(() => {
//   fetchCategories();
// }, []);

// const fetchCategories = async () => {
//   try {
//     // For now, fetch from seeded data
//     // Later we'll create a categories API endpoint
//     setCategories([
//       { id: '02dffb07-57c9-4d25-9b90-875f1bbb9934', name: 'Pothole', icon: '🕳️' },
//       { id: '92bc749a-21c8-4e8c-8ad9-d6ba9273bb37', name: 'Garbage', icon: '🗑️' },
//       { id: '1cb8979e-0ac5-4815-a096-c38b57eb9604', name: 'Streetlight', icon: '💡' },
//       { id: '9f5c9348-f5e6-402f-a901-ce7764072715', name: 'Water Leakage', icon: '💧' },
//       { id: '49aea733-89dc-4c7d-9220-6be41ae58940', name: 'Drainage', icon: '🚰' }
//     ]);
//   } catch (error) {
//     console.error('Error fetching categories:', error);
//   }
// };
useEffect(() => {
  fetchCategories();
}, []);

const fetchCategories = async () => {
  try {
    const response = await api.getCategories();
    if (response.success) {
      setCategories(response.data);
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Fallback to empty array
    setCategories([]);
  }
};

  // ✅ Generic input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ✅ Image upload handler
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + imagePreviews.length > 5) {
      setToast({ message: 'Maximum 5 images allowed', type: 'error' });
      return;
    }

    const newPreviews = files.map(file =>
      URL.createObjectURL(file)
    );

    setImagePreviews(prev => [...prev, ...newPreviews]);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  // ✅ Remove image
  const removeImage = (index) => {
    setImagePreviews(prev =>
      prev.filter((_, i) => i !== index)
    );
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // // ✅ Submit handler
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     console.log('Submitting complaint:', formData);

  //     // 🔜 Backend ready (FormData)
  //     // const payload = new FormData();
  //     // Object.entries(formData).forEach(([key, value]) => {
  //     //   if (key === 'images') {
  //     //     value.forEach(img => payload.append('images', img));
  //     //   } else {
  //     //     payload.append(key, value);
  //     //   }
  //     // });
  //     // await api.post('/complaints', payload);

  //     setTimeout(() => {
  //       setToast({
  //         message: 'Complaint submitted successfully!',
  //         type: 'success'
  //       });
  //       setTimeout(() => navigate('/'), 1500);
  //     }, 1000);
  //   } catch (error) {
  //     console.error(error);
  //     setToast({
  //       message: 'Failed to submit complaint',
  //       type: 'error'
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };
//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   setLoading(true);

//   try {
//     console.log('Submitting complaint:', formData);
    
//     const response = await api.createComplaint(formData);
//     console.log('Response:', response);
    
//     if (response.success) {
//       setToast({ message: 'Complaint submitted successfully!', type: 'success' });
//       setTimeout(() => navigate('/'), 1500);
//     } else {
//       setToast({ message: response.message || 'Failed to submit', type: 'error' });
//     }
//   } catch (error) {
//     console.error('Error submitting complaint:', error);
//     setToast({ message: 'Failed to submit complaint', type: 'error' });
//   } finally {
//     setLoading(false);
//   }
// };
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    let imageUrls = [];

    // Upload images first if any
    if (formData.images && formData.images.length > 0) {
      console.log('Uploading images...');
      const uploadResponse = await api.uploadImages(formData.images);
      
      if (uploadResponse.success) {
        imageUrls = uploadResponse.data.map(img => img.url);
        console.log('Images uploaded:', imageUrls);
      } else {
        setToast({ message: 'Failed to upload images', type: 'error' });
        setLoading(false);
        return;
      }
    }

    // Submit complaint with image URLs
    const complaintData = {
      title: formData.title,
      description: formData.description,
      categoryId: formData.categoryId,
      address: formData.address,
      landmark: formData.landmark,
      latitude: formData.latitude,
      longitude: formData.longitude,
      imageUrls
    };

    console.log('Submitting complaint:', complaintData);
    
    const response = await api.createComplaint(complaintData);
    console.log('Response:', response);
    
    if (response.success) {
      setToast({ message: 'Complaint submitted successfully!', type: 'success' });
      setTimeout(() => navigate('/'), 1500);
    } else {
      setToast({ message: response.message || 'Failed to submit', type: 'error' });
    }
  } catch (error) {
    console.error('Error submitting complaint:', error);
    setToast({ message: 'Failed to submit complaint', type: 'error' });
  } finally {
    setLoading(false);
  }
};

  // ✅ Geolocation
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString()
        }));
        alert('Location captured successfully!');
      },
      (error) => alert(error.message)
    );
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="submit-page">
        <Card>
          <form
            onSubmit={handleSubmit}
            className="complaint-form"
          >

            {/* ISSUE DETAILS */}
            <div className="form-section">
              <h2>Issue Details</h2>

              <Input
                label="Title"
                name="title"
                placeholder="Brief description"
                value={formData.title}
                onChange={handleChange}
                required
              />

              <div className="form-group">
                <label className="form-label">
                  Description <span className="required">*</span>
                </label>
                <textarea
                  name="description"
                  className="form-textarea"
                  placeholder="Describe the issue"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Category <span className="required">*</span>
                </label>
                <select
                  name="categoryId"
                  className="form-select"
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* LOCATION */}
            <div className="form-section">
              <h2>Location</h2>

              <Input
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />

              <Input
                label="Landmark (Optional)"
                name="landmark"
                value={formData.landmark}
                onChange={handleChange}
              />

              <div className="location-row">
                <Input
                  label="Latitude"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                />
                <Input
                  label="Longitude"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                />
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={getCurrentLocation}
                fullWidth
              >
                📍 Use Current Location
              </Button>
            </div>

            {/* IMAGE UPLOAD */}
            <div className="form-section">
              <h2>Upload Images</h2>

              <div className="upload-area">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />

                <label
                  htmlFor="image-upload"
                  className="upload-label"
                >
                  <div className="upload-content">
                    <span className="upload-icon">📷</span>
                    <span className="upload-text">
                      Click to upload images
                    </span>
                    <span className="upload-hint">
                      Maximum 5 images (JPG, PNG)
                    </span>
                  </div>
                </label>
              </div>

              {imagePreviews.length > 0 && (
                <div className="image-previews">
                  {imagePreviews.map((preview, index) => (
                    <div
                      key={index}
                      className="preview-item"
                    >
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                      />
                      <button
                        type="button"
                        className="remove-image"
                        onClick={() => removeImage(index)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ACTIONS */}
            <div className="form-actions">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Complaint'}
              </Button>
            </div>




            

          </form>
        </Card>
      </div>
    </>
  );
};

export default SubmitComplaint;

