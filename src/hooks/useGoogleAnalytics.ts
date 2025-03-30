import { useEffect } from 'react';

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event',
      targetId: string,
      config?: {
        page_path?: string;
        [key: string]: any;
      }
    ) => void;
  }
}

export const useGoogleAnalytics = () => {
  useEffect(() => {
    // Track page views
    const handleRouteChange = () => {
      window.gtag('config', 'G-9RB6R7XBJQ', {
        page_path: window.location.pathname,
      });
    };

    // Track initial page view
    handleRouteChange();

    // Track command usage
    const trackCommand = (command: string) => {
      window.gtag('event', 'command_executed', {
        command_name: command,
      });
    };

    // Add event listener for command tracking
    window.addEventListener('command_executed', ((event: CustomEvent) => {
      trackCommand(event.detail.command);
    }) as EventListener);

    return () => {
      window.removeEventListener('command_executed', ((event: CustomEvent) => {
        trackCommand(event.detail.command);
      }) as EventListener);
    };
  }, []);

  // Function to track custom events
  const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
    window.gtag('event', eventName, eventParams);
  };

  return { trackEvent };
}; 