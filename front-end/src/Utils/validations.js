// validations.js

const validateUsername = (username) => {
    if (!username.trim()) {
      return 'Name is required';
    } else if (username.length < 4) {
      return 'Name should be at least 4 characters';
    } else if (username.length > 20) {
      return 'Name should not exceed 20 characters';
    } else {
      return '';
    }
  };
  
  const validateEmail = (email) => {
    const re = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!email.trim()) {
      return 'Email is required';
    } else if (!re.test(email)) {
      return 'Please include a valid email';
    } else {
      return '';
    }
  };
  
  const validatePassword = (password, fieldName) => {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?{}|<>]).*$/;
    if (!password.trim()) {
      return `${fieldName} is required`;
    } else if (password.length < 8) {
      return `${fieldName} requires at least 8 or more characters`;
    } else if (password.length > 20) {
      return `${fieldName} should not exceed 20 characters`;
    } else if (!re.test(password)) {
      return `${fieldName} requires a number, an upper & lower case letter, and a special character`;
    } else {
      return '';
    }
  };
  
  export { validateUsername, validateEmail, validatePassword };
  