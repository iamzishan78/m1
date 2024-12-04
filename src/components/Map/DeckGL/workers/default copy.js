export const workerFunction = event => {
	function earcut(positions, holeIndices, dim = 2, areas, plane = 'xy') {
		const hasHoles = holeIndices && holeIndices.length;
		const outerLen = hasHoles ? holeIndices[0] * dim : positions.length;
		let outerNode = linkedList(positions, 0, outerLen, dim, true, areas && areas[0], plane);
		const triangles = [];

		if (!outerNode || outerNode.next === outerNode.prev) return triangles;

		let invSize;
		let maxX;
		let maxY;
		let minX;
		let minY;
		let x;
		let y;

		if (hasHoles) outerNode = eliminateHoles(positions, holeIndices, outerNode, dim, areas, plane);

		// if the shape is not too simple, we'll use z-order curve hash later; calculate polygon bbox
		if (positions.length > 80 * dim) {
			minX = maxX = positions[0];
			minY = maxY = positions[1];

			for (let i = dim; i < outerLen; i += dim) {
				x = positions[i];
				y = positions[i + 1];
				if (x < minX) minX = x;
				if (y < minY) minY = y;
				if (x > maxX) maxX = x;
				if (y > maxY) maxY = y;
			}

			// minX, minY and invSize are later used to transform coords into integers for z-order calculation
			invSize = Math.max(maxX - minX, maxY - minY);
			invSize = invSize !== 0 ? 32767 / invSize : 0;
		}

		earcutLinked(outerNode, triangles, dim, minX, minY, invSize, 0);

		return triangles;
	}

	// create a circular doubly linked list from polygon points in the specified winding order
	function linkedList(data, start, end, dim, clockwise, area, plane) {
		let i;
		let last;
		if (area === undefined) {
			area = getPolygonSignedArea(data, { start, end, size: dim, plane });
		}

		let i0 = DimIndex[plane[0]];
		let i1 = DimIndex[plane[1]];
		// Note that the signed area calculation in math.gl
		// has the opposite sign to that which was originally
		// present in earcut, thus the `< 0` is reversed
		if (clockwise === area < 0) {
			for (i = start; i < end; i += dim) last = insertNode(i, data[i + i0], data[i + i1], last);
		} else {
			for (i = end - dim; i >= start; i -= dim) last = insertNode(i, data[i + i0], data[i + i1], last);
		}

		if (last && equals(last, last.next)) {
			removeNode(last);
			last = last.next;
		}

		return last;
	}

	// eliminate colinear or duplicate points
	function filterPoints(start, end) {
		if (!start) return start;
		if (!end) end = start;

		let p = start;
		let again;
		do {
			again = false;

			if (!p.steiner && (equals(p, p.next) || area(p.prev, p, p.next) === 0)) {
				removeNode(p);
				p = end = p.prev;
				if (p === p.next) break;
				again = true;
			} else {
				p = p.next;
			}
		} while (again || p !== end);

		return end;
	}

	// main ear slicing loop which triangulates a polygon (given as a linked list)
	function earcutLinked(ear, triangles, dim, minX, minY, invSize, pass) {
		if (!ear) return;

		// interlink polygon nodes in z-order
		if (!pass && invSize) indexCurve(ear, minX, minY, invSize);

		let stop = ear;
		let prev;
		let next;

		// iterate through ears, slicing them one by one
		while (ear.prev !== ear.next) {
			prev = ear.prev;
			next = ear.next;

			if (invSize ? isEarHashed(ear, minX, minY, invSize) : isEar(ear)) {
				// cut off the triangle
				triangles.push((prev.i / dim) | 0);
				triangles.push((ear.i / dim) | 0);
				triangles.push((next.i / dim) | 0);

				removeNode(ear);

				// skipping the next vertex leads to less sliver triangles
				ear = next.next;
				stop = next.next;

				continue;
			}

			ear = next;

			// if we looped through the whole remaining polygon and can't find any more ears
			if (ear === stop) {
				// try filtering points and slicing again
				if (!pass) {
					earcutLinked(filterPoints(ear), triangles, dim, minX, minY, invSize, 1);

					// if this didn't work, try curing all small self-intersections locally
				} else if (pass === 1) {
					ear = cureLocalIntersections(filterPoints(ear), triangles, dim);
					earcutLinked(ear, triangles, dim, minX, minY, invSize, 2);

					// as a last resort, try splitting the remaining polygon into two
				} else if (pass === 2) {
					splitEarcut(ear, triangles, dim, minX, minY, invSize);
				}

				break;
			}
		}
	}

	// check whether a polygon node forms a valid ear with adjacent nodes
	function isEar(ear) {
		const a = ear.prev;
		const b = ear;
		const c = ear.next;

		if (area(a, b, c) >= 0) return false; // reflex, can't be an ear

		// now make sure we don't have other points inside the potential ear
		const ax = a.x;
		const bx = b.x;
		const cx = c.x;
		const ay = a.y;
		const by = b.y;
		const cy = c.y;

		// triangle bbox; min & max are calculated like this for speed
		const x0 = ax < bx ? (ax < cx ? ax : cx) : bx < cx ? bx : cx;
		const y0 = ay < by ? (ay < cy ? ay : cy) : by < cy ? by : cy;
		const x1 = ax > bx ? (ax > cx ? ax : cx) : bx > cx ? bx : cx;
		const y1 = ay > by ? (ay > cy ? ay : cy) : by > cy ? by : cy;

		let p = c.next;
		while (p !== a) {
			if (
				p.x >= x0 &&
				p.x <= x1 &&
				p.y >= y0 &&
				p.y <= y1 &&
				pointInTriangle(ax, ay, bx, by, cx, cy, p.x, p.y) &&
				area(p.prev, p, p.next) >= 0
			)
				return false;
			p = p.next;
		}

		return true;
	}

	function isEarHashed(ear, minX, minY, invSize) {
		const a = ear.prev;
		const b = ear;
		const c = ear.next;

		if (area(a, b, c) >= 0) return false; // reflex, can't be an ear

		const ax = a.x;
		const bx = b.x;
		const cx = c.x;
		const ay = a.y;
		const by = b.y;
		const cy = c.y;

		// triangle bbox; min & max are calculated like this for speed
		const x0 = ax < bx ? (ax < cx ? ax : cx) : bx < cx ? bx : cx;
		const y0 = ay < by ? (ay < cy ? ay : cy) : by < cy ? by : cy;
		const x1 = ax > bx ? (ax > cx ? ax : cx) : bx > cx ? bx : cx;
		const y1 = ay > by ? (ay > cy ? ay : cy) : by > cy ? by : cy;

		// z-order range for the current triangle bbox;
		const minZ = zOrder(x0, y0, minX, minY, invSize);
		const maxZ = zOrder(x1, y1, minX, minY, invSize);

		let p = ear.prevZ;
		let n = ear.nextZ;

		// look for points inside the triangle in both directions
		while (p && p.z >= minZ && n && n.z <= maxZ) {
			if (
				p.x >= x0 &&
				p.x <= x1 &&
				p.y >= y0 &&
				p.y <= y1 &&
				p !== a &&
				p !== c &&
				pointInTriangle(ax, ay, bx, by, cx, cy, p.x, p.y) &&
				area(p.prev, p, p.next) >= 0
			)
				return false;
			p = p.prevZ;

			if (
				n.x >= x0 &&
				n.x <= x1 &&
				n.y >= y0 &&
				n.y <= y1 &&
				n !== a &&
				n !== c &&
				pointInTriangle(ax, ay, bx, by, cx, cy, n.x, n.y) &&
				area(n.prev, n, n.next) >= 0
			)
				return false;
			n = n.nextZ;
		}

		// look for remaining points in decreasing z-order
		while (p && p.z >= minZ) {
			if (
				p.x >= x0 &&
				p.x <= x1 &&
				p.y >= y0 &&
				p.y <= y1 &&
				p !== a &&
				p !== c &&
				pointInTriangle(ax, ay, bx, by, cx, cy, p.x, p.y) &&
				area(p.prev, p, p.next) >= 0
			)
				return false;
			p = p.prevZ;
		}

		// look for remaining points in increasing z-order
		while (n && n.z <= maxZ) {
			if (
				n.x >= x0 &&
				n.x <= x1 &&
				n.y >= y0 &&
				n.y <= y1 &&
				n !== a &&
				n !== c &&
				pointInTriangle(ax, ay, bx, by, cx, cy, n.x, n.y) &&
				area(n.prev, n, n.next) >= 0
			)
				return false;
			n = n.nextZ;
		}

		return true;
	}

	// go through all polygon nodes and cure small local self-intersections
	function cureLocalIntersections(start, triangles, dim) {
		let p = start;
		do {
			const a = p.prev;
			const b = p.next.next;

			if (!equals(a, b) && intersects(a, p, p.next, b) && locallyInside(a, b) && locallyInside(b, a)) {
				triangles.push((a.i / dim) | 0);
				triangles.push((p.i / dim) | 0);
				triangles.push((b.i / dim) | 0);

				// remove two nodes involved
				removeNode(p);
				removeNode(p.next);

				p = start = b;
			}
			p = p.next;
		} while (p !== start);

		return filterPoints(p);
	}

	// try splitting polygon into two and triangulate them independently
	function splitEarcut(start, triangles, dim, minX, minY, invSize) {
		// look for a valid diagonal that divides the polygon into two
		let a = start;
		do {
			let b = a.next.next;
			while (b !== a.prev) {
				if (a.i !== b.i && isValidDiagonal(a, b)) {
					// split the polygon in two by the diagonal
					let c = splitPolygon(a, b);

					// filter colinear points around the cuts
					a = filterPoints(a, a.next);
					c = filterPoints(c, c.next);

					// run earcut on each half
					earcutLinked(a, triangles, dim, minX, minY, invSize, 0);
					earcutLinked(c, triangles, dim, minX, minY, invSize, 0);
					return;
				}
				b = b.next;
			}
			a = a.next;
		} while (a !== start);
	}

	// link every hole into the outer loop, producing a single-ring polygon without holes
	function eliminateHoles(data, holeIndices, outerNode, dim, areas, plane) {
		const queue = [];
		let i;
		let len;
		let start;
		let end;
		let list;

		for (i = 0, len = holeIndices.length; i < len; i++) {
			start = holeIndices[i] * dim;
			end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
			list = linkedList(data, start, end, dim, false, areas && areas[i + 1], plane);
			if (list === list.next) list.steiner = true;
			queue.push(getLeftmost(list));
		}

		queue.sort(compareX);

		// process holes from left to right
		for (i = 0; i < queue.length; i++) {
			outerNode = eliminateHole(queue[i], outerNode);
		}

		return outerNode;
	}

	function compareX(a, b) {
		return a.x - b.x;
	}

	// find a bridge between vertices that connects hole with an outer ring and and link it
	function eliminateHole(hole, outerNode) {
		const bridge = findHoleBridge(hole, outerNode);
		if (!bridge) {
			return outerNode;
		}

		const bridgeReverse = splitPolygon(bridge, hole);

		// filter collinear points around the cuts
		filterPoints(bridgeReverse, bridgeReverse.next);
		return filterPoints(bridge, bridge.next);
	}

	// David Eberly's algorithm for finding a bridge between hole and outer polygon
	function findHoleBridge(hole, outerNode) {
		let p = outerNode;
		const hx = hole.x;
		const hy = hole.y;
		let qx = -Infinity;
		let m;

		// find a segment intersected by a ray from the hole's leftmost point to the left;
		// segment's endpoint with lesser x will be potential connection point
		do {
			if (hy <= p.y && hy >= p.next.y && p.next.y !== p.y) {
				const x = p.x + ((hy - p.y) * (p.next.x - p.x)) / (p.next.y - p.y);
				if (x <= hx && x > qx) {
					qx = x;
					m = p.x < p.next.x ? p : p.next;
					if (x === hx) return m; // hole touches outer segment; pick leftmost endpoint
				}
			}
			p = p.next;
		} while (p !== outerNode);

		if (!m) return null;

		// look for points inside the triangle of hole point, segment intersection and endpoint;
		// if there are no points found, we have a valid connection;
		// otherwise choose the point of the minimum angle with the ray as connection point

		const stop = m;
		const mx = m.x;
		const my = m.y;
		let tanMin = Infinity;
		let tan;

		p = m;

		do {
			if (
				hx >= p.x &&
				p.x >= mx &&
				hx !== p.x &&
				pointInTriangle(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p.x, p.y)
			) {
				tan = Math.abs(hy - p.y) / (hx - p.x); // tangential

				if (
					locallyInside(p, hole) &&
					(tan < tanMin || (tan === tanMin && (p.x > m.x || (p.x === m.x && sectorContainsSector(m, p)))))
				) {
					m = p;
					tanMin = tan;
				}
			}

			p = p.next;
		} while (p !== stop);

		return m;
	}

	// whether sector in vertex m contains sector in vertex p in the same coordinates
	function sectorContainsSector(m, p) {
		return area(m.prev, m, p.prev) < 0 && area(p.next, m, m.next) < 0;
	}

	// interlink polygon nodes in z-order
	function indexCurve(start, minX, minY, invSize) {
		let p = start;
		do {
			if (p.z === 0) p.z = zOrder(p.x, p.y, minX, minY, invSize);
			p.prevZ = p.prev;
			p.nextZ = p.next;
			p = p.next;
		} while (p !== start);

		p.prevZ.nextZ = null;
		p.prevZ = null;

		sortLinked(p);
	}

	// Simon Tatham's linked list merge sort algorithm
	// http://www.chiark.greenend.org.uk/~sgtatham/algorithms/listsort.html
	function sortLinked(list) {
		let e;
		let i;
		let inSize = 1;
		let numMerges;
		let p;
		let pSize;
		let q;
		let qSize;
		let tail;

		do {
			p = list;
			list = null;
			tail = null;
			numMerges = 0;

			while (p) {
				numMerges++;
				q = p;
				pSize = 0;
				for (i = 0; i < inSize; i++) {
					pSize++;
					q = q.nextZ;
					if (!q) break;
				}
				qSize = inSize;

				while (pSize > 0 || (qSize > 0 && q)) {
					if (pSize !== 0 && (qSize === 0 || !q || p.z <= q.z)) {
						e = p;
						p = p.nextZ;
						pSize--;
					} else {
						e = q;
						q = q.nextZ;
						qSize--;
					}

					if (tail) tail.nextZ = e;
					else list = e;

					e.prevZ = tail;
					tail = e;
				}

				p = q;
			}

			tail.nextZ = null;
			inSize *= 2;
		} while (numMerges > 1);

		return list;
	}

	// z-order of a point given coords and inverse of the longer side of data bbox
	function zOrder(x, y, minX, minY, invSize) {
		// coords are transformed into non-negative 15-bit integer range
		x = ((x - minX) * invSize) | 0;
		y = ((y - minY) * invSize) | 0;

		x = (x | (x << 8)) & 0x00ff00ff;
		x = (x | (x << 4)) & 0x0f0f0f0f;
		x = (x | (x << 2)) & 0x33333333;
		x = (x | (x << 1)) & 0x55555555;

		y = (y | (y << 8)) & 0x00ff00ff;
		y = (y | (y << 4)) & 0x0f0f0f0f;
		y = (y | (y << 2)) & 0x33333333;
		y = (y | (y << 1)) & 0x55555555;

		return x | (y << 1);
	}

	// find the leftmost node of a polygon ring
	function getLeftmost(start) {
		let p = start;
		let leftmost = start;
		do {
			if (p.x < leftmost.x || (p.x === leftmost.x && p.y < leftmost.y)) leftmost = p;
			p = p.next;
		} while (p !== start);

		return leftmost;
	}

	// check if a point lies within a convex triangle
	function pointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
		return (
			(cx - px) * (ay - py) >= (ax - px) * (cy - py) &&
			(ax - px) * (by - py) >= (bx - px) * (ay - py) &&
			(bx - px) * (cy - py) >= (cx - px) * (by - py)
		);
	}

	// check if a diagonal between two polygon nodes is valid (lies in polygon interior)
	function isValidDiagonal(a, b) {
		return (
			a.next.i !== b.i &&
			a.prev.i !== b.i &&
			!intersectsPolygon(a, b) && // dones't intersect other edges
			((locallyInside(a, b) &&
				locallyInside(b, a) &&
				middleInside(a, b) && // locally visible
				(area(a.prev, a, b.prev) || area(a, b.prev, b))) || // does not create opposite-facing sectors
				(equals(a, b) && area(a.prev, a, a.next) > 0 && area(b.prev, b, b.next) > 0))
		); // special zero-length case
	}

	// signed area of a triangle
	function area(p, q, r) {
		return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
	}

	// check if two points are equal
	function equals(p1, p2) {
		return p1.x === p2.x && p1.y === p2.y;
	}

	// check if two segments intersect
	function intersects(p1, q1, p2, q2) {
		const o1 = sign(area(p1, q1, p2));
		const o2 = sign(area(p1, q1, q2));
		const o3 = sign(area(p2, q2, p1));
		const o4 = sign(area(p2, q2, q1));

		if (o1 !== o2 && o3 !== o4) return true; // general case

		if (o1 === 0 && onSegment(p1, p2, q1)) return true; // p1, q1 and p2 are collinear and p2 lies on p1q1
		if (o2 === 0 && onSegment(p1, q2, q1)) return true; // p1, q1 and q2 are collinear and q2 lies on p1q1
		if (o3 === 0 && onSegment(p2, p1, q2)) return true; // p2, q2 and p1 are collinear and p1 lies on p2q2
		if (o4 === 0 && onSegment(p2, q1, q2)) return true; // p2, q2 and q1 are collinear and q1 lies on p2q2

		return false;
	}

	// for collinear points p, q, r, check if point q lies on segment pr
	function onSegment(p, q, r) {
		return (
			q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y)
		);
	}

	function sign(num) {
		return num > 0 ? 1 : num < 0 ? -1 : 0;
	}

	// check if a polygon diagonal intersects any polygon segments
	function intersectsPolygon(a, b) {
		let p = a;
		do {
			if (p.i !== a.i && p.next.i !== a.i && p.i !== b.i && p.next.i !== b.i && intersects(p, p.next, a, b))
				return true;
			p = p.next;
		} while (p !== a);

		return false;
	}

	// check if a polygon diagonal is locally inside the polygon
	function locallyInside(a, b) {
		return area(a.prev, a, a.next) < 0
			? area(a, b, a.next) >= 0 && area(a, a.prev, b) >= 0
			: area(a, b, a.prev) < 0 || area(a, a.next, b) < 0;
	}

	// check if the middle point of a polygon diagonal is inside the polygon
	function middleInside(a, b) {
		let p = a;
		let inside = false;
		const px = (a.x + b.x) / 2;
		const py = (a.y + b.y) / 2;
		do {
			if (
				p.y > py !== p.next.y > py &&
				p.next.y !== p.y &&
				px < ((p.next.x - p.x) * (py - p.y)) / (p.next.y - p.y) + p.x
			)
				inside = !inside;
			p = p.next;
		} while (p !== a);

		return inside;
	}

	class Vertex {
		// vertex index in coordinates array
		i;

		// vertex coordinates
		x;
		y;

		// previous and next vertex nodes in a polygon ring
		prev = null;
		next = null;

		// z-order curve value
		z = 0;

		// previous and next nodes in z-order
		prevZ = null;
		nextZ = null;

		// indicates whether this is a steiner point
		steiner = false;

		constructor(i, x, y) {
			this.i = i;
			this.x = x;
			this.y = y;
		}
	}

	// link two polygon vertices with a bridge; if the vertices belong to the same ring, it splits polygon into two;
	// if one belongs to the outer ring and another to a hole, it merges it into a single ring
	function splitPolygon(a, b) {
		const a2 = new Vertex(a.i, a.x, a.y);
		const b2 = new Vertex(b.i, b.x, b.y);
		const an = a.next;
		const bp = b.prev;

		a.next = b;
		b.prev = a;

		a2.next = an;
		an.prev = a2;

		b2.next = a2;
		a2.prev = b2;

		bp.next = b2;
		b2.prev = bp;

		return b2;
	}

	// create a node and optionally link it with previous one (in a circular doubly linked list)
	function insertNode(i, x, y, last) {
		const p = new Vertex(i, x, y);

		if (!last) {
			p.prev = p;
			p.next = p;
		} else {
			p.next = last.next;
			p.prev = last;
			last.next.prev = p;
			last.next = p;
		}
		return p;
	}

	function removeNode(p) {
		p.next.prev = p.prev;
		p.prev.next = p.next;

		if (p.prevZ) p.prevZ.nextZ = p.nextZ;
		if (p.nextZ) p.nextZ.prevZ = p.prevZ;
	}

	function extractGeometryInfo(features) {
		// Counts the number of _positions_, so [x, y, z] counts as one
		let pointPositionsCount = 0;
		let pointFeaturesCount = 0;
		let linePositionsCount = 0;
		let linePathsCount = 0;
		let lineFeaturesCount = 0;
		let polygonPositionsCount = 0;
		let polygonObjectsCount = 0;
		let polygonRingsCount = 0;
		let polygonFeaturesCount = 0;
		const coordLengths = new Set();

		for (const feature of features) {
			const geometry = feature.geometry;
			switch (geometry.type) {
				case 'Point':
					pointFeaturesCount++;
					pointPositionsCount++;
					coordLengths.add(geometry.coordinates.length);
					break;
				case 'MultiPoint':
					pointFeaturesCount++;
					pointPositionsCount += geometry.coordinates.length;
					for (const point of geometry.coordinates) {
						coordLengths.add(point.length);
					}
					break;
				case 'LineString':
					lineFeaturesCount++;
					linePositionsCount += geometry.coordinates.length;
					linePathsCount++;

					for (const coord of geometry.coordinates) {
						coordLengths.add(coord.length);
					}
					break;
				case 'MultiLineString':
					lineFeaturesCount++;
					for (const line of geometry.coordinates) {
						linePositionsCount += line.length;
						linePathsCount++;

						// eslint-disable-next-line max-depth
						for (const coord of line) {
							coordLengths.add(coord.length);
						}
					}
					break;
				case 'Polygon':
					polygonFeaturesCount++;
					polygonObjectsCount++;
					polygonRingsCount += geometry.coordinates.length;
					const flattened = geometry.coordinates.flat();
					polygonPositionsCount += flattened.length;

					for (const coord of flattened) {
						coordLengths.add(coord.length);
					}
					break;
				case 'MultiPolygon':
					polygonFeaturesCount++;
					for (const polygon of geometry.coordinates) {
						polygonObjectsCount++;
						polygonRingsCount += polygon.length;
						const flattened = polygon.flat();
						polygonPositionsCount += flattened.length;

						// eslint-disable-next-line max-depth
						for (const coord of flattened) {
							coordLengths.add(coord.length);
						}
					}
					break;
				default:
					throw new Error('Unsupported geometry type');
			}
		}

		return {
			coordLength: coordLengths.size > 0 ? Math.max(...coordLengths) : 2,

			pointPositionsCount,
			pointFeaturesCount,
			linePositionsCount,
			linePathsCount,
			lineFeaturesCount,
			polygonPositionsCount,
			polygonObjectsCount,
			polygonRingsCount,
			polygonFeaturesCount,
		};
	}

	const DimIndex = {
		x: 0,
		y: 1,
		z: 2,
	};

	function getPolygonSignedArea(points, options = {}) {
		const { start = 0, end = points.length, plane = 'xy' } = options;
		const dim = options.size || 2;
		let area = 0;
		const i0 = DimIndex[plane[0]];
		const i1 = DimIndex[plane[1]];

		for (let i = start, j = end - dim; i < end; i += dim) {
			area += (points[i + i0] - points[j + i0]) * (points[i + i1] + points[j + i1]);
			j = i;
		}
		return area / 2;
	}

	function flattenPoint(coordinates, data, indices, options) {
		indices.push(data.length);
		data.push(...coordinates);

		// Pad up to coordLength
		for (let i = coordinates.length; i < options.coordLength; i++) {
			data.push(0);
		}
	}

	function flattenLineString(coordinates, data, indices, options) {
		indices.push(data.length);
		for (const c of coordinates) {
			data.push(...c);

			// Pad up to coordLength
			for (let i = c.length; i < options.coordLength; i++) {
				data.push(0);
			}
		}
	}

	function flattenPolygon(coordinates, data, indices, areas, options) {
		let count = 0;
		const ringAreas = [];
		const polygons = [];
		for (const lineString of coordinates) {
			const lineString2d = lineString.map(p => p.slice(0, 2));
			let area = getPolygonSignedArea(lineString2d.flat());
			const ccw = area < 0;

			// Exterior ring must be CCW and interior rings CW
			if (options.fixRingWinding && ((count === 0 && !ccw) || (count > 0 && ccw))) {
				lineString.reverse();
				area = -area;
			}
			ringAreas.push(area);
			flattenLineString(lineString, data, polygons, options);
			count++;
		}

		if (count > 0) {
			areas.push(ringAreas);
			indices.push(polygons);
		}
	}

	function flattenFeature(feature, options) {
		const { geometry } = feature;
		if (geometry.type === 'GeometryCollection') {
			throw new Error('GeometryCollection type not supported');
		}
		const data = [];
		const indices = [];
		let areas;
		let type;

		switch (geometry.type) {
			case 'Point':
				type = 'Point';
				flattenPoint(geometry.coordinates, data, indices, options);
				break;
			case 'MultiPoint':
				type = 'Point';
				geometry.coordinates.map(c => flattenPoint(c, data, indices, options));
				break;
			case 'LineString':
				type = 'LineString';
				flattenLineString(geometry.coordinates, data, indices, options);
				break;
			case 'MultiLineString':
				type = 'LineString';
				geometry.coordinates.map(c => flattenLineString(c, data, indices, options));
				break;
			case 'Polygon':
				type = 'Polygon';
				areas = [];
				flattenPolygon(geometry.coordinates, data, indices, areas, options);
				break;
			case 'MultiPolygon':
				type = 'Polygon';
				areas = [];
				geometry.coordinates.map(c => flattenPolygon(c, data, indices, areas, options));
				break;
			default:
				throw new Error('Unknown type');
		}

		return { ...feature, geometry: { type, indices, data, areas } };
	}

	function geojsonToFlatGeojson(features, options = { coordLength: 2, fixRingWinding: true }) {
		return features.map(feature => flattenFeature(feature, options));
	}

	function deduceArrayType(x, constructor) {
		if (constructor === Array || !Number.isFinite(x)) {
			return Array;
		}

		// If this or previous value required 64bits use Float64Array
		return constructor === Float64Array || Math.fround(x) !== x ? Float64Array : Float32Array;
	}

	function extractNumericPropTypes(features) {
		const propArrayTypes = {};
		for (const feature of features) {
			if (feature.properties) {
				for (const key in feature.properties) {
					// If property has not been seen before, or if property has been numeric
					// in all previous features, check if numeric in this feature
					// If not numeric, Array is stored to prevent rechecking in the future
					// Additionally, detects if 64 bit precision is required
					const val = feature.properties[key];
					propArrayTypes[key] = deduceArrayType(val, propArrayTypes[key]);
				}
			}
		}

		return propArrayTypes;
	}

	function keepStringProperties(properties, numericKeys) {
		const props = {};
		for (const key in properties) {
			if (!numericKeys.includes(key)) {
				props[key] = properties[key];
			}
		}
		return props;
	}

	function wrapProps(obj, size) {
		const returnObj = {};
		for (const key in obj) {
			returnObj[key] = { value: obj[key], size };
		}
		return returnObj;
	}

	function makeAccessorObjects(points, lines, polygons, coordLength) {
		const binaryFeatures = {
			shape: 'binary-feature-collection',
			points: {
				...points,
				positions: { value: points.positions, size: coordLength },
				globalFeatureIds: { value: points.globalFeatureIds, size: 1 },
				featureIds: { value: points.featureIds, size: 1 },
				numericProps: wrapProps(points.numericProps, 1),
			},
			lines: {
				...lines,
				positions: { value: lines.positions, size: coordLength },
				pathIndices: { value: lines.pathIndices, size: 1 },
				globalFeatureIds: { value: lines.globalFeatureIds, size: 1 },
				featureIds: { value: lines.featureIds, size: 1 },
				numericProps: wrapProps(lines.numericProps, 1),
			},
			polygons: {
				...polygons,
				positions: { value: polygons.positions, size: coordLength },
				polygonIndices: { value: polygons.polygonIndices, size: 1 },
				primitivePolygonIndices: { value: polygons.primitivePolygonIndices, size: 1 },
				globalFeatureIds: { value: polygons.globalFeatureIds, size: 1 },
				featureIds: { value: polygons.featureIds, size: 1 },
				numericProps: wrapProps(polygons.numericProps, 1),
			}, // triangles not expected
		};

		if (binaryFeatures.polygons && polygons.triangles) {
			binaryFeatures.polygons.triangles = {
				value: new Uint32Array(polygons.triangles),
				size: 1,
			};
		}

		return binaryFeatures;
	}

	function fillNumericProperties(object, properties, index, length) {
		for (const numericPropName in object.numericProps) {
			if (numericPropName in properties) {
				const value = properties[numericPropName];
				object.numericProps[numericPropName].fill(value, index, index + length);
			}
		}
	}

	function handlePoint(geometry, points, indexMap, coordLength, properties) {
		points.positions.set(geometry.data, indexMap.pointPosition * coordLength);

		const nPositions = geometry.data.length / coordLength;
		fillNumericProperties(points, properties, indexMap.pointPosition, nPositions);
		points.globalFeatureIds.fill(indexMap.feature, indexMap.pointPosition, indexMap.pointPosition + nPositions);
		points.featureIds.fill(indexMap.pointFeature, indexMap.pointPosition, indexMap.pointPosition + nPositions);

		indexMap.pointPosition += nPositions;
	}

	function handleLineString(geometry, lines, indexMap, coordLength, properties) {
		lines.positions.set(geometry.data, indexMap.linePosition * coordLength);

		const nPositions = geometry.data.length / coordLength;
		fillNumericProperties(lines, properties, indexMap.linePosition, nPositions);

		lines.globalFeatureIds.fill(indexMap.feature, indexMap.linePosition, indexMap.linePosition + nPositions);
		lines.featureIds.fill(indexMap.lineFeature, indexMap.linePosition, indexMap.linePosition + nPositions);

		for (let i = 0, il = geometry.indices.length; i < il; ++i) {
			// Extract range of data we are working with, defined by start
			// and end indices (these index into the geometry.data array)
			const start = geometry.indices[i];
			const end =
				i === il - 1
					? geometry.data.length // last line, so read to end of data
					: geometry.indices[i + 1]; // start index for next line

			lines.pathIndices[indexMap.linePath++] = indexMap.linePosition;
			indexMap.linePosition += (end - start) / coordLength;
		}
	}

	function triangulatePolygon(polygons, areas, indices, { startPosition, endPosition, coordLength }) {
		if (!polygons.triangles) {
			return;
		}

		const start = startPosition * coordLength;
		const end = endPosition * coordLength;

		// Extract positions and holes for just this polygon
		const polygonPositions = polygons.positions.subarray(start, end);

		// Holes are referenced relative to outer polygon
		const offset = indices[0];
		const holes = indices.slice(1).map(n => (n - offset) / coordLength);

		// Compute triangulation
		const triangles = earcut(polygonPositions, holes, coordLength, areas);

		// Indices returned by triangulation are relative to start
		// of polygon, so we need to offset
		for (let t = 0, tl = triangles.length; t < tl; ++t) {
			polygons.triangles.push(startPosition + triangles[t]);
		}
	}

	function handlePolygon(geometry, polygons, indexMap, coordLength, properties) {
		polygons.positions.set(geometry.data, indexMap.polygonPosition * coordLength);

		const nPositions = geometry.data.length / coordLength;
		fillNumericProperties(polygons, properties, indexMap.polygonPosition, nPositions);
		polygons.globalFeatureIds.fill(indexMap.feature, indexMap.polygonPosition, indexMap.polygonPosition + nPositions);
		polygons.featureIds.fill(indexMap.polygonFeature, indexMap.polygonPosition, indexMap.polygonPosition + nPositions);

		// Unlike Point & LineString geometry.indices is a 2D array
		for (let l = 0, ll = geometry.indices.length; l < ll; ++l) {
			const startPosition = indexMap.polygonPosition;
			polygons.polygonIndices[indexMap.polygonObject++] = startPosition;

			const areas = geometry.areas[l];
			const indices = geometry.indices[l];
			const nextIndices = geometry.indices[l + 1];

			for (let i = 0, il = indices.length; i < il; ++i) {
				const start = indices[i];
				const end =
					i === il - 1
						? // last line, so either read to:
							nextIndices === undefined
							? geometry.data.length // end of data (no next indices)
							: nextIndices[0] // start of first line in nextIndices
						: indices[i + 1]; // start index for next line

				polygons.primitivePolygonIndices[indexMap.polygonRing++] = indexMap.polygonPosition;
				indexMap.polygonPosition += (end - start) / coordLength;
			}

			const endPosition = indexMap.polygonPosition;
			triangulatePolygon(polygons, areas, indices, {
				startPosition,
				endPosition,
				coordLength,
			});
		}
	}

	function fillArrays(features, geometryInfo, options) {
		const {
			pointPositionsCount,
			pointFeaturesCount,
			linePositionsCount,
			linePathsCount,
			lineFeaturesCount,
			polygonPositionsCount,
			polygonObjectsCount,
			polygonRingsCount,
			polygonFeaturesCount,
			propArrayTypes,
			coordLength,
		} = geometryInfo;
		const { numericPropKeys = [], PositionDataType = Float32Array, triangulate = true } = options;
		const hasGlobalId = features[0] && 'id' in features[0];
		const GlobalFeatureIdsDataType = features.length > 65535 ? Uint32Array : Uint16Array;
		const points = {
			type: 'Point',
			positions: new PositionDataType(pointPositionsCount * coordLength),
			globalFeatureIds: new GlobalFeatureIdsDataType(pointPositionsCount),
			featureIds:
				pointFeaturesCount > 65535 ? new Uint32Array(pointPositionsCount) : new Uint16Array(pointPositionsCount),
			numericProps: {},
			properties: [],
			fields: [],
		};
		const lines = {
			type: 'LineString',
			pathIndices:
				linePositionsCount > 65535 ? new Uint32Array(linePathsCount + 1) : new Uint16Array(linePathsCount + 1),
			positions: new PositionDataType(linePositionsCount * coordLength),
			globalFeatureIds: new GlobalFeatureIdsDataType(linePositionsCount),
			featureIds: lineFeaturesCount > 65535 ? new Uint32Array(linePositionsCount) : new Uint16Array(linePositionsCount),
			numericProps: {},
			properties: [],
			fields: [],
		};
		const polygons = {
			type: 'Polygon',
			polygonIndices:
				polygonPositionsCount > 65535
					? new Uint32Array(polygonObjectsCount + 1)
					: new Uint16Array(polygonObjectsCount + 1),
			primitivePolygonIndices:
				polygonPositionsCount > 65535 ? new Uint32Array(polygonRingsCount + 1) : new Uint16Array(polygonRingsCount + 1),
			positions: new PositionDataType(polygonPositionsCount * coordLength),
			globalFeatureIds: new GlobalFeatureIdsDataType(polygonPositionsCount),
			featureIds:
				polygonFeaturesCount > 65535 ? new Uint32Array(polygonPositionsCount) : new Uint16Array(polygonPositionsCount),
			numericProps: {},
			properties: [],
			fields: [],
		};

		if (triangulate) {
			polygons.triangles = [];
		}

		// Instantiate numeric properties arrays; one value per vertex
		for (const object of [points, lines, polygons]) {
			for (const propName of numericPropKeys) {
				// If property has been numeric in all previous features in which the property existed, check
				// if numeric in this feature
				const T = propArrayTypes[propName];
				object.numericProps[propName] = new T(object.positions.length / coordLength);
			}
		}

		// Set last element of path/polygon indices as positions length
		lines.pathIndices[linePathsCount] = linePositionsCount;
		polygons.polygonIndices[polygonObjectsCount] = polygonPositionsCount;
		polygons.primitivePolygonIndices[polygonRingsCount] = polygonPositionsCount;

		const indexMap = {
			pointPosition: 0,
			pointFeature: 0,
			linePosition: 0,
			linePath: 0,
			lineFeature: 0,
			polygonPosition: 0,
			polygonObject: 0,
			polygonRing: 0,
			polygonFeature: 0,
			feature: 0,
		};

		for (const feature of features) {
			const geometry = feature.geometry;
			const properties = feature.properties || {};

			switch (geometry.type) {
				case 'Point':
					handlePoint(geometry, points, indexMap, coordLength, properties);
					points.properties.push(keepStringProperties(properties, numericPropKeys));
					if (hasGlobalId) {
						points.fields.push({ id: feature.id });
					}
					indexMap.pointFeature++;
					break;
				case 'LineString':
					handleLineString(geometry, lines, indexMap, coordLength, properties);
					lines.properties.push(keepStringProperties(properties, numericPropKeys));
					if (hasGlobalId) {
						lines.fields.push({ id: feature.id });
					}
					indexMap.lineFeature++;
					break;
				case 'Polygon':
					handlePolygon(geometry, polygons, indexMap, coordLength, properties);
					polygons.properties.push(keepStringProperties(properties, numericPropKeys));
					if (hasGlobalId) {
						polygons.fields.push({ id: feature.id });
					}
					indexMap.polygonFeature++;
					break;
				default:
					throw new Error('Invalid geometry type');
			}

			indexMap.feature++;
		}

		// Wrap each array in an accessor object with value and size keys
		return makeAccessorObjects(points, lines, polygons, coordLength);
	}

	function flatGeojsonToBinary(features, geometryInfo, options) {
		const propArrayTypes = extractNumericPropTypes(features);
		const numericPropKeys = Object.keys(propArrayTypes).filter(k => propArrayTypes[k] !== Array);
		return fillArrays(
			features,
			{
				propArrayTypes,
				...geometryInfo,
			},
			{
				numericPropKeys: (options && options.numericPropKeys) || numericPropKeys,
				PositionDataType: options ? options.PositionDataType : Float32Array,
				triangulate: options ? options.triangulate : true,
			}
		);
	}

	function geojsonToBinary(features, options = { fixRingWinding: true, triangulate: true }) {
		const geometryInfo = extractGeometryInfo(features);
		const coordLength = geometryInfo.coordLength;
		const { fixRingWinding } = options;
		const flatFeatures = geojsonToFlatGeojson(features, { coordLength, fixRingWinding });
		return flatGeojsonToBinary(flatFeatures, geometryInfo, {
			numericPropKeys: options.numericPropKeys,
			PositionDataType: options.PositionDataType || Float32Array,
			triangulate: options.triangulate,
		});
	}

	try {
		const { data, type } = event.data;

		const customMessageObject = {};
		const customMessageArray = [];

		// const options = { PositionDataType: Float64Array };

		switch (type) {
			case 'polygon':
				// const binaryFeatures = geojsonToBinary(data, options);
				customMessageObject.data = data;

				break;

			default:
				break;
		}

		postMessage({ /* count: data.length ,*/ ...customMessageObject }, [...customMessageArray]);
	} catch (err) {
		console.log('🚀 ~ file: default.js:1393 ~ workerFunction ~ err:', err);
	}
};
