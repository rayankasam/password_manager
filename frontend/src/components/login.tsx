import React, { useState } from "react";
import {
  Input,
  Button,
  Heading,
  useColorMode,
  Flex,
  Link,
  UseToastOptions,
  ToastId,
} from "@chakra-ui/react";
import ColorModeSwitch from "./ColorModeSwitch";
import { host } from "../connection";

interface LoginProps {
  setToken: (token: string) => void;
  toast: (options?: UseToastOptions) => ToastId;
}

function Login({ setToken, toast }: LoginProps) {
  const { colorMode, toggleColorMode } = useColorMode();
  const [password, setPassword] = useState("");
  const [passwordTest, setPasswordTest] = useState("");
  const [username, setUsername] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handlePasswordTestChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPasswordTest(event.target.value);
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isRegisterMode && password !== passwordTest) {
      toast({
        title: "Error",
        description: "Passwords don't match",
        status: "error",
      });
      return;
    }

    const endpoint = isRegisterMode ? "/new_user" : "/login";
    const action = isRegisterMode ? "registering" : "logging in";

    try {
      const response = await fetch(host + endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const resData = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: `Successfully ${isRegisterMode ? "registered" : "logged in"}.`,
          status: "success",
        });

        if (!isRegisterMode) {
          setToken(resData.token);
        }
      } else {
        toast({
          title: "Error",
          description: resData.message || `Error ${action}`,
          status: "error",
        });
      }
    } catch (error: unknown) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Something went wrong",
        status: "error",
      });
    }
  };

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      height="100vh"
      p={4}
      bg={colorMode === "dark" ? "gray.800" : "white"}
    >
      <Flex justify="space-between" width="100%" maxWidth="400px" mb={4}>
        <Heading color={colorMode === "dark" ? "white" : "black"}>
          {isRegisterMode ? "Register" : "Login"}
        </Heading>
        <ColorModeSwitch
          colorMode={colorMode}
          toggleColorMode={toggleColorMode}
        />
      </Flex>

      <form
        style={{
          ...formStyle,
          backgroundColor: colorMode === "dark" ? "#2D3748" : "white",
        }}
        onSubmit={handleSubmit}
      >
        <Input
          type="username"
          placeholder="Username"
          value={username}
          onChange={handleUsernameChange}
          required
          style={inputStyle}
          mb={3}
          bg={colorMode === "dark" ? "gray.700" : "white"}
          color={colorMode === "dark" ? "white" : "black"}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          required
          style={inputStyle}
          mb={3}
          bg={colorMode === "dark" ? "gray.700" : "white"}
          color={colorMode === "dark" ? "white" : "black"}
        />
        {isRegisterMode && (
          <Input
            type="password"
            placeholder="Confirm Password"
            value={passwordTest}
            onChange={handlePasswordTestChange}
            required
            style={inputStyle}
            mb={3}
            bg={colorMode === "dark" ? "gray.700" : "white"}
            color={colorMode === "dark" ? "white" : "black"}
          />
        )}

        <Button
          type="submit"
          style={{
            ...buttonStyle,
            ...(isHovered ? buttonHoverStyle : {}),
            marginBottom: "10px",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isRegisterMode ? "Register" : "Login"}
        </Button>

        <Link
          onClick={() => setIsRegisterMode(!isRegisterMode)}
          color={colorMode === "dark" ? "teal.200" : "blue.500"}
          fontWeight="bold"
          mt={3}
        >
          {isRegisterMode
            ? "Already have an account? Login"
            : "Don't have an account? Register"}
        </Link>
      </form>
    </Flex>
  );
}

export default Login;

const formStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  maxWidth: "400px",
  width: "100%",
  margin: "0 auto",
  padding: "30px",
  border: "1px solid #ccc",
  borderRadius: "10px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  backgroundColor: "white",
};

const inputStyle: React.CSSProperties = {
  marginBottom: "15px",
  padding: "12px",
  width: "100%",
  border: "1px solid #ccc",
  borderRadius: "5px",
  boxSizing: "border-box",
};

const buttonStyle: React.CSSProperties = {
  padding: "12px",
  width: "100%",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "16px",
};

const buttonHoverStyle: React.CSSProperties = {
  backgroundColor: "#0056b3",
};
