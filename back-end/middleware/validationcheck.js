// validation.js
const { check } = require('express-validator');

// Function to check username
function checkUsername() {
  return [
    check('uname', 'Display Name is required').trim().not().isEmpty().escape(),
    check('uname', 'Display Name should be at least 5 characters').isLength({ min: 4 }),
    check('uname', 'Display Name should not exceed 20 characters').isLength({ max: 20 })
  ];
}

// Function to check email
function checkEmail() {
  return check('email', 'Please include a valid email').trim().isEmail().normalizeEmail();
}

// Function to check password
function checkPassword(fieldName) {
  return [
    check(fieldName, 'Please enter a password with 6 or more characters').trim().isLength({ min: 8 }).escape(),
    check(fieldName, 'Password should not exceed 20 characters').isLength({ max: 20 }),
    check(fieldName, 'Password should contain at least one number, one uppercase letter, one lowercase letter, and one special character').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/)
  ];
}

// Function to check ID
function checkId(fieldName) {
    return check(fieldName)
      .trim()
      .notEmpty().withMessage(`${fieldName} is required`)
      .isString().withMessage(`${fieldName} must be a string`)
      .isLength({ min: 24, max: 24 }).withMessage(`${fieldName} must be 24 characters long`)
      .escape();
  }
  
  // Function to check content
  function checkContent(fieldName) {
    return check(fieldName)
      .trim()
      .notEmpty().withMessage(`${fieldName} is required`)
      .isString().withMessage(`${fieldName} must be a string`)
      .custom(value => {
        if(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(value)) {
          throw new Error(`${fieldName} must not include script tags`);
        }
        return true;
      });
  }
  
module.exports = {
  checkUsername,
  checkEmail,
  checkPassword,
  checkId,
  checkContent

};
