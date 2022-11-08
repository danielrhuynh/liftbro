import { Toolbar, Typography, Card, CardContent } from '@mui/material';
import { muiComponents } from '../muiComponentsOverride';

const LiftCards = ({ jumpingJackCount, pushupCount, squatCount }) => {
    return (
            <Card sx={muiComponents.cardContainer}>
                <Toolbar sx={muiComponents.toolbar}>
                    <Card sx={muiComponents.cardItem}>
                        <CardContent>
                            <Typography color="#2B2D42" gutterBottom>Jumping Jacks</Typography>
                            <Typography variant="h3" component="h3" color="#2B2D42">{jumpingJackCount} s.</Typography>
                        </CardContent>
                    </Card>
                    <Card sx={muiComponents.cardItem}>
                        <CardContent>
                            <Typography color="#2B2D42" gutterBottom>Pushups</Typography>
                            <Typography variant="h3" component="h3" color="#2B2D42">{pushupCount} s.</Typography>
                        </CardContent>
                    </Card>
                    <Card sx={muiComponents.cardItem}>
                        <CardContent>
                            <Typography color="#2B2D42" gutterBottom>Squats</Typography>
                            <Typography variant="h3" component="h3" color="#2B2D42">{squatCount} s.</Typography>
                        </CardContent>
                    </Card>
                </Toolbar>
            </Card>
    );
}

export default LiftCards;
