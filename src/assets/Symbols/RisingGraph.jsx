const RisingBarGraphIcon = () => {
  return (
    <div style={{ display: 'inline-block', position: 'relative', width: '24px', height: '24px' }}>
      <div style={{ position: 'absolute', bottom: '0', left: '50%', width: '8px', height: '16px', backgroundColor: 'green' }}></div>
      <div style={{ position: 'absolute', bottom: '8px', left: '50%', width: '16px', height: '8px', backgroundColor: 'green' }}></div>
      <div style={{ position: 'absolute', bottom: '16px', left: '50%', width: '24px', height: '8px', backgroundColor: 'green' }}></div>
    </div>
  );
};

export default RisingBarGraphIcon;
