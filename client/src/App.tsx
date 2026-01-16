import React, { useEffect, useState } from "react";
import "@innovaccer/design-system/css";
import "./App.css";
import CaseList from "./components/CaseList";
import CaseForm from "./components/CaseForm";
import {
  PageHeader,
  Card,
  Button,
  Input,
  Spinner,
  Label,
  Message,
} from "@innovaccer/design-system";
import axios from "axios";
import Upload from "./components/Upload";
import openSocket from "socket.io-client";

const App: React.FC = () => {
  console.log(document.cookie, "document.cookie");

  const [isCheckingLoggedIn, setIsCheckingLoggedIn] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const checkIsLoggedIn = async (): Promise<void> => {
    const response = await axios.get("http://localhost:4000/api/cases/me", {
      withCredentials: true, // Important: Send cookies with request
    });
    if (response.data.success) {
      setIsCheckingLoggedIn(false);
      setCurrPage("cases");

      const socket = openSocket("http://localhost:4000", {
        query: {
          uniqueKey: "cases",
        },
      });

      socket.on("connect", () => {
        console.log("connected to socket with unique key: cases");
      });

      socket.on("caseCreated", (data: any) => {
        console.log("New case created:", data);
        setRefreshKey((oldKey) => oldKey + 1);
      });
    } else {
      setIsCheckingLoggedIn(false);
      setCurrPage("login");
    }
  };

  useEffect(() => {
    checkIsLoggedIn();
  }, []);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [currPage, setCurrPage] = useState<
    "login" | "signup" | "cases" | "upload"
  >("login");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async (
    username: string,
    password: string
  ): Promise<void> => {
    setErrorMessage("");
    const response = await axios.post(
      "http://localhost:4000/api/cases/login",
      {
        username: username,
        password: password,
      },
      {
        withCredentials: true, // Important: Send cookies with request
      }
    );
    if (response.data.success) {
      setCurrPage("cases");
    } else {
      setCurrPage("login");
    }
  };

  const handleSignUp = async (): Promise<void> => {
    setErrorMessage("");
    const response = await axios.post(
      "http://localhost:4000/api/cases/signup",
      {
        username: username,
        password: password,
      }
    );
    console.log(response.data, "response.data");
    if (response.data.success) {
      setUsername("");
      setPassword("");
      setCurrPage("login");
    } else {
      setErrorMessage(response.data.message);
      setCurrPage("signup");
    }
  };

  const handleCaseCreated = (): void => {
    // Trigger refresh of case list
    // setRefreshKey((oldKey) => oldKey + 1);
  };

  const handleLogout = async (): Promise<void> => {
    const response = await axios.post(
      "http://localhost:4000/api/cases/logout",
      {},
      {
        withCredentials: true, // Important: Send cookies with request
      }
    );
    if (response.data.success) {
      setCurrPage("login");
    }
  };

  if (isCheckingLoggedIn) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner size="large" appearance="primary" />
      </div>
    );
  }

  const renderErrorMessage = () => {
    return (
      <Message
        className="form-container"
        appearance="alert"
        title={errorMessage}
      />
    );
  };

  const renderPage = () => {
    if (currPage === "upload") {
      return <Upload />;
    } else if (currPage === "cases") {
      return (
        <div className="container">
          <div className="row">
            <div className="col-4">
              <Card className="case-form-card">
                <CaseForm onCaseCreated={handleCaseCreated} />
              </Card>
            </div>

            <div className="col-8">
              <Card className="case-list-card">
                <CaseList key={refreshKey} />
              </Card>
            </div>
          </div>
        </div>
      );
    } else if (currPage === "login") {
      return (
        <div className="container form-container">
          <div className="form-group">
            <Label>Username</Label>
            <Input
              name="username"
              placeholder="Username"
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUsername(e.target.value)
              }
            />
          </div>
          <div className="form-group">
            <Label>Password</Label>
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
          </div>
          <div className="form-group">
            <Button
              appearance="primary"
              onClick={() => handleLogin(username, password)}
              disabled={!username || !password}
            >
              Login
            </Button>
          </div>
        </div>
      );
    } else if (currPage === "signup") {
      return (
        <div className="container form-container">
          <div className="form-group">
            <Label>Username</Label>
            <Input
              name="username"
              placeholder="Username"
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUsername(e.target.value)
              }
            />
          </div>
          <div className="form-group">
            <Label>Password</Label>
            <Input
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
          </div>
          <div className="form-group">
            <Button
              appearance="primary"
              onClick={handleSignUp}
              disabled={!username || !password}
            >
              Sign Up
            </Button>
          </div>
        </div>
      );
    }
  };
  return (
    <div className="App">
      <PageHeader
        title="Case Management System"
        separator
        actions={
          currPage === "cases" ? (
            <div className="d-flex">
              <Button
                appearance="primary"
                onClick={() => setCurrPage("upload")}
                className="mr-2"
              >
                Upload/View Files
              </Button>
              <Button appearance="alert" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : currPage === "login" ? (
            <Button appearance="primary" onClick={() => setCurrPage("signup")}>
              Sign Up
            </Button>
          ) : currPage === "upload" ? (
            <Button appearance="primary" onClick={() => setCurrPage("cases")}>
              Back
            </Button>
          ) : (
            <Button appearance="primary" onClick={() => setCurrPage("login")}>
              Login
            </Button>
          )
        }
      />
      {errorMessage && renderErrorMessage()}
      {renderPage()}
    </div>
  );
};

export default App;
