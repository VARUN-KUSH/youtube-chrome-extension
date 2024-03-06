const squareStyle = `
    position: absolute;
    top: 10px;
    left: 10px;
    width: 40px;
    height: 40px;
    background-color: yellow;
    border: 2px solid red;
    
`;

const spinnerStyles= `
.loaderui {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 48px;
  height: 48px;
  border: 5px solid #FFF;
  border-bottom-color: #FF3D00;
  border-radius: 50%;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
  
  }

  @keyframes rotation {
  0% {
      transform: rotate(0deg);
  }
  100% {
      transform: rotate(360deg);
  }
  } 
`;







function extractVideoIds() {
  let VideosIds = [];
  let select = document.querySelectorAll('a#thumbnail.ytd-thumbnail');
  let running;
  
  let links = [...select]
  for (let i = 0; i < links.length; i++) {
    const styles = document.createElement('style');
    styles.innerHTML = spinnerStyles;
    document.head.appendChild(styles);

    const uielement = document.createElement('div');
    uielement.classList.add('loaderui')
  

    let link = links[i];
    link.parentElement.appendChild(uielement)
    
    let videoId
   
   
      if (link.href && link.href.indexOf('youtube.com/watch') !== -1) {
       
       let url = new URL(link.href);

       let searchParams = new URLSearchParams(url.search);
       videoId = searchParams.get('v');
       
      } else if (link.href && link.href.indexOf('youtube.com/shorts') !== -1) { 
        const regex = /(?:shorts\/)([a-zA-Z0-9_-]{11})/;
        const match = link.href.match(regex);
        
        if (match && match.length > 1) {
           videoId = match[1];
            

            console.log("ID extracted from the URL:", videoId);
        } else {
            console.log("Invalid YouTube Shorts URL.");
        }
        
      }

      if (videoId) {
        VideosIds.push(videoId);
        
      }
      
  } 

   
   return [VideosIds, links, false];
   



}

function sendVideoIdsToExtension(videoIds, link) {
  
  if (videoIds.length > 0) {
      var port = chrome.runtime.connect({ name: "videoIds" });
      port.postMessage({ value: videoIds });
      port.onMessage.addListener(function (msg) {
          if(msg.data) {
            const objectLength = Object.keys(msg.data).length;

            for (let i = 0; i < objectLength; i++) {
                let currentmsg = msg.data[i];
                console.log(currentmsg);
                let arrs = link;
                let arr = arrs[i];
                let elementsToRemove = document.getElementsByClassName('loaderui');
                if (elementsToRemove.length > 0) {
                  let element = elementsToRemove[0];
                  element.parentNode.removeChild(element);
                }
                let uielement = document.createElement("div")
                uielement.style.cssText = squareStyle;
                uielement.innerHTML = currentmsg;
                arr.parentElement.appendChild(uielement);
            }
          
          }
          
          
          
        
           
      });
  }
}


function handleChanges() {
    
        const [videoIds, link, running] = extractVideoIds();

        sendVideoIdsToExtension(videoIds, link);

        console.log('Video IDs:', videoIds);
       
        isExtractionRunning = false;
  
}



window.addEventListener('scroll', function() {
  // Check if the extraction process is already running
  // if (!isExtractionRunning) {
  //     // Check if user has scrolled to the bottom of the page
  //     if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
  //         // Set flag to indicate extraction process is running
  //         isExtractionRunning = true;

  //         // Call the handleChanges function to extract video IDs
  //         handleChanges();
  //     }
  // }
});

window.addEventListener('DOMContentLoaded', function () {
  
  const [videoIds, link] = extractVideoIds();
  // Send the initial video IDs to the extension
  sendVideoIdsToExtension(videoIds, link);
});

const webupdate = () => {
 
  const [videoIds, link] = extractVideoIds();

  sendVideoIdsToExtension(videoIds, link);

}

chrome.webNavigation.onTabReplaced.addListener(webupdate)


















