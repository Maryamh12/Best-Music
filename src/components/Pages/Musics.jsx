
import { useEffect , useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./Music.css"

const Musics = ({setIdData,idData}) => {
  const api_Url = "https://deezerdevs-deezer.p.rapidapi.com/search" ;
  const [tapa, setTapa]=useState([]);
  

  const { id } = useParams();
 localStorage.setItem('id',id);

  useEffect(() => {
    setIdData(true);
    const fetchData = async () => {
      const {data} = await axios.get(`${api_Url}?q=${id}`,{headers:{
        "X-RapidAPI-Key":"3616db3932msh540df5ed32b3debp1314b5jsn26fc7d107e48"
      }});
      
      setTapa(data.data);
      
      
      
  
    };
    fetchData();
  },[])
  console.log(tapa);
  
  

  return (
    <div className="page">
     
      <ul className="Musiccontain">
      {tapa.map((tapas)=> <li key={tapas.id} className="musicclass">
        <img src={tapas.album.cover_medium} alt="" className="music-image"/>
        <div>
          <p className="musicTitle">{tapas.title}</p>
          <Link to={`/music/${tapas.id}`}>
            <button className="musicCard">Watch Music!</button>
          </Link>

      </div></li>)}
      </ul>
      
    </div>
  );
};

export default Musics;
