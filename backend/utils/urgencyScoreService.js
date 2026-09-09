import { pipeline } from "@xenova/transformers";

// ============================================================
// AI URGENCY SCORER
// Hybrid architecture:
// 1. Garbage / casual-message gate
// 2. Disaster relevance detection
// 3. Zero-shot NLI classification
// 4. Deterministic safety rules
// 5. Explainable final 0-100 score
//
// IMPORTANT:
// This is a disaster-response TRIAGE PROTOTYPE.
// It is NOT a medical-grade emergency classifier.
// ============================================================


// ============================================================
// MODEL
// ============================================================

let classifierPipeline = null;

const MODEL_NAME = "Xenova/nli-deberta-v3-small";


// ============================================================
// MODEL LOADER
// ============================================================

async function getClassifier() {
    if (!classifierPipeline) {
        console.log("Loading urgency classification model...");

        classifierPipeline = await pipeline(
            "zero-shot-classification",
            MODEL_NAME
        );

        console.log("Urgency classification model loaded.");
    }

    return classifierPipeline;
}


// ============================================================
// CLASSIFICATION LABELS
// ============================================================

const EMERGENCY_LABELS = [

    "an immediate life threatening emergency",

    "a trapped or stranded person requiring rescue",

    "a serious medical emergency or severe injury",

    "an immediate environmental danger",

    "an unsafe shelter or evacuation requirement",

    "an essential food or drinking water shortage",

    "a general disaster assistance request",

    "an irrelevant or non-disaster message"
];


// ============================================================
// BASE SCORE FOR EACH CATEGORY
// ============================================================

const BASE_SCORES = {

    LIFE_THREATENING: 95,

    TRAPPED_OR_STRANDED: 82,

    MEDICAL_EMERGENCY: 78,

    ENVIRONMENTAL_DANGER: 68,

    SHELTER_EVACUATION: 58,

    ESSENTIAL_NEED: 45,

    GENERAL_ASSISTANCE: 25,

    NO_CLEAR_EMERGENCY: 0
};


// ============================================================
// TEXT NORMALIZATION
// ============================================================

function normalizeText(text) {

    if (!text || typeof text !== "string") {
        return "";
    }

    return text
        .toLowerCase()
        .replace(/[^\w\s']/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}


// ============================================================
// OBVIOUS CASUAL / IRRELEVANT MESSAGES
// ============================================================
//
// These are intentionally checked BEFORE the AI model.
//
// This prevents the model from being forced to classify
// "how are you?" into one of the emergency categories.
// ============================================================

function isObviouslyCasual(text) {

    const casualPatterns = [

        /^hi$/,

        /^hello$/,

        /^hey$/,

        /^hey there$/,

        /^how are you$/,

        /^how are u$/,

        /^how are you doing$/,

        /^what are you doing$/,

        /^who are you$/,

        /^good morning$/,

        /^good afternoon$/,

        /^good evening$/,

        /^good night$/,

        /^thanks$/,

        /^thank you$/,

        /^ok$/,

        /^okay$/,

        /^fine$/,

        /^nice$/,

        /^cool$/,

        /^great$/,

        /^i am fine$/,

        /^i'm fine$/,

        /^we are chilling$/,

        /^we are chilling here$/,

        /^we are chilling here how are u$/,

        /^we are chilling here how are you$/
    ];

    return casualPatterns.some(pattern => pattern.test(text));
}


// ============================================================
// DISASTER / EMERGENCY EVIDENCE
// ============================================================
//
// This is NOT the final classifier.
//
// It is simply a gate that asks:
//
// "Does this message contain ANY concrete indication
// that something related to a disaster/emergency is happening?"
//
// This prevents completely unrelated messages from entering
// the emergency scoring system.
// ============================================================

function hasDisasterEvidence(text) {

    const disasterTerms = [

        // General emergency
        "emergency",
        "danger",
        "dangerous",
        "unsafe",
        "urgent",
        "critical",
        "crisis",
        "rescue",

        // Flood / water
        "flood",
        "flooded",
        "flooding",
        "flood water",
        "water rising",
        "water level rising",
        "water entered",
        "water inside",
        "drowning",
        "drowned",

        // Fire
        "fire",
        "fire broke",
        "burning",
        "burned",
        "burnt",
        "smoke",

        // Injury / medical
        "injured",
        "injury",
        "bleeding",
        "blood",
        "wound",
        "fracture",
        "fractured",
        "broken bone",
        "broken leg",
        "broken arm",
        "severe pain",
        "unconscious",
        "unresponsive",
        "not breathing",
        "cannot breathe",
        "can't breathe",
        "breathing problem",
        "breathing difficulty",
        "medical emergency",
        "ambulance",

        // Trapped
        "trapped",
        "stuck",
        "stranded",
        "cannot get out",
        "can't get out",
        "unable to get out",
        "unable to leave",
        "cannot leave",
        "can't leave",
        "blocked",

        // Collapse
        "collapsed",
        "collapse",
        "house collapsed",
        "building collapsed",
        "roof collapsed",
        "wall collapsed",
        "debris",

        // Shelter
        "no shelter",
        "without shelter",
        "homeless",
        "house damaged",
        "home damaged",
        "unsafe house",
        "unsafe home",
        "need evacuation",
        "evacuate",
        "evacuation",

        // Food / water
        "no food",
        "without food",
        "no water",
        "without water",
        "no drinking water",
        "drinking water",
        "starving",
        "starvation",
        "thirsty",
        "food shortage",
        "water shortage",

        // Disaster situations
        "landslide",
        "earthquake",
        "cyclone",
        "storm",
        "hurricane",
        "tsunami",
        "disaster"
    ];

    return disasterTerms.some(term => text.includes(term));
}


// ============================================================
// NEGATION DETECTION
// ============================================================
//
// Prevents obvious cases such as:
//
// "There is no fire"
// "I am not injured"
// "We are not trapped"
// ============================================================

function isNegated(text, phrase) {

    const index = text.indexOf(phrase);

    if (index === -1) {
        return false;
    }

    const before = text.slice(
        Math.max(0, index - 20),
        index
    );

    const negationWords = [
        "no",
        "not",
        "never",
        "without",
        "isn't",
        "isnt",
        "aren't",
        "arent",
        "don't",
        "dont",
        "doesn't",
        "doesnt"
    ];

    return negationWords.some(word => {

        return before.includes(word);
    });
}


// ============================================================
// SAFETY EVIDENCE EXTRACTION
// ============================================================
//
// These rules are intentionally conservative.
//
// They are used as SAFETY OVERRIDES for explicit situations.
// ============================================================

function detectSafetyEvidence(text) {

    const evidence = [];

    // --------------------------------------------------------
    // LIFE THREATENING
    // --------------------------------------------------------

    if (
        text.includes("not breathing") ||
        text.includes("cannot breathe") ||
        text.includes("can't breathe") ||
        text.includes("unable to breathe")
    ) {

        evidence.push({
            type: "LIFE_THREATENING",
            score: 100,
            reason: "Possible breathing emergency detected."
        });
    }


    if (
        text.includes("unconscious") ||
        text.includes("unresponsive") ||
        text.includes("passed out")
    ) {

        evidence.push({
            type: "LIFE_THREATENING",
            score: 98,
            reason: "Possible unconscious or unresponsive person detected."
        });
    }


    if (
        text.includes("heavy bleeding") ||
        text.includes("severe bleeding") ||
        text.includes("bleeding heavily")
    ) {

        evidence.push({
            type: "LIFE_THREATENING",
            score: 100,
            reason: "Severe bleeding indicator detected."
        });
    }


    // --------------------------------------------------------
    // DROWNING / RISING WATER
    // --------------------------------------------------------

    if (
        text.includes("drowning") ||
        text.includes("drowning") ||
        text.includes("water rising") ||
        text.includes("water level rising")
    ) {

        evidence.push({
            type: "LIFE_THREATENING",
            score: 98,
            reason: "Possible drowning or rapidly rising water detected."
        });
    }


    // --------------------------------------------------------
    // TRAPPED
    // --------------------------------------------------------

    if (
        text.includes("trapped") ||
        text.includes("cannot get out") ||
        text.includes("can't get out") ||
        text.includes("unable to get out") ||
        text.includes("cannot leave") ||
        text.includes("can't leave")
    ) {

        evidence.push({
            type: "TRAPPED_OR_STRANDED",
            score: 88,
            reason: "Person appears trapped or unable to leave."
        });
    }


    // --------------------------------------------------------
    // MEDICAL
    // --------------------------------------------------------

    if (
        text.includes("fracture") ||
        text.includes("fractured") ||
        text.includes("broken leg") ||
        text.includes("broken arm") ||
        text.includes("broken bone")
    ) {

        evidence.push({
            type: "MEDICAL_EMERGENCY",
            score: 82,
            reason: "Possible serious injury or fracture detected."
        });
    }


    if (
        text.includes("severe pain") ||
        text.includes("serious injury") ||
        text.includes("badly injured")
    ) {

        evidence.push({
            type: "MEDICAL_EMERGENCY",
            score: 78,
            reason: "Possible serious injury detected."
        });
    }


    if (
        text.includes("bleeding") &&
        !text.includes("heavy bleeding") &&
        !text.includes("severe bleeding")
    ) {

        evidence.push({
            type: "MEDICAL_EMERGENCY",
            score: 72,
            reason: "Bleeding or blood-related injury detected."
        });
    }


    // --------------------------------------------------------
    // FIRE
    // --------------------------------------------------------

    if (
        text.includes("fire") ||
        text.includes("burning") ||
        text.includes("house is burning") ||
        text.includes("building is burning")
    ) {

        evidence.push({
            type: "ENVIRONMENTAL_DANGER",
            score: 90,
            reason: "Fire or active burning hazard detected."
        });
    }


    // --------------------------------------------------------
    // COLLAPSE
    // --------------------------------------------------------

    if (
        text.includes("house collapsed") ||
        text.includes("building collapsed") ||
        text.includes("roof collapsed") ||
        text.includes("wall collapsed")
    ) {

        evidence.push({
            type: "ENVIRONMENTAL_DANGER",
            score: 88,
            reason: "Structural collapse detected."
        });
    }


    // --------------------------------------------------------
    // UNSAFE SHELTER
    // --------------------------------------------------------

    if (
        text.includes("no shelter") ||
        text.includes("without shelter") ||
        text.includes("unsafe shelter") ||
        text.includes("unsafe house") ||
        text.includes("unsafe home")
    ) {

        evidence.push({
            type: "SHELTER_EVACUATION",
            score: 60,
            reason: "Unsafe or unavailable shelter detected."
        });
    }


    // --------------------------------------------------------
    // FOOD
    // --------------------------------------------------------

    if (
        text.includes("no food") ||
        text.includes("without food") ||
        text.includes("food shortage") ||
        text.includes("starving") ||
        text.includes("starvation")
    ) {

        evidence.push({
            type: "ESSENTIAL_NEED",
            score: 48,
            reason: "Food shortage detected."
        });
    }


    // --------------------------------------------------------
    // WATER
    // --------------------------------------------------------

    if (
        text.includes("no drinking water") ||
        text.includes("no water") ||
        text.includes("without water") ||
        text.includes("water shortage")
    ) {

        evidence.push({
            type: "ESSENTIAL_NEED",
            score: 52,
            reason: "Drinking water shortage detected."
        });
    }


    return evidence;
}


// ============================================================
// GET HIGHEST SAFETY SCORE
// ============================================================

function getHighestSafetyEvidence(evidence) {

    if (!evidence || evidence.length === 0) {
        return null;
    }

    return evidence.reduce((highest, current) => {

        if (!highest || current.score > highest.score) {
            return current;
        }

        return highest;

    }, null);
}


// ============================================================
// MAP AI LABEL TO INTERNAL CATEGORY
// ============================================================

function mapCategory(label) {

    const text = label.toLowerCase();

    if (
        text.includes("life threatening")
    ) {

        return "LIFE_THREATENING";
    }


    if (
        text.includes("trapped") ||
        text.includes("stranded")
    ) {

        return "TRAPPED_OR_STRANDED";
    }


    if (
        text.includes("medical") ||
        text.includes("severe injury")
    ) {

        return "MEDICAL_EMERGENCY";
    }


    if (
        text.includes("environmental danger")
    ) {

        return "ENVIRONMENTAL_DANGER";
    }


    if (
        text.includes("unsafe shelter") ||
        text.includes("evacuation")
    ) {

        return "SHELTER_EVACUATION";
    }


    if (
        text.includes("food") ||
        text.includes("drinking water")
    ) {

        return "ESSENTIAL_NEED";
    }


    if (
        text.includes("general disaster")
    ) {

        return "GENERAL_ASSISTANCE";
    }


    return "NO_CLEAR_EMERGENCY";
}


// ============================================================
// CONVERT CATEGORY TO BASE SCORE
// ============================================================

function getBaseScore(category) {

    return BASE_SCORES[category] ?? 0;
}


// ============================================================
// SEVERITY
// ============================================================

function getSeverity(score) {

    if (score >= 90) {
        return "CRITICAL";
    }

    if (score >= 70) {
        return "HIGH";
    }

    if (score >= 40) {
        return "MODERATE";
    }

    return "LOW";
}


// ============================================================
// MAIN FUNCTION
// ============================================================

export async function generateUrgencyScore(
    helpsRequired = [],
    description = ""
) {

    try {

        // ====================================================
        // STEP 1 — NORMALIZE INPUT
        // ====================================================

        const text = normalizeText(description);


        // ====================================================
        // EMPTY DESCRIPTION
        // ====================================================

        if (!text) {

            return {
                score: 0,

                severity: "LOW",

                confidence: 1,

                category: "NO_CLEAR_EMERGENCY",

                detectedFactors: [],

                reason:
                    "No emergency description was provided."
            };
        }


        // ====================================================
        // STEP 2 — OBVIOUS CASUAL MESSAGE
        // ====================================================
        //
        // VERY IMPORTANT:
        //
        // We return BEFORE running the transformer.
        //
        // Therefore:
        //
        // "how are u?"
        //
        // can NEVER become 50, 60, 70, etc.
        // ====================================================

        if (isObviouslyCasual(text)) {

            return {

                score: 0,

                severity: "LOW",

                confidence: 1,

                category: "NO_CLEAR_EMERGENCY",

                detectedFactors: [],

                reason:
                    "The message appears to be casual or unrelated to a disaster emergency."
            };
        }


        // ====================================================
        // STEP 3 — BASIC DISASTER EVIDENCE GATE
        // ====================================================
        //
        // If there is absolutely no emergency/disaster
        // indication, do NOT allow the NLI model to invent
        // an emergency category.
        // ====================================================

        const hasEvidence = hasDisasterEvidence(text);


        if (!hasEvidence) {

            return {

                score: 0,

                severity: "LOW",

                confidence: 1,

                category: "NO_CLEAR_EMERGENCY",

                detectedFactors: [],

                reason:
                    "No concrete disaster or emergency evidence was detected in the description."
            };
        }


        // ====================================================
        // STEP 4 — SAFETY RULES
        // ====================================================

        const safetyEvidence = detectSafetyEvidence(text);

        const strongestSafetyEvidence =
            getHighestSafetyEvidence(safetyEvidence);


        // ====================================================
        // STEP 5 — LOAD AI MODEL
        // ====================================================

        const classifier = await getClassifier();


        // ====================================================
        // STEP 6 — ZERO-SHOT CLASSIFICATION
        // ====================================================

        const result = await classifier(

            text,

            EMERGENCY_LABELS,

            {
                multi_label: false
            }
        );


        // ====================================================
        // STEP 7 — GET AI RESULT
        // ====================================================

        const aiLabel = result.labels?.[0] ?? "";

        const aiConfidence =
            result.scores?.[0] ?? 0;


        const aiCategory =
            mapCategory(aiLabel);


        let score =
            getBaseScore(aiCategory);


        // ====================================================
        // STEP 8 — AI CONFIDENCE CONTROL
        // ====================================================
        //
        // NLI confidence is NOT a true probability.
        //
        // We therefore prevent weak classifications from
        // producing huge scores.
        // ====================================================

        if (aiConfidence < 0.40) {

            score = Math.min(score, 30);

        } else if (aiConfidence < 0.55) {

            score = Math.min(score, 50);

        } else if (aiConfidence < 0.70) {

            score = Math.min(score, 70);
        }


        // ====================================================
        // STEP 9 — SAFETY OVERRIDE
        // ====================================================
        //
        // Explicit critical evidence gets priority over
        // uncertain semantic classification.
        // ====================================================

        if (strongestSafetyEvidence) {

            score = Math.max(
                score,
                strongestSafetyEvidence.score
            );
        }


        // ====================================================
        // STEP 10 — PREVENT FAKE CRITICAL SCORES
        // ====================================================
        //
        // If there is NO explicit critical safety evidence,
        // don't let weak NLI classification produce 90+.
        // ====================================================

        const hasCriticalEvidence =
            safetyEvidence.some(item =>
                item.type === "LIFE_THREATENING"
            );


        if (!hasCriticalEvidence) {

            score = Math.min(score, 89);
        }


        // ====================================================
        // STEP 11 — SUPPLY INFORMATION
        // ====================================================
        //
        // IMPORTANT:
        //
        // helpsRequired is ONLY contextual information.
        //
        // We intentionally DO NOT add score because someone
        // selected "Medical" or "Food".
        //
        // Otherwise:
        //
        // "hello"
        // + Medical
        //
        // could become an emergency.
        // ====================================================

        const supplies =
            Array.isArray(helpsRequired)
                ? helpsRequired
                : [];


        // ====================================================
        // STEP 12 — DETECTED FACTORS
        // ====================================================

        const detectedFactors = [];


        if (aiCategory !== "NO_CLEAR_EMERGENCY") {

            detectedFactors.push(
                `AI classification: ${aiCategory}`
            );
        }


        if (strongestSafetyEvidence) {

            detectedFactors.push(
                strongestSafetyEvidence.reason
            );
        }


        if (supplies.length > 0) {

            detectedFactors.push(
                `Requested assistance: ${supplies.join(", ")}`
            );
        }


        // ====================================================
        // STEP 13 — FINAL SCORE
        // ====================================================

        score = Math.round(
            Math.max(0, Math.min(100, score))
        );


        // ====================================================
        // STEP 14 — FINAL RESPONSE
        // ====================================================

        return {

            score,

            severity:
                getSeverity(score),

            confidence:
                Number(aiConfidence.toFixed(3)),

            category:
                strongestSafetyEvidence?.type ??
                aiCategory,

            detectedFactors,

            reason:
                strongestSafetyEvidence?.reason ??
                `The request was classified as ${aiCategory.replaceAll("_", " ").toLowerCase()}.`
        };


    } catch (error) {

        console.error(
            "Urgency scoring error:",
            error
        );


        // ====================================================
        // FALLBACK
        // ====================================================
        //
        // If AI model fails, deterministic safety rules
        // still work.
        // ====================================================

        const text = normalizeText(description);

        const safetyEvidence =
            detectSafetyEvidence(text);


        const strongestEvidence =
            getHighestSafetyEvidence(
                safetyEvidence
            );


        if (strongestEvidence) {

            return {

                score:
                    strongestEvidence.score,

                severity:
                    getSeverity(
                        strongestEvidence.score
                    ),

                confidence: 1,

                category:
                    strongestEvidence.type,

                detectedFactors: [
                    strongestEvidence.reason
                ],

                reason:
                    `${strongestEvidence.reason} AI classification was unavailable, so deterministic safety rules were used.`
            };
        }


        return {

            score: 0,

            severity: "LOW",

            confidence: 0,

            category: "NO_CLEAR_EMERGENCY",

            detectedFactors: [],

            reason:
                "No clear emergency evidence was detected. AI classification was unavailable."
        };
    }
}