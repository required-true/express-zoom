const messageList = document.querySelector('ul')
const messageForm = document.querySelector('form')

const socket = new WebSocket(`ws://${window.location.host}`)

socket.addEventListener('open', () => {
  console.log('Connected to Server ✅')
})

socket.addEventListener('message', (message) => {
  console.log('Just got this:', message.data, 'from the server.')
})

socket.addEventListener('close', () => {
  console.log('Disconnected from Server ❌')
})

setTimeout(() => {
  socket.send('Hello !!!')
}, 5000);

messageForm.addEventListener('submit', (event) => {
  event.preventDefault()
  const input = messageForm.querySelector('input')
  socket.send(input.value)
  input.value = ''
})