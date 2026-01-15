const playlist=[];let currentTrack=0;
let audio=document.getElementById('audio');
let playBtn=document.getElementById('play');
let prevBtn=document.getElementById('prev');
let nextBtn=document.getElementById('next');
let seek=document.getElementById('seek');
let volume=document.getElementById('volume');
let currentTimeEl=document.getElementById('current');
let durationEl=document.getElementById('duration');
let themeBtn=document.getElementById('themeBtn');
let body=document.body;
let playlistEl=document.getElementById('playlist');
let fileInput=document.getElementById('fileInput');
let titleEl=document.getElementById('track-title');
let artistEl=document.getElementById('track-artist');
let discContainer=document.querySelector('.disc-container');

// Play / Pause
function loadTrack(i){
  const track=playlist[i];
  audio.src=track.src;
  titleEl.textContent=track.title;
  artistEl.textContent=track.artist;
  pauseAudio();
  updatePlaylistUI();
}
function updatePlaylistUI(){
  Array.from(playlistEl.children).forEach((el,i)=>el.classList.toggle('activeTrack',i===currentTrack));
}
function playAudio(){audio.play();playBtn.textContent="⏸️";body.classList.add('playing');discContainer.classList.add('playing');}
function pauseAudio(){audio.pause();playBtn.textContent="▶️";body.classList.remove('playing');discContainer.classList.remove('playing');}
playBtn.addEventListener('click',()=>audio.paused?playAudio():pauseAudio());
prevBtn.addEventListener('click',()=>{currentTrack=(currentTrack-1+playlist.length)%playlist.length;loadTrack(currentTrack);playAudio();});
nextBtn.addEventListener('click',()=>{currentTrack=(currentTrack+1)%playlist.length;loadTrack(currentTrack);playAudio();});

// Time & Seek
audio.addEventListener('timeupdate',()=>{
  seek.value=(audio.currentTime/audio.duration)*100||0;
  currentTimeEl.textContent=formatTime(audio.currentTime);
  durationEl.textContent=formatTime(audio.duration);
});
seek.addEventListener('input',()=>audio.currentTime=(seek.value/100)*audio.duration);
audio.addEventListener('ended',()=>nextBtn.click());
volume.addEventListener('input',()=>audio.volume=volume.value/100);

themeBtn.addEventListener('click',()=>{
  body.classList.toggle('light');
  themeBtn.textContent=body.classList.contains('light')?"🌙":"☀️";
});

function formatTime(t){if(isNaN(t))return"0:00";return Math.floor(t/60)+":"+String(Math.floor(t%60)).padStart(2,'0');}

// Handle local files
fileInput.addEventListener('change',(e)=>{
  const files=Array.from(e.target.files);
  files.forEach(file=>{
    const url=URL.createObjectURL(file);
    playlist.push({title:file.name.replace(/\.[^/.]+$/,""), artist:"Local", src:url});
    const div=document.createElement('div');
    div.textContent=file.name.replace(/\.[^/.]+$/,"");
    div.addEventListener('click',()=>{currentTrack=playlist.findIndex(t=>t.src===url);loadTrack(currentTrack);playAudio();});
    playlistEl.appendChild(div);
  });
  if(playlist.length>0 && !audio.src){currentTrack=0;loadTrack(0);}
});

