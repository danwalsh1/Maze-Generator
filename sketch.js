let cCanvas, bgColour, cols, rows, lineColour, drawButton;

function setup(){
	cols = createInput("40", "number");
	cols.parent('colsContainer');
	
	rows = createInput("30", "number");
	rows.parent('rowsContainer');
	
	bgColor = createColorPicker("#FFFFFF");
	bgColor.parent('bgColourContainer');
	
	cCanvas = createCanvas(40,40);
	cCanvas.parent('canvasContainer');
	
	lineColour = createRadio();
	lineColour.parent('lineColourContainer');
	lineColour.option('Black');
	lineColour.option('White');
	
	drawButton = createButton('Draw Maze');
	drawButton.parent('buttonContainer');
	drawButton.mousePressed(drawMaze);
}

function draw(){
	background(bgColor.color());
	stroke(0);
	noFill();
	rect(0,0,width,height);
	if(lineColour.value() == "White"){
		stroke(255);
	}else{
		stroke(0)
	}
	line(width / 2, 0, width / 2, height);
	line(0, height / 2, width, height / 2);
}

function drawMaze(){
	let mCols = cols.value();
	let mRows = rows.value();
	let mBgColour = bgColor.color();
	let mLineColour;
	if(lineColour.value() == "White"){
		mLineColour = "rgba(255,255,255,1)";
	}else{
		mLineColour = "rgba(0,0,0,1)";
	}
	window.location.href = "maze/maze.html?cols=" + mCols + "&rows=" + mRows + "&bgcolour=" + mBgColour + "&linecolour=" + mLineColour;
}
