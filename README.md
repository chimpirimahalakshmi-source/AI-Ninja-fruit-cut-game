# 🍉 Hand Fruit Cut Game – AI Hand Gesture Game

## 🎮 About the Project

**Hand Fruit Cut Game** is an interactive browser-based game where you can cut fruits using **real-time hand movements** instead of a keyboard or mouse.

The game uses your computer's camera to detect your hand and tracks your finger movements. When you move your hand across a fruit, the game detects the gesture and cuts the fruit.

## ✨ Features

* 🖐️ Real-time hand gesture detection
* 📷 Webcam-based gameplay
* 🍉 Interactive fruit cutting
* 💥 Fruit slicing animations
* 🎯 Score tracking
* ❤️ Lives/game-over system
* ⚡ Real-time hand tracking using MediaPipe
* 🌐 Runs directly in the browser
* 🎨 Modern and responsive game interface

## 🛠️ Technologies Used

* **HTML5** – Game structure
* **CSS3** – Styling, animations and responsive layout
* **JavaScript** – Game logic and interactions
* **MediaPipe Hands** – Real-time hand tracking
* **Web Camera API** – Captures the player's hand movements
* **Canvas API** – Renders game elements and effects

## 🕹️ How to Play

1. Open the game in your browser.
2. Allow **camera permission** when requested.
3. Position your hand in front of the camera.
4. Move your index finger across the fruits.
5. Slice the fruits using your hand movement.
6. Avoid missing fruits and try to achieve the highest score!

## 📂 Project Structure

```text
Hand-Fruit-Cut-Game/
│
├── index.html
├── style.css
├── script.js
│
├── assets/
│   ├── fruits/
│   └── sounds/
│
└── README.md
```

## 🚀 How to Run

### Method 1 – VS Code Live Server

1. Download or clone this repository.
2. Open the project in **VS Code**.
3. Install the **Live Server** extension.
4. Right-click `index.html`.
5. Select **Open with Live Server**.
6. Allow camera access.
7. Start playing!

### Method 2 – Local Server

You can also run the project using any local HTTP server.

> **Note:** Camera access may not work correctly when opening the HTML file directly with `file://`. Running through a local server is recommended.

## 🧠 How It Works

```text
Webcam
   ↓
Capture Video
   ↓
MediaPipe Hands
   ↓
Detect Hand Landmarks
   ↓
Track Finger Movement
   ↓
Check Fruit Collision
   ↓
Slice Fruit
   ↓
Update Score
```

The camera continuously captures video frames. **MediaPipe Hands** identifies hand landmarks, and JavaScript tracks the movement of the player's finger. When the tracked movement intersects with a fruit, the fruit is sliced and the player's score is updated.

## 🎯 Future Improvements

* 🔊 Add cutting and background sound effects
* 🏆 Add high-score leaderboard
* ⏱️ Add different game modes
* 🍎 Add more fruits and special objects
* 💣 Add bombs and obstacles
* 📱 Improve mobile support
* 👥 Add multiplayer mode
* 🤖 Improve gesture recognition accuracy

## 👩‍💻 Author

**CHIMPIRI MAHA LAKSHMI**

Computer Science & Engineering Student

## ⭐ Support

If you like this project, consider giving the repository a **⭐ Star** on GitHub!
