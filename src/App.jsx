import {Routes, Route, Link, useParams} from "react-router-dom"
import { useEffect , useState} from "react";
import "./App.css"
import HomePage from "./components/HomePage/HomePage"
import Footer from "./components/Layout/Footer"
import Header from "./components/Layout/Header"
import Musics from "./components/Pages/Musics"
import Music from "./components/Pages/Music"


function App() {
  const [idData, setIdData] = useState("");
 
  return (
    <div className="App">
      <Header setIdData={setIdData} idData={idData}/>
      <Routes>
        <Route path="/" element={<HomePage setIdData={setIdData} idData={idData}/>}/>
        <Route path="/musics/:id" element={<Musics setIdData={setIdData} idData={idData}/>}/>
        <Route path="/music/:id" element={<Music setIdData={setIdData} idData={idData}/>}/>
       
        
      </Routes>
      {/* {!(idData) && (<Footer/>)} */}
    </div>
  );
}

export default App;