const { Router } = require("express");
const {
    createRole,
    getAllRoles,
    getRoleById,
    updateRole,
    deleteRole,
} = require("../controllers/roleController");

// const { IsAdmin } = require("../middlewares/auth");

const RoleRouter = Router();

RoleRouter.post("/", createRole);
RoleRouter.get("/", getAllRoles);
RoleRouter.get("/:id", getRoleById);
RoleRouter.put("/:id", updateRole);
RoleRouter.delete("/:id", deleteRole);

module.exports = RoleRouter;
