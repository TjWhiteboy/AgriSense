import React from 'react';
import LeafLogoIcon from './icons/LeafLogoIcon';

const Preloader: React.FC = () => {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'100vh', backgroundColor:'#f8fafc', fontFamily:'Inter, sans-serif' }}>
      <div style={{ position:'relative', width:'96px', height:'96px', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <LeafLogoIcon className="h-20 w-20 text-green-500" />
        <div style={{ position:'absolute', inset:0, borderRadius:'50%', border:'4px solid rgba(34,197,94,0.2)', borderTop:'4px solid #22c55e', animation:'spin 1s linear infinite' }} />
      </div>
      <h1 style={{ fontSize:'1.875rem', fontWeight:'bold', color:'#1f2937', marginTop:'1.5rem', fontFamily:'Manrope, sans-serif' }}>AgriSense</h1>
      <p style={{ color:'#6b7280', marginTop:'0.5rem' }}>Initializing your smart farming assistant...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Preloader;
