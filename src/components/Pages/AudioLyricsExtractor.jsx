import React, {useEffect, useState } from 'react';
import { Button } from '@mui/material';
import mm from 'music-metadata';

const AudioLyricsExtractor = ({audio}) => {
  const [lyrics, setLyrics] = useState('');

   console.log(audio);
    

    useEffect(() => {
        
    const fetchData = async () => {
        if (audio) {
            try {
                const metadata = await mm.parseBlob(audio);
                const extractedLyrics = metadata.common.lyrics;
                if (extractedLyrics) {
                setLyrics(extractedLyrics);
                } else {
                setLyrics('Lyrics not found');
                }
            } catch (error) {
                console.error('Error:', error.message);
            }
            }};
    fetchData();
    }, []);
 

  return (
    <div>
      
        <p>{lyrics}</p>
      </div>
    
  );
};

export default AudioLyricsExtractor;
