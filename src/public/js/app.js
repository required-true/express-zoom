const socket = io()

const welcome = document.getElementById('welcome')
const welcomeForm = welcome.querySelector('form')
const room = document.getElementById('room')

room.hidden = true

let roomName;

welcomeForm.addEventListener('submit', handleRoomSubmit)

function handleRoomSubmit(event) {
  event.preventDefault();
  const nameInput = welcomeForm.querySelector("#nameInput");
  const roomInput = welcomeForm.querySelector("#roomInput");
  socket.emit("enter_room", nameInput.value, roomInput.value, showRoom);
  roomName = roomInput.value;
  nameInput.value = '';
  roomInput.value = '';
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;

  const msgForm = room.querySelector('#msg')
  msgForm.addEventListener('submit', handleMessageSubmit)
}

function addMessage(message) {
  const ul = room.querySelector('ul')
  const li = document.createElement('li')
  li.innerText = message
  ul.appendChild(li)
}

function handleMessageSubmit(event) {
  event.preventDefault()
  const input = room.querySelector("#msg input");
  const value = input.value
  socket.emit('new_message', value, roomName, () => {
    addMessage(`You: ${value}`)
   })
  input.value = ''
}

socket.on('welcome', (user) => {
  addMessage(`${user} arrived !`)
})

socket.on('bye', (user) => {
  addMessage(`${user} left .`)
})

socket.on('new_message', addMessage)