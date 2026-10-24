# Restaurant Ordering App with AI Recommendations

A restaurant web app where guests browse the menu, place orders, follow their order status in real time, and get dish recommendations from an AI assistant that takes their dietary preferences and allergies into account. Staff manage dishes, ingredients and orders from a dedicated dashboard.

Built with Django REST Framework, React and PostgreSQL, with Django Channels for real-time updates and the Google Gemini API for the AI features.

## Features

**For guests**
- Browse the menu, filter by category and search by name
- Add dishes to a cart and place an order
- Get live order-status notifications (bell icon) without refreshing the page
- Ask a question about any dish ("Does this contain gluten?")
- Describe what you feel like eating and get up to three recommended dishes, each with a short reason
- Save dietary preferences and allergies on your profile; recommendations exclude dishes with your allergens

**For staff (ADMIN / STAFF roles)**
- Add, edit and delete dishes, including image and ingredients
- Add ingredients and mark them as allergen, vegetarian or vegan
- See all orders and change their status; the list refreshes automatically when a new order arrives
- Status changes made in the dashboard or in Django admin notify the customer instantly

## Tech stack

| Layer | Technology |
| --- | --- |
| Backend | Django, Django REST Framework, token authentication |
| Real-time | Django Channels, Daphne (ASGI) |
| Database | PostgreSQL |
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| AI | Google Gemini API (`google-genai`) |

## Architecture

```
React (Vite, :5173)  ──REST + WebSocket──▶  Django + Channels (Daphne, :8000)  ──HTTPS──▶  Gemini API
                                                     │
                                                 Django ORM
                                                     │
                                                PostgreSQL
```

- The frontend talks to the backend over REST for data and over one WebSocket connection per logged-in user for notifications.
- Only the backend talks to the database and to Gemini, so the API key never reaches the browser.
- Each user joins a personal channel group (`user_<id>`) for order-status updates. Staff also join `admin_orders`, which is how the dashboard refreshes when a new order is placed.

## Getting started

### Prerequisites

- Python 3.11+
- Node.js 20+
- PostgreSQL
- A Gemini API key from [Google AI Studio](https://aistudio.google.com)

> API keys created with a university or company Google account can be blocked by the organisation's policy (`403 PERMISSION_DENIED`). If that happens, create the key in a different project or with a personal account.

### 1. Backend

```bash
# from the project root (the folder with manage.py)
python -m venv venv

# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
```

Create a PostgreSQL database for the app, then point `DATABASES` in `Restoran/settings.py` at it.

Create a `.env` file in the project root:

```
GEMINI_API_KEY=your_key_here
```

Run migrations, create an admin account and start the server:

```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

The backend runs on `http://localhost:8000`. Because `daphne` is listed first in `INSTALLED_APPS`, `runserver` starts the ASGI server, so WebSockets work in development too.

A superuser automatically gets the `ADMIN` role, which unlocks the staff dashboard.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`.

### 3. Add some data

Log in at `http://localhost:8000/admin/` or through the app's staff dashboard and add a few categories, ingredients and dishes. The AI features work best when dishes have descriptions of two to four sentences covering ingredients, taste and dietary notes.

## Frontend routes

| Route | Page |
| --- | --- |
| `/home` | Home page with footer (About, Contact) |
| `/menuOrder` | Menu with category filter, search and per-dish questions |
| `/OrderPage` | Cart and order confirmation |
| `/assistant` | AI recommendation assistant |
| `/profilePage` | Password, email, profile picture, preferences and allergies |
| `/admin` | Staff dashboard (dishes, orders, ingredients) |
| `/createMeniItem` | Add a dish |
| `/editMenuItem/:id` | Edit a dish |

## API

Protected endpoints expect the header `Authorization: Token <token>`.

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| POST | `/accounts/login/` | Log in, returns a token | Public |
| POST | `/accounts/register/` | Create an account | Public |
| POST | `/accounts/logout/` | Log out, deletes the token | Logged in |
| GET | `/accounts/userinfo/` | Current user, including role | Logged in |
| POST | `/accounts/changepassword/` | Change password | Logged in |
| POST | `/accounts/changeemail/` | Change email | Logged in |
| GET, PATCH | `/accounts/profile/` | Dietary preferences and allergies | Logged in |
| GET | `/api/menu/list` | List dishes | Public |
| GET | `/api/categories/` | List categories | Public |
| GET | `/api/ingredient/` | List ingredients | Public |
| POST | `/api/ingredients/add` | Add an ingredient | Staff |
| POST | `/api/menu/add/` | Add a dish | Staff |
| PATCH | `/api/menu/<id>/update/` | Edit a dish | Staff |
| DELETE | `/api/menu/<id>/delete/` | Delete a dish | Staff |
| POST | `/api/orders/create` | Place an order | Logged in |
| GET | `/api/orders/list/` | List all orders | Staff |
| PATCH | `/api/orders/<id>/status/` | Change order status and notify the customer | Logged in |
| POST | `/api/menu/<id>/qa/` | Ask a question about a dish | Public |
| POST | `/api/menu/recommend/` | AI recommendations, personalised when a token is sent | Public |
| WS | `/ws/notifications/?token=<token>` | Order notifications | Logged in |

## How the AI recommendations work

1. Only available dishes are considered.
2. If the user is logged in, dishes containing any of their allergens are removed with a database query, before anything is sent to the model. Food safety does not depend on the model following instructions.
3. Each remaining dish becomes one line of text: ID, name, description, ingredients and price.
4. The user's saved preferences are added as context, together with their message.
5. Gemini is asked to return JSON matching a fixed schema: a list of `{ "id", "reason" }`. The backend maps each ID back to the real dish and discards any ID it does not recognise, so the model cannot invent a dish.

If Gemini is temporarily overloaded (`503`), the backend retries once and then falls back to other models. Every attempt counts towards the API key's rate limit, so the number of retries is kept low.
