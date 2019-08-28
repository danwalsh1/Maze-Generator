const cells = [];

let mazeCanvas, myMaze, cellSize, currentCell, nextCell, cellStack, cellCount, finished;

let getSplit = window.location.search.substr(1).split("&");
let get = {};

function setup(){
	for(let i = 0; i < getSplit.length; i++){
		let sString = getSplit[i].split("=");
		get[decodeURIComponent(sString[0])] = decodeURIComponent(sString[1]);
	}
	if(!get.cols){
		get.cols = 40;
	}
	if(!get.rows){
		get.rows = 30;
	}
	if(!get.bgcolour){
		get.bgcolour = 0;
	}
	if(!get.linecolour){
		get.linecolour = "rgba(255,255,255,1)";
	}
	
	cellSize = 20;
	
	mazeCanvas = createCanvas(cellSize * get.cols, cellSize * get.rows);
	
	cellStack = [];
	cellCount = 0;
	
	myMaze = new maze(floor(height / cellSize), floor(width / cellSize));
	
	currentCell = myMaze.cells[0][0];
	currentCell.visited = true;
	cellCount++;
	finished = false;
}

function draw(){
	if(cellCount < myMaze.total){
		// Calculate
		nextCell = myMaze.unvisitedNeighbours(currentCell);
		
		if(nextCell){
			// A random unvisited neighbour has been selected
			cellStack.push(currentCell);
			myMaze.removeWalls(currentCell, nextCell);
			currentCell = nextCell;
			currentCell.visited = true;
			cellCount++;
		}else{
			// There were no unvisited neighbours
			if(cellStack.length > 0){
				currentCell = cellStack.pop();
			}else{
				throw new Error("The stack is empty!");
			}
		}
		
		// Draw
		background(20);
		for(let y = 0; y < myMaze.rows; y++){
			for(let x = 0; x < myMaze.cols; x++){
				myMaze.cells[y][x].draw(x, y);
			}
		}
	}else if(!finished){
		drawButton = createButton('Convert to Image');
		drawButton.mousePressed(cToImage);
		finished = true;
	}
}

function cToImage(){
	let img = new Image();
	img.src = canvas.toDataURL();
	document.body.appendChild(img);
	resizeCanvas(0,0);
	drawButton.remove();
}

class maze{
	constructor(rows, cols){
		this.rows = rows;
		this.cols = cols;
		this.total = rows * cols;
		this.cells = [];
		
		for(let y = 0; y < rows; y++){
			this.cells.push([]);
			for(let x = 0; x < cols; x++){
				this.cells[y].push(new cell(x, y));
			}
		}
	}
	
	removeWalls(cellA, cellB){
		if(cellA.x == cellB.x && cellA.y == cellB.y){
			throw new Error("The given cells are in the same position!");
		}
		
		if(cellA.x == cellB.x){
			// 'Cell B' is above or below 'Cell A'
			if(cellA.y > cellB.y){
				// 'Cell B' is above 'Cell A'
				cellA.top = false;
				cellB.bottom = false;
			}else{
				// 'Cell B' is below 'Cell A'
				cellA.bottom = false;
				cellB.top = false;
			}
		}else if(cellA.y == cellB.y){
			// 'Cell B' is left or right of 'Cell A'
			if(cellA.x > cellB.x){
				// 'Cell B' is left of 'Cell A'
				cellA.left = false;
				cellB.right = false;
			}else{
				// 'Cell B' is right of 'Cell A'
				cellA.right = false;
				cellB.left = false;
			}
		}else{
			throw new Error("The given cells are not neighbours!");
		}
	}
	
	unvisitedNeighbours(cell){
		if(cell.x < 0 || cell.y < 0 || cell.x >= this.cols || cell.y >= this.rows){
			throw new Error("Invalid co-ordinates given!");
		}
		
		let neighbours = [];
		
		// Is there a top neighbour? If so, is it unvisited?
		if((cell.y - 1) >= 0 && !this.cells[cell.y - 1][cell.x].visited){
			neighbours.push(this.cells[cell.y - 1][cell.x]);
		}
		
		// Is there a bottom neighbour? If so, is it unvisited?
		if((cell.y + 1) < this.rows && !this.cells[cell.y + 1][cell.x].visited){
			neighbours.push(this.cells[cell.y + 1][cell.x]);
		}
		
		// Is there a left neighbour? If so, is it unvisited?
		if((cell.x - 1) >= 0 && !this.cells[cell.y][cell.x - 1].visited){
			neighbours.push(this.cells[cell.y][cell.x - 1]);
		}
		
		// Is there a right neighbour? If so, is it unvisited?
		if((cell.x + 1) < this.cols && !this.cells[cell.y][cell.x + 1].visited){
			neighbours.push(this.cells[cell.y][cell.x + 1]);
		}
		
		if(neighbours.length > 0){
			return neighbours[floor(random(0, neighbours.length))];
		}else{
			return false;
		}
	}
}

class cell{
	constructor(x, y){
		this.x = x;
		this.y = y;
		this.top = true;
		this.bottom = true;
		this.left = true;
		this.right = true;
		this.visited = false;
	}
	
	draw(){
		let x = this.x * cellSize;
		let y = this.y * cellSize;
		
		stroke(get.linecolour);
		if(this.top){
			line(x, y, x + cellSize, y);
		}
		if(this.bottom){
			line(x + cellSize, y + cellSize, x, y + cellSize);
		}
		if(this.left){
			line(x, y + cellSize, x, y);
		}
		if(this.right){
			line(x + cellSize, y, x + cellSize, y + cellSize);
		}
		
		if(this.visited){
			noStroke();
			fill(get.bgcolour);
			rect(x, y, cellSize, cellSize);
		}
	}
}