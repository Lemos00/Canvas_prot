import Tool from './tool.class.js'; // we might have to use "/" only idk

document.querySelectorAll("[data-command]").forEach( // maybe remove ]
    item => {
        item.addEventListener("click", e => {
            console.log(item.getAttribute("data-command"));
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
            
            switch(selectedTool){
                //activate shape or line widths group
                case Tool.TOOL_SQUARE:
                    console.log(Tool.TOOL_SQUARE)
                    break;
                case Tool.TOOL_TRIANGLE:
                    console.log(Tool.TOOL_TRIANGLE)
                    break;
                case Tool.TOOL_PAINT_BUCKET:
                    console.log(Tool.TOOL_PAINT_BUCKET)
                    break;
                case Tool.TOOL_ERASER:
                    console.log(Tool.TOOL_ERASER)
                    break;
                case Tool.TOOL_PENCIL:
                    console.log(Tool.TOOL_PENCIL)
                    //make pencil shapes visible
                    document.querySelector(".group.for-shapes").style = "display: block;";
                    //make brush sizes invisible
                    console.log()
                    document.querySelector(".group.for-brush").style = "display: none;";
                    break;

                case Tool.TOOL_BRUSH:
                    console.log(Tool.TOOL_PENCIL)
                    //make pencil shapes invisible
                    document.querySelector(".group.for-shapes").style.display = "none";
                    //make brush selection visible
                    document.querySelector(".group.for-brush").style.display = "block";
                    break;
                default:
                    //make both line groups invisible
                    document.querySelector(".group.for-shapes").style.display = "block";
                    document.querySelector(".group.for-brush").style.display = "block";
            }

        }
    ))
);

document.querySelectorAll("[data-line-width]").forEach(
    item => {
        item.addEventListener("click", e => {
            document.querySelector("[data-line-width].active").classList.toggle("active"); // remove the previous active function from the active class
            item.classList.add("active"); // we add the element we clicked on to the active class
        });
    }
);

document.querySelectorAll("[data-color]").forEach(
    item => {
        item.addEventListener("click", e => {
            document.querySelector("[data-color].active").classList.toggle("active"); // remove the previous active function from the active class
            item.classList.add("active"); // we add the element we clicked on to the active class
        });
    }
);