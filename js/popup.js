// array to hold the opened windows ids
let openedWindows = [];
// variable to hold max z-index
let lastIndex = 10;
/**
 * function to load the template of popup from
 * a separate html file. For structure purposes
 * we make the window template in a separate file
 * to make our code more readable and easy to fix
 * issues.
 * @param file
 */
function loadTemplate(file) {
    /**
     * return promise object means an object that
     * we can subscribe on it.
     * in classic programming languages we write lines
     * of code and the order of execution is vertical
     * means some (n) line of code cannot be executed only if
     * the (n-1) line is executed successfully this way of programming
     * named synchronous programming. This approach has a lot of
     * problems... example line (n) will not be executed when the
     * line (n-1) fail...
     * so nowadays we use asynchronous programming... to know more about the
     * new approach visit this link:
     * https://developer.mozilla.org/fr/docs/Learn/JavaScript/Asynchronous
     * https://developer.mozilla.org/fr/docs/Learn/JavaScript/Asynchronous/Introducing
     *
     */
    return fetch(file).then(response=> response.text(), {mode: 'no-cors'});
}

function createPopup(popup) {
    // define object to contain window properties.
    let windowObj = {};
    if (popup.title) {

    }
}

/**
 * create function to show the window
 * object already created by createPopup
 * function
 * @param popup
 */
function show(popup) {
    // variable to hold the popup theme
    let theme = null;
    // write console to track the function execution.
    console.log("[show] function - start. popup = ", popup);
    if (popup) {
        if (popup.theme) {
            console.log("[show] function - start theme:", popup.theme);
            theme = popup.theme;
        } else {
            // set default theme
            theme = "../html/popup.html";
        }
    } else {
        throw Error("Programming error cannot create popup from " + popup);
    }
    // get the popup template
    loadTemplate(theme).then(html=> {
        // retrieve the html body
        let body = document.getElementsByTagName("body");
        // make console to track the function outputs
        console.log("[show] function - body = ", body);
        // bind the popup html to body
        let windowObject = createElementFromHTML(html);
        // get window header
        let header = windowObject.childNodes[1];
        // write console to track the function execution.
        console.log("[show] function - header = ", header);
        // get window body
        let windowBody = windowObject.childNodes[3];
        // write console to track the function execution.
        console.log("[show] function - windowBody = ", windowBody);
        // get window close button
        // make window draggable
        draggable(windowObject);
        // check if user set title
        if (popup.title) {
            let title = document.createElement("span");
            title.style = "color: white; font-size:13px; font-weight: bold;" +
                " font-family: verdana; sans-serif; line-height: 30px; margin-left:8px; ";
            title.innerText = popup.title;
            header.insertBefore(title, header.firstChild);
        }
        if (popup.content) {
            let content = document.createElement("p");
            content.innerText = popup.content;
            windowBody.appendChild(content);
        }
        if (popup.file) {
            loadTemplate(popup.file).then(template=> {
               let content = createElementFromHTML(template);
                // write console to track the function execution.
                console.log("[show] function - file content = ", content);
               windowBody.appendChild(content);
            });
        }
        console.log("windowObject = ", windowObject.firstChild.nextSibling);
        let child = body[0].appendChild(windowObject);
        console.log("child = ", child.childNodes)
        openedWindows.push(windowObject);
        // write console to track the function execution.
        console.log("[show] function - openedWindows = ", openedWindows);
    });
}

/**
 * function to create a real html element
 * from html string loaded by the function loadTemplate
 * @param htmlString
 * @returns {ChildNode}
 */
function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
}
/**
 * function to destroy a popup object
 * passed on parameter.
 * @param popup
 */
function destroy(popup) {

}

function draggable(popup) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    // get the window header
    let header = popup.firstChild.nextSibling;
    console.log("header children = ", header.firstChild.nextSibling.childNodes);
    // get close button
    let closeBtn = header.firstChild.nextSibling.childNodes[1];
    // write console to track the function execution.
    console.log("[draggable] function - closeBtn = ", closeBtn);
    // get minimize button
    let maximizeBtn = header.firstChild.nextSibling.childNodes[3];
    // write console to track the function execution.
    console.log("[draggable] function - maximizeBtn = ", maximizeBtn);
    // get maximize button
    let minimizeBtn = header.firstChild.nextSibling.childNodes[5];
    // write console to track the function execution.
    console.log("[draggable] function - minimizeBtn = ", minimizeBtn);
    popup.onmousedown = getInFront;
    header.onmousedown = dragMouseDown;
    // set close function
    closeBtn.onclick = closeWindow;
    // set minimize function
    minimizeBtn.onclick = minimizeWindow;
    // set maximize function
    maximizeBtn.onclick = maximizeWindow;
    function minimizeWindow() {

    }
    function maximizeWindow() {

    }
    function closeWindow() {
        // write console to track the function execution.
        console.log("[closeWindow] function - start");
        popup.remove();
        openedWindows.splice(popup, 1);
        // write console to track the function execution.
        console.log("[closeWindow] function - end, openedWindows = ", openedWindows);
    }
    function getInFront() {
        console.log("z-index= ", popup.style.zIndex);
        popup.style.zIndex = lastIndex;
        lastIndex++;
    }
    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        popup.style.top = (popup.offsetTop - pos2) + "px";
        popup.style.left = (popup.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}