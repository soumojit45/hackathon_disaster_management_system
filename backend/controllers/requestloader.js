import VictimHelp from "../models/VictimHelpSchema.js"; 
import VictimSMS from "../models/victimSMSschema.js"; 

export const getAllActiveRequests = async (req, res) => {
    try {
        // 1. Fetch data from BOTH collections
        const webRequests = await VictimHelp.find();
        const smsRequests = await VictimSMS.find();

        // 2. Format Web Requests (Uses Lat/Lng)
        const formattedWebRequests = webRequests.map(request => ({
            _id: request._id,
            groupName: "Not Specified", 
            exactLocation: `Lat: ${request.latitude}, Lng: ${request.longitude}`,
            numberOfPeopleAffected: request.numberOfPeopleAffected,
            helpsRequired: request.helpsRequired,
            status: request.status || "Pending",
            urgencyScore: request.urgencyScore, 
            source: "Web" 
        }));

        // 3. Format SMS Requests (Uses the string location from the text)
        const formattedSmsRequests = smsRequests.map(request => ({
            _id: request._id,
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