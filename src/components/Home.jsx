import React from 'react';
import MediaContainer from './MediaContainer/MediaContainer';
import ButtonRow from './ButtonRow/ButtonRow';
import styles from './Home.module.css';

const Home = () => {
    return (
        <div className={styles.home}>
            <MediaContainer />
            <ButtonRow />
        </div>
    );
}

export default Home;