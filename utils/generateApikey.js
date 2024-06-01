const { v4: uuidv4 } = require('uuid');

const generateApikey = () => {
    return uuidv4();
}

module.exports = generateApikey;