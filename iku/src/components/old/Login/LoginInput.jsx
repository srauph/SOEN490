import React from 'react';

import '../../styles/Login.css';

const LoginInput = ({ handleInputChange, value, label, type, name, ariaLabel, count, onEnterDown }) => {

    return(
        <div className='input-container'>
            <label className='login-label' htmlFor={name}>{label}</label>
            <input
                className='login-input'
                value={value}
                onChange={event => handleInputChange(event, count)}
                type={type}
                name={name}
                aria-label={ariaLabel}
                onKeyDown={e => onEnterDown(e)}
                required
            />
        </div>
    )
}

export default LoginInput