const UserService = require("../services/user.service");
class UserController {
  async fetchAll(req, res) {
    try {
      const fetchedUsers = await UserService.fetch({});

      res.status(200).json({
        success: true,
        message: "User fetched successfully",
        data: fetchedUsers,
      });
    } catch (error) {
      // Handle errors
      console.error("Error fetching users:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async deleteUser(req, res) {
    try {
      const userId = req.params.id;
      //Check if the user to delete is in the database
      const existingUser = await UserService.findUserById(userId);
      if (!existingUser) {
        return res.status(403).json({
          success: false,
          message: "User to delete does not exist",
        });
      }

      const deletedUser = await UserService.delete(userId);

      res.status(200).json({
        success: true,
        message: "User deleted successfully",
        data: deletedUser,
      });
    } catch (error) {
      // Handle errors
      console.error("Error deleting user:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}

module.exports = new UserController();
