window.onload = function() {

    sendRequest('b');

    document.addEventListener('DOMContentLoaded', function () {
        var links = document.getElementsByTagName("a");
        for (var i = 0; i < links.length; i++) {
            (function () {
                var ln = links[i];
                var location = ln.href;
                ln.onclick = function () {
                    chrome.tabs.create({active: true, url: location});
                };
            })();
        }
    });

        var b = document.getElementById("b");
        var po = document.getElementById("po");
        var pr = document.getElementById("pr");
        var news = document.getElementById("news");
        var vg = document.getElementById("vg");
        var a = document.getElementById("a");
        var root = document.querySelector('#root');

        b.addEventListener('click', function () {
            while (root.firstChild) {
                root.removeChild(root.firstChild);
            }
            sendRequest('b');
        })
        po.addEventListener('click', function () {
            while (root.firstChild) {
                root.removeChild(root.firstChild);
            }
            sendRequest('po');
        })
        pr.addEventListener('click', function () {
            while (root.firstChild) {
                root.removeChild(root.firstChild);
            }
            sendRequest('pr');
        })
        news.addEventListener('click', function () {
            while (root.firstChild) {
                root.removeChild(root.firstChild);
            }
            sendRequest('news');
        })
        vg.addEventListener('click', function () {
            while (root.firstChild) {
                root.removeChild(root.firstChild);
            }
            sendRequest('vg');
        })
        a.addEventListener('click', function () {
            while (root.firstChild) {
                root.removeChild(root.firstChild);
            }
            sendRequest('a');
        })

    function sendRequest(board){
       chrome.runtime.sendMessage({board: board}, (response)=>{ 
       response = JSON.parse(response);
       response.forEach((v, i)=>{
        if (v.title !== undefined){
         var li = document.createElement('li');
         var a = document.createElement('a');
         a.innerHTML = v.title;
         a.href = v.link;
         a.target="_blank";
         document.querySelector('#root').appendChild(li).appendChild(a); 
        }
       })
    })
    }
}