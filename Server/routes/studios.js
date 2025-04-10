const { Router } = require("express");
const {
    createStudio,
    getAllStudios,
    getStudioById,
    updateStudio,
    deleteStudio,
    getStudioByOwnerId,
    getStudioByTag,
} = require("../controllers/studioController");

const StudioRouter = Router();

StudioRouter.post("/", createStudio);

StudioRouter.get("/", getAllStudios);
StudioRouter.get("/:id", getStudioById);
StudioRouter.get("/owner/:id", getStudioByOwnerId);
StudioRouter.get("/tag/:tag", getStudioByTag);

StudioRouter.put("/:id", updateStudio);
StudioRouter.delete("/:id", deleteStudio);

module.exports = StudioRouter;
