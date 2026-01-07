const { parentPort } = require("worker_threads");

parentPort.on("message", ({ boxes, start, end }) => {
  const COLS = 150;
  const ROWS = 150;

  // Create grid
  const grid = Array.from({ length: COLS }, (_, x) =>
    Array.from({ length: ROWS }, (_, y) => ({
      x, y,
      f: 0, g: 0, h: 0,
      neighbors: [],
      parent: null,
      blocked: false
    }))
  );

  // Mark blocked cells
  for (const b of boxes) {
    const gx = Math.floor(b.x / 10);
    const gy = Math.floor(b.y / 10);

    for (let x = gx; x < gx + 9; x++) {
      for (let y = gy; y < gy + 9; y++) {
        if (grid[x] && grid[x][y]) {
          grid[x][y].blocked = true;
        }
      }
    }
  }

  // Build neighbors
  for (let x = 0; x < COLS; x++) {
    for (let y = 0; y < ROWS; y++) {
      const p = grid[x][y];
      if (p.blocked) continue;

      if (x > 0 && !grid[x - 1][y].blocked) p.neighbors.push(grid[x - 1][y]);
      if (x < COLS - 1 && !grid[x + 1][y].blocked) p.neighbors.push(grid[x + 1][y]);
      if (y > 0 && !grid[x][y - 1].blocked) p.neighbors.push(grid[x][y - 1]);
      if (y < ROWS - 1 && !grid[x][y + 1].blocked) p.neighbors.push(grid[x][y + 1]);
    }
  }

  function heuristic(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }

  function search(startNode, endNode) {
    const openSet = [startNode];
    const closedSet = new Set();

    while (openSet.length) {
      let lowest = 0;
      for (let i = 1; i < openSet.length; i++) {
        if (openSet[i].f < openSet[lowest].f) lowest = i;
      }

      const current = openSet[lowest];

      if (current === endNode) {
        const path = [];
        let temp = current;
        while (temp) {
          path.push({ x: temp.x, y: temp.y });
          temp = temp.parent;
        }
        return path.reverse();
      }

      openSet.splice(lowest, 1);
      closedSet.add(current);

      for (const neighbor of current.neighbors) {
        if (closedSet.has(neighbor)) continue;

        const gScore = current.g + 1;

        if (!openSet.includes(neighbor) || gScore < neighbor.g) {
          neighbor.g = gScore;
          neighbor.h = heuristic(neighbor, endNode);
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.parent = current;

          if (!openSet.includes(neighbor)) {
            openSet.push(neighbor);
          }
        }
      }
    }

    return [];
  }

  const result = search(
    grid[start.x][start.y],
    grid[end.x][end.y]
  );

  parentPort.postMessage(result);
});
