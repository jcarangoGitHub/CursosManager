socket = io()

socket.on("message", (information) => {
  console.log(information)
})

socket.emit("message", "I'm connected")

socket.emit("counter")

socket.on("counter", (counter) => {
  console.log(counter)
})

/*
var elem = document.querySelector('#messageToAll');
console.log('elem: ' + elem);
console.log('btn: ' + document.querySelector('#btnSendMessage'))
if (document.querySelector('#btnSendMessage')) {
  document.querySelector('#btnSendMessage').addEventListener('submit', (data) => {
    data.preventDefault()
    const message = data.target.elements.messageToAll.value
    socket.emit("messageToAll", message)
  })
}
*/

/*
socket.on("messageToAll", (messageToAll) => {
  console.log('sjs ' + messageToAll)
})
*/
