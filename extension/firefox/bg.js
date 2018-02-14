browser.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  
    var xhr = new XMLHttpRequest();

    xhr.open("GET", "https://still-cove-13917.herokuapp.com/top", false);
    xhr.send();

    var res = xhr.responseText;
  	sendResponse(JSON.parse(res));
 
  return true;
})