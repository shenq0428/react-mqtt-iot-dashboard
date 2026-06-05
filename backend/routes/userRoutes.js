// routes/userRoutes.js start from /api/users
//VERIFY TOKEN TO PROTECT THIS ROUTE, ONLY ADMIN AND SUPERADMIN CAN ACCESS THIS ROUTE
const { verifyToken } = require("../middleware/authMiddleware");

const { getUsers, updateUserStatus, deleteUser, createUser} = require("../controllers/userController");
//requireRole function to check if the user has the required role to access this route, only admin and superadmin can access this route
const { requireRole } = require("../middleware/roleMiddleware");

const express = require("express");

const router = express.Router();
//startfrom /api/users route

//create user 
router.post( 
    "/",
    verifyToken, 
    requireRole("admin","superadmin"), 
    createUser
);

//用了两个middelware里的function和一个controllers里的function 来保护这个路由，只有admin和superadmin角色的用户才能访问这个路由
router.get( 
    "/", 
    verifyToken, 
    requireRole("admin","superadmin"), 
    getUsers 
);

//save button in user management page not working, need to add more routes here for update user info, delete user, etc.
router.patch(
    "/:id/status", 
    verifyToken, 
    requireRole("admin", "superadmin"),
    updateUserStatus
);

router.delete(
    "/:id", 
    verifyToken,
    requireRole("admin", "superadmin"),
    deleteUser
);

module.exports = router;