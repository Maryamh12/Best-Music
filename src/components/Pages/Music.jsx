import { useEffect , useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./Music.css"
import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import PauseRounded from '@mui/icons-material/PauseRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import FastForwardRounded from '@mui/icons-material/FastForwardRounded';
import FastRewindRounded from '@mui/icons-material/FastRewindRounded';
import VolumeUpRounded from '@mui/icons-material/VolumeUpRounded';
import VolumeDownRounded from '@mui/icons-material/VolumeDownRounded';



const Widget = styled('div')(({ theme }) => ({
  padding: 16,
  borderRadius: 16,
  width: 500,
  height:550,
  maxWidth: '100%',
  margin: 'auto',
  position: 'relative',
  zIndex: 1,
  backgroundColor:
    theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.4)',
  backdropFilter: 'blur(40px)',
}));

const CoverImage = styled('div')({
  width: "100%",
  height: 300,
  objectFit: 'cover',
  overflow: 'hidden',
  flexShrink: 0,
  borderRadius: 8,
  backgroundColor: 'rgba(0,0,0,0.08)',
  '& > img': {
    width: '100%',
    
  },
});

const TinyText = styled(Typography)({
  fontSize: '0.75rem',
  opacity: 0.38,
  fontWeight: 500,
  letterSpacing: 0.2,
});

const Music = ({setIdData,idData})=> {
  const Api_Url = "https://deezerdevs-deezer.p.rapidapi.com/track/" ;
  const [tapa, setTapa]=useState([]);
  const [album, setAlbum]=useState();
  const [audio] = useState(new Audio()); // Initialize audio state
  const theme = useTheme();
  const duration = 30; // seconds
  const [position, setPosition] = useState(0);
  const [paused, setPaused] = useState('pause');
  const [isPlaying, setIsPlaying] = useState(false);

  

const { id } = useParams();

useEffect(() => {
  setPosition(0);
  setIdData(true);
  const fetchData = async () => {
  const data = await axios.get(`${Api_Url}${id}`,{headers:{
    "X-RapidAPI-Key":"3616db3932msh540df5ed32b3debp1314b5jsn26fc7d107e48"
  }});

  
  setTapa(data.data);
  
  setAlbum(data.data.album.cover_big)
  // Set audio source after fetching data
  audio.src = data.data.preview;
  console.log(audio);
  audio.volume = 10 /30;
  
    };
  
    fetchData();
   
  },[])


  console.log(album);

  const togglePlay = () => {
    if (isPlaying) {
      audio.pause();
      setPaused('pause');
      console.log(paused);
      console.log(isPlaying);
    } else {
      audio.play();
      setPaused('play');
      console.log(paused);
      console.log(isPlaying);
    
    }
    setIsPlaying(!isPlaying);
    
    
  };

  useEffect(() => {
    setPosition(0);
    const updateTime = () => {
      setPosition(audio.currentTime);
    };
    audio.addEventListener('timeupdate', updateTime);

    const handleAudioEnd = () => {
      audio.currentTime = 0; 
      setPosition(0); 
      setPaused('pause'); 
      setIsPlaying(false);
    };
    
    audio.addEventListener('ended', handleAudioEnd);
   
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleAudioEnd); 
    };
  }, [audio]); 

 
  useEffect(() => {
    return () => {
      audio.pause(); // Pause audio playback
      audio.src = ''; // Reset audio source
    };
  }, [id]);
  
 

  const onClick = (value) => {
    setPosition(value);
    audio.currentTime = value;
  }

  const onVolume = (value)=> {
    // Normalize the value to fit within the range [0, 1]
     const normalizedVolume = value / 30; // Assuming max volume from Slider is 30
     audio.volume = normalizedVolume;
  }

  
  function formatDuration(value) {
    console.log(audio.currentTime)
    
    const minute = Math.floor(value / 60);
    const secondLeft = Math.floor(value - minute * 60);
    return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
  }


  const mainIconColor = theme.palette.mode === 'dark' ? '#fff' : '#000';
  const lightIconColor = theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';
  
  
  return (
    <div className="pageMusic" >
    <Box id="widgetPage" sx={{ width: '100%', overflow: 'hidden'}}>
      <Widget >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CoverImage>
            <img
              alt="can't win - Chilling Sunday"
              src={album}
            />
          </CoverImage>
          </Box>
          <Box sx={{ ml: 3, minWidth: 100}}>
           
            <Typography noWrap marginTop={2} marginLeft={-2.5} >
              <b>{tapa.title}</b>
             
            </Typography>
            
          </Box>
        
        <Slider
          aria-label="time-indicator"
          size="small"
          defaultValue={0}
          value={position}
          min={0}
          step={1}
          max={audio.duration}
          onChange={(_, value) => onClick(value)}
          sx={{
            color: theme.palette.mode === 'dark' ? '#fff' : 'rgba(0,0,0,0.87)',
            height: 4,
            '& .MuiSlider-thumb': {
              width: 8,
              height: 8,
              transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
              '&::before': {
              boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
              },
              '&:hover, &.Mui-focusVisible': {
                boxShadow: `0px 0px 0px 8px ${
                  theme.palette.mode === 'dark'
                    ? 'rgb(255 255 255 / 16%)'
                    : 'rgb(0 0 0 / 16%)'
                }`,
              },
              '&.Mui-active': {
                width: 20,
                height: 20,
              },
            },
            '& .MuiSlider-rail': {
              opacity: 0.28,
            },
          }}
        />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: -2,
          }}
        >
          <TinyText>{formatDuration(position)}</TinyText>
          <TinyText>{formatDuration(duration - position)}</TinyText>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mt: -1,
          }}
        >
         
          <IconButton
            aria-label={paused ? 'play' : 'pause'}
            onClick={togglePlay}
          >
            {(paused ==='pause') ? (
              <PlayArrowRounded
                sx={{ fontSize: '3rem' }}
                htmlColor={mainIconColor}
              />
            ) : (
              <PauseRounded sx={{ fontSize: '3rem' }} htmlColor={mainIconColor} />
            )}
          </IconButton>
         
        </Box>
        <Stack spacing={2} direction="row" sx={{ mb: 1, px: 1 }} alignItems="center">
          <VolumeDownRounded htmlColor={lightIconColor} />
          <Slider
            aria-label="Volume"
            
            defaultValue={10}
            min={0}
            step={1}
            max={30}
            onChange={(_, value) => onVolume(value)}
            sx={{
              color: theme.palette.mode === 'dark' ? '#fff' : 'rgba(0,0,0,0.87)',
              '& .MuiSlider-track': {
                border: 'none',
              },
              '& .MuiSlider-thumb': {
                width: 24,
                height: 24,
                backgroundColor: '#fff',
                '&::before': {
                  boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
                },
                '&:hover, &.Mui-focusVisible, &.Mui-active': {
                  boxShadow: 'none',
                },
              },
            }}
          />
          <VolumeUpRounded htmlColor={lightIconColor} />
        </Stack>
      </Widget>
      {/* <WallPaper /> */}
    </Box>
    </div>
  );
}
export default Music;

// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import "./Music.css";
// import * as React from 'react';
// import { styled, useTheme } from '@mui/material/styles';
// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import Slider from '@mui/material/Slider';
// import IconButton from '@mui/material/IconButton';
// import Stack from '@mui/material/Stack';
// import PauseRounded from '@mui/icons-material/PauseRounded';
// import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
// import VolumeUpRounded from '@mui/icons-material/VolumeUpRounded';
// import VolumeDownRounded from '@mui/icons-material/VolumeDownRounded';
// import AudioLyricsExtractor from './AudioLyricsExtractor'; // Import AudioLyricsExtractor component
// import mm from 'music-metadata';

// import { parseBlob } from 'music-metadata-browser';
// import { Buffer } from 'buffer';


// const Widget = styled('div')(({ theme }) => ({
//   padding: 16,
//   borderRadius: 16,
//   width: 500,
//   height: 550,
//   maxWidth: '100%',
//   margin: 'auto',
//   position: 'relative',
//   zIndex: 1,
//   backgroundColor:
//     theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.4)',
//   backdropFilter: 'blur(40px)',
// }));

// const CoverImage = styled('div')({
//   width: "100%",
//   height: 300,
//   objectFit: 'cover',
//   overflow: 'hidden',
//   flexShrink: 0,
//   borderRadius: 8,
//   backgroundColor: 'rgba(0,0,0,0.08)',
//   '& > img': {
//     width: '100%',
//   },
// });

// const TinyText = styled(Typography)({
//   fontSize: '0.75rem',
//   opacity: 0.38,
//   fontWeight: 500,
//   letterSpacing: 0.2,
// });



// const Music = () => {
//   const Api_Url = "https://deezerdevs-deezer.p.rapidapi.com/track/";
//   const [tapa, setTapa] = useState([]);
//   const [album, setAlbum] = useState();
//   const [audio] = useState(new Audio()); // Initialize audio state
//   const theme = useTheme();
//   const [position, setPosition] = useState(0);
//   const [paused, setPaused] = useState(false);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const { id } = useParams();
//   const [lyrics, setLyrics] = useState('');

//   useEffect(() => {
//     setPosition(0);
//     const fetchData = async () => {
//       const data = await axios.get(`${Api_Url}${id}`, {
//         headers: {
//           "X-RapidAPI-Key": "3616db3932msh540df5ed32b3debp1314b5jsn26fc7d107e48"
//         }
//       });
//       setTapa(data.data);
//       setAlbum(data.data.album.cover_big);
//       audio.src = data.data.preview;
//       audio.volume = 10 / 30;
//       const file = "https://cdns-preview-1.dzcdn.net/stream/c-1d5623e57bbdbbfbc9387241c16fffc7-2.mp3"
//       if (file) {
//         try {
//           console.log('Buffer object:', Buffer);
//           console.log(audio.src);
//           const response = await fetch(file);
//           const blob = await response.blob();
//           console.log(blob);
          

//           const metadata = await parseBlob(blob);
//           const extractedLyrics = metadata.common.lyrics;

//           if (extractedLyrics) {
//           setLyrics(extractedLyrics);
//           } else {
//           setLyrics('Lyrics not found');
//           }
//         } catch (error) {
//             console.error('Error:', error.message);
//         }
//         }
//     };
//     fetchData();
//   }, []);

//   const togglePlay = () => {
//     if (isPlaying) {
//       audio.pause();
//       setPaused(true);
//     } else {
//       audio.play();
//       setPaused(false);
//     }
//     setIsPlaying(!isPlaying);
//   };

//   useEffect(() => {
//     return () => {
//       audio.pause(); // Pause audio playback
//       audio.src = ''; // Reset audio source
//     };
//   }, [id]);

//   useEffect(() => {
//     const updateTime = () => {
//       setPosition(audio.currentTime);
//     };
//     audio.addEventListener('timeupdate', updateTime);
//     return () => {
//       audio.removeEventListener('timeupdate', updateTime);
//     };
//   }, [audio]);

  
//   const lightIconColor = theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';
// const mainIconColor = theme.palette.mode === 'dark' ? '#fff' : '#000';
 

//   return (
//     <div className="pageMusic">
//       <Box id="widgetPage" sx={{ width: '100%', overflow: 'hidden' }}>
//         <Widget>
//           <Box sx={{ display: 'flex', alignItems: 'center' }}>
//             <CoverImage>
//               <img
//                 alt="can't win - Chilling Sunday"
//                 src={album}
//               />
//             </CoverImage>
//           </Box>
//           <Box sx={{ ml: 3, minWidth: 100 }}>
//             <Typography noWrap marginTop={2} marginLeft={-2.5} >
//               <b>{tapa.title}</b>
//               <p>{lyrics}</p>
//             </Typography>
//           </Box>
         
         
//           <IconButton
//             aria-label={paused ? 'play' : 'pause'}
//             onClick={togglePlay}
//           >
//             {paused ? (
//               <PlayArrowRounded
//                 sx={{ fontSize: '3rem' }}
//                 htmlColor={mainIconColor}
//               />
//             ) : (
//               <PauseRounded sx={{ fontSize: '3rem' }} htmlColor={mainIconColor} />
//             )}
//           </IconButton>
//         </Widget>
//       </Box>
//     </div>
//   );
// };

// export default Music;

// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import "./Music.css";
// import * as React from 'react';
// import { styled, useTheme } from '@mui/material/styles';
// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import Slider from '@mui/material/Slider';
// import IconButton from '@mui/material/IconButton';
// import Stack from '@mui/material/Stack';
// import PauseRounded from '@mui/icons-material/PauseRounded';
// import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
// import VolumeUpRounded from '@mui/icons-material/VolumeUpRounded';
// import VolumeDownRounded from '@mui/icons-material/VolumeDownRounded';

// const Widget = styled('div')(({ theme }) => ({
//   padding: 16,
//   borderRadius: 16,
//   width: 500,
//   height: 550,
//   maxWidth: '100%',
//   margin: 'auto',
//   position: 'relative',
//   zIndex: 1,
//   backgroundColor:
//     theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.4)',
//   backdropFilter: 'blur(40px)',
// }));

// const CoverImage = styled('div')({
//   width: "100%",
//   height: 300,
//   objectFit: 'cover',
//   overflow: 'hidden',
//   flexShrink: 0,
//   borderRadius: 8,
//   backgroundColor: 'rgba(0,0,0,0.08)',
//   '& > img': {
//     width: '100%',
//   },
// });

// const TinyText = styled(Typography)({
//   fontSize: '0.75rem',
//   opacity: 0.38,
//   fontWeight: 500,
//   letterSpacing: 0.2,
// });

// const Music = ({ setIdData, idData }) => {
//   const Api_Url = "https://deezerdevs-deezer.p.rapidapi.com/track/";
//   const [tapa, setTapa] = useState([]);
//   const [album, setAlbum] = useState();
//   const [audio] = useState(new Audio()); // Initialize audio state
//   const theme = useTheme();
//   const [position, setPosition] = useState(0);
//   const [paused, setPaused] = useState('pause');
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [transcript, setTranscript] = useState('');

//   const { id } = useParams();

//   useEffect(() => {
//     setPosition(0);
//     setIdData(true);
//     const fetchData = async () => {
//       const data = await axios.get(`${Api_Url}${id}`, {
//         headers: {
//           "X-RapidAPI-Key": "3616db3932msh540df5ed32b3debp1314b5jsn26fc7d107e48"
//         }
//       });
//       setTapa(data.data);
//       setAlbum(data.data.album.cover_big);
//       // Set audio source after fetching data
//       audio.src = data.data.preview;
//       audio.volume = 10 / 30;
//     };

//     fetchData();

   

    
//   }, [id]);
  

//   const transcribeAudio = async () => {
//     try {
//       const response = await fetch(audio.src);
//       const blob = await response.blob();
//       const reader = new FileReader();
//       reader.onload = async () => {
//         const result = reader.result;
//         // Use your transcription logic here
//         // For demonstration purposes, I'm setting the transcript to the base64 representation of the audio
//         setTranscript(result);
//       };
//       reader.readAsDataURL(blob);
//     } catch (error) {
//       console.error('Transcription error:', error);
//     }
//   }; 


//   const togglePlay = () => {
//     if (isPlaying) {
//       audio.pause();
//       setPaused('pause');
//     } else {
//       audio.play();
//       setPaused('play');
//       transcribeAudio();
//       console.log(transcript);
//     }
//     setIsPlaying(!isPlaying);
//   };

//   const onClick = (value) => {
//     setPosition(value);
//     audio.currentTime = value;
//   }

//   const onVolume = (value) => {
//     // Normalize the value to fit within the range [0, 1]
//     const normalizedVolume = value / 30; // Assuming max volume from Slider is 30
//     audio.volume = normalizedVolume;
//   }

//   function formatDuration(value) {
//     const minute = Math.floor(value / 60);
//     const secondLeft = Math.floor(value - minute * 60);
//     return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
//   }

//   const mainIconColor = theme.palette.mode === 'dark' ? '#fff' : '#000';
//   const lightIconColor = theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';

//   return (
//     <div className="pageMusic">
//       <Box id="widgetPage" sx={{ width: '100%', overflow: 'hidden' }}>
//         <Widget >
//           <Box sx={{ display: 'flex', alignItems: 'center' }}>
//             <CoverImage>
//               <img
//                 alt="can't win - Chilling Sunday"
//                 src={album}
//               />
//             </CoverImage>
//           </Box>
//           <Box sx={{ ml: 3, minWidth: 100 }}>
//             <Typography noWrap marginTop={2} marginLeft={-2.5} >
//               <b>{tapa.title}</b>
//               <div>{transcript}</div> {/* Display transcript */}
//             </Typography>
//           </Box>
//           <Slider
//             aria-label="time-indicator"
//             size="small"
//             defaultValue={0}
//             value={position}
//             min={0}
//             step={1}
//             max={audio.duration}
//             onChange={(_, value) => onClick(value)}
//             sx={{
//               color: theme.palette.mode === 'dark' ? '#fff' : 'rgba(0,0,0,0.87)',
//               height: 4,
//               '& .MuiSlider-thumb': {
//                 width: 8,
//                 height: 8,
//                 transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
//                 '&::before': {
//                   boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
//                 },
//                 '&:hover, &.Mui-focusVisible': {
//                   boxShadow: `0px 0px 0px 8px ${
//                     theme.palette.mode === 'dark'
//                       ? 'rgb(255 255 255 / 16%)'
//                       : 'rgb(0 0 0 / 16%)'
//                   }`,
//                 },
//                 '&.Mui-active': {
//                   width: 20,
//                   height: 20,
//                 },
//               },
//               '& .MuiSlider-rail': {
//                 opacity: 0.28,
//               },
//             }}
//           />
//           <Box
//             sx={{
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'space-between',
//               mt: -2,
//             }}
//           >
//             <TinyText>{formatDuration(position)}</TinyText>
//             <TinyText>{formatDuration(audio.duration - position)}</TinyText>
//           </Box>
//           <Box
//             sx={{
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               mt: -1,
//             }}
//           >
//             <IconButton
//               aria-label={paused ? 'play' : 'pause'}
//               onClick={togglePlay}
//             >
//               {paused === 'pause' ? (
//                 <PlayArrowRounded
//                   sx={{ fontSize: '3rem' }}
//                   htmlColor={mainIconColor}
//                 />
//               ) : (
//                 <PauseRounded sx={{ fontSize: '3rem' }} htmlColor={mainIconColor} />
//               )}
//             </IconButton>
//           </Box>
//           <Stack spacing={2} direction="row" sx={{ mb: 1, px: 1 }} alignItems="center">
//             <VolumeDownRounded htmlColor={lightIconColor} />
//             <Slider
//               aria-label="Volume"
//               defaultValue={10}
//               min={0}
//               step={1}
//               max={30}
//               onChange={(_, value) => onVolume(value)}
//               sx={{
//                 color: theme.palette.mode === 'dark' ? '#fff' : 'rgba(0,0,0,0.87)',
//                 '& .MuiSlider-track': {
//                   border: 'none',
//                 },
//                 '& .MuiSlider-thumb': {
//                   width: 24,
//                   height: 24,
//                   backgroundColor: '#fff',
//                   '&::before': {
//                     boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
//                   },
//                   '&:hover, &.Mui-focusVisible, &.Mui-active': {
//                     boxShadow: 'none',
//                   },
//                 },
//               }}
//             />
//             <VolumeUpRounded htmlColor={lightIconColor} />
//           </Stack>
//         </Widget>
//       </Box>
//     </div>
//   );
// }

// export default Music;
