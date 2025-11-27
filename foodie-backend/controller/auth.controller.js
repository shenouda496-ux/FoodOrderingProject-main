const authService = require('../services/auth.service');
module.exports = {
  
  register: async (req, res) => {
    try {
      const result = await AuthService.register(req.body);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  login: async (req, res) => {
    try {
      const result = await AuthService.login(req.body);
      res.status(200).json(result);
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  }

};
