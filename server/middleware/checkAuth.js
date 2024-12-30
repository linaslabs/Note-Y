
const path = require('path')

exports.isLoggedIn = function(req,res,next){
    if(req.user){
        next();
    }else{
        return res.status(403).render('error', { title: 'Access Denied', errorCode: '403', information : 'Access to the dashboard is denied, login first!'});
    }
}