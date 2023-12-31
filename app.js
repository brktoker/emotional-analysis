const video = document.getElementById("video");
const playButton = document.getElementById("playButton");

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("/models"),
]).then(startCamera());

function startCamera(e) {
  if (e && playButton.value == "Close") {
    playButton.value = "Start"
    playButton.innerHTML = "Close Emotional Analysis with Camera"
    navigator.getUserMedia(
      {
        video: {},
      },
      (stream) => (video.srcObject = stream),
      (err) => console.log(err)
    );
  } else {
    playButton.value = "Close"
    playButton.innerHTML = "Start Emotional Analysis with Camera"
    return false;
  }
}

playButton.addEventListener("click", startCamera);

video.addEventListener("play", () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const boxSize = {
    width: video.width,
    height: video.height,
  };

  faceapi.matchDimensions(canvas, boxSize);

  setInterval(async () => {
    //async
    // await
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    const resizedDetections = faceapi.resizeResults(detections, boxSize);

    faceapi.draw.drawDetections(canvas, resizedDetections);

    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

    // console.log(detections);
  }, 100);
});
