import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const authenticateToken = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if(token) {
            jwt.verify(token,process.env.JWT_SECTRET,(err)=> {
                if(err) {
                    res.redirect('/login')
                }else {
                    next();
                }
            })
        }else {
            res.redirect('/login')
        }

    } catch (e) {
        res.status(401).json({
            succeed: false,
            error: "Not authorized"
        })
    }
}

const checkUser = async (req,res,next) => {
    const token = req.cookies.jwt

    if(token) {
        jwt.verify(token,process.env.JWT_SECTRET, async (err,decodedToken) => {
            if(err) {

                res.locals.user = null
                next()
            }else {
                const user = await User.findById(decodedToken.userId)
                res.locals.user = user
                next();
            }
        })
    }else {
        res.locals.user = null
        next()
    }
}

export default {authenticateToken,checkUser}