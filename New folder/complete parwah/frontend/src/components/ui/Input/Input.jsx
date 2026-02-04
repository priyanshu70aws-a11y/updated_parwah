// import React from 'react';
// import './Input.css';

// const Input = ({ 
//   label,
//   type = 'text',
//   placeholder,
//   value,
//   onChange,
//   error,
//   required = false,
//   disabled = false,
// }) => {
//   return (
//     <div className="input-wrapper">
//       {label && (
//         <label className="input-label">
//           {label}
//           {required && <span className="input-required">*</span>}
//         </label>
//       )}
//       <input
//         type={type}
//         className={`input ${error ? 'input-error' : ''}`}
//         placeholder={placeholder}
//         value={value}
//         onChange={onChange}
//         required={required}
//         disabled={disabled}
//       />
//       {error && <span className="input-error-message">{error}</span>}
//     </div>
//   );
// };

// export default Input;













import React from 'react';
import './Input.css';

const Input = ({ 
  label,
  type = 'text',
  name,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  step,
  className = ''
}) => {
  return (
    <div className={`input-wrapper ${className}`}>
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        className={`input ${error ? 'input-error' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        step={step}
      />
      {error && <span className="input-error-message">{error}</span>}
    </div>
  );
};

export default Input;