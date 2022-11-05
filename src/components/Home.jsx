import React, { useState } from 'react';
import styles from './Home.module.css';
import MediaContainer from './MediaContainer/MediaContainer';
import Button from './Button/Button';
import { Grid, Toolbar, Typography, Card, CardContent, CardActions, FormControl, InputLabel, NativeSelect, FormHelperText } from '@mui/material';
import { muiComponents } from './muiComponentsOverride';

const Home = () => {
    const [workoutState, setWorkoutState] = useState({ workout: '', name: 'hai', });
    
    const handleWorkoutSelect = (event) => {
        const name = event.target.name;
        setWorkoutState({
            ...workoutState,
            [name]: event.target.value,
        });
    };

    return (
        <div className={styles.home}>
            <MediaContainer />
            <Grid container className={styles.gridContainer}>
                <Grid item xs className={styles.gridItem}>
                    <Card sx={muiComponents.cardContainer}>
                        <Toolbar className={styles.toolbar}>
                            <Card sx={muiComponents.cardItem}>
                                <CardContent>
                                    <Typography color="#2B2D42" gutterBottom>Jumping Jacks</Typography>
                                    <Typography variant="h3" component="h3" color="#2B2D42">75</Typography>
                                </CardContent>
                            </Card>
                            <Card sx={muiComponents.cardItem}>
                                <CardContent>
                                    <Typography color="#2B2D42" gutterBottom>Wall-sit</Typography>
                                    <Typography variant="h3" component="h3" color="#2B2D42">200</Typography>
                                </CardContent>
                            </Card>
                            <Card sx={muiComponents.cardItem}>
                                <CardContent>
                                    <Typography color="#2B2D42" gutterBottom>Lunges</Typography>
                                    <Typography variant="h3" component="h3" color="#2B2D42">5</Typography>
                                </CardContent>
                            </Card>
                        </Toolbar>
                    </Card>
                </Grid>
                <Grid item xs className={styles.singleLineContainer}>
                    <Toolbar className={styles.singleLine}>
                        <FormControl required className={styles.muiForm}>
                            <InputLabel htmlFor="age-native-helper" sx={muiComponents.muiInputLabel}>Movement</InputLabel>
                            <NativeSelect
                                value={workoutState.workout}
                                onChange={handleWorkoutSelect}
                                inputProps={{ name: 'workout', id: 'age-native-helper', }}
                                sx={{textAlign:'center'}}
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
            </Grid>
        </div>
    );
}

export default Home;