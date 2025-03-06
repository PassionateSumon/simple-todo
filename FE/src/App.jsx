import AppRouter from "./AppRouter";
import { AuthProvider } from "./context/AuthContext";

function App() {
  console.log("here APp")
  return (
    <AuthProvider>
      {console.log("Inside")}
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
