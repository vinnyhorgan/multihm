import { Server } from "socket.io";

const io = new Server({
    cors: {
        origin: "*"
    }
});

io.on("connection", (socket) => {
    console.log("User connected: " + socket.id);

    socket.on("sync", (id, x, y, angle) => {
        socket.broadcast.emit("sync", id, x, y, angle);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected: " + socket.id);
    });
});

io.listen(3000);

console.log("Server started on port 3000");
