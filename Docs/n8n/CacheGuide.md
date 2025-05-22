# Guide: Using the Google Gemini API Context Caching Feature
<!-- Last updated: May 8, 2025, 11:00 PM ET -->
Version: 1.8
Sources:
https://ai.google.dev/gemini-api/docs/caching?lang=rest
https://cloud.google.com/vertex-ai/generative-ai/docs/context-cache/context-cache-create
https://cloud.google.com/vertex-ai/generative-ai/docs/context-cache/context-cache-overview (General Info)
1. Introduction: What is Context Caching?
The Gemini API Context Caching feature allows you to upload a significant block of input content (like a large document, system instructions, tools definitions, or media files) to Google's servers once and then reference that content in subsequent API calls using a unique identifier.
Why use it?
Cost Reduction:
Instead of sending the same large block of tokens repeatedly with every API request (e.g., in a multi-turn chat about a specific document), you send it once to create the cache.
Processing cached tokens in later requests is significantly cheaper than processing fresh input tokens. (Refer to official pricing documentation for details).
Potential Latency Improvement:
While primarily a cost-saving feature currently, reusing server-side cached data can potentially reduce the amount of data transferred and processing time for the static portion of your prompt, especially on subsequent turns after the initial cache creation.
Important Distinction:
Context Caching stores a specific part of your input prompt server-side (e.g., contents, systemInstruction, tools). It does not make the main generateContent API calls stateful. You still need to manage conversational state (like chat history) in your application and send it along with the reference to the cached content in each turn.
2. Prerequisites & Requirements
Supported Models:
Caching is supported by specific models. According to the latest information provided (always verify with current official documentation for the latest list and specific version requirements):
Gemini 2.5 Pro
Gemini 2.5 Flash
Gemini 2.0 Flash
Gemini 2.0 Flash-Lite
Crucially: You must use the full, specific model name, often including a version suffix or tag (like -latest or a preview identifier, e.g., models/gemini-2.5-pro-preview-0514), when creating and referencing a cache. The model used in generateContent must exactly match the model used to create the cache.
Minimum Token Count:
There's a minimum number of tokens required for the content you want to cache (e.g., 4,096 tokens).
API Key & Authentication:
You need a valid Google AI API key (generativelanguage.googleapis.com) or appropriate Google Cloud credentials/service account (aiplatform.googleapis.com for Vertex AI) with the necessary permissions (e.g., roles/aiplatform.user or more specific roles).
3. Core Concept: How It Works
Cache Creation:
You send the content you want to cache (contents, systemInstruction, tools, toolConfig) to the cachedContents.create endpoint (POST /v1beta/cachedContents).
You specify the exact model this cache is intended for and a ttl (Time-To-Live).
Cache ID:
The API processes the content, stores it server-side, and returns a unique resource name (cache ID) for this CachedContent (e.g., cachedContents/your-unique-id).
Time-To-Live (TTL):
You specify how long the cache should remain active (e.g., "3600s" for 1 hour).
After the TTL expires, the cache is automatically deleted. You can update the TTL using a PATCH request.
The default TTL is typically 1 hour, and there's usually a maximum TTL (e.g., check docs, often 1-24 hours).
Referencing:
In subsequent generateContent calls using the same model, instead of including the large cached block directly, you provide the cache ID in the cachedContent field of the request.
The Gemini model then internally combines the referenced cached content with the non-cached parts of your current generateContent request (e.g., new user query, recent chat history) before generation.
4. API Interaction (REST Example - Generative Language API)
(Note: Endpoints and authentication might differ slightly if using Vertex AI)
4.1 Creating a Cache
Method: POST
Endpoint: https://generativelanguage.googleapis.com/v1beta/cachedContents?key=YOUR_API_KEY
Headers: Content-Type: application/json
Request Body (JSON): An instance of the CachedContent resource.
Key Request Body Fields:
Field
Required?
Mutable?
Description
Example Value
model
Yes
No (Create)
Full model resource name (e.g., models/gemini-2.5-pro-latest). Must match the model used later.
"models/gemini-2.5-pro-latest"
contents
Optional
No (Create)
Array of Content objects (user/model turns) to cache. See section 4.2.
[ { "role": "user", "parts": [...] } ]
systemInstruction
Optional
No (Create)
A Content object with system instructions to cache.
{ "parts": [{"text": "You are..."}] }
tools
Optional
No (Create)
Array of Tool definitions (e.g., function declarations) to cache.
[...]
toolConfig
Optional
No (Create)
Configuration for cached tools.
{...}
ttl
Optional
Yes (Update)
Cache duration (string with 's' suffix, e.g., "3600s"). Cannot be set if expireTime is set. Defaults to 1 hour. Max TTL applies.
"7200s" (2 hours)
expireTime
Optional
Yes (Update)
Absolute expiration time (RFC 3339 UTC). Cannot be set if ttl is set.
"2025-05-03T10:00:00Z"
displayName
Optional
No (Create)
User-friendly name (max 128 chars).
"Scenario X + Principles Cache"
name
Output
N/A
Resource name assigned by the API upon creation. Format: cachedContents/{id}. Store this ID.
cachedContents/abc123xyz789

(Note: At least one of contents, systemInstruction, or tools must be provided to create a cache).
4.2 Structuring Content (contents field)
The contents field is an array, where each element is a Content object, typically including a role (user or model) and a parts array. Each element in parts is a Part object representing a piece of data.
Part Object Formats:
For Plain Text:
Use the text field.
No Base64 encoding needed.
Example: { "text": "This is the scenario text..." }

For Document Separation:
When combining multiple documents, use clear separation markers:
```
######## SCENARIO DOCUMENT START ########
[scenario content]
######## SCENARIO DOCUMENT END ########

######## UNIVERSAL PRINCIPLES START ########
[principles content]
######## UNIVERSAL PRINCIPLES END ########
```
This helps the model understand document boundaries and context.
For Inline Binary Data (Images, Audio, etc.):
Use the inlineData field (which is an object).
Requires mimeType (e.g., "image/png") and data.
The data field MUST contain the Base64-encoded string of the file bytes.
Example: { "inlineData": { "mimeType": "image/jpeg", "data": "..." } }
For File URIs (Cloud Storage, File API):
Use the fileData field (which is an object).
Requires mimeType and fileUri (e.g., "gs://...").
No Base64 encoding needed. Ensure the service/model has permission to access the URI.
Example: { "fileData": { "mimeType": "application/pdf", "fileUri": "gs://..." } }
4.3 JSON Example: Caching Combined Text
POST https://generativelanguage.googleapis.com/v1beta/cachedContents?key=YOUR_API_KEY
Content-Type: application/json

{
  "model": "models/gemini-2.5-pro-latest", // Use a specific, supported model version
  "contents": [
    {
      "role": "user", // Role might be 'user' or 'model' depending on how you structure cached context
      "parts": [
        {
          "text": "--- Scenario Document: Counseling Employees ---\n[Full text of scenario doc]...\n\n--- Universal Principles ---\n1. Principle One...\n2. Principle Two...\n[Rest of principles text]..."
        }
      ]
    }
  ],
  "ttl": "7200s", // 2 hours
  "displayName": "Childcare Counseling Scenario + Principles"
}


Response: The API will respond with a JSON object representing the created CachedContent, including its assigned name (e.g., "name": "cachedContents/abc123xyz789"). Store this name securely.
4.4 Referencing the Cache in generateContent
When making a standard call to generate content using the same model specified during cache creation, include the cache name. Note that all parameter names in the request must use snake_case format (e.g., "generation_config" instead of "generationConfig").
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro-latest:generateContent?key=YOUR_API_KEY
Content-Type: application/json

{
  "contents": [
    // Include ONLY the NEW parts of the conversation (e.g., latest user query)
    // DO NOT include the text that is already in the cache here.
    {
      "role": "user",
      "parts": [
        { "text": "Okay, based on that scenario and principles, what's the first step if the employee refuses to sign the counseling form?" }
      ]
    }
    // You might include previous non-cached turns here if managing chat history manually
  ],
  "cachedContent": "cachedContents/abc123xyz789", // Reference the cache ID obtained previously
  "generation_config": {
    "temperature": 0.7,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 1024
    // Other generation settings
  }
  // Include tools, toolConfig, systemInstruction ONLY if they were NOT part of the cache
  // or if you need to override/add to them for this specific call.
}


4.5 Managing Caches
The API provides endpoints for managing your caches:
List Caches: GET /v1beta/cachedContents (Returns a list of your active caches)
Get Cache: GET /v1beta/cachedContents/{id} (Retrieves details of a specific cache)
Update Cache TTL: PATCH /v1beta/cachedContents/{id} (Request body contains { "ttl": "new_duration_s" } or { "expire_time": "new_timestamp_Z" }. Requires updateMask query parameter, e.g., ?updateMask=ttl)
Delete Cache: DELETE /v1beta/cachedContents/{id} (Deletes the cache immediately)
Refer to the official Gemini API documentation for exact request/response details and parameters.
5. Important Considerations

### Parameter Naming (CRITICAL)

The Gemini API requires snake_case for all parameter names (e.g., "generation_config", "top_p", "top_k", "max_output_tokens"). Using camelCase (e.g., "generationConfig", "topP") will result in validation errors with HTTP 400 status codes.

This is a critical requirement that affects all interactions with the Gemini API, including:
- The main generateContent endpoint
- The cachedContents endpoints
- All configuration parameters within requests

Common parameters that must use snake_case:
- `system_instruction` (NOT `systemInstruction`)
- `display_name` (NOT `displayName`)
- `generation_config` (NOT `generationConfig`)
- `max_output_tokens` (NOT `maxOutputTokens`)

Examples of correct parameter naming:
```json
{
  "system_instruction": {  // NOT "systemInstruction"
    "parts": [
      { "text": "You are an AI assistant..." }
    ]
  },
  "display_name": "My Cache",  // NOT "displayName"
  "generation_config": {  // NOT "generationConfig"
    "temperature": 0.7,
    "top_p": 0.95,        // NOT "topP"
    "top_k": 40,          // NOT "topK"
    "max_output_tokens": 1024  // NOT "maxOutputTokens"
  }
}
```

If you receive a 400 error with a message like "required oneof field 'data' must have one initialized field", check your parameter naming first. This is a common error when using camelCase instead of snake_case.

Error Handling: Implement robust error handling for API calls (cache creation, generation). Check for errors related to invalid model names, insufficient tokens, permissions issues, or expired caches.
Idempotency: Cache creation is generally not idempotent. Calling create multiple times with the same content will likely create multiple caches with different IDs.
Cache Invalidation: If the source documents (scenario, principles) change, you need a mechanism to delete the old cache and create a new one with the updated content. Caching is best suited for relatively static content within the TTL period.
Permissions: Ensure the credentials used have the necessary permissions not only for the Generative AI API but also potentially for accessing file URIs (like Google Cloud Storage) if you use that method.
Quotas & Limits: Be aware of potential quotas on the number of active caches, cache size, and API call frequency. Check the official documentation for current limits.
Pricing: Remember that cache creation, storage (implicitly via TTL), and usage incur costs. Review the official pricing page.
6. Common Use Cases & Strategies (Review)
Single Large Document Q&A: Cache a large document (manual, contract, research paper) and ask multiple questions about it.
Chatbots with Large System Prompts/Instructions: Cache extensive instructions or persona definitions.
Repetitive Media Analysis: Cache a long video or audio file and run various analytical queries against it.
RAG with Static Context: Cache foundational knowledge base documents or chunks used repeatedly in Retrieval-Augmented Generation.
Multi-Turn Scenario-Based Dialogue (Your Use Case): Cache the combined scenario document and universal principles for the duration of the user's conversation about that specific situation, provided the combined text exceeds the token minimum.
Combined Context Strategy (Multiple Sources):
Retrieve: Get content from Google Docs (scenario + principles).
Combine: Concatenate into a single string with separators.
Count Tokens: Use countTokens API.
Cache or Send:
If >= minimum tokens: POST /cachedContents to create cache, store the returned name.
If < minimum tokens: Store the combined text locally/in session.
Generate:
If cached: Use cachedContent: "cache_name" in generateContent request, sending only new user input in contents.
If not cached: Send the full combined text + new user input in contents.
Benefit: Optimizes cost by caching large, static context blocks.
