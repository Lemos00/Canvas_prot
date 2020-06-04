import {TOOL_CIRCLE, TOOL_LINE, TOOL_BRUSH, TOOL_ERASER, TOOL_PAINT_BUCKET, TOOL_PENCIL, TOOL_SQUARE, TOOL_TRIANGLE} from './tool.js'; 
import Paint from './paint.class.js';
import Fill from './fill.class.js';

//variables related to paint
var paint = new Paint("canvas");
paint.activeTool = TOOL_LINE; // IT WILL DEFAULT THE TOOL TO THE SQUARE
paint.lineWidth = 1; // determine lineWidth here
paint.brushSize = 4;
paint.selectedColor = "#000000";

paint.init();

// make it such the stroke is nicer than what it acc is right now






document.querySelectorAll("[data-command]").forEach( 
    item => {
        item.addEventListener("click", e => {
            let command = item.getAttribute("data-command");

            if (command === "undo"){
                paint.undoPaint();
            
            // Drawings can be dowloaded in any compatible image format we want,
            }else if (command === "dowload"){
                
                //solve base64 issue
                var canvas = document.getElementById("canvas");
                var image = canvas.toDataURL("image/png", 1.0).replace("image.png", "image/octet-stream");
                var link = document.createElement("a");
                link.download = "Board.png";
                link.href = image;
                link.click();

            }
        })
    }//e is the element
); //this way, you will get all the elements that have the data command specified

document.querySelectorAll("[data-tool]").forEach(
    item => (
        item.addEventListener("click", e => {
            document.querySelector("[data-tool].active").classList.toggle("active"); // remove the previous active function from the active class
            
            item.classList.add("active"); // we add the element we clicked on to the active class
             
            //with the tool.class.js created:
            let selectedTool = item.getAttribute("data-tool");
            paint.activeTool = selectedTool;


            switch(selectedTool){
                //activate shape or line widths group
                case TOOL_CIRCLE:
                case TOOL_LINE:
                case TOOL_SQUARE:
                case TOOL_TRIANGLE:
               // case TOOL_PAINT_BUCKET:
                case TOOL_PENCIL:
                    //make pencil shapes visible
                    document.querySelector(".group.for-shapes").style = "display: block;";
                    //make brush sizes invisible
                    document.querySelector(".group.for-brush").style = "display: none;";
                    break;

                case TOOL_BRUSH:
                case TOOL_ERASER:
                    //make pencil shapes invisible
                    document.querySelector(".group.for-shapes").style.display = "none";
                    //make brush selection visible
                    document.querySelector(".group.for-brush").style.display = "block";
                    break;
                default:
                    //make both line groups invisible
                    document.querySelector(".group.for-shapes").style.display = "none";
                    document.querySelector(".group.for-brush").style.display = "none";
            }

        }
    ))
);

document.querySelectorAll("[data-line-width]").forEach(
    item => {
        item.addEventListener("click", e => {
            document.querySelector("[data-line-width].active").classList.toggle("active"); // remove the previous active function from the active class
            item.classList.add("active"); // we add the element we clicked on to the active class

            let lineWidth = item.getAttribute("data-line-width");
            paint.lineWidth = lineWidth;
        });
    }
);

document.querySelectorAll("[data-brush-size]").forEach(
    item => {
        item.addEventListener("click", e => {
            document.querySelector("[data-brush-size].active").classList.toggle("active"); // remove the previous active function from the active class
            item.classList.add("active"); // we add the element we clicked on to the active class

            let brushSize = item.getAttribute("data-brush-size");
            paint.brushSize = brushSize;
        });
    }
);




document.querySelectorAll("[data-color]").forEach(
    item => {
        item.addEventListener("click", e => {
            document.querySelector("[data-color].active").classList.toggle("active"); // remove the previous active function from the active class
            item.classList.add("active"); // we add the element we clicked on to the active class

            let color = item.getAttribute("data-color");
            paint.selectedColor = color;
        });
    }
);

document.querySelectorAll("[data-image]").forEach(
    item => {
        item.addEventListener("click", e => {
            document.querySelector("[data-image].active").classList.toggle("active"); // remove the previous active function from the active class
            item.classList.add("active"); // we add the element we clicked on to the active class

            let image = document.getElementById("check");
            paint.selectedImage = image;

        });
    }
);

// key press events for drag and drop functionality
window.addEventListener('keydown', e => {

   //paint.tool is the one that stores the current paint tool
    if (paint.tool == "select-area"){
        if (e.key === "Backspace" || e.key === "Delete"){
           var canvas = document.getElementById("canvas");
           var context = canvas.getContext("2d");
            
           var start = paint.startingPoint;
           var end = paint.endPoint;

           /* TAKE CARE OF ALL DIRECTIONS POSSIBLE FOR DRAG AND DROP ERASING FUNCIOTIONALITY*/
           //start high go down, right (good)
           if (start.x < end.x && start.y < end.y){
                context.clearRect(start.x - 2, start.y - 2, (end.x - start.x) + 3, (end.y - start.y) + 3);
           }else if (start.x < end.x && start.y > end.y){ //start low, go up, right (good)
                context.clearRect(start.x - 2, end.y - 2, (end.x - start.x) + 3, (start.y - end.y) + 3);
           }else if (start.x > end.x && start.y < end.y){ // start high, go down, left (good)
                context.clearRect(end.x - 2, start.y - 2, (start.x - end.x) + 3, (end.y - start.y) + 3);
           }else if (start.x > end.x && start.y > end.y){ //start low, go up, left (good)
                context.clearRect(end.x - 2, end.y - 2, (start.x - end.x) + 3, (start.y - end.y) + 3);
           }

           // if there is a select area square on the canvas, remove it from the undo stack
           if (paint.numSquares == true){
            paint.undoStack.pop(); // this makes it so returning to the deleted drawing requires the redo button
           }
           paint.numSquares = false;



    // if the user presses ctrl + c, copy the image inside of the dotted rectangle
        }else if (e.key === "c" && e.ctrlKey){
            var canvas = document.getElementById("canvas");
            var context = canvas.getContext("2d");
             
            var start = paint.startingPoint;
            var end = paint.endPoint;
            
            /* TAKE CARE OF ALL DIRECTIONS POSSIBLE FOR DRAG AND DROP COPYING FUNCIOTIONALITY*/
            
            if (start.x < end.x && start.y < end.y){//start high go down, right (good)
                 let test = context.getImageData(start.x, start.y, (end.x - start.x), (end.y - start.y));
                 //context.putImageData(test, start.x + 20, start.y + 20); (this works...... ish)
                 paint.getRectImage(test);
                 console.log(paint.rectData);
            }else if (start.x < end.x && start.y > end.y){ //start low, go up, right (good)
                 let test = context.getImageData(start.x, end.y, (end.x - start.x), (start.y - end.y));
                 
                 paint.getRectImage(test);
                 console.log(paint.rectData);
            }else if (start.x > end.x && start.y < end.y){ // start high, go down, left (good)
                 let test = context.getImageData(end.x, start.y, (start.x - end.x), (end.y - start.y));
                 paint.getRectImage(test);
                 console.log(paint.rectData);
            }else if (start.x > end.x && start.y > end.y){ //start low, go up, left (good)
                 let test = context.getImageData(end.x, end.y, (start.x - end.x), (start.y - end.y));
                 paint.getRectImage(test);
                 console.log(paint.rectData);
            }
        }
    }
});