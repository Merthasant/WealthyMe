import type { NavigateFunction } from "react-router-dom";

let _navigate: NavigateFunction | null = null;

export const setNavigate = (fn: NavigateFunction) => {
  _navigate = fn;
};

export const navigateTo = (path: string) => {
  if (_navigate) {
    _navigate(path, { replace: true });
  } else {
    window.location.href = path;
  }
};
