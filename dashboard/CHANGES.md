# Dashboard Changes - Hackathon Simplification

## Overview
Simplified the dashboard to focus exclusively on displaying menu_events data from the events API.

## Changes Made

### 1. API Client (`app/utils/api-client.ts`)
- Created an API client to communicate with the events API
- Similar pattern to the functions client
- Provides `eventsApi.list()` and `eventsApi.get()` methods

### 2. Server API Routes
- **`server/api/events.ts`** - Proxy endpoint to list events
- **`server/api/events/[id].ts`** - Proxy endpoint to get a single event
- Both routes forward requests to the events API (configured via `EVENTS_API_URL`)

### 3. Removed Pages & Components
Deleted unnecessary pages to focus on menu events:
- ❌ `/customers`
- ❌ `/inbox`
- ❌ `/settings` (and all sub-pages)
- ❌ Related components (customers/, inbox/, settings/ folders)
- ❌ Related API endpoints (customers, mails, members, notifications)

### 4. Simplified Layout (`app/layouts/default.vue`)
- Removed navigation links except Home
- Removed dashboard search
- Removed cookie consent toast
- Kept sidebar, user menu, and notifications slideover

### 5. New Menu Events Components

#### `components/home/MenuEventsStats.vue`
Displays 4 key metrics:
- **Visualizações** (Page Views)
- **Produtos Vistos** (Product Views)
- **Adicionados ao Carrinho** (Add to Cart)
- **Compras** (Purchases)

#### `components/home/MenuEventsTable.vue`
Shows a table of the 50 most recent events with:
- Event type (with colored badges)
- Device type
- Platform
- Created date

### 6. Updated Home Page (`pages/index.vue`)
- Replaced mock stats and charts with real menu events data
- Now displays `MenuEventsStats` and `MenuEventsTable`
- Kept date range picker and period selector for future filtering

## Environment Variables

Make sure to set in your `.env` file for local development:

```bash
EVENTS_API_URL=http://127.0.0.1:5001/fast-hackathon-andre/us-central1/events-api
```

For production, the fallback URL is already configured to use the Cloud Functions URL:
```bash
https://us-central1-fast-hackathon-andre.cloudfunctions.net/events-api
```

You can override this by setting the `EVENTS_API_URL` environment variable in your deployment.

## Next Steps

1. The date range picker and period selector are in place but not yet filtering the events
2. To implement date filtering, update the API client to send date parameters
3. Consider adding charts/visualizations of event trends over time
4. Add conversion funnel visualization (pageView → productView → addToCart → purchase)

