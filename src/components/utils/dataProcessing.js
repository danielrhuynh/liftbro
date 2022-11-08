import * as tf from "@tensorflow/tfjs";

export function processData(rawData) {
    const training_size = Math.round((rawData.length * 80) / 100);

    const rawDatasetShuffled = tf.data.array(rawData).shuffle(10);

    const rawDatasetTraining = rawDatasetShuffled.take(training_size);
    const rawDatasetValidation = rawDatasetShuffled.skip(training_size);

    const convertedDatasetTraining =
        rawDatasetTraining.map(({ xs, ys }) => {
            const labels = [
                ys === "JUMPING_JACKS" ? 1 : 0,
                ys === "PUSHUPS" ? 1 : 0,
                ys === "SQUATS" ? 1 : 0
            ]
            return { xs: Object.values(xs), ys: Object.values(labels) };
        }).batch(30);

    const convertedDatasetValidation =
        rawDatasetValidation.map(({ xs, ys }) => {
            const labels = [
                ys === "JUMPING_JACKS" ? 1 : 0,
                ys === "PUSHUPS" ? 1 : 0,
                ys === "SQUATS" ? 1 : 0
            ]
            return { xs: Object.values(xs), ys: Object.values(labels) };
        }).batch(30);

    const numOfFeatures = 34;
    return [numOfFeatures, convertedDatasetTraining, convertedDatasetValidation];
};
