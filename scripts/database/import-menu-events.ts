import * as admin from "firebase-admin";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { createLogger } from "../utils/logger";

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Initialize logger
const logger = createLogger({
    scriptName: "import-menu-events",
});

const __DEV__ = false;

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

interface MenuEvent {
    id: string;
    created_at: string;
    event_type: string;
    device_type: string;
    platform: string;
    referrer: string;
    session_id: string;
    store_id: string;
    metadata: string;
    timestamp: string;
}

// Helper function to parse date string
function parseEventDate(dateString: string): Date {
    // Format: "DD/MM/YYYY, HH:mm"
    const [datePart, timePart] = dateString.split(", ");
    const [day, month, year] = datePart.split("/");
    const [hours, minutes] = timePart.split(":");

    return new Date(
        parseInt(year),
        parseInt(month) - 1, // Month is 0-indexed
        parseInt(day),
        parseInt(hours),
        parseInt(minutes)
    );
}

async function importMenuEvents() {
    try {
        logger.log("📚 Starting menu events import...");

        // Validate configuration
        if (!firebaseConfig.projectId) {
            logger.error("❌ Firebase configuration missing. Please check your .env file.");
            logger.close();
            process.exit(1);
        }

        // Read menu_events_last_30_days.json
        const menuEventsPath = path.resolve(__dirname, "../data/menu_events_last_30_days.json");
        logger.info(`Reading menu events from: ${menuEventsPath}`);

        const menuEventsData = fs.readFileSync(menuEventsPath, "utf-8");
        const menuEvents: MenuEvent[] = JSON.parse(menuEventsData);

        logger.log(`📊 Found ${menuEvents.length} menu events to import`);

        // Batch write for better performance
        const batchSize = 500; // Firestore batch limit is 500
        let batch = db.batch();
        let count = 0;
        let totalImported = 0;

        for (const event of menuEvents) {
            const docRef = db.collection("menu_events").doc(event.id);

            // Parse dates and metadata
            const data = {
                ...event,
                created_at: parseEventDate(event.created_at),
                timestamp: parseEventDate(event.timestamp),
                metadata: event.metadata ? JSON.parse(event.metadata) : {}
            };

            batch.set(docRef, data);
            count++;
            totalImported++;

            // Commit batch when it reaches the limit
            if (count === batchSize) {
                await batch.commit();
                logger.log(`✅ Imported ${totalImported} / ${menuEvents.length} menu events...`);
                batch = db.batch();
                count = 0;
            }
        }

        // Commit remaining items
        if (count > 0) {
            await batch.commit();
            logger.log(`✅ Imported ${totalImported} / ${menuEvents.length} menu events...`);
        }

        logger.log(`🎉 Successfully imported ${totalImported} menu events!`);
        logger.close();
        process.exit(0);
    } catch (error) {
        logger.error(`❌ Error importing menu events: ${error}`);
        logger.close();
        process.exit(1);
    }
}

// Run import
importMenuEvents();
