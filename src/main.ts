import kaboom from "kaboom";
import { io } from "socket.io-client";

const k = kaboom();
const socket = io("http://localhost:3000");

let players: { [key: string]: any } = {};

socket.on("connect", () => {
    const player = {
        id: socket.id,
        x: Math.random() * 640,
        y: Math.random() * 480,
    };

    socket.emit("newPlayer", player);
});

socket.on("newPlayer", (player) => {
    let newPlayer = k.add([
        k.sprite("bean"),
        k.pos(player.x, player.y),
    ]);

    console.log(newPlayer);

    players[player.id] = newPlayer;
});

socket.on("playerMoved", (player) => {
    players[player.id].pos.x = player.x;
    players[player.id].pos.y = player.y;
});

k.loadSprite("bean", "src/assets/bean.png");

const SPEED = 320

const player = k.add([
    k.sprite("bean"),
    k.pos(k.center())
]);

k.onKeyDown("left", () => {
    player.move(-SPEED, 0)

    socket.emit("playerMoved", {
        id: socket.id,
        x: player.pos.x,
        y: player.pos.y,
    });
})

k.onKeyDown("right", () => {
    player.move(SPEED, 0)

    socket.emit("playerMoved", {
        id: socket.id,
        x: player.pos.x,
        y: player.pos.y,
    });
})

k.onKeyDown("up", () => {
    player.move(0, -SPEED)

    socket.emit("playerMoved", {
        id: socket.id,
        x: player.pos.x,
        y: player.pos.y,
    });
})

k.onKeyDown("down", () => {
    player.move(0, SPEED)

    socket.emit("playerMoved", {
        id: socket.id,
        x: player.pos.x,
        y: player.pos.y,
    });
})
