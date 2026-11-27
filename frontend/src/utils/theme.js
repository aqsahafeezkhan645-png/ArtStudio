
export const THEMES = {
  "Light Pink": {
    primary: "#DB8FA5",
    secondary: "#B85C7A",
    accent: "#F2B9CC",
    light: "#F8DCE6",
    soft: "#FCE7EF",
    background: "#FFF5F8",
    text: "#593D49",
    muted: "#927582"
  },

  "Purple": {
    primary: "#9B72CF",
    secondary: "#7041A6",
    accent: "#C8A2E8",
    light: "#E9DDF7",
    soft: "#F3ECFA",
    background: "#FAF7FD",
    text: "#40334F",
    muted: "#81758F"
  },

  "Blue": {
    primary: "#6699DD",
    secondary: "#3265A8",
    accent: "#B5D2F3",
    light: "#DFECFA",
    soft: "#EDF5FF",
    background: "#F5F9FF",
    text: "#30445D",
    muted: "#71839A"
  },

  "Green": {
    primary: "#72AD8B",
    secondary: "#397B55",
    accent: "#B9DFC8",
    light: "#DFF1E5",
    soft: "#EFF8F1",
    background: "#F7FCF8",
    text: "#344C3C",
    muted: "#788C7E"
  },

  "Peach": {
    primary: "#E99A7B",
    secondary: "#BB684B",
    accent: "#F6C5AF",
    light: "#FBE4D9",
    soft: "#FFF1EA",
    background: "#FFFAF7",
    text: "#624538",
    muted: "#9A7B6D"
  },

  "Teal": {
    primary: "#55AAA5",
    secondary: "#287873",
    accent: "#A9DCD7",
    light: "#D9F0ED",
    soft: "#ECF8F6",
    background: "#F5FCFB",
    text: "#31514F",
    muted: "#728E8B"
  },

  "Golden": {
    primary: "#D6A62E",
    secondary: "#98721C",
    accent: "#F0D58D",
    light: "#F8EDC9",
    soft: "#FCF7E8",
    background: "#FFFCF3",
    text: "#594B2E",
    muted: "#93835F"
  }
};

export const applyTheme = (colors) => {
  const root = document.documentElement;

  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--theme-${key}`, value);
  });
};

export const saveTheme = (name, colors) => {
  localStorage.setItem(
    "artstudio-theme",
    JSON.stringify({ name, colors })
  );

  applyTheme(colors);
};
