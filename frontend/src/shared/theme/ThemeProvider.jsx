// import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

// const ThemeContext = createContext(null);

// export function ThemeProvider({ children }) {
//   const [mode, setMode] = useState(() => localStorage.getItem("theme") || "light");

//   useEffect(() => {
//     const root = document.documentElement;
//     if (mode === "dark") root.classList.add("dark");
//     else root.classList.remove("dark");
//     localStorage.setItem("theme", mode);
//   }, [mode]);

//   const value = useMemo(
//     () => ({ mode, setMode, toggle: () => setMode((m) => (m === "dark" ? "light" : "dark")) }),
//     [mode]
//   );

//   return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
// }

// export function useTheme() {
//   const v = useContext(ThemeContext);
//   if (!v) throw new Error("useTheme must be used inside ThemeProvider");
//   return v;
// }