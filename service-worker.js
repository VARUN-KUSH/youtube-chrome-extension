console.log("i am background.js");



chrome.runtime.onConnect.addListener(function(port) {
    console.assert(port.name === "videosIds");
    port.onMessage.addListener(function(msg) {
      if (msg.value) {
        const serverUrl = 'https://jsonplaceholder.typicode.com/posts';

        fetch(serverUrl, {
            method: 'POST',
            body: JSON.stringify(msg.value),
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
            },
          })
        .then((response) => response.json())
        .then((json) => {
                console.log(json);
                port.postMessage({data: json});
            });


        
       
     }
      else if (!msg.value) {
        port.postMessage({question: "not recieved videosId"});
  
    }
})
});

