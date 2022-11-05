import styles from './LiftCards.module.css';
import { Grid, Toolbar, Typography, Card, CardContent } from '@mui/material';
import { muiComponents } from '../muiComponentsOverride';

const LiftCards = () => {
    return (
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
    );
}

export default LiftCards;
