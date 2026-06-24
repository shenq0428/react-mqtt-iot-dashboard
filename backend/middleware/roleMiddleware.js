function requireRole(...allowedRoles) {

    return (req, res, next) => {
        /* debug
         console.log(
            "Current Role:",
            req.user.role
        );

        console.log(
            "Allowed Roles:",
            allowedRoles
        );
        */

        if (!allowedRoles.includes(req.user.role)
        ) {

            return res.status(403).json({
                message: "Access denied"
            });
        }

        next();
    };

}

module.exports = { requireRole};