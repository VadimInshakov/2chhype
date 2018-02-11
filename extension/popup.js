window.onload = function() {

    chrome.runtime.sendMessage({test: 'test'}, (response)=>{ 
       response = JSON.parse(response);
       response.forEach((v, i)=>{
         var li = document.createElement('li');
         var a = document.createElement('a');
         a.innerHTML = v.title;
         a.href = v.link;
         a.target="_blank";
         document.querySelector('#root').appendChild(li).appendChild(a);  
       })
    })

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
}