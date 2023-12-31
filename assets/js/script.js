// Array of special characters to be included in password
const specialCharacters = [
  '@',
  '%',
  '+',
  '\\',
  '/',
  "'",
  '!',
  '#',
  '$',
  '^',
  '?',
  ':',
  ',',
  ')',
  '(',
  '}',
  '{',
  ']',
  '[',
  '~',
  '-',
  '_',
  '.'
];

// Array of numeric characters to be included in password
const numericCharacters = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

// Array of lowercase characters to be included in password
const lowerCasedCharacters = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z'
];

// Array of uppercase characters to be included in password
const upperCasedCharacters = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z'
];

// Function to prompt user for password options
function getPasswordOptions() {
  let stop = true; // Variable to control the loop
  let charTypes = []; // Array to store selected character types
  let passwordLength = 0; // Variable to store the password length
  
  // Loop to ensure a valid password length is entered
  while (stop) {
    // Prompt the user for password length
    passwordLength = prompt('Enter password length between [8 - 128] characters: ');
        
    if(passwordLength === null || Number(passwordLength) >= 8 && Number(passwordLength) <= 128){
      stop = false; // Exit the loop if a valid input is received
    }else if(passwordLength !== null && (Number(passwordLength) < 8 || Number(passwordLength) > 128)){
      // Display an alert for an invalid password length      
      alert('Please enter a valid password length');
    }else{
      // Display an alert for non-numeric input
      alert('Only numbers between [8 - 128] are allowed');
    }
  }

  // Check if the user provided a password length (didn't click cancel)
  if(passwordLength !== null){
    // Prompt user for character type options
    const lowerCase = confirm('Click OK to confirm to include lowercase characters.');

    if(lowerCase) {
      charTypes = [...charTypes, ...lowerCasedCharacters];
    }
  
    const upperCase = confirm('Click OK to confirm to include uppercase characters.');

    if(upperCase) {
      charTypes = [...charTypes, ...upperCasedCharacters];
    }
    
    const numericValues = confirm('Click OK to confirm to include numeric characters.');

    if(numericValues) {
      charTypes = [...charTypes, ...numericCharacters];
    }

    const specialChars = confirm('Click OK to confirm to include special characters [$@%&*, etc].');  
      
    if(specialChars) {
      charTypes = [...charTypes, ...specialCharacters];
    }

    // Check if at least one character type is chosen
    if(charTypes.length !== 0){
      // Return an object with password options
      return {
        passwordLength: passwordLength, 
        charTypes: charTypes.join('') // Convert the array to a string
      }
    }else{
      // Display an alert if no character type is chosen
      alert('Ensure that at least one character type is chosen.')
    }
  }

  // Return false if the user clicked cancel or didn't provide valid options
  return false;
}


// Generates a random password of the specified length using the Math.random() function
function getMathRandomNum(length, chars) {
   // variable for storing generated password 
   let randomPassword = '';

  for(let i = 0; i < length; i++){     
    // Generate a random index within the range of chars length
    let char = Math.floor(Math.random() * chars.length  // random number between 0 (inclusive) and the chars length
                                        + 1); // +1 is used to adjust the range to be inclusive of the upper bound
    // Convert random number to the character and append to randomPassword variable
    randomPassword += chars.charAt(char);  
  }

  return randomPassword;
}


// Generates a random password of the specified length using the Web Cryptography API
function getCryptoRandomNum(length, chars) {
  // variable for storing generated password 
  let randomPassword = '';

  // unsigned 32-bit array used to get random numbers, where length is the user password length 
  const array = new Uint32Array(length);

  // generte randoms numbers using  Web Cryptography API to fill an array with cryptographically secure random values.
  self.crypto.getRandomValues(array);

  // loop through array and add new random character to the 'randomPassword' variable
  for(const randomNum of array){  
    // the % remainder ensures that the random characters won't be out of the range of 'chars' length variable
    randomPassword += chars[randomNum % chars.length]; 
  }
  
  // return random generated password
  return randomPassword;
}


// Function to generate password with user input
function generatePassword() {
  const getPass = getPasswordOptions();  

  // Get the value of the selected radio button (simple or secure)
  const selectedOptions = document.querySelector('.options:checked').value;

  // create random password only when user input all necessery values
  if(getPass){
    if(selectedOptions === 'simple'){
      return getMathRandomNum(getPass.passwordLength, getPass.charTypes);
    }else if(selectedOptions === 'secure'){
      return getCryptoRandomNum(getPass.passwordLength, getPass.charTypes);
    }
  }else{
    return false;
  }
}


// Get references to the #generate element
const generateBtn = document.querySelector('#generate');

// Write password to the #password input
function writePassword() {
  const password = generatePassword();
  const passwordText = document.querySelector('#password');
 
  // display generated passowrd to the screen
  if(password) passwordText.value = password;
}


// Get references to the .card-options element
const passwordOptions = document.querySelector('.card-options');

// Function to update the placeholder text
function placeholderText() { 
  // The checked radio button
  const options = document.querySelector('.options:checked');

  // The text area where placeholder goes
  const passwordPlaceholder = document.querySelector('.password');
  
  // Check if a radio button is selected
  if(options){
    // Reset the generated password if user toggle the options
    if(passwordPlaceholder.value !== '') passwordPlaceholder.value = '';

    // Store the selected toggle option
    const selectedValue = options.value;    

    // Update the placeholder text based on the selected option
    if(selectedValue === 'simple') {
      passwordPlaceholder.placeholder = "Generates a password using basic randomization method."

    } else{
      passwordPlaceholder.placeholder = "Generates a highly secure password using advanced cryptographic method."
    }
  } 
}


// Copy to clipboard
const clipboard = document.querySelector('#clipboard-container');
// Function to handle copying the password to the clipboard

function copyToClipboard(e) {
  // Select the password input element from the DOM
  const password = document.querySelector('#password');

  // Check if the click event was triggered by the clipboard copy button and if the password is not empty
  if(e.target.className === 'clipboard-copy' && password.value !== ''){
    // Select the clipboard copy button and the clipboard mark elements
    const copy = document.querySelector('.clipboard-copy');
    const mark = document.querySelector('.clipboard-mark');
    
    // Apply fadeInOut animation to the copy button and the clipboard mark
    copy.style.animation = 'fadeInOut 0.5s ease-in-out';
    mark.style.animation = 'fadeInOut 0.5s ease-in-out';
    
    // Hide the copy button and show the clipboard mark
    copy.classList.add('hide');
    mark.classList.remove('hide');
    
    // Copy the password to the clipboard
    navigator.clipboard.writeText(password.value);
    
    // Set a timeout to revert the UI changes
    setTimeout(() => {
      mark.classList.add('hide'); 
      copy.classList.remove('hide');
    }, 1000); // Revert changes after 1s
  }  
}


// Event listener to generate button
generateBtn.addEventListener('click', writePassword);

// Event listener to copy password to clipboard
clipboard.addEventListener('click', copyToClipboard);

// Event listener to change placeholder text
passwordOptions.addEventListener('click', placeholderText)

// Reset to the default state 
document.addEventListener('DOMContentLoaded', function () {
  // Check the 'simple' radio button by default
  document.querySelector('#simple').checked = true;
  
  // Set password to default value, empty string
  document.querySelector('#password').value = '';
});