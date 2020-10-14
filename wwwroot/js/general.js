// General Methods ____________________________________________________________________________________________________________________________________________________________________________________________

// returns NodeElement from HTML-String
function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
}

// control Inputfields
function controlInput(inputfields, editmode) {
    for (field of inputfields) {
        if (editmode == true) {
            field.removeAttribute("readonly");
        } else {
            field.setAttribute("readonly", true);
        }
    }
}

// create (JSON-)Object from Form
function serializeForm(form) {
    var obj = {};
    var formData = new FormData(form);
    for (var key of formData.keys()) {
        obj[key] = formData.get(key);
    }
    return obj;
};


// convert img to data:URL
function toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        var reader = new FileReader();
        reader.onloadend = function() {
            callback(reader.result);
        }
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}


// General DOM Methods for this Website
function infoPopup(title, type = "", duration = 10) {
    popup = document.getElementById("info-popup");
    const time = Date.now();

    popup.getElementsByClassName("message")[0].innerHTML = title;

    if (type == "") {
        popup.removeAttribute("type");
    } else {
        popup.setAttribute("type", type);
    }

    popup.setAttribute("triggertime", time);
    popup.classList.add("active");


    setTimeout(() => {
        if (popup.getAttribute("triggertime") == time) {
            popup.classList.remove("active");
            console.log(popup.getAttribute("triggertime"));
        }
    }, duration * 1000);
}

function setupInfoPopup() {
    document.getElementById("closeInfo").addEventListener("click", (event) => {
        event.preventDefault();
        infopopup = document.getElementById("info-popup");
        infopopup.classList.remove("active");
    });
}

const scrollToTop = () => {
    const c = document.documentElement.scrollTop || document.body.scrollTop;
    if (c > 0) {
        window.requestAnimationFrame(scrollToTop);
        window.scrollTo(0, c - c / 8);
    }
};