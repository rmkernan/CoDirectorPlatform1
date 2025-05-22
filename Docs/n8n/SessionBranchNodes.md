<!-- n8nSessionBranchNodes.md
Workflow Overview:

This document outlines the "Session Setup Path" of the n8n workflow. This path is triggered
when a new chat session needs to be initialized. This typically occurs when a request
is identified as requiring a new session (e.g., `userQuery` is null in the initial
request, signaling a setup rather than a continuation of an existing chat).

The Session Branch involves:
-   Receiving initial session parameters (like document IDs for context).
-   Fetching content from Google Docs (principles and scenarios).
-   Combining fetched docs to form a context for the AI.
-   Creating a context cache using the Gemini API.
-   Extracting the cache ID and calculating its expiry.
-   Storing all relevant session data (including cache details and configuration)
    in a Supabase database.
-   Handling potential errors during the document fetching, cache creation, or
    database storage steps.
All outcomes from this path (successful session creation or errors) converge into
a final "Merge Responses" node.

This path is distinct from the "Chat Branch," which handles ongoing messages
within an already established session.
-->

## List of Nodes in Order (Session Setup Path)

1.  **Webhook**
    * ➡️ Goes to: **ProcessWebhookData**
2.  **ProcessWebhookData** (Code node)
    * ➡️ Goes to: **ChatEmpty?**
3.  **ChatEmpty?** (If node)
    * ➡️ **Session Setup Path (True - `userQuery` IS empty/null):** Continues to `GetPrinciples`
    * ➡️ *Chat Interaction Path (False - `userQuery` is NOT empty):* (Leads to `Chat Variables` and subsequent chat processing logic - not detailed in this document.)
4.  **GetPrinciples** (Google Docs node)
    * ➡️ Goes to: **ProcessScenarioDocIds**
5.  **ProcessScenarioDocIds** (Code node)
    * ➡️ Goes to: **Split Out Scenarios**
6.  **Split Out Scenarios** (SplitOut node)
    * ➡️ Goes to: **Get Scenarios** (for each scenario item)
7.  **Get Scenarios** (Google Docs node)
    * *This node executes for each scenario output by "Split Out Scenarios".*
    * ➡️ Goes to: **Build API Payload** (accumulates results)
8.  **Build API Payload** (Code node)
    * *This node waits for all items from "Get Scenarios" to be processed and then combines them.*
    * ➡️ Goes to: **CreateGeminiCache**
9.  **CreateGeminiCache** (HTTP Request node)
    * ➡️ Goes to: **ExtractCacheIDAndExpiry**
10. **ExtractCacheIDAndExpiry** (Code node)
    * ➡️ Goes to: **StoreSessionData**
11. **StoreSessionData** (Supabase node)
    * *Configured with `onError: continueRegularOutput`, so workflow proceeds even if storage fails, passing error information.*
    * ➡️ Goes to: **Code (Response Formatter)**
12. **Code (Response Formatter)** (Code node)
    * *Formats a message based on success/failure of `StoreSessionData`.*
    * ➡️ Goes to: **Respond to Webhook**
13. **Respond to Webhook** (Respond To Webhook node)
    * *Sends the final HTTP response to the initial Webhook caller.*

---
## Node by Node Descriptions

## Webhook (Webhook node, v2)

**Function:**
This node serves as the primary entry point for external HTTP POST requests that trigger the workflow. It listens on a specific path and receives payload data. It is configured to have its HTTP response sent by a separate "Respond to Webhook" node later in the flow.

**Notes:**
Receives incoming data from an external application to start the session setup process. The payload is expected to contain session parameters like document IDs and topic. The `responseMode: "responseNode"` ensures that this Webhook node doesn't immediately respond, but waits for a "Respond to Webhook" node to send the actual response.

**Key Configurations:**
* **HTTP Method:** `POST`
* **Path:** `7b70d7a9-7b7f-4b46-a2c7-b58e93081ff2` (This is the unique endpoint identifier)
* **Response Mode:** `responseNode`
* **Options:** (No specific options detailed in the provided JSON parameters)

**Connections:**
* **Receives Data From:** (External HTTP POST request)
* **Sends Data To:** `ProcessWebhookData` (to main input/input 0)
---
---
## ProcessWebhookData (Code node, v2)

**Function:**
This node processes the initial data received from the Webhook. It extracts and validates required session parameters, formats timestamps, sets default values for AI model configuration (like model name, TTL, system message), and prepares a structured JSON output for subsequent nodes.

**Notes:**
(From JSON) Purpose: This node processes webhook data for session initialization, selecting relevant fields and transforming them into the format required by downstream nodes. Key Functions: Extracts essential session parameters from webhook payload. Adds required system parameters (model, TTL, system message). Formats timestamp in Eastern Time (EDT, offset -4). Converts data types (e.g., `scenarioDocIds` and `scenarioDocNames` to JSON strings, `historyTurnsSetting` to String) as needed for compatibility. Validates required fields are present and throws an error if missing. Input: Raw webhook data (assumed to be `json.body` from the Webhook node). Output: Formatted session configuration object containing all necessary variables for the session setup. This node ensures clean data flow from the web application to the n8n workflow.

**Key Configurations:**
* **JavaScript Logic:**
    * Extracts data from the webhook input (expected at `$input.first()?.json?.body`).
    * Validates the presence of required fields (`sessionId`, `principlesDocId`, `scenarioDocIds`, `sessionTopic`, `historyTurnsSetting`, `testerId`); throws an error if any are missing.
    * Formats the current timestamp to an ISO string with an Eastern Time (EDT, UTC-4) offset.
    * Constructs and returns a JSON object containing:
        * Session identification and configuration from webhook data (`sessionID`, `principlesDocId`, `sessionTopic`, `historyTurnsSetting` (as string), `testerId`).
        * Hardcoded `principlesDocName` as "Universal Principles".
        * `scenarioDocIds` and `scenarioDocNames` are stringified JSON arrays (with `scenarioDocNames` being hardcoded in the script).
        * Additional system parameters: `startTime` (formatted Eastern Time), `systemMessageText` (predefined AI agent instruction), `model` ("models/gemini-2.0-flash"), and `ttlValue` (now "60s").

**Connections:**
* **Receives Data From:** `Webhook` (from main output/output 0)
* **Sends Data To:** `ChatEmpty?` (to main input/input 0)
---
---
## ChatEmpty? (If node, v2.2)

**Function:**
This node acts as a conditional router. It checks if the `userQuery` field (expected to be part of the data processed by `ProcessWebhookData` and available in `json.body`) is empty or null. If it is, the workflow proceeds down the "Session Setup Path". If `userQuery` contains data, it routes to the "Chat Interaction Path".

**Notes:**
Determines if this is a session setup request (userQuery is null) or a chat request (userQuery has content). Routes to different paths accordingly. The `userQuery` field is expected to be present in the `$json.body` object passed to this node (originating from the initial Webhook payload).

**Key Configurations:**
* **Combinator:** `and`
* **Condition Logic:** Checks if the expression `{{ $json.body.userQuery }}` is effectively empty or null. If true (session setup), directs to Output 0. If false (chat interaction), directs to Output 1.

**Connections:**
* **Receives Data From:** `ProcessWebhookData` (from main output/output 0)
* **Sends Data To (True path - Output 0, if `userQuery` is empty/null):** `GetPrinciples` (This is the Session Setup Path)
* **Sends Data To (False path - Output 1, if `userQuery` has content):** `Chat Variables` (This is the Chat Interaction Path, not detailed further in this document)
---
---
## GetPrinciples (Google Docs node, v2)

**Function:**
This node fetches the content of a Google Document. The ID of this document (`principlesDocId`) is expected to be available in the JSON data passed from the preceding `ProcessWebhookData` node (via `ChatEmpty?`). This document usually contains universal principles or guidelines for the AI.

**Notes:**
Fetches universal principles document content using the `principlesDocId` (sourced from data originating from the `ProcessWebhookData` node).

**Key Configurations:**
* **Operation:** `get`
* **Document URL/ID:** `={{$json.principlesDocId}}`
* **Credentials:** `Google Docs account`

**Connections:**
* **Receives Data From:** `ChatEmpty?` (from True path/output 0)
* **Sends Data To:** `ProcessScenarioDocIds` (to main input/input 0)
---
---
## ProcessScenarioDocIds (Code node, v2)

**Function:**
This node takes `scenarioDocIds` and `scenarioDocNames` (sourced from the output of `ProcessWebhookData`) and processes them. It normalizes these inputs from various formats (e.g., arrays, JSON string representations of arrays, comma-separated strings) into a clean array of objects, where each object contains a scenario `id` and its corresponding `name`.

**Notes:**
Processes scenario document IDs and their corresponding names, expected to be sourced from the 'ProcessWebhookData' node. Normalizes various input formats for IDs and names. Primary output is a single array 'scenariosToProcess', where each element is an object containing a scenario 'id' (the document ID) and its 'name'. If a name is not available for a given ID, a default name is generated. This output structure is designed for subsequent iterative processing.

**Key Configurations:**
* **JavaScript Logic:**
    * Defines and uses a helper function `normalizeToArray(input)` to convert various input types for document IDs and names into standardized arrays of trimmed, non-empty strings.
    * Retrieves `rawScenarioDocIds` and `rawScenarioDocNames` from the output of the `ProcessWebhookData` node.
    * Applies `normalizeToArray` to both inputs.
    * Iterates through the normalized scenario IDs. For each ID, it attempts to pair it with a corresponding name from the normalized scenario names by index. If a name is missing or empty, or if there are more IDs than names, it generates a default name (e.g., "Scenario X (ID: short_id...)").
    * Outputs a JSON object containing an array named `scenariosToProcess`. Each element in this array is an object with `id` (the scenario document ID) and `name` (the scenario name or generated default).

**Connections:**
* **Receives Data From:** `GetPrinciples` (from main output/output 0)
* **Sends Data To:** `Split Out Scenarios` (to main input/input 0)
---
---
## Split Out Scenarios (SplitOut node, v1)

**Function:**
This node takes the `scenariosToProcess` array (output by `ProcessScenarioDocIds`) and splits it into multiple individual items. Each object within the array becomes a separate item in the workflow, enabling iterative processing of each scenario.

**Notes:**
Takes the 'scenariosToProcess' array (output by 'ProcessScenarioDocIds') and splits it so each object within that array becomes a separate output item. This enables subsequent nodes to process each scenario individually.

**Key Configurations:**
* **Field To Split Out:** `scenariosToProcess`

**Connections:**
* **Receives Data From:** `ProcessScenarioDocIds` (from main output/output 0)
* **Sends Data To:** `Get Scenarios` (to main input/input 0 - for each split item)
---
---
## Get Scenarios (Google Docs node, v2)

**Function:**
This node fetches the content of an individual scenario document from Google Docs. It operates on each item output by the `Split Out Scenarios` node. The document to fetch is identified by the `id` field of the current scenario item.

**Notes:**
Fetches the content of the current scenario document using its 'id'. This node executes for each scenario item output by 'Split Out Scenarios'. The note in the JSON "processed one by one from the 'Loop Through Each Scenario' node" refers to the iterative nature introduced by 'Split Out Scenarios'.

**Key Configurations:**
* **Operation:** `get`
* **Document URL/ID:** `={{ $json.id }}` (where `$json.id` refers to the ID of the current scenario item)
* **Credentials:** `Google Docs account`

**Connections:**
* **Receives Data From:** `Split Out Scenarios` (from main output/output 0 - for each scenario item)
* **Sends Data To:** `Build API Payload` (to main input/input 0 - accumulates results)
---
---
## Build API Payload (Code node, v2)

**Function:**
This node aggregates the content of all fetched scenario documents (from `Get Scenarios`) and combines them with the universal principles document content (from `GetPrinciples`). It then constructs the complete JSON payload for the Gemini API, ensuring API-required snake_case for certain parameter names and using the session topic for the display name.

**Notes:**
(From JSON) Collects and combines all scenario documents with principles document. Creates Gemini API payload using snake_case parameter names (`system_instruction`, `display_name`) as required by the API. Sources model parameters from `ProcessWebhookData` node. Formats documents with clear separators for context organization.

**Key Configurations:**
* **JavaScript Logic:**
    * Collects all items output by `Get Scenarios` (each containing content of one scenario) using `$input.all()`.
    * Retrieves the principles document content from the `GetPrinciples` node.
    * Sources AI model parameters (`model`, `ttlValue`, `systemMessageText`, `sessionTopic`) from the `ProcessWebhookData` node.
    * Iterates through collected scenario items, concatenating their content into `combinedScenarioText`, with each scenario wrapped by `######## SCENARIO DOCUMENT START/END ########` markers.
    * Appends principles content to `combinedScenarioText`, wrapped by `######## UNIVERSAL PRINCIPLES START/END ########` markers, forming `combinedDocsText`.
    * Constructs the `payload` for the Gemini API, using snake_case for keys like `system_instruction` and `display_name`. Includes `model`, `ttl`, `system_instruction` (with `systemMessageText`), `contents` (with `combinedDocsText` as user content), and `display_name` (set to the `sessionTopic`).
    * Returns the constructed `payload`.

**Connections:**
* **Receives Data From:** `Get Scenarios` (from main output/output 0 - accumulates all items)
* **Sends Data To:** `CreateGeminiCache` (to main input/input 0)
---
---
## CreateGeminiCache (HTTP Request node, v4.2)

**Function:**
This node sends the JSON payload (constructed by `Build API Payload`) to the Google Generative Language API's `cachedContents` endpoint to create a new context cache.

**Notes:**
(From JSON) Sends the combined document content to the Gemini API's cachedContents endpoint to create a context cache. Uses POST method with proper authentication and JSON body from the Build API Payload node. Returns a comprehensive response containing the cache ID in the 'name' field, precise expireTime, createTime, updateTime, and usageMetadata with token counts. This cached content allows subsequent chat messages to reference the context without resending the full document content. The response structure provides all necessary information for tracking cache lifecycle and performance metrics.

**Key Configurations:**
* **Method:** `POST`
* **URL:** `https://generativelanguage.googleapis.com/v1beta/cachedContents`
* **Authentication:** `predefinedCredentialType`
* **Node Credential Type:** `googlePalmApi`
* **Credentials:** `Google Gemini(PaLM) Api account`
* **Send Headers:** `true` (with `Content-Type: application/json`)
* **Send Body:** `true`
* **Specify Body:** `json`
* **JSON Body:** `={{ $json }}` (receives the payload from `Build API Payload`)

**Connections:**
* **Receives Data From:** `Build API Payload` (from main output/output 0)
* **Sends Data To:** `ExtractCacheIDAndExpiry` (to main input/input 0)
---
---
## ExtractCacheIDAndExpiry (Code node, v2)

**Function:**
This node processes the response from `CreateGeminiCache`. It extracts the `geminiCacheId`, uses the `expireTime` and `createTime` directly from the API response, captures `totalTokenCount` and `displayName` from the response, and gathers session information (sourced from `ProcessWebhookData`) to prepare a comprehensive record for database storage.

**Notes:**
(From JSON) Extracts the Gemini cache ID from the API response's "name" field and uses the provided `expireTime` directly from the response for precise cache expiration tracking. No need to calculate expiry time manually since the API provides it. Processes `scenarioDocIds` to ensure proper array format regardless of input format. Collects session metadata from `ProcessWebhookData` node including session ID, document IDs, and configuration settings. Captures useful cache metrics like `totalTokenCount` for monitoring. Prepares a comprehensive data object for Supabase database storage with all fields properly formatted for the sessions table.

**Key Configurations:**
* **JavaScript Logic:**
    * Retrieves the API response from the `CreateGeminiCache` node.
    * Extracts `geminiCacheId` from `response.name`.
    * Extracts `cacheExpiryTime` directly from `response.expireTime`.
    * Extracts `totalTokenCount` from `response.usageMetadata.totalTokenCount` if available.
    * Retrieves `scenarioDocIds` from the `ProcessWebhookData` node and ensures it's formatted as an array.
    * Gathers other session details (`sessionID`, `principlesDocId`, `historyTurnsSetting`, `testerId`, `startTime`) from the `ProcessWebhookData` node.
    * Sets `cacheCreationTime` using `response.createTime` (or `startTime` from `ProcessWebhookData` as a fallback).
    * Sets `modelUsed` using `response.model` (or `model` from `ProcessWebhookData` as a fallback).
    * Sets `displayName` using `response.displayName` (or an empty string as a fallback).
    * Returns a JSON object containing `geminiCacheId`, `cacheExpiryTime`, `totalTokenCount`, `displayName`, and all the gathered session and configuration details.

**Connections:**
* **Receives Data From:** `CreateGeminiCache` (from main output/output 0)
* **Sends Data To:** `StoreSessionData` (to main input/input 0)
---
---
## StoreSessionData (Supabase node, v1)

**Function:**
This node attempts to insert the prepared session data from `ExtractCacheIDAndExpiry` into the `sessions` table in a Supabase database. It is configured to continue the workflow and pass along error information if the storage operation fails.

**Notes:**
Stores session data in the Supabase 'sessions' table, including cache ID, timestamps, and configuration parameters. Due to `onError: continueRegularOutput`, any error during this operation will be included in the output JSON (e.g., as `$json.error`) allowing downstream nodes to handle it.

**Key Configurations:**
* **Table ID:** `sessions`
* **Data To Send:** `autoMapInputData`
* **On Error:** `continueRegularOutput`
* **Credentials:** `n8n AI RAG Agent (Inertia login)`

**Connections:**
* **Receives Data From:** `ExtractCacheIDAndExpiry` (from main output/output 0)
* **Sends Data To:** `Code (Response Formatter)` (to main input/input 0)
---
---
## Code (Response Formatter) (Code node, v2)

**Function:**
This node takes the output from the `StoreSessionData` node (which will include an `error` property if the Supabase operation failed) and formats a final response message.

**Notes:**
Prepares a JSON response containing a `message` field. The message indicates success if no error was passed from the `StoreSessionData` node, or an error message (including the error details) if an error occurred during data storage. This node does not have specific notes in the JSON.

**Key Configurations:**
* **JavaScript Logic:**
    * Checks if an `error` property exists in the input JSON (from `StoreSessionData`).
    * If an error exists, it constructs an error message string: `"Error storing session data: " + $input.item.json.error`.
    * If no error exists, it sets the message to: `"Session data stored successfully in Supabase"`.
    * Returns a JSON object with a single key `message` containing the appropriate success or error string.

**Connections:**
* **Receives Data From:** `StoreSessionData` (from main output/output 0)
* **Sends Data To:** `Respond to Webhook` (to main input/input 0)
---
---
## Respond to Webhook (Respond To Webhook node, v1.2)

**Function:**
This node sends an HTTP response back to the original caller of the "Webhook" node that initiated the workflow. The content of the response is taken from the output of the preceding "Code (Response Formatter)" node.

**Notes:**
Finalizes the workflow by sending a response (containing either a success or error message regarding session data storage) back to the initial HTTP request. This node is used in conjunction with the "Webhook" node's `responseMode: "responseNode"` setting. This node does not have specific notes in the JSON.

**Key Configurations:**
* **Options:** (No specific options detailed in the provided JSON parameters for this node, it typically sends the input data as the response body).

**Connections:**
* **Receives Data From:** `Code (Response Formatter)` (from main output/output 0)
* **Sends Data To:** (Sends HTTP response to the original Webhook caller)
---

## Summary of Nodes with Auto-Generated/Enhanced Notes

The following nodes did not have explicit `notes` in the provided JSON for this version, or their notes were enhanced/updated for clarity based on the new JSON:

* **Webhook** (Note updated to include `responseMode` explanation)
* **GetPrinciples** (Note updated to reflect data sourcing from `ProcessWebhookData`)
* **ProcessScenarioDocIds** (Note updated to reflect data sourcing from `ProcessWebhookData`)
* **StoreSessionData** (Note updated to include `onError` behavior explanation)
* **Code (Response Formatter)** (New node, note created)
* **Respond to Webhook** (New node, note created)

The notes for "ProcessWebhookData", "Build API Payload", "CreateGeminiCache", and "ExtractCacheIDAndExpiry" were primarily sourced from the latest JSON, with minor adjustments for consistency. The significant "Workflow Note" about the previously broken `ExtractCacheIDAndExpiry` node has been removed as the issue is resolved in this JSON version. The potentially problematic routing of the old "Check For Errors" node is no longer relevant as that entire error handling block has been replaced.