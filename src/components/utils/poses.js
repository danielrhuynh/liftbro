import * as posenet from '@tensorflow-models/posenet';
import { drawKeypoints, drawSkeleton } from './canvas';

export const loadPosenet = async (webcamRef, canvasRef) => {
    const loadedModel = await posenet.load({
        architecture: 'MobileNetV1',
        outputStride: 16,
        inputResolution: { width: 640, height: 480 },
        multiplier: 0.75
    });

    setInterval(() => {
        startPoseEstimation(loadedModel, webcamRef, canvasRef);
    }, 100);
};

const startPoseEstimation = (model, webcamRef, canvasRef) => {
    if (typeof webcamRef.current !== "undefined" && webcamRef.current !== null && webcamRef.current.video.readyState === 4) {
        const video = webcamRef.current.video;
        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;

        webcamRef.current.video.width = videoWidth;
        webcamRef.current.video.height = videoHeight;

        model.estimateSinglePose(video, {
            flipHorizontal: false
        }).then(pose => {
            drawCanvas(pose, videoWidth, videoHeight, canvasRef, webcamRef);
        });
    }
};

const drawCanvas = (pose, videoWidth, videoHeight, canvas, webcamRef) => {
    const ctx = canvas.current.getContext("2d");
    canvas.current.width = videoWidth;
    canvas.current.height = videoHeight;

    ctx.drawImage(webcamRef.current.video, 0, 0, videoWidth, videoHeight)
    drawKeypoints(pose["keypoints"], 0.5, ctx);
    drawSkeleton(pose["keypoints"], 0.5, ctx);
};
