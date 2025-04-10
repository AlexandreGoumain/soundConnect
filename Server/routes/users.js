const { Router } = require("express");
const {
    createUserItSelf,
    getAllUsers,
    getUserById,
    updateUser,
    updateUserPassword,
    deleteUser,
} = require("../controllers/userController");

const UserRouter = Router();

UserRouter.post("/", createUserItSelf);

UserRouter.get("/", getAllUsers);
UserRouter.get("/:id", getUserById);

UserRouter.put("/:id", updateUser);
UserRouter.put("/:id/password", updateUserPassword);

UserRouter.delete("/:id", deleteUser);

module.exports = UserRouter;
