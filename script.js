console.log("her er javascript");

function generateMaze() {
  const rows = parseInt(document.getElementById('rows').value);
  const cols = parseInt(document.getElementById('cols').value);

  // Opretter en labyrint ved hjælp af Prim's algoritme
  const maze = generatePrimMaze(rows, cols);

  displayMaze(maze);

  // Konverter labyrinten til JSON og log til konsollen
  const mazeJSON = {
    rows,
    cols,
    start: { row: 0, col: 0 },  
    goal: { row: rows - 1, col: cols - 1 },  
    maze
  };

  console.log(JSON.stringify(mazeJSON, null, 2));
}

function generatePrimMaze(rows, cols) {
  // Initialisere af labyrint med alle vægge
  const maze = new Array(rows).fill(null).map(() =>
    new Array(cols).fill(null).map(() => ({ north: true, east: true, west: true, south: true }))
  );

  // Start med en tilfældig celle og tilføj den til labyrinten
  const startRow = Math.floor(Math.random() * rows);
  const startCol = Math.floor(Math.random() * cols);
  const visited = [[startRow, startCol]];

  while (visited.length > 0) {
    const [currentRow, currentCol] = visited[Math.floor(Math.random() * visited.length)];

    // Få naboer til den nuværende celle
    const neighbors = [];
    if (currentRow > 1) neighbors.push([currentRow - 2, currentCol]);
    if (currentRow < rows - 2) neighbors.push([currentRow + 2, currentCol]);
    if (currentCol > 1) neighbors.push([currentRow, currentCol - 2]);
    if (currentCol < cols - 2) neighbors.push([currentRow, currentCol + 2]);

    // Tjek om naboerne er gyldige og ikke allerede besøgt
    const unvisitedNeighbors = neighbors.filter(([row, col]) =>
      row > 0 && row < rows - 1 && col > 0 && col < cols - 1 && maze[row][col].north
    );

    if (unvisitedNeighbors.length > 0) {
      // Vælger tilfældigt en nabo
      const [nextRow, nextCol] = unvisitedNeighbors[Math.floor(Math.random() * unvisitedNeighbors.length)];

      // Fjerner væggen mellem den nuværende celle og den valgte nabo
      maze[(currentRow + nextRow) / 2][(currentCol + nextCol) / 2].north = false;

      // Tilføj den valgte nabo til labyrinten
      maze[nextRow][nextCol].north = false;

      // Marker den valgte nabo som besøgt
      visited.push([nextRow, nextCol]);
    } else {
      // Hvis ingen gyldige naboer, fjern den nuværende celle fra besøgte
      visited.splice(visited.findIndex(([row, col]) => row === currentRow && col === currentCol), 1);
    }
  }

  return maze; // Flyt return til slutningen af funktionen
}

function displayMaze(maze) {
  const mazeContainer = document.getElementById('maze-container');
  mazeContainer.innerHTML = '';

  maze.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const cellElement = document.createElement('div');
      cellElement.className = 'cell';

      // Displaying walls based on cell configuration
      if (cell.north) cellElement.style.borderTop = '1px solid black';
      if (cell.east) cellElement.style.borderRight = '1px solid black';
      if (cell.south) cellElement.style.borderBottom = '1px solid black';
      if (cell.west) cellElement.style.borderLeft = '1px solid black';

      
      if (rowIndex === 0 && colIndex === 0) {
        cellElement.style.borderTop = '1px solid black';
        cellElement.style.borderLeft = '1px solid black';
      }
      if (rowIndex === 0 && colIndex === maze[0].length - 1) {
        cellElement.style.borderTop = '1px solid black';
        cellElement.style.borderRight = '1px solid black';
      }
      if (rowIndex === maze.length - 1 && colIndex === 0) {
        cellElement.style.borderBottom = '1px solid black';
        cellElement.style.borderLeft = '1px solid black';
      }
      if (rowIndex === maze.length - 1 && colIndex === maze[0].length - 1) {
        cellElement.style.borderBottom = '1px solid black';
        cellElement.style.borderRight = '1px solid black';
      }

      mazeContainer.appendChild(cellElement);
    });
  });
}