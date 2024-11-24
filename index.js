import net from "net";
import EventEmitter from "events";
class NamedPipe extends EventEmitter {
    constructor(name) {
        super();
        if (name.includes("\\\\.\\pipe\\")) name = name.split("\\\\.\\pipe\\")[1];
        this.name = name;
        this.path = `\\\\.\\pipe\\${this.name}`;
        this.started = false;
        this.initialize();
    }

    initialize() {
        const server = net.createServer((connection) => {
            // Handle data from the command
            connection.on("data", (data) => {
                if (!this.started) {
                    this.started = true;
                    this.emit("start");
                }
                this.emit("data", data);
                // console.log("Received:", data.toString());
            });

            connection.on("end", () => {
                console.log("Client disconnected.");
            });
        });

        server.listen(`\\\\.\\pipe\\${this.name}`, () => {
            console.log("Server listening on named pipe.");
        });
    }
}

export default NamedPipe;

/*

// Client
const client = net.createConnection("\\\\.\\pipe\\mypipe", () => {
    console.log("Connected to server.");
    client.write("Hello from client!");
});

client.on("data", (data) => {
    console.log("Received data:", data.toString());
    client.end();
});
*/
