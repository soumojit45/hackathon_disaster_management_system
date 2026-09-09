import VictimHelp from "../models/VictimHelpSchema.js"; 
import VictimSMS from "../models/victimSMSschema.js"; 

export const getAllvictimDetail = async (req, res) => {
    try {

        const webRequests = await VictimHelp.find().populate("victimId", "contactPersonName email phoneNumber");
        // populate for join 
        const smsRequests = await VictimSMS.find();

        const formattedWebRequests = webRequests.map(request => ({
            _id: request._id,
            name: request.victimId?.contactPersonName || "Not Specified",
            email: request.victimId?.email || "Not Specified",
            phoneNumber: request.victimId?.phoneNumber || "Not Specified",
            groupName: "Not Specified", 
            exactLocation: `Lat: ${request.latitude}, Lng: ${request.longitude}`,
            numberOfPeopleAffected: request.numberOfPeopleAffected,
            helpsRequired: request.helpsRequired,
            status: request.status || "Pending",
            urgencyScore: request.urgencyScore, 
            source: "Web" 
        }));

        const formattedSmsRequests = smsRequests.map(request => ({
            _id: request._id,
            name: request.contactPersonName || "Not Specified",
            email: request.email || "Not Specified", 
            phoneNumber: request.phoneNumber || "Not Specified",
            groupName: request.contactPersonName || "Not Specified",
            exactLocation: request.exactLocation || "Location not provided", 
            numberOfPeopleAffected: request.numberOfPeopleAffected,
            helpsRequired: request.helpsRequired,
            status: request.status || "Pending",
            urgencyScore: request.urgencyScore, 
            source: "SMS" 
        }));

        const combinedRequests = [...formattedWebRequests, ...formattedSmsRequests];

        // Sort the combined list by Urgency Score (Highest to Lowest)
        combinedRequests.sort((a, b) => (b.urgencyScore || 0) - (a.urgencyScore || 0));

        return res.status(200).json({
            success: true,
            count: combinedRequests.length,
            data: combinedRequests
        });

    } catch (error) {
        console.error("Error fetching combined chart data:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Server error while fetching requests for the chart" 
        });
    }
};