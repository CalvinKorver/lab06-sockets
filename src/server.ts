import net = require('net');//import socket module
import ip = require('ip');

// define address interface
interface Address { port: number; family: string; address: string; };

// create socket server
let server:net.Server = net.createServer();

let clients: net.Socket[] = [];

// when the server is connected
server.on('connection', function(socket:net.Socket){
    // helper function to broadcast to all other clients
    function broadcast(name:String, message:String){
        clients.forEach(function(client:net.Socket) {
            //don't send to self
            if (client !== socket) {
                client.write('[' + name + '] ' + message + '\n');
            }
        });
    }

    //we've established a socket to use
    // add it to the list of sockets
    console.log('connected :' + socket.remoteAddress);
    clients.push(socket);

    // write a message to the client that just connected
    socket.write("Hi what's your name? \n");
    let name: String = '';

    socket.on('data', function(data){
        let message:String = data.toString();
        if(message.length === 0){
            socket.write('(type something and hit return)\n');
            return;
        }

        if (!name) {
            name = data.toString().substr(0, 10);

            socket.write("Hello!");
        }
        else {
            if ('exit' === message) {
                socket.end();
            }
            else {
                broadcast(name, message);
            }
        }
    });

    

});

//when the server starts listening...
server.on('listening', function() {
    //output to the console the port number on which we are listening
    var addr:Address = server.address();
    console.log(addr.address);
    console.log('server listening on port %d', addr.port);
});

server.listen({
  host: ip.address(),
  port: 3000
});

