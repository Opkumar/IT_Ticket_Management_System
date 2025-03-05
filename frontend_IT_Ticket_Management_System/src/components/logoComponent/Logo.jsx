import React from 'react';

function Logo({
    className = "", // Default value for className
    ...props
}) {
    return (
        <div className="w-full h-full">
            <div className="w-full h-full">
                <img 
                    src={`/logo.png`} // Correct way to access the logo in the public folder
                    alt="logoImage"
                    className={`rounded-full w-[40px] h-full ${className}`} 
                    {...props} 
                />
            </div>
        </div>
    );
}

export default Logo;
