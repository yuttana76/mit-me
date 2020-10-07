// https://www.npmjs.com/package/maskdata#mask-the-exact-substring-from-throughout-the-string
const MaskData = require('maskdata');

const maskCardOptions = {
  // Character to mask the data. Default value is 'X'
  maskWith: "X",

  // Should be positive Integer
  // If the starting 'n' digits needs to be unmasked
  // Default value is 4
  unmaskedStartDigits: 4,

  //Should be positive Integer
  //If the ending 'n' digits needs to be unmasked
  // Default value is 1.
  unmaskedEndDigits: 3
};

const cardNumber = "3560100350330";

const cardAfterMasking = MaskData.maskCard(cardNumber, maskCardOptions);

console.log(cardAfterMasking)

