// src/components/AuthRouter.tsx
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginScreen from "../auth/LoginScreen";
import MainApp from "./MainApp";
import StationSelector from "../components/StationSelector";

const AuthRouter: React.FC = () => {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [station, setStation] = useState<{ id: number; name: string; location: string } | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const stationData = localStorage.getItem("station");

    if (userData) setUser(JSON.parse(userData));
    if (stationData) setStation(JSON.parse(stationData));
  }, []);

  const handleLoginSuccess = (user: { name: string }) => {
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  const handleLogoutUser = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const handleStationSet = () => {
    const stationData = localStorage.getItem("station");
    if (stationData) setStation(JSON.parse(stationData));
  };

  const handleLogoutStation = () => {
    localStorage.removeItem("station");
    localStorage.removeItem("user");
    setStation(null);
    setUser(null);
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/station" />} />

      <Route
        path="/station"
        element={
          station ? (
            <Navigate to={user ? "/app" : "/login"} />
          ) : (
            <StationSelector onStart={handleStationSet} />
          )
        }
      />

      <Route
        path="/login"
        element={
          !station ? (
            <Navigate to="/station" />
          ) : user ? (
            <Navigate to="/app" />
          ) : (
            <LoginScreen
              station={station}
              onLoginSuccess={handleLoginSuccess}
              onStationLogout={handleLogoutStation}
              redirectTo="/app"
            />
          )
        }
      />

      <Route
        path="/app"
        element={
          !station ? (
            <Navigate to="/station" />
          ) : !user ? (
            <Navigate to="/login" />
          ) : (
            <MainApp
              onUserLogout={handleLogoutUser}
              onStationLogout={handleLogoutStation}
            />
          )
        }
      />
    </Routes>
  );
};

export default AuthRouter;
