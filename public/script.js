const socket = io('/')
const videoGrid = document.getElementById('video-grid')
// const myPeer = new Peer(undefined, {
//   path: '/peerjs',
//   host: '/',
//   port: '443'
// })
const myPeer = new Peer({host:'peerjs-server.herokuapp.com', secure:true, port:443})
let myVideoStream;
const myVideo = document.createElement('video')
myVideo.muted = true;
const peers = {}
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  myVideoStream = stream;
  addVideoStream(myVideo, stream)
  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })

  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
  })
  // input value
  let text = $("input");
  $('html').keydown(function (e) {
    if (e.which == 13 && text.val().length !== 0) {
      socket.emit('message', text.val());
      text.val('')
    }
  });
  socket.on("createMessage", message => {
    $("ul").append(`<li class="message"><div><b>user</b><br/><div>${message}</div></div></li>`);
    scrollToBottom()
  })
})

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}



const scrollToBottom = () => {
  var d = $('.main_chat_window');
  d.scrollTop(d.prop("scrollHeight"));
}


const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
      myVideoStream.getAudioTracks()[0].enabled = false;
      setUnmuteButtom();
  } else {
      myVideoStream.getAudioTracks()[0].enabled = true;
      setMuteButtom(); 
  }
}

const setMuteButtom = () => {
  const html = `
  <i class="green fas fa-microphone"></i>
  <span>Mute</span>
  `
  document.querySelector('.main_mute_button').innerHTML = html
}
const setUnmuteButtom = () => {
  const html = `
  <i class="unmute fas fa-microphone-slash"></i>
  <span class="unmute" >Unmute</span>
  `
  document.querySelector('.main_mute_button').innerHTML = html
}

const playStop = () => {
  const enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
      myVideoStream.getVideoTracks()[0].enabled = false;
      setStopButtom(); 
  } else {
      myVideoStream.getVideoTracks()[0].enabled = true;
      setPlayButtom();
  } 
}
const setPlayButtom = () => {
  const html = `
  <i class="green fas fa-video"></i>
  <span>Stop Video</span>
  `
  document.querySelector('.main_video_button').innerHTML = html
}
const setStopButtom = () => {
  const html = `
  <i class="unmute fas fa-video-slash"></i>
  <span class="unmute">Play Video</span>
  `
  document.querySelector('.main_video_button').innerHTML = html
}