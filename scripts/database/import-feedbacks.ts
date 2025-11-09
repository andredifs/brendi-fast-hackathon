import * as admin from "firebase-admin";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { createLogger } from "../utils/logger";

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Initialize logger
const logger = createLogger({
    scriptName: "import-feedbacks",
});

const __DEV__ = true;

if (__DEV__) {
    // app emulator config
    const FIRESTORE_EMULATOR_PORT = 9093;
    const AUTH_EMULATOR_PORT = 9099;
    const STORAGE_EMULATOR_HOST = 9099;

    process.env.FIRESTORE_EMULATOR_HOST = `127.0.0.1:${FIRESTORE_EMULATOR_PORT}`;
    process.env.FIREBASE_AUTH_EMULATOR_HOST = `127.0.0.1:${AUTH_EMULATOR_PORT}`;
    process.env.FIREBASE_STORAGE_EMULATOR_HOST = `127.0.0.1:${STORAGE_EMULATOR_HOST}`;
}

// Get Firebase config from environment variables
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase Admin
const app = admin.initializeApp(firebaseConfig);
const db = app.firestore();

interface Feedback {
    id: string;
    store_consumer_id: string;
    created_at: {
        _date: boolean;
        iso: string;
    };
    updated_at: {
        _date: boolean;
        iso: string;
    };
    category: string;
    order_id: string;
    rated_response: string;
    rating: number;
    store_id: string;
}

async function importFeedbacks() {
    try {
        logger.log("📚 Starting feedbacks import...");

        // Validate configuration
        if (!firebaseConfig.projectId) {
            logger.error("❌ Firebase configuration missing. Please check your .env file.");
            logger.close();
            process.exit(1);
        }

        // Read feedbacks.json
        const feedbacksPath = path.resolve(__dirname, "../data/feedbacks.json");
        logger.info(`Reading feedbacks from: ${feedbacksPath}`);

        const feedbacksData = fs.readFileSync(feedbacksPath, "utf-8");
        const feedbacks: Feedback[] = JSON.parse(feedbacksData);

        logger.log(`📊 Found ${feedbacks.length} feedbacks to import`);

        // Batch write for better performance
        const batchSize = 500; // Firestore batch limit is 500
        let batch = db.batch();
        let count = 0;
        let totalImported = 0;

        for (const feedback of feedbacks) {
            const docRef = db.collection("feedbacks").doc(feedback.id);

            // Convert dates
            const data = {
                ...feedback,
                created_at: new Date(feedback.created_at.iso),
                updated_at: new Date(feedback.updated_at.iso)
            };

            batch.set(docRef, data);
            count++;
            totalImported++;

            // Commit batch when it reaches the limit
            if (count === batchSize) {
                await batch.commit();
                logger.log(`✅ Imported ${totalImported} / ${feedbacks.length} feedbacks...`);
                batch = db.batch();
                count = 0;
            }
        }

        // Commit remaining items
        if (count > 0) {
            await batch.commit();
            logger.log(`✅ Imported ${totalImported} / ${feedbacks.length} feedbacks...`);
        }

        logger.log(`🎉 Successfully imported ${totalImported} feedbacks!`);
        logger.close();
        process.exit(0);
    } catch (error) {
        logger.error(`❌ Error importing feedbacks: ${error}`);
        logger.close();
        process.exit(1);
    }
}

// Run import
importFeedbacks();
