# BF2-TRACK 🎖️

**BF2-TRACK** is a modern web interface designed for tracking player statistics, server status, and global rankings for Battlefield 2.
## 🚀 Key Features

* **Player Profiles:** Comprehensive statistics, real-time rank progress calculation (XP bar), and recent match history.
* **Global Leaderboard:** TOP player rankings across the network with filtering by rank, score, and country.
* **Server Monitoring:** View active servers, current maps, and player counts in real-time.
* **Favorite Servers:** Add servers to a quick-access list; data is persistently stored in `localStorage`.
* **Live Network Info:** A dedicated header displaying the total number of players and active servers currently online.

## 🛠️ Tech Stack

* **Frontend:** React (TypeScript)
* **API:** [bflist.io](https://bflist.io/) for getting live stats and 
* **State Management:** React Hooks (`useState`, `useEffect`), Redux
* **Storage:** `LocalStorage` for saving user favorite servers

