import Point from './point.model.js';
import {TOOL_CIRCLE, TOOL_LINE, TOOL_BRUSH, TOOL_ERASER, TOOL_PAINT_BUCKET, TOOL_PENCIL, TOOL_SQUARE, TOOL_TRIANGLE} from './tool.js'; 

import {getMouseCoordsOnCanvas, findDistance} from './utility.js';


export default class Paint{

    constructor(canvasId){
        this.canvas = document.getElementById(canvasId);
        this.context = canvas.getContext("2d");
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


    init(){
        // maybe it should be onmousedown and onMouseDown
        this.canvas.onmousedown = e => this.onMouseDown(e);
    }

    onMouseDown(e){
        // store the image so that we can replicate it with every mouse move.
        this.saveData = this.context.getImageData(0, 0, this.canvas.clientWidth, this.canvas.height);


        this.canvas.onmousemove = e => this.onMouseMove(e);
        document.onmouseup = e => this.onMouseUp(e);

        this.startPos = getMouseCoordsOnCanvas(e, this.canvas); //NaN here

        if (this.tool == TOOL_PENCIL || this.tool == TOOL_BRUSH){
            //begin path again and again for good quality
            this.context.beginPath();
            this.context.moveTo(this.startPos.x, this.startPos.y);
        }

    }


    onMouseMove(e){
        this.currentPos = getMouseCoordsOnCanvas(e, this.canvas);

        // loop for every shape at the user's disposal
        switch(this.tool){
            case TOOL_LINE:
            case TOOL_SQUARE:
            case TOOL_CIRCLE:
            case TOOL_TRIANGLE:
                this.drawShape(); //nothing showed up here, might glitch
                break;
            case TOOL_PENCIL:
                this.drawFreeLine(this._lineWidth);
                break;
            case TOOL_BRUSH:
                this.drawFreeLine(this._brushSize);
            default:
                break;
        }

    }

    onMouseUp(e){
        this.canvas.onmousemove = null;
        document.onmouseup = null;
    }
    
    drawShape(){
        
        this.context.putImageData(this.saveData, 0, 0);

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
        }

        this.context.stroke();
    }

    drawFreeLine(lineWidth){
        this.context.lineWidth = lineWidth;
        this.context.lineTo(this.currentPos.x, this.currentPos.y);
        this.context.stroke();
    }
}

