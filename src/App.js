import { useState, useEffect } from "react";
import Auth from "./Auth";
import Inventory from "./Inventory";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    document.title = "Inventory Management System";
  }, []);

  return (
    <div>
      {user ? <Inventory user={user} /> : <Auth setUser={setUser} />}
    </div>
  );
}

export default App;
