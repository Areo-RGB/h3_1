import React, { useEffect, useState } from 'react';

export default function FussballdeWidget({ id, type }: { id: string; type: string }) {
  const [randomPrefix] = useState(() => Math.random().toString(36).substring(2, 6));
  const iframeName = `${randomPrefix}_fussballde_widget-${id}`;
  const [height, setHeight] = useState(600);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (
        event.data?.type === 'fussballde_widget:resize' &&
        event.data?.iframeName === iframeName
      ) {
        setHeight(event.data.height);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [iframeName]);

  return (
    <iframe
      src={`https://next.fussball.de/widget/${type}/${id}`}
      name={iframeName}
      style={{ width: '100%', height: `${height}px`, border: 'none' }}
      frameBorder="0"
      scrolling="no"
      title={`Fussball.de ${type} Widget`}
    />
  );
}
