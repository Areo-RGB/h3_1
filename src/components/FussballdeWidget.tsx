import React, { useEffect, useRef } from 'react';

export default function FussballdeWidget({ id, type }: { id: string; type: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Observe child additions inside our widget container.
    // When the script injects an iframe, we immediately remove the "fussballde_widget"
    // class so that any other scripts/executions won't find or modify it again.
    const observer = new MutationObserver(() => {
      const hasIframe = container.querySelector('iframe');
      if (hasIframe) {
        container.classList.remove('fussballde_widget');
        container.classList.add('fussballde_widget_loaded');
      }
    });

    observer.observe(container, { childList: true });

    // Remove any accidental pre-existing duplicate iframes from the container
    const iframes = Array.from(container.querySelectorAll('iframe'));
    if (iframes.length > 1) {
      for (let i = 1; i < iframes.length; i++) {
        iframes[i].remove();
      }
    }

    // Append script dynamically to parse this new widget
    const scriptId = `fussballde-script-${id}-${type}`;
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (script) {
      script.remove();
    }

    script = document.createElement('script');
    script.id = scriptId;
    script.type = 'text/javascript';
    script.src = `https://www.fussball.de/widgets.js?t=${Date.now()}`;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      observer.disconnect();
      if (script) {
        script.remove();
      }
    };
  }, [id, type]);

  return (
    <div
      ref={containerRef}
      id={`fussballde-widget-${id}`}
      className="fussballde_widget w-full"
      data-id={id}
      data-type={type}
    />
  );
}
