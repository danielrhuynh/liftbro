import React from 'react';
import styles from './Home.module.css';
import MediaContainer from './MediaContainer/MediaContainer';
import ButtonRow from './ButtonRow/ButtonRow';
import { Grid, AppBar, Toolbar, Typography, Card, CardContent, CardActions, Button } from '@mui/material';
import { muiComponents } from './HomeMUIOverride';

const Home = () => {

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
                                    <Typography variant="h2" component="h2" color="#2B2D42">75</Typography>
                                </CardContent>
                            </Card>
                            <Card sx={muiComponents.cardItem}>
                                <CardContent>
                                    <Typography color="#2B2D42" gutterBottom>Wall-sit</Typography>
                                    <Typography variant="h2" component="h2" color="#2B2D42">200</Typography>
                                </CardContent>
                            </Card>
                            <Card sx={muiComponents.cardItem}>
                                <CardContent>
                                    <Typography color="#2B2D42" gutterBottom>Lunges</Typography>
                                    <Typography variant="h2" component="h2" color="#2B2D42">5</Typography>
                                </CardContent>
                            </Card>
                        </Toolbar>
                    </Card>
                </Grid>
            </Grid>
            <ButtonRow />
        </div>
    );
}

export default Home;