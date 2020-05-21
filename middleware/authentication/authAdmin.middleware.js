const db = require('../../db.js')
module.exports = (req, res, next) => {

    if(!req.signedCookies.userId){
        next()
        return
    }
    const user = db
                .get('users')
                .find({
                    id: req.signedCookies.userId
                })
                .value()
    if(!user){
        next()
        return
    }
    if(user.isAdmin === false){
        res.locals.userMember = user;
        next();
        return;
    }
    if(user.isAdmin === true){
        res.locals.userAdmin = user;
        next()
    }
    next()

}