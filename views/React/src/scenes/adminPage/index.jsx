import React from 'react';
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../navbar";
import { Box, Typography, Grid, Rating, useTheme } from "@mui/material";
import { styled, keyframes } from "@mui/system";
import Image from "mui-image";
import Avatar from "@mui/material/Avatar";

const shineAnimation = keyframes`
  0% {
    background-position: -250px;
  }
  60% {
    background-position: 250px;
  }
  100% {
    background-position: 250px;
  }
`;

const ShiningText = styled(Typography)`
  
  margin: "1rem 1.15rem",
  fontWeight: "bold",
  padding: 12px 48px;
  color: #fff;
  background: linear-gradient(to right, #FF5F9E 0, #fff 10%, #FF5F9E 20%);
  background-position: 0;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${shineAnimation} 3s infinite linear;
  animation-fill-mode: forwards;
  -webkit-text-size-adjust: none;
  font-weight: bold;
  font-family: 'Montserrat', sans-serif;
`;

const AdminPage = () => {
  const [availableMovies, setAvailableMovies] = useState([]);
  const [availableShows, setAvailableShows] = useState([]);
  const [hoveredAvailableMovieId, setHoveredAvailableMovieId] = useState(null);
  const [hoveredAvailableShowId, setHoveredAvailableShowId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAvailablesMovieShow = async () => {
      const fetchAvailablesResponse = await fetch(
        `${VITE_BASE_URL}/admin/availables/get`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      const result = await fetchAvailablesResponse.json();
      const updatedResult = await Promise.all(result.map(async (media) => {
          const availableMediaInfo = await fetchMediaInfo(media.movieID, media.media_type);
          return {...availableMediaInfo, intendedSeason: media.season, media_type: media.media_type};
      }));
      console.log(updatedResult);
      // Filter the response based on media_type and update the state variables accordingly
      const availableMoviesResult = updatedResult.filter(item => item.media_type === "movie");
      const availableShowsResult = updatedResult.filter(item => item.media_type === "tv");

      setAvailableMovies(availableMoviesResult);
      setAvailableShows(availableShowsResult);
    };
    fetchAvailablesMovieShow();
  }, []);

    const fetchMediaInfo = async (mediaID, media_type) => {
      const url = media_type === "movie"
        ? `${VITE_BASE_URL}/movie/detail/${mediaID}`
        : `${VITE_BASE_URL}/movie/tvDetail/${mediaID}`
      
        const fetchMediaResponse = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        })
        const mediaResult = await fetchMediaResponse.json();
        return mediaResult;
    }

  return (
    <Box sx={{ margin: '1rem'}}>
        <Navbar/>
            {/* THESE ARE PLACEHOLDERS FOR INCOMING USER DETAILS */}
            <ShiningText
              fontSize={"30px"}
              sx={{
                fontWeight: "bold",
                borderBottom: "2px solid white",
                paddingBottom: "0.5rem",
              }}
            >
              Available Movies
            </ShiningText>
            <Box
              className="moviePoster"
              sx={{
                padding: "1rem 0",
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              {availableMovies.map((movie) => (
                <Grid
                  title={movie.title}
                  key={movie.id}
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                >
                  <Box
                    onMouseEnter={async () => {
                      setHoveredAvailableMovieId(movie.id);
                      
                    }}
                    onMouseLeave={() => {
                      setHoveredAvailableMovieId(null);      
                    }}
                    sx={{
                      display: "flex",
                      position: "relative",
                      boxShadow: ".4rem .4rem black",
                      border: ".5vmin solid #05060f",
                      transition: "all 0.5s",
                      "&:hover": {
                        cursor: "pointer",
                        boxShadow: "16px 16px 0 rgba(32,33,37,10)",
                        transform: "translate(-2px, -4px)",
                      },

                      "&:active": {
                        cursor: "pointer",
                        transform: "translate(-2px, -4px)",
                        boxShadow: "4px 4px 0  rgba(32,33,37,.70)",
                      },
                    }}
                  >
                    <Image
                      width="175px"
                      height="275px"
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    />
                    {/* <Typography>{movie.title}</Typography> */}
                    {hoveredAvailableMovieId === movie.id && (
                      <Box
                        onClick={() => navigate(`/movie/${movie.id}`)}
                        className="hover"
                        sx={{
                          display: "flex",
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          opacity: 0.8,
                          backgroundColor: "black",
                        }}
                      >
                        <Box
                          className="infoContainer"
                          sx={{
                            opacity: 1,
                            width: "100%",
                            height: "100%",
                            display: "grid",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "1.25rem",
                              fontWeight: "bold",
                            }}
                          >
                            {movie.title}
                          </Typography>
                          {/*      TIME-RENTED ( CALCULATE TO THE TIME EXPIRED )        */}
                          {/* <Typography></Typography> */}
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Grid>
              ))}
            </Box>
            <ShiningText
              fontSize={"30px"}
              sx={{
                fontWeight: "bold",
                borderBottom: "2px solid white",
                paddingBottom: "0.5rem",
              }}
            >
              Available TV Shows
            </ShiningText>
            <Box
              className="moviePoster"
              sx={{
                padding: "1rem 0",
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              {availableShows.map((show) => (
                <Grid
                  title={show.name}
                  key={`${show.id}-${show.intendedSeason}`}
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                >
                  <Box
                    onMouseEnter={async () => {
                      setHoveredAvailableShowId(`${show.id}-${show.intendedSeason}`);
                      
                    }}
                    onMouseLeave={() => {
                      setHoveredAvailableShowId(null);      
                    }}
                    sx={{
                      display: "flex",
                      position: "relative",
                      boxShadow: ".4rem .4rem black",
                      border: ".5vmin solid #05060f",
                      transition: "all 0.5s",
                      "&:hover": {
                        cursor: "pointer",
                        boxShadow: "16px 16px 0 rgba(32,33,37,10)",
                        transform: "translate(-2px, -4px)",
                      },

                      "&:active": {
                        cursor: "pointer",
                        transform: "translate(-2px, -4px)",
                        boxShadow: "4px 4px 0  rgba(32,33,37,.70)",
                      },
                    }}
                  >
                    <Image
                      width="175px"
                      height="275px"
                      src={`https://image.tmdb.org/t/p/w500${
                        show.seasons.length > 1 & show.seasons[0].name === "Specials"
                      ? show.seasons[show.intendedSeason].poster_path
                      : show.poster_path
                  }`}
                    />
                    {/* <Typography>{movie.title}</Typography> */}
                    {hoveredAvailableShowId === `${show.id}-${show.intendedSeason}` && (
                      <Box
                        onClick={() => navigate(`/TV Shows/${show.id}`)}
                        className="hover"
                        sx={{
                          display: "flex",
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          opacity: 0.8,
                          backgroundColor: "black",
                        }}
                      >
                        <Box
                          className="infoContainer"
                          sx={{
                            opacity: 1,
                            width: "100%",
                            height: "100%",
                            display: "grid",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "1.25rem",
                              fontWeight: "bold",
                            }}
                          >
                            {show.name}
                          </Typography>
                          {/*      TIME-RENTED ( CALCULATE TO THE TIME EXPIRED )        */}
                          {/* <Typography></Typography> */}
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Grid>
              ))}
            </Box>
    </Box>
  )
}

export default AdminPage;