import { Grid, Toolbar, FormControl, InputLabel, NativeSelect, FormHelperText, CircularProgress } from '@mui/material';
import clsx from 'clsx';
import { muiComponents } from '../muiComponentsOverride';
import Button from '../Button/Button';
import styles from './LiftForm.module.css';

const LiftForm = ({handleWorkoutSelect, workoutState, handlePoseEstimation, isPoseEstimation, dataCollect, handleTrainModel, trainModel }) => {
    return (
        <Grid item xs className={styles.singleLineContainer}>
            <Toolbar className={styles.singleLine}>
                <FormControl required className={styles.muiForm}>
                    <InputLabel htmlFor="age-native-helper" sx={muiComponents.muiInputLabel}>Movement</InputLabel>
                    <NativeSelect
                        value={workoutState.workout}
                        onChange={(e) => handleWorkoutSelect(e)}
                        inputProps={{ name: 'workout', id: 'age-native-helper', }}
                        sx={{ textAlign: 'center' }}
                    >
                        <option aria-label="None" value="" />
                        <option value={'JUMPING_JACKS'}>Jumping Jacks</option>
                        <option value={'WALL_SIT'}>Wall-Sit</option>
                        <option value={'LUNGES'}>Lunges</option>
                    </NativeSelect>
                    <FormHelperText>Select training data type</FormHelperText>
                </FormControl>
                <Button className={clsx(trainModel && styles.disabledButton)} onClick={() => handlePoseEstimation('COLLECT_DATA')} disabled={trainModel}>{isPoseEstimation ? 'Collecting...' : 'Collect Data'}</Button>
                <Button className={clsx(dataCollect && styles.disabledButton)} onClick={() => handleTrainModel()} disabled={dataCollect}>Train Model</Button>
                {trainModel ? <CircularProgress color="secondary"/> : null}
            </Toolbar>
        </Grid>
    );
}

export default LiftForm;
