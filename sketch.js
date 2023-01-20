const config = {
    width: 1200,
    height: 300,
    color: {
        h: 230,
        s: 80,
        l: 80,
    },
    background: {
        h: 0,
        s: 0,
        l: 0,
    },
    density: 100,
    delta: 20,
    speed: 3,
    movement: 90,
};

let t = 0;

const sketch = new p5((p5) => {
    const points = [];
    const columns = Math.floor(config.width / config.density) + 4;
    const rows = Math.floor(config.height / (Math.sin(Math.PI / 3) * 100)) + 3;
    let camera = null;
    const b = config.background;
    const bCol = p5.color(b.h, b.s, b.l);
    p5.colorMode(p5.HSL, 360, 100, 100, 1);
    const { h, s, l } = config.color;
    const lineColor = p5.color(h, s, l);

    p5.setup = () => {
        p5.pixelDensity(4);
        p5.smooth();
        p5.setAttributes('antialias', true);
        p5.createCanvas(config.width, config.height, p5.WEBGL);
        camera = p5.createCamera();
        camera.lookAt(20, 0, 0);
        camera.tilt(-0.2);
        camera.move(0, 100, 0);
        for (x = 0; x < columns; x++) {
            for (y = 0; y < rows; y++) {
                points.push(p5.createVector(
                    x * config.density - (config.width / 2) + p5.random(config.delta),
                    y * config.density - (config.height / 2) + ((config.density / 2) * -(x % 2)) + p5.random(config.delta) - (config.density / 2),
                    0
                ));
            }
        }
    };

    p5.draw = () => {
        t += 0.001 * config.speed;
        p5.background(bCol);
        p5.noFill();
        for ([i, p] of points.entries()) {
            p.z = (p5.noise(t + i) - 0.5) * config.movement;
        }
        for (let i = 0; i < columns; i++) {
            for (let j = 0; j < rows - 1; j++) {
                let from = points[i * rows + j];
                let to = points[i * rows + j + 1];
                p5.stroke(lineColor);
                lineColor.setAlpha(
                    p5.map(from.z, -(config.movement / 2), config.movement / 2, 0.1, 1)
                );
                p5.line(from.x, from.y, from.z, to.x, to.y, to.z);
                if (i < columns - 1) {
                    let from = points[i * rows + j];
                    if (!(i % 2 && j === 0)) {
                        let toUp = points[(i + 1) * rows + j - (i % 2)];
                        p5.line(from.x, from.y, from.z, toUp.x, toUp.y, toUp.z);
                    }
                    if (!(!(i % 2) && j === rows - 1)) {
                        let toDown = points[(i + 1) * rows + j - (i % 2) + 1];
                        p5.line(from.x, from.y, from.z, toDown.x, toDown.y, toDown.z);
                    }
                }
            }
        }
    };
}, 'sketch');
