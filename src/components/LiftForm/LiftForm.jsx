import { Grid, Toolbar, Typography, Card, CardContent, CardActions, FormControl, InputLabel, NativeSelect, FormHelperText } from '@mui/material';
import { muiComponents } from '../muiComponentsOverride';
import Button from '../Button/Button';
import styles from './LiftForm.module.css';

const LiftForm = (handleWorkoutSelect, workoutState) => {
    return (
        <Grid item xs className={styles.singleLineContainer}>
            <Toolbar className={styles.singleLine}>
                <FormControl required className={styles.muiForm}>
                    <InputLabel htmlFor="age-native-helper" sx={muiComponents.muiInputLabel}>Movement</InputLabel>
                    <NativeSelect
                        value={workoutState.workout}
                        onChange={() => handleWorkoutSelect}
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
                <Button variant="contained" >Collect Data</Button>
                <Button variant="contained">Train Model</Button>
            </Toolbar>
        </Grid>
    );
}

export default LiftForm;
