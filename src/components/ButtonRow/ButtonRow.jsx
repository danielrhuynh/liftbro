import React from 'react';
import styles from './ButtonRow.module.css';
import Button from '../Button/Button';

const ButtonRow = () => {
    return (
        <div className={styles.buttonRow}>
            <Button>Push Ups</Button>
            <Button>Squats</Button>
        </div>
    );
};

export default ButtonRow;