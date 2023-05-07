import React, { useState, useEffect } from 'react';
import db from './firebase';
import { collection, getDocs, query, where} from 'firebase/firestore';
import './App.css';

const App = () => {
  const [titles, setTitles] = useState([]);
  const [selectedSong, setSelectedSong] = useState('');
  const [lyric, setLyric] = useState(null);
  const [selectedWords, setSelectedWords] = useState('');
  const [showAnser, setShowAnser] = useState(true);
  const [creator, setCreator] = useState('');

  const loadAllSongTitle = (artist) => {
    const lyrics = collection(db, 'Lyrics');
    const songs = query(lyrics, where("artist", "==", "Mr.Children"));
    getDocs(songs).then((snapShot) => {
      let songTitles = [];
      snapShot.forEach((doc) => {
        const song = doc.data().song;
        songTitles.push(song);
      })
      setTitles(songTitles);
    })
  }

  const loadLyrics = () => {
    setShowAnser(false)
    const titleLength = titles.length;
    const randomNumber = Math.floor(Math.random()*titleLength);
    console.log(titles[randomNumber]);
    const selectedSong = titles[randomNumber]
    setSelectedSong(selectedSong);
    const lyrics = collection(db, 'Lyrics');
    const lyric = query(lyrics, where("song", "==", selectedSong));
    getDocs(lyric).then((snapShot) => {
      let lyrics = [];
      let creators = [];
      snapShot.forEach((doc) => {
        lyrics.push(doc.data().lyric)
        const creatorText = '作詞：'+ doc.data().lyricist + ' 作曲：' + doc.data().composer;
        creators.push(creatorText);
      })
      const lyric2 = lyrics[0];
      selectWords(lyric2, 10);
      setCreator(creators[0]);
      const newTitles = titles.filter(item => item !== selectedSong);
      setTitles(newTitles);
    })
  }

  const selectWords = (lyric, len) => {
    let l = lyric.split('\n');
      const l2 = l.length;
      const randomPhrase = Math.floor(Math.random()*(l2));
      let selectedPhrase = '';
      if (l[randomPhrase].length !== 0){
        selectedPhrase = l[randomPhrase];
      } else {
        selectedPhrase = l[randomPhrase+1];
      }
      const l3 = selectedPhrase.length;
      if (l3 > len) {
        const randomText = Math.floor(Math.random()*(l3-len));
        const selected = selectedPhrase.substr(randomText, len);
        setSelectedWords(selected);
        showLyric(lyric, randomPhrase);
      } else {
        setSelectedWords(selectedPhrase);
        showLyric(lyric, randomPhrase);
      }
  }

  const showLyric = (lyric, n) => {
    let l = lyric;
    const l2 = l.split('\n').map((item, index) => {
      if (index === n ){
        return (
          <React.Fragment><div className="textRed">{item}<br/></div></React.Fragment>
        );
      } else {
        return (
          <React.Fragment><div>{item}<br/></div></React.Fragment>
        );       
      }
    })
    setLyric(l2);
  }


  useEffect(() => {
    loadAllSongTitle('Mr.Children');
  }, []);

  useEffect(() => {
  }, [selectedWords]);

  

  return (
    <div className="App">
      <h2>歌詞クイズ</h2>
      <p>Mr.Children</p>
      <p className="textSelect">{selectedWords}</p>
      {showAnser ? (
        <div>
        <button className="button" onClick={() => {loadLyrics()}}>次の曲</button>
        <h2>{selectedSong}</h2>
        <h4>{creator}</h4>
        <p>{lyric}</p>
        </div>
      ): (
        <button className="button" onClick={() => {setShowAnser(true)}}>正解は</button>
      )}
    </div>
  );
}

export default App;
