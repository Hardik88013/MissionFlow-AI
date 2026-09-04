import { Home } from "./pages/Home";
import { useEffect } from "react";
import { useTheme } from "./hooks/useTheme";

function App() {
  const { theme } = useTheme();

  useEffect(() => {
    // Initial theme set to body by the hook
  }, [theme]);

  return <Home />;
}

export default App;
