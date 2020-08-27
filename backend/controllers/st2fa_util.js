  /**
 * Reference
 * https://nodejs.org/api/crypto.html
 * https://gist.github.com/siwalikm/8311cf0a287b98ef67c73c1b03b47154
 *
 */

const crypto = require('crypto');


const password = 'merchantasset.co.th';
const ENC_KEY = crypto.scryptSync(password, 'salt', 32);

exports.encrypt = ((val) => {
  let iv = crypto.randomBytes(8).toString('hex')

  let cipher = crypto.createCipheriv('aes-256-cbc', ENC_KEY, iv);
  let encrypted = cipher.update(val, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return { "data": encrypted, "iv": iv };
});

exports.decrypt = ((encrypted,iv) => {
  let decipher = crypto.createDecipheriv('aes-256-cbc', ENC_KEY, iv);
  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  return (decrypted + decipher.final('utf8'));
});


/**
 * Test Encrypt/Decrypt function
 */
const phrase = "0897765331";
test_crypt=()=>{
  console.log('***original >' + phrase)

  encrypted = exports.encrypt(phrase);
  console.log('***encrypted >' + JSON.stringify(encrypted))

  original_phrase = exports.decrypt(encrypted.data,encrypted.iv);
  console.log('***decrypted >' + original_phrase)
}

// test_crypt();


