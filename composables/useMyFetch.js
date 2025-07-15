import { ref } from 'vue';

export const BASE_URL =
  process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001/api';

export default function useMyFetch() {
  const error = ref(null);
  const loading = ref(false);

  const myFetch = async (url, options = {}) => {
    loading.value = true;
    error.value = null;

    try {
      const res = await fetch(`${BASE_URL}${url}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          cookies: document.cookie,
          ...options.headers,
        },
        credentials: 'include',
      });

      if (res.status === 401) {
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      } else if (!res.ok) {
        const message = (await res.json()).message || 'Failed to fetch data';
        throw new Error(message);
      }

      return res.json();
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return { myFetch, error, loading };
}

  // example of how to use in POST
  // const { myFetch, error, loading } = useMyFetch();

  // const handleLogin = async (email, password) => {
  //   const res = await myFetch('/login', {
  //     method: 'POST',
  //     body: JSON.stringify({ email, password }),
  //   });

  //   if (res) {
  //     console.log(res);
  //   }
  // };
