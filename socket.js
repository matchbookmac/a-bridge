var socket = require('socket.io-client')('http://localhost');
for (var i = 0; i < 1000; i++) {
  socket.emit('bridge data', { foo: 'bar'});
}
setTimeout(function () {
  process.exit();
}, 15000);
