// validation.js
const { check } = require('express-validator');

// Function to check username
function checkUsername() {
  return check('uname')
    .trim()
    .not().isEmpty().withMessage('Name is required')
    .isLength({ min: 4 }).withMessage('Name should be at least 4 characters')
    .isLength({ max: 20 }).withMessage('Name should not exceed 20 characters')
    .escape();
}

// Function to check email
function checkEmail() {
  return check('email')
    .trim()
    .not().isEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please include a valid email')
    .normalizeEmail();
}

// Function to check Pssword
function checkPassword(fieldName) {
  return check(fieldName)
    .trim()
    .not().isEmpty().withMessage(`${fieldName} is required`)
    .isLength({ min: 8 }).withMessage(`${fieldName} should contain st least 8 or more characters`)
    .isLength({ max: 20 }).withMessage(`${fieldName} should not exceed 20 characters`)
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/).withMessage(`${fieldName} should contain a number, an upper & lower case letter, and a special character`)
    .escape();
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
