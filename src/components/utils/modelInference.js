import * as tf from "@tensorflow/tfjs";

export function runInference(model, data) {
    const pose = tf.tensor2d(data.xs, [1, data.xs.length]);
    const prediction = model.predict(pose);

    const pIndex = tf.argMax(prediction, 1).dataSync();
    const probability = prediction.dataSync()[pIndex];

    let result = null;
    if (probability > 0.99) {
        const classNames = ["JUMPING_JACKS", "PUSHUPS", "SQUATS"];
        console.log(classNames[pIndex] + ', probability: ' + probability);
        result = classNames[pIndex];
    }

    prediction.dispose();

    return result;
}