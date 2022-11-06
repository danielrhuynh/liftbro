import React from 'react';
import styles from './Button.module.css';
import clsx from 'clsx';

const Button = ({ children, onClick, className, disabled }) => {
    return (
        <button className={clsx(className, styles.custom_btn)} onClick={onClick} disabled={disabled}>{children}</button>
    );
};

export default Button;
