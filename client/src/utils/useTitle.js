import { useEffect } from 'react';

// Унікальний title і description для кожного маршруту (SEO)
export default function useTitle(title, description) {
  useEffect(() => {
    document.title = `${title} | AUTOM`;
    if (description) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    }
  }, [title, description]);
}
