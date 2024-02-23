
import User from "./User_Schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const expiresIn = (60 * 60)*7; 
const Gg_Callback = async (req) => {
    
    console.log("=====================GGID==========================")
    console.log(req.session.passport.user)
    try {
        const GgId = req.session.passport.user;
        const user = await User.findOne({ GgId: GgId });
        if (!user) {
            return {
                status: 400,
                error: "User does not exist."
            }
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {expiresIn});
        const salt = await bcrypt.genSalt();
        const tokenHash = await bcrypt.hash(token, salt);
        //save token to DB
        let update = await User.findOneAndUpdate({ _id: user._id }, {
            token: tokenHash
        })
            .then((update) => { })
            .catch((error) => {
                return {
                    status: 400,
                    error: "fail to apply token"
                }
            })

        delete user.password;
        return {
            user: user,
            token: token
        }
    } catch (err) {
        // console.log(err.message)
        return {
            status: 500,
            error: err.message
        }
    }
}

const Fb_Callback = async (req) => {
    try {
        const FbId = req.session.passport.user;
        const user = await User.findOne({ FbId: FbId });
        console.log("callback:", user)
        if (!user) {
            return {
                status: 400,
                error: "User does not exist."
            }
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {expiresIn});
        const salt = await bcrypt.genSalt();
        const tokenHash = await bcrypt.hash(token, salt);
        //save token to DB
        let update = await User.findOneAndUpdate({ _id: user._id }, {
            token: tokenHash
        })
            .then((update) => { })
            .catch((error) => {
                return {
                    status: 400,
                    error: "fail to apply token"
                }
            })

        delete user.password;
        return {
            user: user,
            token: token
        }
    } catch (err) {
        // console.log(err.message)
        return {
            status: 500,
            error: err.message
        }
    }
}
const Gh_Callback = async (req) => {
    try {
        if(!req.session.passport.user){
            try {
                let token = req.signedCookies.token;
                const UUID = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findOne({ Ghid: UUID.id });
                const isMatch = await bcrypt.compare(token, user.token);
                if (isMatch) {
                    req.user = UUID;
                    delete user.password;
                    return {
                        user: user,
                        token: token
                    }
                } else {
                    console.log("Access Denied")
                    return res.status(403).send("Access Denied");
                }
            } catch (err) {
                console.log(err.message)
                res.status(500).json({ error: err.message });
            }
        }
        const GhId = req.session.passport.user;
        const user = await User.findOne({ GhId: GhId });
        if (!user) {
            return {
                status: 400,
                error: "User does not exist."
            }
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {expiresIn});
        const salt = await bcrypt.genSalt();
        const tokenHash = await bcrypt.hash(token, salt);
        //save token to DB
        let update = await User.findOneAndUpdate({ _id: user._id }, {
            token: tokenHash
        })
            .then((update) => { })
            .catch((error) => {
                return {
                    status: 400,
                    error: "fail to apply token"
                }
            })

        delete user.password;
        return {
            user: user,
            token: token
        }
    } catch (err) {
        // console.log(err.message)
        return {
            status: 500,
            error: err.message
        }
    }
}
const Tw_Callback = async (req) => {
    try {
        const TwId = req.session.passport.user;
        const user = await User.findOne({ TwId: TwId });
        if (!user) {
            return {
                status: 400,
                error: "User does not exist."
            }
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {expiresIn});
        const salt = await bcrypt.genSalt();
        const tokenHash = await bcrypt.hash(token, salt);
        //save token to DB
        let update = await User.findOneAndUpdate({ _id: user._id }, {
            token: tokenHash
        })
            .then((update) => { })
            .catch((error) => {
                return {
                    status: 400,
                    error: "fail to apply token"
                }
            })

        delete user.password;
        return {
            user: user,
            token: token
        }
    } catch (err) {
        // console.log(err.message)
        return {
            status: 500,
            error: err.message
        }
    }
}
let output = {
    Gg_Callback,
    Fb_Callback,
    Gh_Callback,
    Tw_Callback
}
export default output