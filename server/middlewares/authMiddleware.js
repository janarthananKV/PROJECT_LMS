import { clerkClient } from "@clerk/express";

//middleware to protect eduactor routes
const protectEducator = async (req, res, next) => {
    try {
        const userId = req.auth.userId
        const response = await clerkClient.users.getUser(userId)
        if (response.publicMetadata.role !== 'educator') {
            return res.json({success : false, message : 'unauthorized Access'})
        }

        next()
    } catch (error) {
        res.json({success : false, message : error.message})
    }
}

export default protectEducator