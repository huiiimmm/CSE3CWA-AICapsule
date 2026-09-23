--- Deploy URL ---

https://cse3cwa-aicapsule.onrender.com

--- Setup / Run Instructions ---

GitHub OAuth APP with callback URL: http://localhost:3000/auth/github/callback for local hosting

backend:
npm install
create .env with the .env variable names as a guide
npm start
runs on http://localhost:3000

frontend:
npm run dev
runs on http://localhost:5173

open the frontend URL to access the app, and the backend url to access backend

Render Deployment: 

Root directory: backend/
Build command: npm install && cd ../frontend && npm install && npm run build
Start command: npm start

change callback URL to https://cse3cwa-aicapsule.onrender.com/auth/github/callback for render

Render Environment Variables:
 
--- .env Variable Names ---

GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET
JWT_SECRET
FRONTEND_URL
GITHUB_CALLBACK_URL based on needs


--- Routes ---

Backend:

backend/routes/auth.js & backend/routes/capsules.js

Middleware:

backend/middleware/auth.js & frontend/vite.config.js

--- OAuth / JWT Explanation ---

Authentication is done through GitHub app

--- DB persistence notes ---

Refresh saving issues on inactive render deployments. 
When the render deployment shuts down, all database memory also seemingly gets wiped. During an active server however, database remains intact.

--- cURL results ---

# Test 1 - no authentication
curl -i https://YOUR-APP/api/capsules
# Required: 401 Unauthorized
Result:
HTTP/2 401 
date: Wed, 23 Sep 2026 07:09:49 GMT
content-type: application/json; charset=utf-8
cf-cache-status: DYNAMIC
etag: W/"18-XPDV80vbMk4yY1/PADG4jYM4rSI"
rndr-id: 4a32f540-4a32-487f
server: cloudflare
vary: Accept-Encoding
x-powered-by: Express
x-render-origin-server: Render
cf-ray: a3f7b9df3d48e6da-MEL
alt-svc: h3=":443"; ma=86400

{"error":"Unauthorized"}

# Test 2 - fake / invalid JWT
curl -i -H "Cookie: token=fake-token-123" https://YOUR-APP/api/capsules
# Required: 401 Unauthorized
Result:
HTTP/2 401 
date: Wed, 23 Sep 2026 07:11:07 GMT
content-type: application/json; charset=utf-8
cf-cache-status: DYNAMIC
etag: W/"18-XPDV80vbMk4yY1/PADG4jYM4rSI"
rndr-id: 08eb5f52-1d26-4e67
server: cloudflare
vary: Accept-Encoding
x-powered-by: Express
x-render-origin-server: Render
cf-ray: a3f7bbc3bc026b92-MEL
alt-svc: h3=":443"; ma=86400

{"error":"Unauthorized"}

--- Limitation ---

The render deployment isn't always live, as it shuts down after a certain amount of inactivity with the free option. With the previously mentioned database persistence issues, this results in user capsules not getting safely saved over extended periods of use.

--- AI usage ---

Claude was my main choice of generative AI for this assignment. The main uses were for breaking down the assignment work structure, debugging syntax, 
and education on the various authentication methods and cloud services required. I also used AI to help with overall html styling, with specific instructions to seperate the css styles 
from the .jsx files. 

--- Bugs and Decisions ---

Majority of the bugs I encountered during development were syntax and routing errors. I repurposed majority of the frontend from past assignments (fetch calls, page loading, etc.)
and so I found little difficulty in those aspects.

A key decision I made was to integrate the landing page and login page into one unified page, as I felt that having the two separate was not necessary, and only increased
the amount of pages the user would have to progress through. If there were more specification for these two pages, I would have kept them seperate. 
However, considering the current requirements, I felt it to be unnecessary.
