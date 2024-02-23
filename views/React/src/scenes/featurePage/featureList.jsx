import FeatureCard from "./featureCard";
import FlexBetween from "../../components/FlexBetween";
import { Grid, IconButton, Box, Typography } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import ReactPlayer from 'react-player/youtube';
import React from 'react';

import { styled, keyframes } from '@mui/system';

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

const FeatureList = ({ movies, category, page, setPage }) => {
  const handlePrevPage = () => {
    setPage((prevPage) => prevPage - 1);
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <Box>
      

      <ShiningText fontSize={"25px"} sx={{  margin: "1rem 1.15rem",fontWeight: "bold" }}>
      {category.toUpperCase()} MOVIES{" "}
    </ShiningText>
      <Grid container spacing={2.25} justifyContent="center">
        {movies.map((movie) => (
          <Grid item key={movie.id}>
            <FeatureCard movie={movie} />
          </Grid>
        ))}
      </Grid>
      <FlexBetween>
        <IconButton
          onClick={handlePrevPage}
          disabled={page === 1}
          sx={{
            padding: "0 0 0 1.5rem",
          }}
        >
          <ArrowBackIos fontSize="30px" sx={{ color: "white" }}></ArrowBackIos>
        </IconButton>
        <Typography
          sx={{
            color: "white",
            fontWeight: "bold",
            fontSize: "1.5rem",
            padding: "0.5rem",
            margin: "1rem 0.5rem",
            border: "hidden",
            borderRadius: "0.5rem ",
          }}
        >
          {page}
        </Typography>
        <IconButton
          onClick={handleNextPage}
          sx={{
            padding: "0 1.5rem 0 0",
          }}
        >
          <ArrowForwardIos sx={{ color: "white" }}></ArrowForwardIos>
        </IconButton>
      </FlexBetween>
      {/* <ReactPlayer
          url={`https://www.youtube.com/watch?v=uTuuz__8gUM`}
          controls={true}
          playing={true}
          loop={true}
          volume={0.1}
          width='0'
          height='0'
        /> */}
    </Box>
  );
};

export default FeatureList;
