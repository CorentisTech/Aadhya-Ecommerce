import React from 'react';

interface ProductVisualProps {
  type: 'saree' | 'dress' | 'bodycon' | 'ethnic' | 'blouse' | 'kurti' | 'lehenga' | 'coin' | 'note';
  color?: string;
  pattern?: 'gold-brocade' | 'floral-embroidery' | 'silk-sheen' | 'plain' | 'antique-metallic' | 'currency-green' | 'rupee-blue';
  className?: string;
  isRotating?: boolean;
}

export const ProductVisual: React.FC<ProductVisualProps> = ({
  type,
  color = '#2C2522',
  pattern = 'plain',
  className = '',
  isRotating = false,
}) => {
  if (type === 'coin') {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <div className="absolute w-[70%] h-[8px] bg-brand-espresso/15 blur-sm rounded-full bottom-2" />
        <img
          src="/coin_image.jpg"
          alt="1957 Indian 1 Rupee Coin"
          className={`w-4/5 h-4/5 object-contain rounded-full shadow-md border border-brand-border/60 ${
            isRotating ? 'animate-spin-coin' : ''
          }`}
          style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
        />
      </div>
    );
  }

  // Pattern gradients and overlays
  const renderPattern = () => {
    switch (pattern) {
      case 'gold-brocade':
        return (
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#B89A67" />
              <stop offset="50%" stopColor="#DFC393" />
              <stop offset="100%" stopColor="#9A7955" />
            </linearGradient>
            <pattern id="brocade" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 0,10 Q 5,5 10,10 T 20,10" fill="none" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.3" />
              <path d="M 10,0 Q 15,5 10,10 T 10,20" fill="none" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.3" />
              <circle cx="10" cy="10" r="1.5" fill="#FFFFFF" opacity="0.4" />
            </pattern>
          </defs>
        );
      case 'floral-embroidery':
        return (
          <defs>
            <linearGradient id="roseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor="#2C2522" />
            </linearGradient>
            <pattern id="floral" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M15,5 C17,10 22,10 20,15 C18,20 12,20 10,15 C8,10 13,10 15,5 Z" fill="none" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.25" />
              <circle cx="15" cy="15" r="1" fill="#FFFFFF" opacity="0.3" />
            </pattern>
          </defs>
        );
      case 'silk-sheen':
        return (
          <defs>
            <linearGradient id="silkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={color} />
              <stop offset="30%" stopColor="#FFFFFF" stopOpacity="0.25" />
              <stop offset="60%" stopColor={color} />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        );
      case 'antique-metallic':
        return (
          <defs>
            <linearGradient id="bronzeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#B89A67" />
              <stop offset="30%" stopColor="#FCFAF7" />
              <stop offset="70%" stopColor="#9A7955" />
              <stop offset="100%" stopColor="#2C2522" />
            </linearGradient>
            <radialGradient id="metallicHighlight" cx="35%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#B89A67" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#2C2522" stopOpacity="0.8" />
            </radialGradient>
          </defs>
        );
      case 'currency-green':
        return (
          <defs>
            <linearGradient id="noteGreen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E2EFE0" />
              <stop offset="50%" stopColor="#B6CBB4" />
              <stop offset="100%" stopColor="#71836C" />
            </linearGradient>
            <pattern id="guilloche" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle cx="5" cy="5" r="4.5" fill="none" stroke="#2C2522" strokeWidth="0.25" opacity="0.08" />
            </pattern>
          </defs>
        );
      case 'rupee-blue':
        return (
          <defs>
            <linearGradient id="noteBlue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E6EFF3" />
              <stop offset="50%" stopColor="#B0C8D6" />
              <stop offset="100%" stopColor="#7B9BB0" />
            </linearGradient>
          </defs>
        );
      default:
        return (
          <defs>
            <linearGradient id="plainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor={color} opacity="0.8" />
            </linearGradient>
          </defs>
        );
    }
  };

  const fillStyle = () => {
    switch (pattern) {
      case 'gold-brocade':
        return 'url(#goldGrad)';
      case 'floral-embroidery':
        return 'url(#roseGrad)';
      case 'silk-sheen':
        return 'url(#silkGrad)';
      case 'antique-metallic':
        return 'url(#bronzeGrad)';
      case 'currency-green':
        return 'url(#noteGreen)';
      case 'rupee-blue':
        return 'url(#noteBlue)';
      default:
        return 'url(#plainGrad)';
    }
  };

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center select-none overflow-hidden ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
    >
      <svg
        viewBox="0 0 200 250"
        className={`w-full h-full max-h-full object-contain transition-all duration-700 ${
          isRotating ? 'animate-spin-coin' : ''
        }`}
        style={{
          filter: 'drop-shadow(0 15px 25px rgba(44, 37, 34, 0.08))',
        }}
      >
        {renderPattern()}

        {/* 1. Saree Slay Visual */}
        {type === 'saree' && (
          <g>
            {/* Background fabric glow */}
            <path
              d="M 60,30 C 90,30 110,60 110,90 C 110,130 50,170 50,220 L 150,220 C 150,180 140,140 130,90 C 120,40 100,20 60,30 Z"
              fill={fillStyle()}
            />
            {/* Drape lines */}
            <path
              d="M 60,30 C 75,50 80,90 70,130 C 60,170 55,200 50,220"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="0.75"
              opacity="0.35"
            />
            <path
              d="M 75,30 C 88,55 92,100 85,145 C 75,185 68,210 65,220"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="0.75"
              opacity="0.35"
            />
            <path
              d="M 90,35 C 102,65 105,115 100,160 C 95,195 88,215 85,220"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="0.75"
              opacity="0.35"
            />
            {/* Brocade overlay if selected */}
            {pattern === 'gold-brocade' && (
              <path
                d="M 60,30 C 90,30 110,60 110,90 C 110,130 50,170 50,220 L 150,220 C 150,180 140,140 130,90 C 120,40 100,20 60,30 Z"
                fill="url(#brocade)"
                opacity="0.5"
              />
            )}
            {pattern === 'floral-embroidery' && (
              <path
                d="M 60,30 C 90,30 110,60 110,90 C 110,130 50,170 50,220 L 150,220 C 150,180 140,140 130,90 C 120,40 100,20 60,30 Z"
                fill="url(#floral)"
                opacity="0.6"
              />
            )}
            {/* Border lines */}
            <path
              d="M 50,220 L 150,220"
              stroke="#E8E1DA"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {pattern === 'gold-brocade' && (
              <path d="M 50,220 L 150,220" stroke="#B89A67" strokeWidth="2" />
            )}
          </g>
        )}

        {/* 2. Cocktail Dress Silhouette */}
        {type === 'dress' && (
          <g>
            <path
              d="M 75,40 C 75,40 85,75 90,90 C 95,105 105,120 105,140 C 105,170 85,190 70,220 L 130,220 C 115,190 105,160 105,140 C 105,120 115,100 120,80 C 120,60 110,40 105,40 Z"
              fill={fillStyle()}
            />
            {/* Silhouette lines */}
            <path
              d="M 75,40 C 85,75 90,90 90,110 C 90,130 80,160 70,220"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="0.75"
              opacity="0.25"
            />
            {pattern === 'silk-sheen' && (
              <path
                d="M 75,40 C 75,40 85,75 90,90 C 95,105 105,120 105,140 C 105,170 85,190 70,220 L 130,220 C 115,190 105,160 105,140 C 105,120 115,100 120,80 C 120,60 110,40 105,40 Z"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="1.5"
                opacity="0.15"
              />
            )}
          </g>
        )}

        {/* 3. Bodycon Visual */}
        {type === 'bodycon' && (
          <g>
            <path
              d="M 80,45 C 80,45 82,70 85,85 C 88,100 95,115 95,135 C 95,160 85,190 82,220 L 118,220 C 115,190 105,160 105,135 C 105,115 112,100 115,85 C 118,70 120,45 120,45 Z"
              fill={fillStyle()}
            />
            <path
              d="M 85,85 C 95,100 95,120 95,135"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="0.5"
              opacity="0.3"
            />
            <path
              d="M 115,85 C 105,100 105,120 105,135"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="0.5"
              opacity="0.3"
            />
          </g>
        )}

        {/* 4. Ethnic Suit Visual */}
        {type === 'ethnic' && (
          <g>
            <path
              d="M 75,40 L 125,40 C 125,60 135,100 145,150 L 155,220 L 45,220 L 55,150 C 65,100 75,60 75,40 Z"
              fill={fillStyle()}
            />
            {/* Dupatta side drape */}
            <path
              d="M 68,40 C 62,70 65,120 60,180 C 58,200 52,215 48,220 Z"
              fill="#C98F91"
              opacity="0.9"
            />
            {/* Golden buttons / patterns */}
            <line x1="100" y1="50" x2="100" y2="90" stroke="#B89A67" strokeWidth="2" strokeDasharray="3,3" />
          </g>
        )}

        {/* 5. Blouse Crop Corset */}
        {type === 'blouse' && (
          <g>
            <path
              d="M 75,80 C 85,85 100,80 100,80 C 100,80 115,85 125,80 L 130,140 C 120,150 100,152 100,152 C 100,152 80,150 70,140 Z"
              fill={fillStyle()}
            />
            {/* Corset stitching lines */}
            <line x1="88" y1="83" x2="84" y2="143" stroke="#FFFFFF" strokeWidth="0.75" opacity="0.4" />
            <line x1="100" y1="80" x2="100" y2="152" stroke="#FFFFFF" strokeWidth="1" opacity="0.5" />
            <line x1="112" y1="83" x2="116" y2="143" stroke="#FFFFFF" strokeWidth="0.75" opacity="0.4" />
          </g>
        )}

        {/* 6. Kurti visual */}
        {type === 'kurti' && (
          <g>
            <path
              d="M 80,45 L 120,45 L 130,110 L 140,210 L 60,210 L 70,110 Z"
              fill={fillStyle()}
            />
            {/* Mandarin Collar slit */}
            <path d="M 100,45 L 100,80" fill="none" stroke="#2C2522" strokeWidth="1.5" />
            <circle cx="100" cy="60" r="1.5" fill="#B89A67" />
            <circle cx="100" cy="70" r="1.5" fill="#B89A67" />
          </g>
        )}

        {/* 7. Lehenga Grand Skirt */}
        {type === 'lehenga' && (
          <g>
            {/* Top */}
            <path d="M 80,50 L 120,50 L 125,85 L 75,85 Z" fill={fillStyle()} />
            {/* Skirt */}
            <path
              d="M 90,95 L 110,95 C 120,140 145,185 165,220 L 35,220 C 55,185 80,140 90,95 Z"
              fill={fillStyle()}
            />
            {/* Gold details / borders */}
            {pattern === 'floral-embroidery' && (
              <path
                d="M 35,220 C 55,185 80,140 90,95 L 110,95 C 120,140 145,185 165,220 Z"
                fill="url(#floral)"
                opacity="0.5"
              />
            )}
            <path
              d="M 35,216 C 55,216 145,216 165,216"
              stroke="#B89A67"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        )}



        {/* 9. Historic Currency Note */}
        {type === 'note' && (
          <g>
            {/* Note Silhouette */}
            <rect x="25" y="65" width="150" height="100" rx="3" fill={fillStyle()} stroke="#E8E1DA" strokeWidth="1" />
            {pattern === 'currency-green' && (
              <rect x="25" y="65" width="150" height="100" rx="3" fill="url(#guilloche)" />
            )}

            {/* Borders */}
            <rect x="30" y="70" width="140" height="90" rx="1.5" fill="none" stroke="#2C2522" strokeWidth="0.5" opacity="0.2" />

            {/* Oval Watermark Medallion */}
            <ellipse cx="60" cy="115" rx="20" ry="25" fill="#FCFAF7" opacity="0.7" stroke="#2C2522" strokeWidth="0.25" strokeDasharray="2,2" />
            {/* Portrait placeholder inside medallion */}
            <path d="M 52,122 C 52,110 68,110 68,122 C 68,128 52,128 52,122 Z" fill="#756E69" opacity="0.2" />

            {/* RBI Header */}
            <text x="100" y="82" fill="#2C2522" fontSize="4.5" fontWeight="bold" textAnchor="middle" letterSpacing="0.5" opacity="0.6">
              RESERVE BANK OF INDIA
            </text>
            <text x="100" y="87" fill="#2C2522" fontSize="3" textAnchor="middle" opacity="0.5">
              GUARANTEED BY THE CENTRAL GOVERNMENT
            </text>

            {/* Center Rupee Value */}
            <rect x="90" y="95" width="20" height="20" fill="#FCFAF7" opacity="0.4" stroke="#2C2522" strokeWidth="0.25" />
            <text x="100" y="109" fill="#2C2522" fontSize="10" fontFamily="serif" fontWeight="bold" textAnchor="middle" opacity="0.65">
              ₹5
            </text>

            {/* Serial Number */}
            <text x="135" y="148" fill="#71836C" fontSize="3.5" fontFamily="monospace" fontWeight="bold" opacity="0.7">
              88A 192045
            </text>
            <text x="35" y="148" fill="#71836C" fontSize="3.5" fontFamily="monospace" fontWeight="bold" opacity="0.7">
              88A 192045
            </text>

            {/* Governor Signature line */}
            <line x1="130" y1="125" x2="155" y2="125" stroke="#2C2522" strokeWidth="0.25" opacity="0.4" />
            <text x="142" y="130" fill="#2C2522" fontSize="2.5" textAnchor="middle" opacity="0.4">
              GOVERNOR
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
