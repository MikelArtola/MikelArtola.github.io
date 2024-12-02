const container = document.querySelector(".container")
const coffees = [
  { name: "Perspiciatis", image: "images/coffee1.jpg" },
  { name: "Voluptatem", image: "images/coffee2.jpg" },
  { name: "Explicabo", image: "images/coffee3.jpg" },
  { name: "Rchitecto", image: "images/coffee4.jpg" },
  { name: " Beatae", image: "images/coffee5.jpg" },
  { name: " Vitae", image: "images/coffee6.jpg" },
  { name: "Inventore", image: "images/coffee7.jpg" },
  { name: "Veritatis", image: "images/coffee8.jpg" },
  { name: "Accusantium", image: "images/coffee9.jpg" },
]

const webPush = require("web-push");

webPush.setVapidDetails(
  "https://mikelartola.github.io",
  "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEB69OPb5fhNPw8BS0ZNQjSiBGQf/j1tzvyn3nz1DEzu12jeGXZ+FZEZweVOlWuCWiLjqF+soyJu631glqdJ4SwA==",
  fs.readFileSync(path.join(__dirname, 'vapid_public.pem'), 'utf8').then((vapidPublicKey) => {vapidPublicKey
    .replace(/-----BEGIN PUBLIC KEY-----/g, '')
    .replace(/-----END PUBLIC KEY-----/g, '')
    .replace(/\n/g, '');}));


function urlBase64ToUint8Array(base64String) {
  var padding = '='.repeat((4 - base64String.length % 4) % 4);
  var base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
 
  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);
 
  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}


const showCoffees = () => {
    let output = ""
    coffees.forEach(
      ({ name, image }) =>
        (output += `
                <div class="card">
                  <img class="card--avatar" src=${image} />
                  <h1 class="card--title">${name}</h1>
                  <a class="card--link" href="#">Taste</a>
                </div>
                `)
    )
    container.innerHTML = output
  }
  
  document.addEventListener("DOMContentLoaded", showCoffees)

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
      navigator.serviceWorker
        .register("/serviceWorker.js")
        .then(function (registration) {
          return registration.pushManager
            .getSubscription()
            .then(async function (subscription) {
              if (subscription) {
                return subscription;
              }
              const response = "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEB69OPb5fhNPw8BS0ZNQjSiBGQf/j1tzvyn3nz1DEzu12jeGXZ+FZEZweVOlWuCWiLjqF+soyJu631glqdJ4SwA==";
              const vapidPublicKey = "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEB69OPb5fhNPw8BS0ZNQjSiBGQf/j1tzvyn3nz1DEzu12jeGXZ+FZEZweVOlWuCWiLjqF+soyJu631glqdJ4SwA==";//await response.text();
              const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
              
              return registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: convertedVapidKey,
              });
            });
        })
        .then(function (subscription) {
          console.log("PushManager subscription: ", subscription);
        })
    })
  }

  document.getElementById("doIt").onclick = function () {
    const payload = document.getElementById("notification-payload").value;
    const delay = document.getElementById("notification-delay").value;
    const ttl = document.getElementById("notification-ttl").value;
    const options = {
      TTL: req.body.ttl,
    };
  
    setTimeout(function () {
      webPush
        .sendNotification(subscription, payload, options);
    }, req.body.delay * 1000);
  };

