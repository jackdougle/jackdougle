/** Resolve paths under /public for `<img src>` etc., honoring Vite `base`. */
export function publicUrl(path) {
  const base = import.meta.env.BASE_URL;
  const clean = path.startsWith("/") ? path.slice(1) : path;
  return `${base}${clean}`;
}

export const manga = {
  luffy: publicUrl("manga/luffy.jpg"),
  haise: publicUrl("manga/haise.png"),
};

export const me = {
  portrait: publicUrl("me/me2.jpg"),
};
