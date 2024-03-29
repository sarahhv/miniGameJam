var ctxTwo = canvas.getContext("2d"),
    arcX = 140,
    arcY = 200,
    lineX = 0,
    lineY = 0,
    r = 15,
    br = 3,
    bullets = [];

// Keycodes
var vectorTwo = [
    [
        [0, -1], 87
    ],
    [
        [0, 1], 83
    ],
    [
        [-1, 0], 65
    ],
    [
        [1, 0], 68
    ]
].map(e => ({
    direction: e[0],
    keyCode: e[1],
    speed: 0,
    active: -1
}))

let keyHandlerTwo = (e, active) => vectorTwo.forEach(v => v.keyCode === e.keyCode && (v.active = active))
document.addEventListener('keydown', e => keyHandlerTwo(e, 1))
document.addEventListener('keyup', e => keyHandlerTwo(e, -1))
canvas.addEventListener('mousemove', e => {
    lineX = e.layerX;
    lineY = e.layerY;
})

canvas.addEventListener('click', e => {
    let x = e.layerX - arcX,
        y = e.layerY - arcY,
        a = Math.atan2(y, x);
    x = Math.cos(a);
    y = Math.sin(a);
    bullets.push({
        to: [x, y],
        pos: [arcX + x * r * 2, arcY + y * r * 2],
        explode: 0
    });
})

drawTwo();
setInterval(tickTwo, 10);

function drawTwo() {

    ctxTwo.clearRect(0, 0, canvas.width, canvas.height);
    ctxTwo.beginPath();
    ctxTwo.arc(arcX, arcY, r, 0, 2 * Math.PI);
    ctxTwo.stroke();
    ctxTwo.fillStyle = "red";
    ctxTwo.fill();

    let x = lineX - arcX,
        y = lineY - arcY,
        a = Math.atan2(y, x);
    x = Math.cos(a) * r;
    y = Math.sin(a) * r;


    // Shooting barrel
    ctxTwo.beginPath();
    ctxTwo.fillRect(this.x, this.y, 5, 5)
    ctxTwo.moveTo(arcX + x, arcY + y);
    ctxTwo.lineTo(arcX + x * 2, arcY + y * 2);
    ctxTwo.strokeStyle = "red";
    ctxTwo.stroke();
    ctxTwo.fillStyle = "red";
    ctxTwo.fill();

    bullets.forEach(b => {
        ctxTwo.beginPath();
        ctxTwo.arc(b.pos[0], b.pos[1], br + b.explode, 0, 2 * Math.PI);
        b.explode ? ctxTwo.fill() : ctxTwo.stroke();
    })

    count.textContent = bullets.length
    requestAnimationFrame(drawTwo)
}

function tickTwo() {

    vectorTwo.forEach(v => {
        v.speed = Math.min(2, Math.max(v.speed + 0.05 * v.active, 0))
        arcX = Math.min(canvas.width - r, Math.max(arcX + v.direction[0] * v.speed, 0 + r));
        arcY = Math.min(canvas.height - r, Math.max(arcY + v.direction[1] * v.speed, 0 + r));
    })

    bullets.filter(b => b.explode === 0).forEach(b => {
        b.pos[0] += b.to[0] * 3;
        b.pos[1] += b.to[1] * 3;
    })

    bullets.forEach((b1, i) => {

        if (b1.explode)
            b1.explode += 0.5;

        for (var j = i + 1; j < bullets.length; j++) {
            let b2 = bullets[j];
            let dx = b2.pos[0] - b1.pos[0];
            let dy = b2.pos[1] - b1.pos[1];
            let r1 = br + b1.explode;
            let r2 = br + b2.explode;
            if (dx * dx + dy * dy < r1 * r1 + r2 * r2) {
                b1.explode = b1.explode || 0.1;
                b2.explode = b2.explode || 0.1;
            }
        }

        if (b1.pos[0] < br || b1.pos[0] > canvas.width - br ||
            b1.pos[1] < br || b1.pos[1] > canvas.height - br)
            b1.explode = b1.explode || 0.1;
    })

    bullets = bullets.filter(b => b.explode < 10)
}