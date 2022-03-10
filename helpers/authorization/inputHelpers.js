const bcrypt = require("bcryptjs");

//İnput içleri doldurulmuş olma kontrolü
const validateUserInput = (email, password) => {
  return email && password;
};

//Login sayfasında hashlenen parolanın açılması işlemi
const comparePassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};
module.exports = {
  validateUserInput,
  comparePassword,
};
