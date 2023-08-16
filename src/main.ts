import kaboom from "kaboom";
import { io } from "socket.io-client";

const k = kaboom({
    global: false,
    scale: 3
});
const socket = io("http://localhost:3000");

k.debug.inspect = true;

k.loadSprite("pWalkShotgun", "src/assets/sprPWalkShotgun_strip8.png", {
    sliceX: 8,
    anims: {
        idle: {
            from: 0,
            to: 0
        },
        walk: {
            from: 0,
            to: 7,
            speed: 10,
            loop: true
        }
    }
});

let hue = 0;

function generateNetId() {
    return Math.random().toString(36).substr(2, 9);
}

k.onUpdate(() => {
    let toSync = k.get("sync");

    toSync.forEach((obj) => {
        socket.emit("sync", obj.netId, obj.pos.x, obj.pos.y, obj.angle);
    });

    hue += 0.001;

    k.setBackground(k.Color.fromHSL(hue, 0.3, 0.3))

    if (hue > 1) {
        hue = 0;
    }
});

socket.on("sync", (id, x, y, angle) => {
    let obj = k.get("*").find((obj) => obj.netId === id);

    if (obj) {
        obj.pos.x = x;
        obj.pos.y = y;
        obj.angle = angle;
    }
    else
    {
        let newPlayer = k.add([
            k.sprite("pWalkShotgun"),
            k.pos(x, y),
            k.anchor("center"),
            k.rotate(angle),
            {
                netId: id,
            }
        ]);

        newPlayer.flipX = true;
    }
});

const SPEED = 200

const player = k.add([
    k.sprite("pWalkShotgun"),
    k.pos(k.center()),
    k.anchor("center"),
    k.rotate(0),
    k.area(),
    k.body(),
    {
        netId: generateNetId(),
    },
    "sync"
]);

player.flipX = true;

player.onUpdate(() => {
    player.angle = player.pos.angle(k.mousePos());
});

k.onKeyDown("a", () => {
    player.move(-SPEED, 0);

    if (player.curAnim() !== "walk")
    {
        player.play("walk");
    }
});

k.onKeyDown("d", () => {
    player.move(SPEED, 0);

    if (player.curAnim() !== "walk")
    {
        player.play("walk");
    }
});

k.onKeyDown("w", () => {
    player.move(0, -SPEED);

    if (player.curAnim() !== "walk")
    {
        player.play("walk");
    }
});

k.onKeyDown("s", () => {
    player.move(0, SPEED);

    if (player.curAnim() !== "walk")
    {
        player.play("walk");
    }
});

k.onKeyRelease("w", () => {
    player.play("idle");
});

k.onKeyRelease("s", () => {
    player.play("idle");
});

k.onKeyRelease("a", () => {
    player.play("idle");
});

k.onKeyRelease("d", () => {
    player.play("idle");
});
