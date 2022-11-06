import * as tf from "@tensorflow/tfjs";

function buildModel(numOfFeatures) {
    const model = tf.sequential();

    model.add(tf.layers.dense({
        inputShape: [numOfFeatures],
        units: 12,
        activation: 'relu'
    }));
    model.add(tf.layers.dense({
        units: 8,
        activation: 'relu'
    }));
    model.add(tf.layers.dense({
        units: 3,
        activation: 'softmax'
    }));

    model.compile({ optimizer: tf.train.adam(0.001), loss: 'categoricalCrossentropy', metrics: 'accuracy' });

    return model;
};

export async function runTraining(convertedDatasetTraining, convertedDatasetValidation, numOfFeatures) {
    const model = buildModel(numOfFeatures);

    const history = await model.fitDataset(
        convertedDatasetTraining,
        {
            epochs: 100,
            validationData: convertedDatasetValidation,
            callbacks: {
                onEpochEnd: (epoch, logs) => {
                    console.log("Epoch: " + epoch + " Loss: " + logs.loss + " Accuracy: " + logs.acc + " Validation loss: "
                        + logs.val_loss + " Validation accuracy: " + logs.val_acc);
                }
            }
        });

    await model.save('indexeddb://fitness-assistant-model');
    console.log('Model saved');
};
