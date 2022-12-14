const request = new XMLHttpRequest();
let y
let r
let x

let cordX
let cordY

function gotData() {
    if (request.readyState === 4) {
        let status = request.status;
        if (status == 200) {
            document.getElementById("resultBox").innerHTML = request.responseText
        }
    }
}

document.getElementById("subBtn").onclick = function () {
    getFormData()
    if(sendRequestHandle()){
        setCoordinates()
        setVisiblePoint()
    }
};

function setCoordinates(){
    cordX = convertToCoordinate(x)
    cordY = convertToCoordinate(y)
}

document.addEventListener('click', function (e) {
    if (e.target.getAttribute('id') == 'clrBtn') {
        sendRequestClear()
        unsetVisiblePoint()
    }
});

function sendRequestGetData() {
    let response = "t=" + 3;
    request.open("GET", "ControllerServlet?" + response);
    request.onreadystatechange = gotData;
    request.send();
}

function sendRequestHandle() {
    if (validate()) {
        let response = "t=" + 1 + "&x=" + x + "&y=" + y + "&r=" + r;
            request.open("GET", "ControllerServlet?" + response);
        request.onreadystatechange = gotData;
        request.send();
        return true
    }
    return false;
}

function sendRequestClear() {
    let response = "t=" + 2;
    request.open("GET", "ControllerServlet?" + response);
    request.onreadystatechange = gotData;
    request.send();
}

document.querySelectorAll('.input').forEach(function (item) {
    item.addEventListener("keydown", function (event) {
        if (event.keyCode == 13) {
            event.preventDefault()
            getFormData()
            if(sendRequestHandle()){
                setCoordinates()
                setVisiblePoint()
            }
        }

    })
});

function getFormData() {
    let form = document.getElementById('form')
    y = form.y.value.replace(",", ".")
    r = form.r.value.replace(",", ".")
    x = form.x.value
}

window.onload = sendRequestGetData();

function validateCoordinates() {
    let msg = ""
    if (checkYInArea()&&checkXInArea()){
        return true
    }
    if (!checkYInArea()) {
        msg+="Y must be (-3;3)\n"
    }
    if(!checkXInArea()){
        msg+="X must be [-2;2]"
    }
    alert(msg)
    return false
}

function checkYInArea(){
    return y > -3 && y < 3;
}

function checkXInArea(){
    return x >= -2 && x <= 2;
}

function validate() {
    let isValidY = checkY(y)
    let isValidX = checkX(x)
    let isValidR = checkR(r)

    return isValidY && isValidX && isValidR;
}

document.querySelector('svg').addEventListener("mousedown", function (e) {
    cordX = e.offsetX
    cordY = e.offsetY
    detectClick()
});

function detectClick() {
    if (checkChoseR()) {
        convertCoordinates()
        if (validateCoordinates()){
            sendRequestHandle()
            setVisiblePoint()
        }
    }else{
        alert("Check the value of R")
    }
}

function setVisiblePoint(){
    let point = document.getElementById("point")
    point.setAttribute('cx',150+cordX)
    point.setAttribute('cy',150-cordY)
    point.setAttribute("visibility","visible")
}

function unsetVisiblePoint(){
    let point = document.getElementById("point")
    point.setAttribute('cx',150)
    point.setAttribute('cy',150)
    point.setAttribute("visibility","visible")
}

function convertCoordinates() {
    changeXCord()
    changeYCord()
    x = convertCoordinate(cordX)
    y = convertCoordinate(cordY)
}

function convertCoordinate(coord){
    return (coord/120)*r;
}

function convertToCoordinate(value){
    return (value*120)/r;
}

function changeXCord(){
    let centerX = 150
    if (cordX < centerX){
        cordX = -(centerX-cordX)
    }else{
        cordX = cordX-centerX
    }
}

function changeYCord(){
    let centerY = 150
    if (cordY>centerY){
        cordY = -(cordY-centerY)
    }else {
        cordY = centerY- cordY
    }
}

function checkChoseR() {
    let form = document.getElementById('form')
    r = form.r.value.replace(",", ".")
    return checkR(r);
}

function checkY(y) {
    let exceptionFieldY = document.getElementById('exceptionFieldY')

    if (y.length === 0) {
        exceptionFieldY.innerText = "Value Y can not be empty"
        return false

    } else if (!isNumber(y)) {
        exceptionFieldY.innerText = "Value Y must be numeric"
        return false
    } else if (!(y < 3 && y > -3)) {
        exceptionFieldY.innerText = "Value Y must be (-3;3)"
        return false
    } else {
        exceptionFieldY.innerText = ""
        return true

    }
}

function checkR(r) {
    let exceptionFieldR = document.getElementById('exceptionFieldR')

    if (r.length === 0) {
        exceptionFieldR.innerText = "Value R can not be empty"
        return false

    } else if (!isNumber(r)) {
        exceptionFieldR.innerText = "Value R must be numeric"
        return false
    } else if (!(r > 1 && r < 4)) {
        exceptionFieldR.innerText = "Value R must be (1;4)"
        return false
    } else {
        exceptionFieldR.innerText = ""
        return true

    }
}


function checkX(x) {
    let exceptionFieldX = document.getElementById('exceptionFieldX')
    if (!isNumber(x)) {
        exceptionFieldX.innerText = "Choose the value of X"
        return false
    } else {
        exceptionFieldX.innerText = ""
        return true

    }
}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && !isNaN(n - 0)
}

function clock() {
    let date = new Date(),
        hours = (date.getHours() < 10) ? '0' + date.getHours() : date.getHours(),
        minutes = (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes(),
        seconds = (date.getSeconds() < 10) ? '0' + date.getSeconds() : date.getSeconds()

    document.getElementById('clock').innerText = hours + ':' + minutes + ':' + seconds
}

setInterval(clock, 1000)
clock()