import axios from "axios"

export const verifyToken = async (req, res, next) => {
    try {
        let Authorization = req.header("Authorization")
        let TheReturn = await axios.get(url, {
            headers: {
                "Authorization": Authorization
                // 'Content-Type': 'application/json',
            },
            data: { userID: userID, movieID: movieID }
        })
        if(TheReturn.data.rentalExpireDate) {
            next();
        }
        else{
            return res.status(403).send("Access Denied");
        }
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
}
var output = {
    verifyToken
}

export default output;