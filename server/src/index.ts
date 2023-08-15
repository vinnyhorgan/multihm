import { Server } from "socket.io";

const io = new Server({
    cors: {
        origin: "*"
    }
});

io.on("connection", (socket) => {
    console.log("User connected: " + socket.id);

    socket.on("newPlayer", (data) => {
        socket.broadcast.emit("newPlayer", data);
    });

    socket.on("playerMoved", (data) => {
        socket.broadcast.emit("playerMoved", data);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected: " + socket.id);
    });
});

io.listen(3000);

console.log("Server started on port 3000");
