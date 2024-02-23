import * as dotenv from 'dotenv';
dotenv.config()
import AdminChecker from '../models/AdminChecker_model.js'
import UserMovieRental from "../models/UserRentMovie_Schema.js";
import MovieAvailability from "../models/MovieAvailability_Schema.js"
import User from "../models/User_Schema.js";

const Admin_checker = async (req, res) => {
    try {
        let AdminChecker_return = await AdminChecker.isAdmin(req)
        if (AdminChecker_return.err) {
            return res.status(AdminChecker_return.status).json({ error: AdminChecker_return.err });
        } else if (AdminChecker_return.isAdmin) {
            return res.status(AdminChecker_return.status).json({ isAdmin: AdminChecker_return.isAdmin });
        }
    } catch (err) {
        console.log("/auth/admin --- error:", err.message)
    }

}

export const getUsers = async (req, res) => {
    try {
        const user = await User.find();
        res.status(200).json(user);
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const getAvailables = async (req, res) => {
    try {
        const availableMedia = await MovieAvailability.find();
        res.status(200).json(availableMedia);
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
}


const output = {
    Admin_checker,
    getUsers,
    getAvailables
}
export default output;