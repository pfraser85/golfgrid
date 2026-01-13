GolfGrid – Project README (PWA)
A social golf‑planning Progressive Web App designed to simplify organizing foursomes, reduce group‑text chaos, and make booking tee times feel as smooth as joining a multiplayer game lobby.

1. Overview
GolfGrid is a calendar‑driven social scheduling PWA that helps golfers coordinate tee times with friends. Instead of endless text chains, users mark availability, discover overlapping open times, form groups of four, and book a course together. The experience intentionally mirrors multiplayer party systems: players join a “lobby,” select a course, ready up, and the first user to click Book Now handles the reservation while others see a status indicator (“Bob is booking…”).

The long‑term goal is App Store / Play Store deployment, but the initial build is web‑first.

2. Core Features
2.1 Bottom Navigation (5 Tabs)
Persistent bottom nav (~10% screen height):

Tab	Icon	Purpose
Messages	💬	Activity log + notifications
Play Now	⛳	Create new golf event (course + time)
Calendar (default)	📅	Availability + event management
Friends	👥	Friend list + search
Profile	🙍	User settings + preferences
3. Calendar System
A clean, modern calendar UI (similar to Apple Calendar or NurseGrid) with rounded day tiles.

3.1 Day Tile Color States
Grey – Not available / no events

White – Open all day

White + Sunrise Icon (🌅) – Morning availability

White + Sun Icon (☀️) – Mid‑day availability

White + Sunset Icon (🌇) – Afternoon availability

Date number appears in the top‑right of each tile.

3.2 Day Tile Action Icons (center area)
🔍 Search – Find matching availability among friends

✨ Sparkle – Someone has joined an open group

⚠️ Alert – A cancellation OR group of 4 not booked within 1 hour

✉️ Letter – Opens a mini group chat for that specific event

Selecting a tile with an active group loads the Play Now flow pre‑filled with date/time.

4. Play Now Tab
A course‑selection and tee‑time creation interface.

4.1 Course Selection
Search by ZIP code

Or auto‑search within 60 miles of user’s ZIP

Horizontal scroll list of available courses

Initial version uses 4 placeholder courses + sample tee times

Future integration: GolfNow API

4.2 Time Selection
Once a course is selected, available times appear in a list below.

4.3 Group Formation Workflow
Users join an open slot (max 4)

When full, the first user to click Book Now becomes the “host”

Others see “<Name> is booking…”

Prevents double‑booking or race conditions

5. Messages Tab
A chronological activity feed:

Events created

Events joined

Friend requests sent/received

Booking reminders

Cancellations or alerts

6. Profile Tab
User settings + personal info:

Profile picture

Name

Email (from FireAuth)

Golf handicap

Favorite/home course

Privacy settings:

Private (only user sees full calendar)

Friends Only

Public Profile

7. Friends Tab
Friend list

Search bar to find new friends

Tap a friend to view their profile card (based on their privacy setting)

Ability to send/accept friend requests

8. Technical Architecture
8.1 Platform
PWA (installable on mobile + desktop)

Domain: golfgrid.app

8.2 Frontend
Recommended: React, Next.js, or Vue

Responsive mobile‑first UI

Service Worker for offline caching

Push notifications (later phase)

8.3 Backend
Firebase stack:

Firestore – primary database

Firebase Auth – email/password + OAuth options

Firebase Cloud Functions – event triggers (e.g., 1‑hour booking alerts)

Firebase Storage – profile images

8.4 Analytics + Data
BigQuery for analytics + custom SQL

Use free 1 TB/month tier

8.5 Future Integrations
GolfNow API for real tee‑time availability

Stripe or similar for group payment splitting

Native app store deployment via Capacitor or React Native wrapper

9. Data Models (Initial Draft)
User
Code
id
name
email
profileImageUrl
handicap
homeCourse
privacySetting
friends: [userId]
availability: { date: availabilityType }
Event
Code
id
creatorId
courseId
date
time
participants: [userId]
status: "open" | "full" | "booking" | "booked"
chatThreadId
Course (placeholder or API-fed)
Code
id
name
location
imageUrl
availableTimes: [time]
Messages / Activity Log
Code
id
userId
type
timestamp
metadata
10. MVP Scope (Recommended for BuildWithAI)
To keep the first build achievable:

Calendar UI + availability states

Friend system (add/remove/search)

Create/join events with placeholder courses

Group-of-four logic + “is booking” lock

Messages tab (basic activity feed)

Profile tab with editable fields

Firebase Auth + Firestore integration

PWA installability