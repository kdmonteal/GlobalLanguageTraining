// Acceder a la cámara
const videoElement = document.getElementById('cameraStream');
const startCameraButton = document.getElementById('startCamera');

startCameraButton.addEventListener('click', async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElement.srcObject = stream;
  } catch (error) {
    console.error('Error accediendo a la cámara:', error);
  }
});

// Acceder al micrófono
const audioElement = document.getElementById('audioStream');
const startMicButton = document.getElementById('startMic');

// Registro del Service Worker para convertir en PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js').then(registration => {
      console.log('ServiceWorker registrado con éxito:', registration.scope);
    }, err => {
      console.log('Error al registrar el ServiceWorker:', err);
    });
  });
}


// Variables globales para el audio
let mediaRecorder;
let audioChunks = [];
const stopMicButton = document.createElement('button');
stopMicButton.textContent = 'Detener Grabación';
stopMicButton.style.display = 'none'; // Se mostrará solo cuando la grabación esté activa

document.body.appendChild(stopMicButton);

// Iniciar grabación de audio
startMicButton.addEventListener('click', async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();

    audioChunks = [];

    mediaRecorder.ondataavailable = event => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(audioBlob);
      audioElement.src = audioUrl;
      audioElement.style.display = 'block';
    };

    startMicButton.style.display = 'none'; // Ocultamos el botón de iniciar grabación
    stopMicButton.style.display = 'inline'; // Mostramos el botón de detener grabación
  } catch (error) {
    console.error('Error accediendo al micrófono:', error);
  }
});

// Detener la grabación de audio
stopMicButton.addEventListener('click', () => {
  mediaRecorder.stop(); // Detenemos la grabación
  stopMicButton.style.display = 'none'; // Ocultamos el botón de detener grabación
  startMicButton.style.display = 'inline'; // Volvemos a mostrar el botón de iniciar grabación
});