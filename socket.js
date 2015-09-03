var socket = require('socket.io-client')('http://localhost');
socket.on('bridge data', function (data) {
  console.log(data);
});
setInterval(beAnnoying, 2000);

setTimeout(function () {
  process.exit();
}, 15000);

function beAnnoying() {
  socket.emit('bridge data', { foo: 'bar'});
  console.log('beep');
  return;
}
// setTimeout(function () {
//   socket.disconnect();
// }, 1800);
