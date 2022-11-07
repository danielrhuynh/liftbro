import React from 'react';
import clsx from 'clsx';

import styles from './Button.module.css';

const Button = ({ children, onClick, className, disabled }) => {
    return (
        <button className={clsx(className, styles.custom_btn)} onClick={onClick} disabled={disabled}>{children}</button>
    );
};

export default Button;
