import { useEffect, useState, useRef } from "react";
import { Navigate, useParams, Link, useNavigate } from "react-router-dom";
import Image from "mui-image";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../components/Loading";
import { updateUser } from "../../states";

import {
  Box,
  Grid,
  Button,
  IconButton,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
  Container,
  Breadcrumbs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  CardHeader,
  CardContent,
  Card,
} from "@mui/material";
import ClosedCaptionOffIcon from '@mui/icons-material/ClosedCaptionOff';
import ShoppingCartCheckoutOutlinedIcon from '@mui/icons-material/ShoppingCartCheckoutOutlined';
import ProductionQuantityLimitsOutlinedIcon from '@mui/icons-material/ProductionQuantityLimitsOutlined';
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import VideocamIcon from "@mui/icons-material/Videocam";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import YouTubePlayer from "../trailerPlayer/YoutubeVideo";
import StarIcon from "@mui/icons-material/Star";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Popover from "@mui/material/Popover";
import Navbar from "../navbar";
import ImageTest from "../../assets/images/background.png";
import HdOutlinedIcon from '@mui/icons-material/HdOutlined';
import BuildIcon from '@mui/icons-material/Build';import Snackbar from '@mui/material/Snackbar';
import AssignmentLateOutlinedIcon from '@mui/icons-material/AssignmentLateOutlined';
import {
  Favorite,
  FavoriteBorderRounded,
  FavoriteTwoTone,
} from "@mui/icons-material";
import { setMode } from "../../states";

const MoviePage = () => {
  const [movie, setMovie] = useState(null);
  const [youtubeIDs, setVideoIDS] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [credits, setCredits] = useState(null);
  const [rateDefaultValue, setRateDefaultValue] = useState(0);
  const mainPlayerRef = useRef(null);

  //hovered black name poster
  const [hoveredRecommendationId, setHoveredRecommendationId] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { movieID } = useParams();
  const user = useSelector((state) => state.user);
  const [isFavourited, setIsFavourited] = useState(false);
  const [isRated, setIsRated] = useState(false);
  const [isRented, setIsRented] = useState(false);
  const [rentalInformation, setRentalInformation] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);

  const theme = useTheme();
  //function for popover
  const [popoverOpen, setPopoverOpen] = useState(false);
  const anchorRef = useRef(null);

  //open and close popover
  const handlePopoverOpen = () => {
    setPopoverOpen(true);
  };

  const handlePopoverClose = () => {
    setPopoverOpen(false);
  };

  //open and close dialogue
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleMouseEnterRentButton = () => {
    setIsHovered(true);
  };

  const handleMouseLeaveRentButton = () => {
    setIsHovered(false);
  };

  //snackbar open and close
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const redirectAccount = () => {
    navigate("/profile/" + user._id);
  };

  const favourite = async (userID, movieID) => {
    const requestData = {
      userID: userID,
      movieID: movieID,
      media_type: "movie",
      season: 0,
    };

    const method = isFavourited ? "DELETE" : "POST";
    const url = isFavourited
      ? `${VITE_BASE_URL}/api/favourite/delete` // DELETE endpoint
      : `${VITE_BASE_URL}/api/favourite/insert`; // POST endpoint

    const addFavouriteResponse = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
      credentials: "include",
    });
  };

  const rate = async (userID, movieID, rating) => {
    const requestData = {
      userID: userID,
      movieID: movieID,
      rating: rating,
      media_type: "movie",
      season: 0,
    };

    const method = isRated ? "PUT" : "POST";
    const url = isRated
      ? `${VITE_BASE_URL}/api/rate/update` // PUT endpoint
      : `${VITE_BASE_URL}/api/rate/insert`; // POST endpoint

    const addRatingResponse = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
      credentials: "include",
    });
  };

  const unrate = async (userID, movieID) => {
    const requestData = {
      userID: userID,
      movieID: movieID,
      media_type: "movie",
      season: 0,
    };

    const removeRatingResponse = await fetch(
      `${VITE_BASE_URL}/api/rate/delete`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
        credentials: "include",
      }
    );
  };

  const rent = async (userID, movieID, duration) => {
    const requestData = {
      userID: userID,
      movieID: movieID,
      media_type: "movie",
      Duration: duration,
      season: 0,
    };

    const addRentResponse = await fetch(
      `${VITE_BASE_URL}/api/rent/insert`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
        credentials: 'include'
      }
    );
  };

  const offer = async (movieID) => {
    const requestData = {
      movieID: movieID,
      media_type: "movie",
      season: 0,
    };

    const method = isAvailable ? "DELETE" : "POST";
    const url = isAvailable
      ? `${VITE_BASE_URL}/admin/available/delete` // DELETE endpoint
      : `${VITE_BASE_URL}/admin/available/insert`; // POST endpoint

    const addAvailableResponse = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
      credentials: "include",
    });
  };

  const checkFavorite = async (userID, movieID) => {
    const requestData = {
      userID: userID,
      movieID: movieID,
      media_type: "movie",
      season: 0,
    };

    const url = new URL(`${VITE_BASE_URL}/api/favourite/check`);
    url.search = new URLSearchParams(requestData).toString();

    const checkFavoriteResponse = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",

    });

    const result = await checkFavoriteResponse.json();
    return result.Favourite_return.favorited;
  };

  const checkRated = async (userID, movieID) => {
    const requestData = {
      userID: userID,
      movieID: movieID,
      media_type: "movie",
      season: 0,
    };

    const url = new URL(`${VITE_BASE_URL}/api/rate/check`);
    url.search = new URLSearchParams(requestData).toString();

    const checkRatedResponse = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",

    });

    const result = await checkRatedResponse.json();
    return result;
  };

  const checkRented = async (userID, movieID) => {
    const requestData = {
      userID: userID,
      movieID: movieID,
      media_type: "movie",
      season: 0,
    };

    const url = new URL(`${VITE_BASE_URL}/api/rent/check`);
    url.search = new URLSearchParams(requestData).toString();

    const checkRentedResponse = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",

    });
    const result = await checkRentedResponse.json();
    return result;
  };

  const checkAvailable = async (movieID) => {
    const requestData = {
      movieID: movieID,
      media_type: "movie",
      season: 0,
    };

    const url = new URL(`${VITE_BASE_URL}/api/available/check`);
    url.search = new URLSearchParams(requestData).toString();

    const checkAvailableResponse = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    const result = await checkAvailableResponse.json();
    return result;
  };

  //FETCH MOVIE DETAIL
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(
          `${VITE_BASE_URL}/movie/detail/${movieID}`, {

          credentials: 'include'
        }
        );
        const data = await response.json();
        setMovie(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMovieDetails();
  }, [movieID]);

  //FETCH VIDEO ID
  useEffect(() => {
    const fetchVideoIDs = async () => {
      try {
        const response = await fetch(
          `${VITE_BASE_URL}/movie/trailer/${movieID}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: 'include'
          }
        );
        const data = await response.json();
        setVideoIDS(data.results);
        setSelectedVideo(data.results[0].key);
      } catch (error) {
        console.error(error);
      }
    };
    fetchVideoIDs();
  }, [movieID]);

  //FETCH RECOMMENDATIONS
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch(
          `${VITE_BASE_URL}/movie/recommendations/${movieID}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: 'include'
          }
        );
        const data = await response.json();
        setRecommendations(data.results);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRecommendations();
  }, [movieID]);

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const response = await fetch(
          `${VITE_BASE_URL}/movie/credits/${movieID}`, {
            credentials: "include",
          }
          
        );
        const data = await response.json();
        setCredits(data.cast);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCredits();
  }, [movieID]);

  const fetchInformation = async () => {
    const checkFavouriteResponse = await checkFavorite(user._id, movieID);
    setIsFavourited(checkFavouriteResponse);

    const checkRatedResponse = await checkRated(user._id, movieID);
    setIsRated(checkRatedResponse.Rating_return.Rated);
    setRateDefaultValue(checkRatedResponse.Rating_return.RateValue);

    const checkRentedResponse = await checkRented(user._id, movieID);
    setIsRented(checkRentedResponse.Rental_return.Rented);
    setRentalInformation(checkRentedResponse.Rental_return.Rental_information);

    const checkAvailableResponse = await checkAvailable(movieID);
    setIsAvailable(checkAvailableResponse.Available_return.available);
  };

  useEffect(() => {
    fetchInformation();
  }, [movieID, user._id]);

  const handleFavouriteClick = () => {
    // Call the favourite function with the necessary values here
    favourite(user._id, movieID);
    setIsFavourited(!isFavourited);
  };

  const handleOfferClick = () => {
    offer(movieID);
    setIsAvailable(!isAvailable);
  }

  const handleTransaction = async (value) => {
    try {
      const requestData = {
        balance: value
      }
      const transactionResponse = await fetch(
        `${VITE_BASE_URL}/profile/${user._id}/purchase`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData),
          credentials: 'include'
        })
        .then((response) => response.json())
        .then((data) => {
          const updatedUser = {
            ...user,
            balance: data.balance,
          };
          dispatch(updateUser({ user: updatedUser }));
        })
        .catch((error) => console.error(error));

    } catch (error) {
      console.error(error);
    }
  }

  const handleRateClick = (rateValue) => {
    if (rateValue === null) {
      unrate(user._id, movieID);
      setIsRated(false);
      setRateDefaultValue(0);
      handlePopoverClose();
    } else {
      rate(user._id, movieID, rateValue);
      setIsRated(true);
      setRateDefaultValue(rateValue);
      handlePopoverClose();
    }
  };

  const handleRentClick = async (event) => {
    rent(user._id, movieID, event.duration);
    setIsRented(!isRented);
    handleTransaction(event.price);
    fetchInformation();
    handleClose();
  };

  if (!movie || youtubeIDs === null) {
    return <Loading />;
  }
    return (
    <div>
      <Navbar></Navbar>
      <Container maxWidth="lg">
        <Breadcrumbs
          aria-label="breadcrumb"
          sx={{ margin: "4px", padding: "4px" }}
        >
          <Link
            style={{ color: "white", textDecoration: "none" }}
            onClick={() => {
              window.location.href = "/Home";
            }}
          >
            <Typography sx={{ "&:hover": { textDecoration: 'underline' } }}><strong>Home</strong></Typography>
          </Link>

          <Link
            style={{ color: "white", textDecoration: "none" }}
            onClick={() => {
              window.location.href = "/Feature Movies";
            }}
          >
            <Typography sx={{ "&:hover": { textDecoration: 'underline' } }}><strong>Movies</strong></Typography>
          </Link>
          <Typography fontWeight="lighter">
          <strong>{movie.title}</strong>
          </Typography>
        </Breadcrumbs>

        {youtubeIDs !== null && youtubeIDs.length > 0 ? (
          <>
            <div ref={mainPlayerRef}>
              <YouTubePlayer
                videoId={selectedVideo}
                width={800}
                height={600}
                thumbnail={false}
              />
            </div>
          </>
        ) : (
          <></>
        )}

        <Grid container spacing={3} padding="20px">
          <Grid item xs={12} sm={6} md={3} lg={3}>
            <Box sx={{ position: "relative", display: "inline-flex" }}>
              <Box
                sx={{
                  borderRadius: "10px",
                  boxShadow: "0px 0px 30px rgba(255, 255, 255, 0.5)",
                }}
              >
                <Image
                  sx={{ borderRadius: "10px" }}
                  src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "https://via.placeholder.com/150x250.png?text=No+Image"}
                  alt={`${movie.title} poster`}
                />
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={9} lg={9}>
            <Typography sx={{ fontSize: 40, fontWeight: "medium" }}>
              {movie.title}
            </Typography>
            <HdOutlinedIcon sx={{ fontSize: "35px" }}></HdOutlinedIcon>
            <ClosedCaptionOffIcon sx={{ fontSize: "35px" }}></ClosedCaptionOffIcon>
            <Stack direction="row" spacing={3} padding="4px">
              <Avatar sx={{ "&:hover": { cursor: 'pointer' } }} onClick={handleFavouriteClick}>
                {!isFavourited ? (
                  <FavoriteBorderOutlinedIcon sx={{ fontSize: "23px" }} />
                ) : (
                  <FavoriteOutlinedIcon
                    sx={{ fontSize: "23px", color: theme.palette.primary.main }}
                  />
                )}
              </Avatar>

              <Avatar sx={{ "&:hover": { cursor: 'pointer' } }} ref={anchorRef} onClick={handlePopoverOpen}>
                {!isRated ? (
                  <StarIcon sx={{ fontSize: "23px" }} />
                ) : (
                  <StarIcon sx={{ fontSize: "23px", color: "yellow" }} />
                )}
              </Avatar>
              {user.isAdmin ? (
                <Avatar sx={{ "&:hover": { cursor: 'pointer' } }} ref={anchorRef} onClick={handleOfferClick}>
                  {!isAvailable ? (
                    <BuildIcon sx={{fontSize: "20px", color: theme.palette.primary.main}}></BuildIcon>
                  ) : (
                    <BuildIcon sx={{fontSize: "20px", color: "#01B636"}}></BuildIcon>
                  )}
              </Avatar>
              ) : (
                <div></div>
              )
              }
              
            </Stack>

            <Popover
              open={popoverOpen}
              anchorEl={anchorRef.current}
              onClose={handlePopoverClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
            >
              <Rating
                name="half-rating"
                precision={0.5}
                value={rateDefaultValue}
                onChange={(event, rateValue) => handleRateClick(rateValue)}
                sx={{ fontSize: "30px" }}
              ></Rating>
            </Popover>

            <Typography padding="4px">
              <strong>Overview:</strong> {movie.overview}
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography padding="4px">
                  <strong>Release Date:</strong> {movie.release_date}
                </Typography>
                <Typography padding="4px">
                  <strong>Production:</strong>{" "}
                  {movie.production_companies.map((g) => g.name).join(", ")}
                </Typography>
                <Typography padding="4px">
                  <strong>Cast:</strong>{" "}
                  {credits
                    ?.slice(0, 5)
                    ?.map((g) => g.name)
                    ?.join(", ")}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography padding="4px">
                  <strong>Duration:</strong> {movie.runtime} min
                </Typography>
                <Typography padding="4px">
                  <strong>Country:</strong>{" "}
                  {movie.production_countries.map((g) => g.name).join(", ")}
                </Typography>
                <Typography padding="4px">
                  <strong>Genre:</strong>{" "}
                  {movie.genres.map((g) => g.name).join(", ")}
                </Typography>
              </Grid>
            </Grid>

            <Button
              variant="contained"
              onClick={handleOpen}
              padding="4px"
              onMouseEnter={handleMouseEnterRentButton}
              onMouseLeave={handleMouseLeaveRentButton}
              sx={{ width: "275px" }}
              disabled={!isAvailable}
            >
              { isAvailable ?
              (!isRented ? (
                <AddShoppingCartOutlinedIcon></AddShoppingCartOutlinedIcon>
              ) : (
                rentalInformation ? (
                  rentalInformation.rentalExpireDate > new Date().toISOString() ? (
                    !isHovered ? (
                      <ShoppingCartOutlinedIcon></ShoppingCartOutlinedIcon>
                    ) : (
                      <ShoppingCartCheckoutOutlinedIcon></ShoppingCartCheckoutOutlinedIcon>
                    )
                  ) : (
                    !isHovered ? (
                      <ProductionQuantityLimitsOutlinedIcon></ProductionQuantityLimitsOutlinedIcon>
                    ) : (
                      <AddShoppingCartOutlinedIcon></AddShoppingCartOutlinedIcon>
                    )
                  )
                ) : (
                  <div></div>
                )
              )) : (
                <AssignmentLateOutlinedIcon></AssignmentLateOutlinedIcon>
              )}

              
              { isAvailable ? 
              (!isRented ? (
                <strong>First-Time Rent</strong>
              ) : (
                rentalInformation ? (
                  rentalInformation.rentalExpireDate > new Date().toISOString() ? (
                    !isHovered ? (
                      <strong>Already Rented till {rentalInformation.rentalExpireDate.substring(0, 10)}</strong>
                    ) : (
                      <strong>Extend Rental</strong>

                    )
                  ) : (
                    !isHovered ? (
                      <strong>Rental Expired since {rentalInformation.rentalExpireDate.substring(0, 10)}</strong>
                    ) : (
                      <strong>Rent Again</strong>
                    )
                  )
                ) : (
                  <div>No information</div>
                )
              )) : (
                <strong>Currently not available</strong>
              )}
            </Button>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth='md'>
              
                <DialogContent sx={{ backgroundImage: `url(${ImageTest})`, backgroundSize: '100% 100%', backgroundPosition: 'center' }}>
                  <Container sx={{ height: '100%' }} maxWidth="lg">
                    <Box py={6} textAlign="center" display="flex">
                      <Box mb={3}>
                        <Container maxWidth="lg">
                        <Typography variant="h2" component="h2">
                            <strong>Pricing Plan</strong>
                        </Typography>

                        </Container>
                      </Box>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                          <Card variant="outlined">
                            <CardHeader title={<Typography variant="h4" >1-Day Plan</Typography>}></CardHeader>
                            <CardContent>
                              <Box px={1}>
                                <Typography
                                  variant="h3"
                                  component="h2"
                                  gutterBottom={true}
                                >
                                  19.99 SmashDong
                                </Typography>
                              </Box>
                              <Button
                                variant="contained"
                                onClick={() => handleRentClick({ duration: 1, price: -19.99 })}
                                disabled={user.balance < 19.99}
                              >
                                Smash
                              </Button>
                            </CardContent>
                          </Card>
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <Card variant="outlined">
                            <CardHeader title={<Typography variant="h4" >1-Week Plan</Typography>}></CardHeader>
                            <CardContent>
                              <Box px={1}>
                                <Typography
                                  variant="h3"
                                  component="h2"
                                  gutterBottom={true}
                                >
                                  129.99 SmashDong
                                </Typography>
                              </Box>
                              <Button
                                variant="contained"
                                onClick={() => handleRentClick({ duration: 7, price: -129.99 })}
                                disabled={user.balance < 129.99}
                              >
                                Smash
                              </Button>
                            </CardContent>
                          </Card>
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <Card variant="outlined">
                            <CardHeader title={<Typography variant="h4" >1-Month Plan</Typography>}></CardHeader>
                            <CardContent>
                              <Box px={1}>
                                <Typography
                                  variant="h3"
                                  component="h2"
                                  gutterBottom={true}
                                >
                                  499.99 SmashDong
                                </Typography>
                              </Box>
                              <Button
                                variant="contained"
                                onClick={() => handleRentClick({ duration: 30, price: -499.99 })}
                                disabled={user.balance < 499.99}
                              >
                                Smash
                              </Button>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                    </Box>
                  </Container>
                </DialogContent>
              <DialogActions>
                <Button variant="contained" onClick={handleClose}>
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>
        </Grid>
        {/* List of videos */}
        {youtubeIDs !== null && youtubeIDs.length > 0 ? (
          <div>
            <Box>
            <Typography variant="h3">
              <strong>Other Trailer:</strong>
            </Typography>
              <Box sx={{ overflowX: "auto" }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    overflowY: "hidden",
                  }}
                >
                  {youtubeIDs.map((video) => (
                    <Grid
                      item
                      key={video.key}
                      onClick={() => {
                        setSelectedVideo(video.key);
                        mainPlayerRef.current.scrollIntoView({
                          behavior: "smooth",
                        });
                      }}
                    >
                      <img
                        src={`https://img.youtube.com/vi/${video.key}/0.jpg`}
                        alt="Thumbnail"
                        width={356}
                        height={220}
                      />
                    </Grid>
                  ))}
                </Box>
              </Box>
            </Box>
          </div>
        ) : (
          <></>
        )}
        <Box sx={{ paddingTop: "20px" }}>
          {recommendations && (
            <Box>
              <Typography variant="h3" sx={{ pb: 1 }}>
                <strong>You may also like:</strong>
              </Typography>
              <Grid container spacing={2}>
                {recommendations.map((recommendation) => (
                  <Grid item key={recommendation.id}>
                    <Box
                      onMouseEnter={() => { setHoveredRecommendationId(recommendation.id) }}
                      onMouseLeave={() => { setHoveredRecommendationId(null) }}
                      sx={{
                        position: 'relative',
                        display: 'flex',
                        "&:hover": {
                          cursor: 'pointer',
                          boxShadow: "0px 0px 30px rgba(255, 255, 255, 0.5)",
                        }
                      }}
                    >
                      <Image
                        width="175px"
                        height="275px"
                        src={
                          recommendation.poster_path
                            ? `https://image.tmdb.org/t/p/w500${recommendation.poster_path}`
                            : "https://via.placeholder.com/150x250.png?text=No+Image"
                        }
                        alt={`${recommendation.title} poster`}
                      />
                      {hoveredRecommendationId === recommendation.id && (
                        <Box
                          onClick={() => {
                            navigate(`/movie/${recommendation.id}`);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="hover" sx={{
                            display: 'flex',
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            opacity: 0.8,
                            backgroundColor: 'black',
                          }}>
                          <Box
                            className="infoContainer" sx={{
                              width: '100%',
                              height: '100%',
                              display: 'grid',
                              alignItems: 'center',
                              justifyContent: 'center'

                            }}>
                            <Typography sx={{
                              fontSize: '1.25rem',
                              fontWeight: 'bold',

                            }}>{recommendation.title}</Typography>
                          </Box>

                        </Box>
                      )}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Box>
      </Container>
      <Box
        sx={{
          height: 70,
        }}
      ></Box>
    </div>
  );
};

export default MoviePage;

/* API DOCUMENTATION
For Movie:
  <Typography>Title: {movie.title}</Typography>
  <Typography>Overview: {movie.overview}</Typography>
  <Typography>Adult: {movie.adult.toString()}</Typography>
  <Typography>Release Date: {movie.release_date}</Typography>
  <Typography>Id: {movie.id}</Typography>
  <Typography>Original Title: {movie.original_title}</Typography>
  <Typography>Original Language: {movie.original_language}</Typography>
  <Typography>Popularity: {movie.popularity}</Typography>
  <Typography>Vote Count: {movie.vote_count}</Typography>
  <Typography>Vote Average: {movie.vote_average}</Typography>


For Recomendation is the same as movie.
Example {recommedation.title}





*/
