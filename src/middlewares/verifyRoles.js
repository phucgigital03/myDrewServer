
const verifyRoles = (...allowRoles)=>{
    return (req,res,next)=>{
        if(!req?.roles){
            return res.status(403).json({
                statusCode: 403,
                errorMessage: 'forbiden'
            })
        }
        const roleArray = [...allowRoles];
        const rolesValidated = req.roles.filter((role)=>{
            return roleArray.includes(role);
        });
        if(!rolesValidated.length){
            return res.status(401).json({
                statusCode: 401,
                errorMessage: 'unauthorization'
            })
        }
        next();
    }
}

module.exports = verifyRoles
