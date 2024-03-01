const squareStyle = `
    position: absolute;
    top: 10px;
    left: 10px;
    width: 40px;
    height: 40px;
    background-color: yellow;
    border: 2px solid red;
    z-index: 9999;
`;
const spinnerStyles =`
    background: #000;
    background: radial-gradient(#222, #000);
    bottom: 0;
    left: 0;
    overflow: hidden;
    position: fixed;
    right: 0;
    top: 0;
    z-index: 99999;

`;

const loaderInnerStyles = `
    bottom: 0;
    height: 60px;
    left: 0;
    margin: auto;
    position: absolute;
    right: 0;
    top: 0;
    width: 100px;
`;

const loaderLineWrapStyles = `
    animation: spin 2000ms cubic-bezier(.175, .885, .32, 1.275) infinite;
    box-sizing: border-box;
    height: 50px;
    left: 0;
    overflow: hidden;
    position: absolute;
    top: 0;
    transform-origin: 50% 100%;
    width: 100px;
`;

const loaderLineStyles = `
    border: 4px solid transparent;
    border-radius: 100%;
    box-sizing: border-box;
    height: 100px;
    left: 0;
    margin: 0 auto;
    position: absolute;
    right: 0;
    top: 0;
    width: 100px;
`;


function showSpinner() {
  const spinner = document.createElement('div');
  spinner.style.cssText = spinnerStyles;

  const loaderInner = document.createElement('div');
  loaderInner.style.cssText = loaderInnerStyles;

  for (let i = 0; i < 5; i++) {
    // Create a loader line wrap
    const loaderLineWrap = document.createElement('div');
    loaderLineWrap.style.cssText = loaderLineWrapStyles;
      switch (i) {
        case 0:
            loaderLineWrap.style.animationDelay = '-50ms';
            loaderLineWrap.style.borderColor = 'hsl(0, 80%, 60%)';
            loaderLineWrap.style.height = '90px';
            loaderLineWrap.style.width = '90px';
            loaderLineWrap.style.top = '7px';
            break;
        case 1:
            loaderLineWrap.style.animationDelay = '-100ms';
            loaderLineWrap.style.borderColor = 'hsl(60, 80%, 60%)';
            loaderLineWrap.style.height = '76px';
            loaderLineWrap.style.width = '76px';
            loaderLineWrap.style.top = '14px';
            break;
        case 2:
            loaderLineWrap.style.animationDelay = '-150ms';
            loaderLineWrap.style.borderColor = 'hsl(120, 80%, 60%)';
            loaderLineWrap.style.height = '62px';
            loaderLineWrap.style.width = '62px';
            loaderLineWrap.style.top = '21px';
            break;
        case 3:
            loaderLineWrap.style.animationDelay = '-200ms';
            loaderLineWrap.style.borderColor = 'hsl(180, 80%, 60%)';
            loaderLineWrap.style.height = '48px';
            loaderLineWrap.style.width = '48px';
            loaderLineWrap.style.top = '28px';
            break;
        case 4:
            loaderLineWrap.style.animationDelay = '-250ms';
            loaderLineWrap.style.borderColor = 'hsl(240, 80%, 60%)';
            loaderLineWrap.style.height = '34px';
            loaderLineWrap.style.width = '34px';
            loaderLineWrap.style.top = '35px';
            break;
        default:
            break;
    }

    // Create a loader line
    const loaderLine = document.createElement('div');
    

    // Append the loader line to the loader line wrap
    loaderLineWrap.appendChild(loaderLine);

    // Append the loader line wrap to the loader inner
    loaderInner.appendChild(loaderLineWrap);
  }

  spinner.appendChild(loaderInner);

  return spinner;



}

const loaderContainer = document.createElement('div');

// Create the first loader
const loader1 = createLoader();

// Create the second loader
const loader2 = createLoader();

// Append the loaders to the container
loaderContainer.appendChild(loader1);
loaderContainer.appendChild(loader2);

function extractVideoIds() {
  let VideosIds = [];
  let select = document.querySelectorAll('a#thumbnail.ytd-thumbnail');
  
  let links = [...select]
  for (let i = 0; i < select.length; i++) {
    let link = select[i];
    link.parentElement.appendChild(loaderContainer)
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

  
   return [VideosIds, links];



}

//const [videoIds, link] = extractVideoIds();



function sendVideoIdsToExtension(videoIds, link) {
  if (videoIds.length > 0) {
      var port = chrome.runtime.connect({ name: "videoIds" });
      port.postMessage({ value: videoIds });
      port.onMessage.addListener(function (msg) {
          if (msg.data) {
              const objectLength = Object.keys(msg.data).length;

              for (let i = 0; i < objectLength; i++) {
                  let currentmsg = msg.data[i];
                  console.log(currentmsg);
                  let arrs = link;
                  let arr = arrs[i];
                  let newDiv = document.createElement('div');
                  newDiv.style.cssText = squareStyle;
                  newDiv.innerHTML = currentmsg;
                  arr.parentElement.appendChild(newDiv);
              }
          }
      });
  }
}

//sendVideoIdsToExtension(videoIds, link);

function handleChanges() {
  
        const [videoIds, link] = extractVideoIds();

        sendVideoIdsToExtension(videoIds, link);

        console.log('Video IDs:', videoIds);
       
      
  
}

window.addEventListener('DOMContentLoaded', function () {
  const [videoIds, link] = extractVideoIds();
  // Send the initial video IDs to the extension
  sendVideoIdsToExtension(videoIds, link);
});

window.addEventListener('scroll', handleChanges);

window.addEventListener('popstate', function(event) {
  // Re-extract video IDs when the user navigates to a new page
  const [videoIds, link]  = extractVideoIds();
  // Send the new video IDs to the extension
  sendVideoIdsToExtension(videoIds, link);
});

// const config = { attributes: true, childList: true, subtree: true };


// const observer = new MutationObserver(handleDOMChanges);

// 
// observer.observe(contents, config);














