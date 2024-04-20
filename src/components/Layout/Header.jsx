import React, { useState ,useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import ppicture from "../Pages/public/ppicture.png";
import "./layout.css";

const Header = ({setIdData,idData}) => {
  const [formData, setFormData] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const location = useLocation();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [currentMenu , setCurrentMenu]= useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const clickMenu = () => {
    setCurrentMenu(!currentMenu);
    
  }


  const onClick = () => {
    
    localStorage.removeItem('id');
    setFormData("");
    setIdData(false);
  };

  const handleClick = (e) => {
    const id = localStorage.getItem('id');
    setFormData(id);
    if (!formData) {
      e.preventDefault();
      navigator("/");
    }
  
  };

  return (
    <header>
      <div className="headercontainer">
        <div className="headerposition">
          <Link to='/' onClick={onClick}>
          <img src={ppicture} alt="Logo" />
          </Link>
          
        </div>
        
        {windowWidth < 760 ? (
        <div className="sidebar">
          
  
  <div className="hamburger-icon"  onClick={clickMenu}>
    {currentMenu ? (<div>
      <div className="a"></div>
      <div className="b" ></div>
      <div className="c"></div>
      <div className="clear"></div>
    </div>):
    (<div>
      <div className="icon-1"></div>
      <div className="icon-2" ></div>
      <div className="icon-3" ></div>
      <div className="clear"></div>
    </div>)}
    
  </div>
  {currentMenu ? (<nav className="navMenu">
          
          <Link to={`/musics/${formData}`} onClick={handleClick} className='navMenuLink'>
            <li>Best Music</li>
          </Link>
          
   </nav>):
   (<nav className="navMenuDisapper">
          
          <Link to={`/musics/${formData}`} onClick={handleClick} className='navMenuDisapperLink'>
            <li>Best Music</li>
          </Link>
          
 </nav>)}
  
  
        </div>
      ) : (
          <Link to={`/musics/${formData}`} onClick={handleClick}>
            <h1>Best Music</h1>
          </Link>   
      )}
       
      </div>
    </header>
  );
};

export default Header;

