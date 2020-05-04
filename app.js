import {TOOL_CIRCLE, TOOL_LINE, TOOL_BRUSH, TOOL_ERASER, TOOL_PAINT_BUCKET, TOOL_PENCIL, TOOL_SQUARE, TOOL_TRIANGLE} from './tool.js'; 
import Paint from './paint.class.js';

//variables related to paint
var paint = new Paint("canvas");
paint.activeTool = TOOL_LINE; // IT WILL DEFAULT THE TOOL TO THE SQUARE
paint.lineWidth = 1; // determine lineWidth here
paint.brushSize = 4;
paint.selectedColor = "#000000";

paint.init();




document.querySelectorAll("[data-command]").forEach( // maybe remove ]
    item => {
        item.addEventListener("click", e => {
            console.log(item.getAttribute("data-command")); // not doing shit here still
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
                    break;
                case TOOL_LINE:
                    break;
                case TOOL_SQUARE:
                
                    break;
                case TOOL_TRIANGLE:
    
                    break;
                case TOOL_PAINT_BUCKET:
                    
                    break;
                case TOOL_ERASER: // I've put these two lines here to fix a bad bug that was haunting me for a while
                    document.querySelector(".group.for-shapes").style.display = "none";
                    document.querySelector(".group.for-brush").style.display = "none";
                    break;
                case TOOL_PENCIL:
                    
                    //make pencil shapes visible
                    document.querySelector(".group.for-shapes").style = "display: block;";
                    //make brush sizes invisible
                    
                    document.querySelector(".group.for-brush").style = "display: none;";
                    break;

                case TOOL_BRUSH:
                    
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