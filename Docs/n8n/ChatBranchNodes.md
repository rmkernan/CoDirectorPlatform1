<!--
Workflow Overview:

This document outlines the "Chat Interaction Path" of the n8n workflow. This path is triggered when a user sends a message within an existing session. It details the sequence of operations for processing the user's query, interacting with the Gemini AI, and logging the exchange.

The Chat Interaction Path includes:
-   Core "happy path" logic for successful message processing.
-   Integrated error handling sub-paths for conditions such as:
    -   Session not found
    -   Expired cache
    -   API call failures
All outcomes from this path (successful responses and the various error conditions)
ultimately converge into a final "Merge" node.

A separate "Session Setup Path" exists (triggered if `userQuery` is empty at the
"Is Session Setup?" node), but its subsequent steps are not detailed in the node list below.
-->
## List of Nodes in Order
1.  **When clicking ‘Test workflow’**
2.  **ChatStubData**
3.  **FormatWebhookData**
4.  **Is Session Setup?**
    *   ➡️ **Primary Chat Interaction Path (False - `userQuery` is NOT empty):** Continues to `Chat Variables`
    *   *   ➡️ **Session Setup Path (True - `userQuery` is empty):** (Leads to session setup logic. This path ends here for this depiction as per the provided JSON.)
5.  **Chat Variables**
6.  **GetSessionData**
7.  **Session Found?**
    *   ➡️ **Primary Path (True - Session IS Found):** Continues to `Extract Session Data`
    *   *   ➡️ **ERROR BRANCH (False - Session IS NOT Found):**
        *   `Session Not Found Error`
        *   ➡️ *Merges to:* `Merge`
8.  **Extract Session Data**
9.  **Cache Expired?**
    *   ➡️ **Primary Path (False - Cache IS NOT Expired):** Continues to `GetChatHistory`
    *   *   ➡️ **ERROR BRANCH (True - Cache IS Expired):**
        *   `Cache Expired Error`
        *   ➡️ *Merges to:* `Merge`
10. **GetChatHistory**
11. **FormatChatHistory**
12. **CallGeminiAPI**
13. **API Success?**
    *   ➡️ **Primary Path (False - API Call SUCCEEDED):** Continues to `Extract Response`
    *   *   ➡️ **ERROR BRANCH (True - API Call FAILED):**
        *   `API Error Response`
        *   ➡️ *Merges to:* `Merge`
14. **Extract Response**
15. **LogUserMessage**
16. **LogAIResponse**
17. **Final Success Response**
    *   ➡️ *Merges to:* `Merge`
18. **Merge** (Convergence point for primary success and all depicted error paths from the Chat Interaction Path)


---
## When clicking ‘Test workflow’ (Manual Trigger node, v1)

**Function:**
This node serves as the starting point for manually testing the workflow within the n8n editor.

**Notes:**
(No notes provided in the JSON for this node.)

**Key Configurations:**
*   (No specific key configurations for a basic manual trigger)

**Connections:**
*   **Receives Data From:** (Manual execution)
*   **Sends Data To:** `ChatStubData` (to main input/input 0)
---
---
## ChatStubData (Set node, v3.4)

**Function:**
This node provides predefined test data to simulate a chat message request, enabling development and testing of the chat handling logic without a live webhook.

**Notes:**
Test data for chat message handling development. Contains session ID and user query needed for testing the chat functionality without a webhook. This simulates a user sending a message in an existing session. Format matches the first branch stub data structure.

**Key Configurations:**

*   **Mode:** `raw`
*   **JSON Output:** Provides stub data including `sessionId`, `principlesDocId`, `scenarioDocIds`, `sessionTopic`, `userQuery`, `historyTurnsSetting`, `testerId`, `timestamp`. (Full JSON: `={"sessionId": "test-session-123", "principlesDocId": "15061u_w-4XtrAPnNuFF73KkcTYxVh1PkbBMfbFargw0", "scenarioDocIds": ["1Mllizn4Ki3sLrZMR6HQTyeSOa2yXHQARWH_aVn8pRck"], "sessionTopic": "Unplanned Absence Scenario", "userQuery": "How should I handle a situation where a child refuses to participate in group activities?", "historyTurnsSetting": 10, "testerId": "test-user-1", "timestamp": "{{DateTime.now().toISO()}}"}`)

**Connections:**

*   **Receives Data From:** `When clicking ‘Test workflow’` (from main output/output 0)
*   **Sends Data To:** `FormatWebhookData` (to main input/input 0)
---
---
## FormatWebhookData (Code node, v2)

**Function:**
This node standardizes the input data, particularly for test scenarios, to match the structure expected by a webhook trigger, ensuring compatibility across different execution modes.

**Notes:**
Formats the input data to match webhook format for compatibility with both test and production flows.

**Key Configurations:**
*   **JavaScript Code:** `return { json: { body: $input.item.json } };`

**Connections:**
*   **Receives Data From:** `ChatStubData` (from main output/output 0)
*   **Sends Data To:** `Is Session Setup?` (to main input/input 0)
---
---
## Is Session Setup? (If node, v2.2)

**Function:**
This node acts as an initial router, checking if the incoming request is for setting up a new session (indicated by an empty user query) or handling an ongoing chat message.

**Notes:**
Determines if this is a session setup request (userQuery is null) or a chat request (userQuery has content). Routes to different paths accordingly.

**Key Configurations:**
*   **Combinator:** `and`
*   **Conditions:**
    *   `={{ $json.body.userQuery }}` `empty` (as string) `={{null}}`

**Connections:**
*   **Receives Data From:** `FormatWebhookData` (from main output/output 0)
*   **Sends Data To:** `Chat Variables` (to False path/output 1)
*   (True path/output 0 is not explicitly connected to subsequent nodes in this chat interaction flow.)
---
---
## Chat Variables (Set node, v3.2)

**Function:**
This node initializes and prepares key variables for the chat session based on the incoming request, such as session ID, user query, a feedback flag, and the current timestamp.

**Notes:**
Extracts and formats chat-related variables from the incoming request. Sets isFeedback flag for special handling of feedback messages (messages that start with 'feedback:'). Also captures the current timestamp for message logging and tracking.

**Key Configurations:**
*   Field `sessionID` set to: `={{$json.sessionId}}\t`
*   Field `userQuery` set to: `={{$json.userQuery}}\t`
*   Field `isFeedback` set to: `={{$json.userQuery.toLowerCase().startsWith('feedback:')}}`
*   Field `timestamp` set to: `={{DateTime.now().toISO()}}`

**Connections:**
*   **Receives Data From:** `Is Session Setup?` (from False path/output 1)
*   **Sends Data To:** `GetSessionData` (to main input/input 0)
---
---
## GetSessionData (Supabase node, v1)

**Function:**
This node fetches existing session data from the Supabase 'sessions' table, using the current session ID to retrieve details like Gemini cache ID, cache expiry time, and history turn settings.

**Notes:**
Retrieves session data from Supabase, including the Gemini cache ID, expiry timestamp, and history turns setting. This data is essential for checking cache validity and retrieving the appropriate amount of conversation history. The query filters by sessionId to ensure we get the correct session.

**Key Configurations:**
*   **Operation:** `get`
*   **Table ID:** `sessions`
*   **Filters:**
    *   Condition: `keyName` = `sessionId`, `keyValue` = `={{ $json.body.sessionId }}`
*   **Credentials:** `n8n AI RAG Agent (Inertia login)`

**Connections:**
*   **Receives Data From:** `Chat Variables` (from main output/output 0)
*   **Sends Data To:** `Session Found?` (to main input/input 0)
---
---
## Session Found? (If node, v2.2)

**Function:**
This node checks if the preceding 'GetSessionData' node successfully retrieved a session from the database, routing the workflow based on whether a session was found.

**Notes:**
Checks if the session exists in the database. If not, returns an error.

**Key Configurations:**
*   **Combinator:** `and`
*   **Conditions:**
    *   `={{ $json.sessionId }}` `notEmpty` (as string) `={{ true }}`

**Connections:**
*   **Receives Data From:** `GetSessionData` (from main output/output 0)
*   **Sends Data To:** `Extract Session Data` (to True path/output 0), `Session Not Found Error` (to False path/output 1)
---
---
## Extract Session Data (Set node, v3.2)

**Function:**
This node extracts specific values (Gemini cache ID, cache expiry time, history turns setting) from the successfully retrieved session data for use in subsequent steps.

**Notes:**
Extracts the cache ID, expiry timestamp, and history turns setting from the session data.

**Key Configurations:**
*   Field `cacheIdToUse` set to: `={{ $json.geminiCacheId }}`
*   Field `expiryTimestamp` set to: `={{ $json.cacheExpiryTime }}`
*   Field `historyTurnsSetting` set to: `={{ $json.historyTurnsSetting }}`

**Connections:**
*   **Receives Data From:** `Session Found?` (from True path/output 0)
*   **Sends Data To:** `Cache Expired?` (to main input/input 0)
---
---
## Session Not Found Error (Set node, v3.2)

**Function:**
This node prepares a standardized error response to be returned if a chat session is not found in the database.

**Notes:**
Formats an error response when the session is not found in the database.

**Key Configurations:**
*   Field `success` set to: (boolean value, `false`)
*   Field `message` set to: `Session not found. Please start a new session.`
*   Field `statusCode` set to: (number value, e.g., `404`)

**Connections:**
*   **Receives Data From:** `Session Found?` (from False path/output 1)
*   **Sends Data To:** `Merge` (to main input/input 2)
---
---
## Cache Expired? (If node, v2.2)

**Function:**
This node checks if the Gemini cache associated with the session has expired by comparing its expiry timestamp with the current time.

**Notes:**
Checks if the Gemini cache has expired by comparing the expiry timestamp with the current time.

**Key Configurations:**
*   **Combinator:** `and`
*   **Conditions:**
    *   `={{ new Date($json.expiryTimestamp) < new Date() }}` `equals` (as boolean) `={{ true }}`

**Connections:**
*   **Receives Data From:** `Extract Session Data` (from main output/output 0)
*   **Sends Data To:** `Cache Expired Error` (to True path/output 0), `GetChatHistory` (to False path/output 1)
---
---
## GetChatHistory (Postgres node, v2.6)

**Function:**
This node queries a PostgreSQL database ('codirectorChats' table) to retrieve the recent chat history for the current session, ordered chronologically and limited by the session's history turn setting.

**Notes:**
1. TABLE & COLUMN CASE SENSITIVITY
   - Use double quotes for table names: "codirectorChats"
   - Use double quotes for column names: "sessionId"
   - PostgreSQL is case-sensitive when quotes are used
2. STRING VALUES
   - Must use single quotes around string values: 'test-session-123'
   - When using expressions: '{{ $json.sessionId }}'
   - Without quotes, PostgreSQL treats values as column names

WHY POSTGRES NODE:
- Supabase node doesn't support expressions in ordering parameters
- Needed dynamic filtering + ordering + limit in one operation
- Syntax: Double quotes for table/column names ("codirectorChats", "sessionId")
- String values need single quotes ('{{ $json.sessionId }}')
- ORDER BY timestamp DESC works without quotes for ordering
- LIMIT {{ expression }} works for dynamic limits

**Key Configurations:**
*   **Operation:** `executeQuery`
*   **Query:** `SELECT * FROM "codirectorChats"\nWHERE "sessionId" = '{{ $json.sessionId }}'\nORDER BY timestamp DESC\nLIMIT {{ $json.historyTurnsSetting * 2 }}`
*   **Credentials:** `n8n AI Agent`

**Connections:**
*   **Receives Data From:** `Cache Expired?` (from False path/output 1)
*   **Sends Data To:** `FormatChatHistory` (to main input/input 0)
---
---
## Cache Expired Error (Set node, v3.2)

**Function:**
This node prepares a standardized error response if the Gemini cache for the session is found to be expired.

**Notes:**
Formats an error response when the Gemini cache has expired.

**Key Configurations:**
*   Field `success` set to: (boolean value, `false`)
*   Field `message` set to: `Cache has expired. Please start a new session.`
*   Field `statusCode` set to: (number value, e.g., `400`)

**Connections:**
*   **Receives Data From:** `Cache Expired?` (from True path/output 0)
*   **Sends Data To:** `Merge` (to main input/input 3)
---
---
## FormatChatHistory (Code node, v2)

**Function:**
This node processes and formats the retrieved chat history and the current user query into the specific payload structure required by the Gemini API, including handling message sorting and role conversion.

**Notes:**
Formats the chat history into the structure expected by Gemini API, adding the current user query at the end. Handles several transformations:

1. COLLECTING MESSAGES:
   - Uses $input.all() to collect all messages from the Postgres node
   - Each message comes as a separate item in n8n's data flow

2. SORTING MESSAGES:
   - Sorts messages by timestamp to get chronological order (oldest first)
   - Needed b/c Postgres returns newest messages first (DESC order)

3. FORMAT CONVERSION:
   - Converts 'ai' role to 'model' as required by Gemini API
   - Structures messages with the proper 'parts' format containing 'text' property
   - Maintains other roles (user, feedback) as they are

4. ADDING CURRENT QUERY:
   - Adds the current user query from Chat Variables as the last message
   - This is the message we want Gemini to respond to

5. API PAYLOAD CREATION:
   - Creates a properly structured API payload with snake_case parameter names
   - Includes contents (formatted messages), cachedContent (from Extract Session Data),
     and generation_config with proper parameters (temperature, top_p, top_k, max_output_tokens)

6. OUTPUT STRUCTURE:
   - Returns apiPayload and apiStartTime
   - The apiPayload is used directly by the CallGeminiAPI node
   - The apiStartTime is used later for response latency calculation

Handles the Postgres node output format where each db row comes as a separate item rather than a single array.

**Key Configurations:**
*   **JavaScript Code:** (Executes custom JS logic - see notes for details)

**Connections:**
*   **Receives Data From:** `GetChatHistory` (from main output/output 0)
*   **Sends Data To:** `CallGeminiAPI` (to main input/input 0)
---
---
## CallGeminiAPI (HTTP Request node, v4.2)

**Function:**
This node makes the API call to Google's Gemini model to generate a chat response, using the formatted history, user query, and cached context.

**Notes:**
Calls the Gemini API with the chat history and cached context to generate a response. This is the core API call that leverages Gemini's Context Caching feature.

1. REQUEST CONFIGURATION:
   - Uses the apiPayload created by the FormatChatHistory node
   - Includes the cached context reference to avoid resending large documents
   - Uses snake_case parameter names as required by the Gemini API (generation_config, top_p, top_k, max_output_tokens)

2. GENERATION PARAMETERS:
   - temperature: 0.7 (controls creativity/randomness)
   - top_p: 0.95 (nucleus sampling parameter)
   - top_k: 40 (limits token selection to top K options)
   - max_output_tokens: 1024 (limits response length)

3. AUTHENTICATION:
   - Uses Google Gemini API credentials for authentication

During testing, expired cache IDs will result in expected 400 errors. In production, ensure cache IDs are valid and not expired.

**Key Configurations:**
*   **Method:** `POST`
*   **URL:** `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`
*   **Authentication:** `predefinedCredentialType`
*   **Node Credential Type:** `googlePalmApi`
*   **Send Body:** `true`
*   **Specify Body:** `json`
*   **JSON Body:** `={{$json.apiPayload}}`
*   **Credentials:** `Google Gemini(PaLM) Api account`

**Connections:**
*   **Receives Data From:** `FormatChatHistory` (from main output/output 0)
*   **Sends Data To:** `API Success?` (to main input/input 0)
---
---
## API Success? (If node, v2.2)

**Function:**
This node checks the response from the Gemini API call to determine if it was successful or if an error occurred.

**Notes:**
Checks if the Gemini API call was successful or returned an error.

**Key Configurations:**
*   **Combinator:** `and`
*   **Conditions:**
    *   `={{ $json.error !== undefined }}` `equals` (as boolean) `={{ true }}`

**Connections:**
*   **Receives Data From:** `CallGeminiAPI` (from main output/output 0)
*   **Sends Data To:** `Extract Response` (to False path/output 0), `API Error Response` (to True path/output 1)
---
---
## Extract Response (Code node, v2)

**Function:**
This node processes a successful Gemini API response, extracting the AI's text reply, calculating response latency, and preparing data for both client response and logging.

**Notes:**
Extracts the AI response text from the Gemini API response and calculates the response latency. This node processes the raw Gemini API response to extract the actual text content and prepares both the client-facing response data and the metadata needed for logging. The response latency calculation provides valuable performance metrics for monitoring and optimization.

**Key Configurations:**
*   **JavaScript Code:** (Executes custom JS logic - see notes for details)

**Connections:**
*   **Receives Data From:** `API Success?` (from False path/output 0)
*   **Sends Data To:** `LogUserMessage` (to main input/input 0)
---
---
## API Error Response (Set node, v3.2)

**Function:**
This node prepares a standardized error response if the call to the Gemini API fails.

**Notes:**
Formats an error response when the Gemini API call fails.

**Key Configurations:**
*   Field `success` set to: (boolean value, `false`)
*   Field `message` set to: `={{ "Error calling Gemini API: " + $json.error.message }}`
*   Field `statusCode` set to: (number value, e.g., `500`)

**Connections:**
*   **Receives Data From:** `API Success?` (from True path/output 1)
*   **Sends Data To:** `Merge` (to main input/input 1)
---
---
## LogUserMessage (Supabase node, v1)

**Function:**
This node logs the user's original message to the 'chat_logs' table in the Supabase database.

**Notes:**
Logs the user's message to the chat_logs table in Supabase.

**Key Configurations:**
*   **Operation:** `insert`
*   (Table and data mapping are implicitly configured based on input)

**Connections:**
*   **Receives Data From:** `Extract Response` (from main output/output 0)
*   **Sends Data To:** `LogAIResponse` (to main input/input 0)
---
---
## LogAIResponse (Supabase node, v1)

**Function:**
This node logs the AI's generated response to the 'chat_logs' table in the Supabase database.

**Notes:**
Logs the AI's response to the chat_logs table in Supabase.

**Key Configurations:**
*   **Operation:** `insert`
*   (Table and data mapping are implicitly configured based on input)

**Connections:**
*   **Receives Data From:** `LogUserMessage` (from main output/output 0)
*   **Sends Data To:** `Final Success Response` (to main input/input 0)
---
---
## Final Success Response (Set node, v3.2)

**Function:**
This node formats the final successful response to be sent back to the client, including the AI's reply and relevant metadata.

**Notes:**
Formats the final success response with the AI's response and metadata.

**Key Configurations:**
*   Field `success` set to: (boolean value, `true`)
*   Field `message` set to: `Chat response generated successfully`
*   Field `data` set to: (json value, containing the AI response and metadata)

**Connections:**
*   **Receives Data From:** `LogAIResponse` (from main output/output 0)
*   **Sends Data To:** `Merge` (to main input/input 0)
---
---
## Merge (Merge node, v3.1)

**Function:**
This node consolidates various execution paths (the primary success path and all defined error paths for session, cache, and API issues) into a single output stream. This is typically used for standardizing the workflow's final output or for centralized final logging/response handling.

**Notes:**
(No notes provided in the JSON for this node.)

**Key Configurations:**
*   **Number of Inputs:** `4`

**Connections:**
*   **Receives Data From:**
    *   `Final Success Response` (to main input/input 0)
    *   `API Error Response` (to main input/input 1)
    *   `Session Not Found Error` (to main input/input 2)
    *   `Cache Expired Error` (to main input/input 3)
*   **Sends Data To:** (Terminates the depicted workflow paths or sends to a subsequent, unshown node for final response)
---