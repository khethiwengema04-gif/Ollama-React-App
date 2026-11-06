
import React from "react";

interface LogoProps {
    size?: number;
    showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({
    size = 45,
    showText = true,
}) => {
    return (
        <div className="logo-container">
            <svg
                width={size}
                height={size}
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="KHEPIA AI logo"
            >
                <defs>
                    <linearGradient id="khepia-gradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#A855F7" />
                        <stop offset="50%" stopColor="#6366F1" />
                        <stop offset="100%" stopColor="#22D3EE" />
                    </linearGradient>
                </defs>

                <rect
                    x="5"
                    y="5"
                    width="90"
                    height="90"
                    rx="25"
                    fill="#17172D"
                    stroke="url(#khepia-gradient)"
                    strokeWidth="3"
                />

                {/* K letter symbol */}
                <path
                    d="M30 25 V75 M30 50 L70 25 M43 42 L72 75"
                    stroke="url(#khepia-gradient)"
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />

                {/* AI-inspired glowing dot */}
                <circle
                    cx="74"
                    cy="25"
                    r="5"
                    fill="#22D3EE"
                />
            </svg>

            {showText && (
                <div className="logo-text">
                    <h2>KHEPIA AI</h2>
                    <p>CHAT. CREATE. EXPLORE.</p>
                </div>
            )}
        </div>
    );
};

export default Logo;
