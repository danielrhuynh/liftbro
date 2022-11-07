import clsx from 'clsx';
import { Grid, Toolbar, FormControl, InputLabel, NativeSelect, FormHelperText, CircularProgress } from '@mui/material';

import { muiComponents } from '../muiComponentsOverride';
import Button from '../Button/Button';
import styles from './LiftForm.module.css';

const LiftForm = ({
    handleWorkoutSelect,
    workoutState,
    handlePoseEstimation,
    isPoseEstimation,
    dataCollect,
    handleTrainModel,
    trainModel,
    isPoseEstimationWorkout,
    resetAll
}) => {
    const workoutDisabled = (dataCollect || trainModel);
    const resetDisabled = (dataCollect || trainModel || isPoseEstimationWorkout);
    const collectDataDisabled = (trainModel || isPoseEstimationWorkout);
    const trainModelDisabled = (dataCollect || isPoseEstimationWorkout);

    return (
        <Grid item xs sx={muiComponents.singleLineContainer}>
            <Toolbar sx={muiComponents.singleLine}>
                <Button
                    onClick={() => handlePoseEstimation('START_WORKOUT')}
                    className={clsx(workoutDisabled && styles.disabledButton, styles.menuButton)}
                    disabled={workoutDisabled}
                >{isPoseEstimationWorkout ? 'Stop' : 'Start'} Workout</Button>
                <Button
                    onClick={() => resetAll()}
                    className={clsx(resetDisabled && styles.disabledButton, styles.menuButton)}
                    disabled={resetDisabled}
                >Reset</Button>
                <FormControl required sx={muiComponents.muiForm}>
                    <InputLabel htmlFor="age-native-helper" sx={muiComponents.muiInputLabel}>Movement</InputLabel>
                    <NativeSelect
                        value={workoutState.workout}
                        onChange={(e) => handleWorkoutSelect(e)}
                        inputProps={{ name: 'workout', id: 'age-native-helper', }}
                        sx={muiComponents.naiveSelect}
                    >
                        <option aria-label="None" value="" />
                        <option value={'JUMPING_JACKS'}>Jumping Jacks</option>
                        <option value={'WALL_SIT'}>Wall-Sit</option>
                        <option value={'LUNGES'}>Lunges</option>
                    </NativeSelect>
                    <FormHelperText>Select training data type</FormHelperText>
                </FormControl>
                <Button
                    onClick={() => handlePoseEstimation('COLLECT_DATA')}
                    className={clsx(collectDataDisabled && styles.disabledButton)}
                    disabled={collectDataDisabled}
                >{isPoseEstimation ? 'Stop' : 'Collect Data'}</Button>
                <Button
                    onClick={() => handleTrainModel()}
                    className={clsx(trainModelDisabled && styles.disabledButton)}
                    disabled={trainModelDisabled}>Train Model</Button>
                {trainModel || isPoseEstimation ? <CircularProgress color="inherit" /> : null}
            </Toolbar>
        </Grid>
    );
}

export default LiftForm;
