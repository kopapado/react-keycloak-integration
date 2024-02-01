import Keycloak from "keycloak-js";
import { useEffect } from 'react';
import './App.css';
import { Routes, Route, useNavigate } from "react-router-dom";
const kcConfig = {
  "url": "http://localhost:8180/",
  "realm": "quickstart",
  "clientId": "webapp-client"
}
function App() {
  return (
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="protected" element={<Protected />} />
          </Routes>
        </header>
      </div>
  );
}
function Home() {
  useEffect(() => {
    const keycloak = new Keycloak(kcConfig);
    keycloak
        .init({
          checkLoginIframe: false,
        })
        .then(async (authenticated) => {
          if (authenticated) {
            try {
              localStorage.setItem("kc_token", keycloak.token);
              localStorage.setItem("kc_refreshToken", keycloak.refreshToken);
            } catch (error) {
              console.log(error);
            }
          }
        });
  }, [])
  return (
      <>
        <button type="button" style={{
          background: "rgb(248 250 252)",
          padding: "8px 20px",
          fontSize: "18px",
          borderRadius: "5px",
          fontWeight: "500",
          cursor: "pointer",
        }} onClick={() => {
          const keycloak = new Keycloak(kcConfig);
          keycloak.init({
            checkLoginIframe: false,
          });
          keycloak.login();
        }}>
          Login with KeyCloak
        </button>
      </>
  )
}
function Protected() {
  const navigate = useNavigate();

  useEffect(() => {
    const keycloak = new Keycloak(kcConfig);
    const token = localStorage.getItem("kc_token");
    const refreshToken = localStorage.getItem("kc_refreshToken");
    keycloak
        .init({
          checkLoginIframe: false,
          token,
          refreshToken,
        })
        .then(async (authenticated) => {
          if (authenticated) {
            console.log("AUTHENTICATED")
          }
        }).catch((error) => {
      navigate("/");
    });
  }, [navigate]);

  return (
      <>
        <h1>
          User Authenticated
        </h1>
      </>
  );
}
export default App;
