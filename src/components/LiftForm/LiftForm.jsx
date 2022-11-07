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
    return (
        <Grid item xs sx={muiComponents.singleLineContainer}>
            <Toolbar sx={muiComponents.singleLine}>
                <Button onClick={() => handlePoseEstimation('START_WORKOUT')} disabled={dataCollect || trainModel} className={clsx((dataCollect || trainModel) && styles.disabledButton, styles.menuButton)}>{isPoseEstimationWorkout ? 'Stop' : 'Start'} Workout</Button>
                <Button onClick={() => resetAll()} disabled={dataCollect || trainModel || isPoseEstimationWorkout} className={clsx((dataCollect || trainModel || isPoseEstimationWorkout) && styles.disabledButton, styles.menuButton)}>Reset</Button>
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
                <Button className={clsx((trainModel || isPoseEstimationWorkout) && styles.disabledButton)} onClick={() => handlePoseEstimation('COLLECT_DATA')} disabled={trainModel || isPoseEstimationWorkout}>{isPoseEstimation ? 'Stop' : 'Collect Data'}</Button>
                <Button className={clsx((dataCollect || isPoseEstimationWorkout) && styles.disabledButton)} onClick={() => handleTrainModel()} disabled={dataCollect || isPoseEstimationWorkout}>Train Model</Button>
                {trainModel || isPoseEstimation ? <CircularProgress color="inherit" /> : null}
            </Toolbar>
        </Grid>
    );
}

export default LiftForm;
