import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./homepage.css";




const HomePage = ({setIdData,idData}) => {
  const [formData, setFormData] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
 
  setIdData(false);
  const onChange = (e) => {
    setFormData(e.target.value);
    setErrorMessage("");
  };

  const handleClick = (e) => {
    if (!formData) {
      e.preventDefault();
      setErrorMessage("Please enter the name of your song");
    }else{
      setErrorMessage("");
    }
    
  };
  const handleKeyPress = (event) => {
    // Check if the Enter key was pressed
    if (event.key === 'Enter') {
      // Prevent default behavior of the Enter key (form submission, etc.)
      event.preventDefault();
      // Programmatically trigger a click event on the button
      document.getElementById("link").click();
    }
  };

  return (
    <>
      
      <div id="hpage">
      <video id="video-background" src="https://videos.pexels.com/video-files/2112426/2112426-sd_640_360_30fps.mp4" autoPlay muted loop >
      
      </video>
        
        <input
          className="inputsign"
          type="text"
          value={formData}
          placeholder="The name of your song"
          onChange={onChange}
          onKeyPress={handleKeyPress}
        />
        <Link id="link" to={`/musics/${formData}`}  onClick={handleClick}>
          <button className="buttonsign" type="button">
            Search
          </button>
        </Link>
        {(errorMessage)&&(<h2>{errorMessage}</h2>)}
      </div>
     
    </>
  );
};

export default HomePage;




