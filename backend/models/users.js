const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

// User plan
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
})

// Validation
userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)

// Email Validation
function validateForm() {
  let isValid = true
  let emailInput = document.getElementById('email')
  let emailError = document.getElementById('emailErrorMsg')
  let emailRegEx = new RegExp("^[A-Za-z0-9._-]+@[A-Za-z0-9]+\.[A-Za-z]+$")
  if(emailRegEx.test(emailInput.value)) {
    emailError.textContent = ""
  }
  else {
    emailError.textContent = "L'email est invalide"
    isValid = false
  }

  return isValid
}