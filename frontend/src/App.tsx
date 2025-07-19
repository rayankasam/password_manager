import { useState } from "react";
import "./App.css";
import Passwords from "./components/Passwords.jsx";
import Login from "./components/login.jsx";
import {
  ChakraProvider,
  createStandaloneToast,
} from "@chakra-ui/react";

function App() {
  const [token, setToken] = useState("");
  const { ToastContainer, toast } = createStandaloneToast({
    defaultOptions: {
      position: "bottom-right",
      duration: 3000,
      isClosable: true,
      containerStyle: {
        borderRadius: "10px",
        fontSize: "14px",
        padding: "8px 12px",
        minWidth: "220px",
      },
    },
  });

  return (
    <ChakraProvider>
      <ToastContainer />
      {token !== "" ? (
        <>
          <Passwords token={token} toast={toast} />
        </>
      ) : (
        <Login setToken={setToken} toast={toast} />
      )}
    </ChakraProvider>
  );
}

export default App;
