const UserService = require("../services/user.service")

async function verifyApikey(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    const user = await UserService.findUserByApikey(apiKey);
  
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    if (user.apiKeyInvalidated) {
      return res.status(401).json({ error: 'API key has been invalidated' });
    }
  
    req.user = user;
    next();
  }
  
module.exports = verifyApikey;
