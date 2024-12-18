import React, { useEffect, useRef } from 'react';
import Victor from 'victor';

const HexocetCanvas = () => {
	const canvasRef = useRef(null);

	useEffect(() => {
		const Hexocet = {
			seeds: [],
			stepCount: 0,
			birthPeriod: 1,
			hexSize: 20,
			targetBounceChance: 0.02,
			springStiffness: 0.01,
			viscosity: 0.8,
			particleOpacity: 0.7,
			fade: true,
			fadeLayerOpacity: 0.04,
		};

		// let backgroundImage = new Image();
		// backgroundImage.src = '/icons/rock.jpg';

		const setupCanvas = () => {
			const canvas = canvasRef.current;
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			Hexocet.canvas = canvas;
			Hexocet.ctx = canvas.getContext('2d');
			Hexocet.canvasBase = Math.min(canvas.width, canvas.height);
			Hexocet.xC = canvas.width / 2;
			Hexocet.yC = canvas.height / 2;
		};

		const hexCoordsToXY = (Hx, Hy) => {
			const isSumEven = (Hx + Hy) % 2 === 0 ? 1 : 0;
			const xPrime = Hx;
			const yPrime = (3 * Hy + 1 + isSumEven) / Math.sqrt(3);
			const XYprime = new Victor(xPrime * Hexocet.hexSize, yPrime * Hexocet.hexSize);
			const XY = XYprime.clone().rotateDeg(30);
			return { x: XY.x, y: XY.y };
		};

		const XYtoHexCoords = (x, y) => {
			const XYprime = new Victor(x / Hexocet.hexSize, y / Hexocet.hexSize).rotateDeg(-30);
			const Hx = XYprime.x;
			const Hy = (Math.sqrt(3) * XYprime.y) / 3;
			return { Hx: Math.floor(Hx), Hy: Math.floor(Hy) };
		};

		const birth = (xBirth, yBirth, seed) => {
			const targetH = XYtoHexCoords(xBirth || Hexocet.xC, yBirth || Hexocet.yC);
			const spreadArea = 1;
			targetH.Hx += Math.floor(spreadArea * (-0.5 + Math.random()));
			targetH.Hy += Math.floor(spreadArea * (-0.5 + Math.random()));
			const targetXY = hexCoordsToXY(targetH.Hx, targetH.Hy);
			const newSeed = {
				xLast: targetXY.x,
				x: targetXY.x,
				xSpeed: 0,
				yLast: targetXY.y,
				y: targetXY.y,
				ySpeed: 0,
				targetHx: targetH.Hx,
				targetHy: targetH.Hy,
				age: 0,
				hue: 170 + Math.random() * (200 - 170), // Generates a random hue between 140 and 190
			};
			Hexocet.seeds.push(seed || newSeed);
		};

		const generateInitialSeeds = count => {
			for (let i = 0; i < count; i++) {
				// Generate seeds around the center of the canvas
				birth(Hexocet.xC + Math.random() * 200 - 100, Hexocet.yC + Math.random() * 200 - 100);
			}
		};

		const move = () => {
			Hexocet.seeds.forEach(seed => {
				seed.age++;
				seed.xLast = seed.x;
				seed.yLast = seed.y;
				if (Math.random() < Hexocet.targetBounceChance) {
					if (Math.random() > 0.33) {
						seed.targetHx += Math.random() > 0.5 ? 1 : -1;
					} else {
						if ((seed.targetHx + seed.targetHy) % 2 === 0) {
							seed.targetHy += 1;
						} else {
							seed.targetHy -= 1;
						}
					}
				}
				const targetXY = hexCoordsToXY(seed.targetHx, seed.targetHy);
				const accX = -Hexocet.springStiffness * (seed.x - targetXY.x);
				const accY = -Hexocet.springStiffness * (seed.y - targetXY.y);
				seed.xSpeed += accX - Hexocet.viscosity * seed.xSpeed;
				seed.ySpeed += accY - Hexocet.viscosity * seed.ySpeed;
				seed.x += 0.01 * seed.xSpeed * Hexocet.canvasBase;
				seed.y += 0.01 * seed.ySpeed * Hexocet.canvasBase;
			});
		};

		const drawHexagon = (cx, cy) => {
			const ctx = Hexocet.ctx;
			const hexagonPath = [];
			for (let i = 0; i < 6; i++) {
				const angle = (i * Math.PI) / 3;
				const x = cx + Hexocet.hexSize * Math.cos(angle);
				const y = cy + Hexocet.hexSize * Math.sin(angle);
				hexagonPath.push({ x, y });
			}

			ctx.beginPath();
			ctx.moveTo(hexagonPath[0].x, hexagonPath[0].y);
			hexagonPath.forEach(point => {
				ctx.lineTo(point.x, point.y);
			});
			ctx.closePath();
		};

		const draw = () => {
			const ctx = Hexocet.ctx;
			if (Hexocet.fade) {
				ctx.rect(0, 0, Hexocet.canvas.width, Hexocet.canvas.height);
				ctx.fillStyle = `rgba(0, 0, 0, ${Hexocet.fadeLayerOpacity})`;
				ctx.fill();
			}

			// Draw hexagons around seeds
			Hexocet.seeds.forEach(seed => {
				const hexXY = hexCoordsToXY(seed.targetHx, seed.targetHy);
				drawHexagon(hexXY.x, hexXY.y);
			});

			Hexocet.seeds.forEach(seed => {
				const hsla = `hsla(${seed.hue}, 90%, 55%, ${Hexocet.particleOpacity})`;
				ctx.strokeStyle = hsla;
				ctx.lineWidth = 2;
				ctx.beginPath();
				ctx.moveTo(seed.xLast, seed.yLast);
				ctx.lineTo(seed.x, seed.y);
				ctx.stroke();
			});
		};

		const update = () => {
			Hexocet.stepCount++;
			if (Hexocet.stepCount % Hexocet.birthPeriod === 0 && Hexocet.stepCount < 60000) {
				birth();
			}
			move();
			draw();
			window.requestAnimationFrame(update);
		};

		setupCanvas();
		generateInitialSeeds(8000);
		window.requestAnimationFrame(update);

		const handleMouseMove = event => {
			birth(event.pageX, event.pageY);
		};

		canvasRef.current.addEventListener('mousemove', handleMouseMove);

		return () => {
			// eslint-disable-next-line react-hooks/exhaustive-deps
			canvasRef?.current?.removeEventListener('mousemove', handleMouseMove);
		};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			style={{
				position: 'absolute',
				zIndex: 0,
				pointerEvents: 'none',
				width: window.innerWidth,
				height: window.innerHeight,
				background: '#000000',
			}}
		></canvas>
	);
};

export default HexocetCanvas;
