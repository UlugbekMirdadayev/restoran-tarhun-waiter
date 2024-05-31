import { useEffect } from 'react';

export function useOutsideClick(ref, callback) {
  const e = 'mousedown',
    d = document;
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }

    d.addEventListener(e, handleClickOutside);
    return () => {
      d.removeEventListener(e, handleClickOutside);
    };
  }, [ref, callback]);
}
