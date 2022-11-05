import React, { useState } from 'react';
import styles from './Home.module.css';
import MediaContainer from './MediaContainer/MediaContainer';
import LiftCards from './LiftCards/LiftCards';
import { Grid } from '@mui/material';
import LiftForm from './LiftForm/LiftForm';

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
                <LiftCards />
                <LiftForm handleWorkoutSelect={handleWorkoutSelect} workoutState={workoutState}/>
            </Grid>
        </div>
    );
}

export default Home;
