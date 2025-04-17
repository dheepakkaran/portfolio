import { useEffect } from 'react';

const useKeyboardNavigation = () => {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // Close any open modals
        document.dispatchEvent(new CustomEvent('closeModals'));
      }

      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'k':
            event.preventDefault();
            // Open search
            document.dispatchEvent(new CustomEvent('openSearch'));
            break;
          case '/':
            event.preventDefault();
            // Toggle help menu
            document.dispatchEvent(new CustomEvent('toggleHelp'));
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);
};

export default useKeyboardNavigation;