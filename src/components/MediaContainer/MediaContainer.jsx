import React, { forwardRef } from 'react';
import styles from './MediaContainer.module.css';
import Webcam from 'react-webcam'

const MediaContainer = forwardRef((props, ref) => {
    const webcamRef = ref.webcamRef;
    const canvasRef = ref.canvasRef;

    return (
        <div className={styles.mediaContainer}>
            <Webcam className={styles.media} ref={webcamRef} />
            <canvas className={styles.canvas} ref={canvasRef} />
        </div>
    );
});

export default MediaContainer;
