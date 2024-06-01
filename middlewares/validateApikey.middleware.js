const UserService = require("../services/user.service")

async function validateApiKey(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    const user = await UserService.findUserByApikey(apiKey);
  
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
  
    req.user = user;
    next();
  }
  
module.exports = validateApiKey;
