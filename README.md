# 🎵 Best Music

Hello and welcome! 👋

**Best Music** is a small web app made with **React**. You type the name of a song, the app finds it, and you can listen to a **30-second preview** in a nice music player.

I built this project to practise React, routing, working with an API and building a simple music player. 

---


## ✨ What the app does

**Search**
- 🔍 Search for any song or artist, from the home page **or** from the search box in the header (on every page).
- 💡 Not sure what to search? Click one of the **suggestions** (Adele, Coldplay, Queen…).

**Results**
- 🖼️ Every song is a card with the cover, title, artist and length.
- ▶️ Press the **play button on a cover** to hear the preview right there, without leaving the page.
- ❤️ Press the **heart** to save a song to your favourites.
- ⏳ While the songs are loading, you see grey "skeleton" cards instead of an empty page.

**Player**
- 🎧 Big cover, title, artist and album, on top of a blurred copy of the cover.
- ⏯️ Play / pause, ⏮️ previous and ⏭️ next song (from the list you came from).
- 🔁 When a song ends, the **next song starts by itself**.
- ⏩ Time slider to jump to any part of the song.
- 🔊 Volume slider and mute button. The app **remembers your volume**.
- ⌨️ Keyboard shortcuts: **Space** = play / pause, **← / →** = skip 5 seconds.
- 🔗 A link to listen to the **full song on Deezer**.

**Favourites**
- 💾 Your favourite songs are saved **in your browser**, so they are still there tomorrow.
- 🔢 The header shows how many favourites you have.

**Everywhere**
- 📱 Works well on phones: the menu becomes a ☰ button, cards show in 2 columns.
- 🌙 Clean dark design with one accent color.
- ⚠️ Friendly messages for loading, "no songs found", errors (with a **Try again** button) and a **404 page**.
- ♿ Accessible: labels for screen readers, works with the keyboard, and less animation for people who turn it off in their system settings.

---

## 🛠 Technologies I used=

| Technology | What it is used for |
|---|---|
| [React 18](https://react.dev/) | Building the user interface with components |
| [Vite](https://vitejs.dev/) | Running the project locally and building it (very fast!) |
| [React Router](https://reactrouter.com/) | Moving between pages without reloading the browser |
| [Axios](https://axios-http.com/) | Sending requests to the music API |
| [Material UI (MUI)](https://mui.com/) | The music player: sliders, buttons and icons |
| [React Icons](https://react-icons.github.io/react-icons/) | Social media icons in the footer |
| [Deezer API on RapidAPI](https://rapidapi.com/deezerdevs/api/deezer-1) | Where the songs, covers and previews come from |
| CSS | All the styling and the responsive design |

---

## 🧠 How the app works (in simple words)

Think of it in three steps:

```
  🏠 Home page              📋 Results page                 🎧 Player page
 ┌──────────────┐  search  ┌──────────────────────┐ click  ┌──────────────────┐
 │ type a song  │ ───────▶ │ list of songs from   │ ─────▶ │ cover, title,    │
 │ name + Enter │          │ Deezer (cards)       │        │ play, time, volume│
 └──────────────┘          └──────────────────────┘        └──────────────────┘
       "/"                    "/musics/<song name>"           "/music/<track id>"
```

1. **Home page** – You write a song name and press **Search** (or **Enter**). If the box is empty, the app shows a small warning.
2. **Results page** – The app sends your words to the Deezer API. Deezer sends back a list of songs.
3. **Player page** – When you click **Watch Music!**, the app asks Deezer for that one song. It gets the cover picture and the link to a 30-second MP3 preview. 

---

## 📁 Project structure

```
Best-Music-main/
├── public/                     
│   ├── _redirects             
│   ├── favicon.ico            
│   ├── ppicture.png
│   └── ...
├── src/
│   ├── main.jsx                
│   ├── App.jsx                 
│   ├── App.css                
│   ├── index.css              
│   ├── data/
│   │   └── data.js            
│   └── components/
│       ├── HomePage/
│       │   ├── HomePage.jsx    
│       │   └── homepage.css
│       ├── Layout/
│       │   ├── Header.jsx     
│       │   ├── Footer.jsx      
│       │   └── layout.css
│       └── Pages/
│           ├── Musics.jsx     
│           ├── Music.jsx       
│           ├── AudioLyricsExtractor.jsx  
│           ├── Music.css
│           └── public/         
├── .env.example                
├── index.html                 
├── package.json               
├── vite.config.js            
├── webpack.config.js          
└── README.md                  
```

---


## 🚀 How to run the project

**Step 1 – Get the code**

**Step 2 – Install the libraries**

```bash
npm install
```


**Step 3 – Start the app**

```bash
npm run dev
```

You will see something like:

```
  ➜  Local:   http://localhost:5173/
```

Open this address in your browser. That's it – search for your favourite song! 🎶

---

## 🗺 Pages and routes

| Address (route) | Page | What you see |
|---|---|---|
| `/` | `HomePage` | Video background and search box |
| `/musics/:id` | `Musics` | Cards of songs. `:id` is the text you searched, e.g. `/musics/adele` |
| `/music/:id` | `Music` | The player. `:id` is the Deezer track number, e.g. `/music/3135556` |

---


## 💡 Ideas for the future

- ⏭️ **Next / previous song** buttons on the player.
- ❤️ **Favourites list** saved in the browser.
- 🎤 **Lyrics** from a lyrics API.
- 🌙 **Dark / light mode** switch.
- 🔎 **Search suggestions** while typing.
- 🧪 **Tests** with Vitest and React Testing Library.
- 🔐 **Small back-end** (for example with Node.js/Express) to hide the API key completely.

---

## 🎓 What I learned

- How to split an app into small **React components**.
- How to use **React Router** with dynamic routes like `/music/:id`.
- How to get data from an **API** with Axios, and how to handle **loading** and **errors**.
- How to control an **HTML `Audio` object** from React (play, pause, seek, volume).
- How to use **`useEffect`** correctly, including cleanup functions.
- How to keep secrets in **environment variables** (`.env`).
- How to make a layout **responsive** for mobile phones.
- How to **deploy** a React app on Netlify.

---

## 🙏 Credits

- Music data and previews: [Deezer API](https://developers.deezer.com/) via [RapidAPI](https://rapidapi.com/deezerdevs/api/deezer-1)
- Background video and image: [Pexels](https://www.pexels.com/)
- Photo: Anita Austvika on [Unsplash](https://unsplash.com/)
- Player design idea: [Material UI](https://mui.com/material-ui/react-slider/#music-player) music player example

---

Thank you for reading! 😊
If you have any questions or ideas, feel free to open an **issue** or send a **pull request**. Have fun with the music! 🎧
