import Point from './point.model.js';
import {TOOL_CIRCLE, TOOL_LINE, TOOL_BRUSH, TOOL_ERASER, TOOL_PAINT_BUCKET, TOOL_PENCIL, TOOL_SQUARE, TOOL_TRIANGLE, TOOL_DRAGDROP, TOOL_SELECTAREA} from './tool.js'; 

import {getMouseCoordsOnCanvas, findDistance} from './utility.js';
import Fill from './fill.class.js';


export default class Paint{

    constructor(canvasId){
        this.canvas = document.getElementById(canvasId);
        this.context = canvas.getContext("2d");
        this.canvas.style.cursor = "crosshair";
        
        this.undoStack = [];
        this.redoStack = [];
        this.undoLimit = 40; //limit for the stack

        // will be used on the drag and drop functionalities
        this.startingPoint = {x: 0, y: 0};
        this.endPoint = {x: 0, y: 0};

        this.numSquares = false;
        this.rectDeleted = false;

        this.rectData;
    }


    set activeTool(tool){
        this.tool = tool;
    }

    set lineWidth(lineWidth){
        this._lineWidth = lineWidth; //"_" for no conflict in between the two
        this.context.lineWidth = this._lineWidth;
    }


    set brushSize(brushSize){
        this._brushSize = brushSize;
    }

    set selectedColor(color){
        this._color = color;
        this.context.strokeStyle = this._color;
    }

    // select the image in order to put in on the canvas
    set selectedImage(image){
        this._image = image;
    }


    init(){
        // maybe it should be onmousedown and onMouseDown
        this.canvas.onmousedown = e => this.onMouseDown(e);
    }

    onMouseDown(e){
        

        if (this.numSquares == true && this.undoStack.length > 0) {
            this.numSquares = false;
            this.undoPaint();
        }
        // store the image so that we can replicate it with every mouse move.
        this.saveData = this.context.getImageData(0, 0, this.canvas.clientWidth, this.canvas.height);
        this.context.putImageData(this.saveData, 0, 0);
        //undo portion (2L)
        if(this.undoStack.length >= this.undoLimit) this.undoStack.shift();
        this.undoStack.push(this.saveData);


        this.canvas.onmousemove = e => this.onMouseMove(e);
        document.onmouseup = e => this.onMouseUp(e);

        this.startPos = getMouseCoordsOnCanvas(e, this.canvas); //NaN here

        if (this.tool == TOOL_PENCIL || this.tool == TOOL_BRUSH){
            //begin path again and again for good quality
            this.context.beginPath();
            this.context.moveTo(this.startPos.x, this.startPos.y);

        }else if (this.tool == TOOL_PAINT_BUCKET){
            //in this case, we will implement the flood fill algorithm (four way)
            new Fill(this.canvas, this.startPos, this._color);
        }else if (this.tool == TOOL_ERASER){
            this.context.clearRect(this.startPos.x, this.startPos.y,
                this._brushSize, this._brushSize);
        }else if (this.tool == TOOL_DRAGDROP){
            this.context.putImageData(this.rectData, this.startingPoint.x, this.startingPoint.y, this.startPos.x, this.startPos.y,
                this.rectData.width, this.rectData.height);
            
        }

    }


    onMouseMove(e){

        this.currentPos = getMouseCoordsOnCanvas(e, this.canvas);
        // loop for every shape at the user's disposal
        switch(this.tool){
            case TOOL_SELECTAREA:
            case TOOL_LINE:
            case TOOL_SQUARE:
            case TOOL_CIRCLE:
            case TOOL_TRIANGLE:
                this.drawShape();
                break;
            case TOOL_BRUSH:
                this.drawFreeLine(this._brushSize);
                break;
            case TOOL_PENCIL:
                this.drawFreeLine(this._lineWidth);
                break;
            case TOOL_ERASER:
                this.context.clearRect(this.currentPos.x, this.currentPos.y,
                this._brushSize, this._brushSize);
                break;                
            default:
                break;
        }   

    }

    onMouseUp(e){
        this.canvas.onmousemove = null;
        document.onmouseup = null;

        if (this.tool == TOOL_SELECTAREA){
            this.context.setLineDash([]);
            this.context.lineWidth = this._lineWidth;
            if (this.numSquares == false){
                this.numSquares = true;
            }
        }
    }
    

    //shape drawing functions
    drawShape(){
        
        this.context.putImageData(this.saveData, 0, 0);
        this.context.lineCap = "round";
        this.context.beginPath();


        if (this.tool == TOOL_LINE){
            this.context.moveTo(this.startPos.x, this.startPos.y);
            this.context.lineTo(this.currentPos.x, this.currentPos.y);

        }else if (this.tool == TOOL_SQUARE){
            this.context.rect(this.startPos.x, this.startPos.y, this.currentPos.x - this.startPos.x, this.currentPos.y - this.startPos.y);

        }else if (this.tool == TOOL_CIRCLE){
            //variables to make it clear what is happening
            let start = this.startPos;
            let finish = this.currentPos;

            let distance = findDistance(start, finish);
            this.context.arc(this.startPos.x, this.startPos.y, distance, 0, 2 * Math.PI, false);

        }else if (this.tool == TOOL_TRIANGLE){
            this.context.moveTo(this.startPos.x + (this.currentPos.x - this.startPos.x) / 2, this.startPos.y);
            this.context.lineTo(this.startPos.x, this.currentPos.y);
            this.context.lineTo(this.currentPos.x, this.currentPos.y);
            this.context.closePath();
        }else if (this.tool = TOOL_SELECTAREA){
            this.context.lineWidth = 1;
            this.context.setLineDash([10, 20]);
            this.context.rect(this.startPos.x, this.startPos.y, this.currentPos.x - this.startPos.x, this.currentPos.y - this.startPos.y);
            this.startingPoint.x = this.startPos.x;
            this.startingPoint.y = this.startPos.y;
            
            this.endPoint.x = this.currentPos.x;
            this.endPoint.y = this.currentPos.y;

        }

        this.context.stroke();
    }

    drawFreeLine(lineWidth){
        this.context.lineWidth = lineWidth;
        this.context.lineTo(this.currentPos.x, this.currentPos.y);
        this.context.stroke();
    }

    undoPaint(){
        this.secondSave = this.context.getImageData(0, 0, this.canvas.clientWidth, this.canvas.height);
        this.numSquares = this.numSquares && false;

        if(this.undoStack.length > 0){
            console.log(this.secondSave);
            this.redoStack.push(this.secondSave);
            this.context.putImageData(this.undoStack[this.undoStack.length - 1], 0, 0);
            this.undoStack.pop();
        }else{
            alert("No drawing to be undone");
        }

    }

    
    redoPaint(){
        this.numSquares = this.numSquares && false; // careful to not be a boolean value

        if(this.redoStack.length > 0){
            this.undoStack.push(this.secondSave);
            this.context.putImageData(this.redoStack[this.redoStack.length - 1], 0, 0);

            this.redoStack.pop();
        }else{
            alert("No drawing to be REdone");
        }

        console.log(this.redoStack)

    }

    getRectImage(data){
        this.rectData = data;
    }

}
