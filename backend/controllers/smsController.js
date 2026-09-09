import VictimSMS from "../models/victimSMSschema.js"; 
import { generateUrgencyScore } from "../utils/urgencyScoreService.js";

export const processIncomingSMS = async (req, res) => {
    try {
        const rawSms = req.body.message || ""; 

        if (!rawSms) {
            return res.status(400).json({ error: "Empty SMS received" });
        }

        // 1. ROBUST PARSING: Find the first '#' to ignore any automated prefixes 
        // (like "From: +91..." added by SMS forwarder apps)
        const firstHashIndex = rawSms.indexOf('#');
        let cleanSms = rawSms;
        if (firstHashIndex !== -1) {
            cleanSms = rawSms.substring(firstHashIndex);
        }

        let dataParts = cleanSms.split('#').map(part => part.trim());

        // If the SMS started with '#', splitting it creates an empty string at index 0. 
        // We shift the array to align our indices properly.
        if (dataParts[0] === "") {
            dataParts.shift();
        }

        // 2. EXTRACT FIELDS BASED ON YOUR EXACT FORMAT
        // Expected Format: #Name#Phone#Location#PeopleCount#DisasterType#HelpsRequired#Description
        const name = dataParts[0] || "Unknown";
        const phone = dataParts[1] || "Unknown";
        const location = dataParts[2] || "Unknown";

        let peopleCount = parseInt(dataParts[3]);
        if (isNaN(peopleCount) || peopleCount < 1) {
            peopleCount = 1;
        }

        const disasterType = dataParts[4] || "Unspecified";
        const rawHelps = dataParts[5] || "";
        
        // Ensure description is extracted (this was missing in your old code!)
        const description = dataParts[6] || "No description provided";

        // 3. PARSE HELPS REQUIRED ENUMS
        const validEnumValues = [
            'Food', 'Medical', 'Shelter', 'Transportation', 
            'Clothing', 'Volunteers', 'Baby Supplies', 
            'Sanitary Products', 'Other'
        ];
        
        let parsedHelps = [];
        const rawHelpsLower = rawHelps.toLowerCase();
        
        validEnumValues.forEach(helpOption => {
            if (rawHelpsLower.includes(helpOption.toLowerCase())) {
                parsedHelps.push(helpOption);
            }
        });

        if (parsedHelps.length === 0 && rawHelps.length > 0) {
            parsedHelps.push('Other');
        }

        // 4. GENERATE URGENCY SCORE
        // Safely pass the parsed helps and extracted description
        const aiUrgencyResult = await generateUrgencyScore(parsedHelps, description);
        const calculatedUrgencyScore = aiUrgencyResult.score;

        // 5. SAVE TO MONGODB
        const newVictimEntry = new VictimSMS({
            contactPersonName: name,
            phoneNumber: phone,
            exactLocation: location,
            numberOfPeopleAffected: peopleCount,
            typeOfDisaster: disasterType,
            helpsRequired: parsedHelps,
            description: description,
            urgencyScore: calculatedUrgencyScore 
        });

        const savedEntry = await newVictimEntry.save();

        return res.status(201).json({
            success: true,
            message: "SMS parsed and saved successfully",
            data: savedEntry
        });

    } catch (error) {
        console.error("Error processing SMS:", error);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};