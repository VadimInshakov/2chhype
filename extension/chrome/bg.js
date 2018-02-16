chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.board === 'b'){
        var xhr = new XMLHttpRequest();

        xhr.open("GET", "https://still-cove-13917.herokuapp.com/topb", false);
        xhr.send();

        var resb = xhr.responseText;
  	    sendResponse(JSON.parse(resb));
    } else if (request.board === 'po'){
        var xhr = new XMLHttpRequest();

        xhr.open("GET", "https://still-cove-13917.herokuapp.com/toppo", false);
        xhr.send();

        var respo = xhr.responseText;
  	    sendResponse(JSON.parse(respo));
    } else if (request.board === 'pr'){
        var xhr = new XMLHttpRequest();

        xhr.open("GET", "https://still-cove-13917.herokuapp.com/toppr", false);
        xhr.send();

        var resppr = xhr.responseText;
  	    sendResponse(JSON.parse(resppr));
    } else if (request.board === 'news'){
        var xhr = new XMLHttpRequest();

        xhr.open("GET", "https://still-cove-13917.herokuapp.com/topnews", false);
        xhr.send();

        var respnews = xhr.responseText;
        sendResponse(JSON.parse(respnews));
    } else if (request.board === 'vg'){
        var xhr = new XMLHttpRequest();

        xhr.open("GET", "https://still-cove-13917.herokuapp.com/topvg", false);
        xhr.send();

        var respvg = xhr.responseText;
        sendResponse(JSON.parse(respvg));
    } else if (request.board === 'a'){
        var xhr = new XMLHttpRequest();

        xhr.open("GET", "https://still-cove-13917.herokuapp.com/topa", false);
        xhr.send();

        var respa = xhr.responseText;
        sendResponse(JSON.parse(respa));
    }
 
  return true;
})