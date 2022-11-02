import React from 'react';
import styles from './Button.module.css';

const Button = ({ children, onClick }) => {
    return (
        <button className={styles.custom_btn} onClick={onClick}>{children}</button>
    );
};

export default Button;