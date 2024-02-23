import React, { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./scenes/homePage";
import LoginPage from "./scenes/loginPage";

import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material";
import { themeSettings } from "./theme";
import MoviePage from "./scenes/moviePage";
import ShowPage from "./scenes/showPage";
import SearchPage from "./scenes/searchPage";
import MyListPage from "./scenes/mylistPage";
import FeaturePage from "./scenes/featurePage";
import TvPage from "./scenes/tvPage";
import ProfilePage from "./scenes/profilePage/NewDesign";
import AdminPage from "./scenes/adminPage";
import Loading from "./components/Loading";
import { setMode, setLogin } from "./states/index.js";
import { useDispatch } from "react-redux";
function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Get the current route path
        const currentPath = window.location.pathname;

        // Skip authentication check if the current route is "/"
        if (currentPath === "/") {
          setLoading(false);
          setAuthenticated(true);
          return;
        }
        if (currentPath === "/auth/google") {
          setLoading(false);
          setAuthenticated(true);
          const response = await fetch(`${VITE_BASE_URL}/login/google`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          });
          const data = await response.json();
          if (data.user) {
            dispatch(
              setLogin({
                user: data.user
              })
            );
          }
          window.location.href = "/home";
          return;
        } else if (currentPath === "/auth/github") {
          setLoading(false);
          setAuthenticated(true);
          const response = await fetch(`${VITE_BASE_URL}/login/github`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          });
          console.log("URL:", `${VITE_BASE_URL}`)
          const data = await response.json();
          if (data.user) {
            dispatch(
              setLogin({
                user: data.user
              })
            );
          }
          window.location.href = "/home";
          return;
        } else if (currentPath === "/auth/facebook") {
          setLoading(false);
          setAuthenticated(true);
          const response = await fetch(`${VITE_BASE_URL}/login/facebook`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          });
          const data = await response.json();
          if (data.user) {
            dispatch(
              setLogin({
                user: data.user
              })
            );
          }
          window.location.href = "/home";
          return;
        } else if (currentPath === "/admin") {
          const response = await fetch("http://localhost:5000/auth/admin", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          });
          const data = await response.json();
          console.log("isAD:", data.isAdmin); // Log the authentication data
          setAuthenticated(data.isAdmin);
          setLoading(false);
          return;
        }

        const response = await fetch(`${VITE_BASE_URL}/auth/info`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await response.json();
        setAuthenticated(data.authenticated);
        setLoading(false);
      } catch (error) {
        console.log("Authentication check error:", error);
        setLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  if (loading) {
    // Show loading state while checking authentication
    return <Loading />;
  }

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/home"
              element={
                authenticated ? (
                  <HomePage />
                ) : (
                  <Navigate to="/" replace state={{ from: "/home" }} />
                )
              }
            />
            <Route
              path="/Feature Movies"
              element={authenticated ? <FeaturePage /> : <Navigate to="/" />}
            />
            <Route
              path="/home/search"
              element={authenticated ? <SearchPage /> : <Navigate to="/" />}
            />
            <Route
            path="/admin"
            element={authenticated ? <AdminPage /> : <Navigate to="/" />}
            >

            </Route>
            <Route
              path="/movie/:movieID"
              element={
                authenticated ? (
                  <MoviePage />
                ) : (
                  <Navigate
                    to="/"
                    replace
                    state={{ from: "/movie/:movieID" }}
                  />
                )
              }
            />
            <Route
              path="/TV Shows"
              element={
                authenticated ? (
                  <TvPage />
                ) : (
                  <Navigate to="/" replace state={{ from: "/TV Shows" }} />
                )
              }
            />
            <Route
              path="/TV Shows/:showID"
              element={
                authenticated ? (
                  <ShowPage />
                ) : (
                  <Navigate
                    to="/"
                    replace
                    state={{ from: "/TV Shows/:showID" }}
                  />
                )
              }
            />
            <Route
              path="/profile/:userID"
              element={
                authenticated ? (
                  <ProfilePage />
                ) : (
                  <Navigate
                    to="/"
                    replace
                    state={{ from: "/profile/:userID" }}
                  />
                )
              }
            />
            <Route
              path="/my list"
              element={authenticated ? <MyListPage /> : <Navigate to="/" />}
            />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
