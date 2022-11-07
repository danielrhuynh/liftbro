import { Snackbar, Alert } from "@mui/material";

const Snackbars = ({
    dataCollectingSB,
    closeDataCollecting,
    dataNotCollectingSB,
    closeDataNotCollecting,
    isWaiting,
    closeWait,
    trainingErrorSB,
    closeSnackbarTrainingError,
    workoutErrorSB,
    closeSnackbarWorkoutError,
    resetSB,
    closeSnackbarReset
}) => {
    return (
        <div>
            <Snackbar open={dataCollectingSB} autoHideDuration={2500} onClose={closeDataCollecting}>
                <Alert onClose={closeDataCollecting} severity="info">
                    Started collecting pose data!
                </Alert>
            </Snackbar>
            <Snackbar open={dataNotCollectingSB} autoHideDuration={2500} onClose={closeDataNotCollecting}>
                <Alert onClose={closeDataNotCollecting} severity="success">
                    Completed collecting pose data!
                </Alert>
            </Snackbar>
            <Snackbar open={isWaiting} autoHideDuration={2500} onClose={closeWait}>
                <Alert onClose={closeWait} severity="error">
                    Please wait!
                </Alert>
            </Snackbar>
            <Snackbar open={trainingErrorSB} autoHideDuration={2000} onClose={closeSnackbarTrainingError}>
                <Alert onClose={closeSnackbarTrainingError} severity="error">
                    Training data is not available!
                </Alert>
            </Snackbar>
            <Snackbar open={workoutErrorSB} autoHideDuration={2000} onClose={closeSnackbarWorkoutError}>
                <Alert onClose={closeSnackbarWorkoutError} severity="error">
                    Model is not available!
                </Alert>
            </Snackbar>
            <Snackbar open={resetSB} autoHideDuration={2000} onClose={closeSnackbarReset}>
                <Alert onClose={closeSnackbarReset} severity="error">
                    Workout and model data reset!
                </Alert>
            </Snackbar>
        </div>
    );
}

export default Snackbars;
