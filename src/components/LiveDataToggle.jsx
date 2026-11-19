import React from 'react';

const LiveDataToggle = ({ isLive, setIsLive }) => {
return (
<div className="live-toggle">
<label>
<input
type="checkbox"
checked={isLive}
onChange={(e) => setIsLive(e.target.checked)}
/>
<span className={`toggle-label ${isLive ? 'live' : 'static'}`}>
{isLive ? '🔴 LIVE' : '🟢 STATIC'}
</span>
</label>
</div>
);
};

export default LiveDataToggle;
