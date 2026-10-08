import React from 'react';

/** Required by the geolocation and network data licences on every threats view. */
export function LabAttribution({ style }: { style?: React.CSSProperties }) {
  const link = { color: 'inherit', textDecoration: 'underline', textUnderlineOffset: 3 };
  return (
    <p className="lab-text-2" style={{ margin: 0, ...style }}>
      IP geolocation by{' '}
      <a href="https://db-ip.com" target="_blank" rel="noopener noreferrer" style={link}>
        DB-IP
      </a>
      , CC BY 4.0 · Network data by{' '}
      <a href="https://ipinfo.io" target="_blank" rel="noopener noreferrer" style={link}>
        IPinfo
      </a>
      , CC BY-SA 4.0
    </p>
  );
}
