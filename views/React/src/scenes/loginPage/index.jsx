import { useState, useEffect } from "react";
import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { styled } from "@mui/system";

import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import PhotoOutlinedIcon from "@mui/icons-material/PhotoOutlined";
import AttachEmailOutlinedIcon from "@mui/icons-material/AttachEmailOutlined";
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControlLabel,
  Container,
  Checkbox,
  Stack,
  Paper,
  Grid,
  IconButton,
} from "@mui/material";

import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import TwitterIcon from "@mui/icons-material/Twitter";
import AppRegistrationTwoToneIcon from "@mui/icons-material/AppRegistrationTwoTone";
import LoginIcon from "@mui/icons-material/Login";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Image from "../../assets/images/background.png";
import Card from "../../assets/images/SmashBruh.png";
import axios from "axios";

import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setMode, setLogin } from "../../states";
import Dropzone from "react-dropzone";
import FlexBetween from "../../components/FlexBetween";

const StyledTabBar = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "70%",
  left: "31.4%",
  transform: "translateX(-50%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
  

  "& #tab-bar": {
    display: "flex",
    transform: "scale(1)",
    width: "380px",
    height: "130px", // Update the height to 100%
   
    "& .tab": {
      flexGrow: 1,
      position: "relative",
      overflow: "hidden",
      cursor: "pointer",
      height: "100%",

      "&.active": {
        "& > div:first-child": {
          backgroundColor: "#E90064",
          stroke: "#E90064",
          fill: "#E90064",
        },
        "& > div:last-child": {
          backgroundColor: "#E90064",
          stroke: "#060047",
          fill: theme.palette.common.white,
        },
      },

      "&:not(.active)": {
        "& > div:first-child": {
          backgroundColor: theme.palette.text.primary,
          stroke: "#B3005E",
          fill: theme.palette.common.white,
        },
        "& > div:last-child": {
          backgroundColor: theme.palette.common.white,
          stroke: "black",
          fill: "#B3005E",
        },
      },

      "& > div": {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: 0, // Update the top position to 0
        left: 0,
        right: 0,
        bottom: 0, // Add bottom position to 0

        "& svg": {
          width: "32px",
          height: "32px",
        },
      },
    },

    "&:active": {
      transform: "scale(0.95)",
    },
  },
}));
const RegisterSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
});

const PictureSchema = yup.object().shape({
  picture: yup.string().required("Profile picture is required"),
});

const AccountSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

const CombineRegisterSchema = yup.object().shape({
  ...RegisterSchema.fields,
  ...PictureSchema.fields,
  ...AccountSchema.fields,
});

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("invalid email")
    .required("required"),
  password: yup.string().required("required"),
});

const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-input": {
            color: "black",
          },
        },
      },
    },
  },
});

const LoginPage = () => {
  const [pageType, setPageType] = useState("login");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLogin = pageType === "login";
  const isRegister = pageType === "register";
  const picRegister = pageType === "picRegister";
  const newAcc = pageType === "newAcc";
  const register = async (values, onSubmitProps) => {
    // this allows us to send form info with image
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }
    formData.append("picturePath", values.picture.name);

    const savedUserResponse = await fetch(`${VITE_BASE_URL}/auth/register`, {
      method: "POST",
      body: formData,
    });
    const savedUser = await savedUserResponse.json();
    onSubmitProps.resetForm();

    if (savedUser) {
      setPageType("login");
    }
  };

  const login = async (values, onSubmitProps) => {
    const loggedInResponse = await fetch(`${VITE_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
      credentials: "include",
    });
    const loggedIn = await loggedInResponse.json();
    onSubmitProps.resetForm();
    if (loggedIn) {
      dispatch(
        setLogin({
          user: loggedIn.user,
        })
      );
      navigate("/home");
    }
  };

  const google = () => {
    window.open(`${VITE_BASE_URL}/auth/google`, "_self");
  };

  const facebook = () => {
    window.open(`${VITE_BASE_URL}/auth/facebook`, "_self");
  };

  const github = () => {
    window.open(`${VITE_BASE_URL}/auth/github`, "_self");
  };

  const {
    values,
    isSubmitting,
    touched,
    errors,
    handleChange,
    handleBlur,
    setFieldValue,
    resetForm,
    handleSubmit,
  } = useFormik({
    onSubmit: async (values, onSubmitProps) => {
      if (isLogin) await login(values, onSubmitProps);
      if (!isLogin) await register(values, onSubmitProps);
    },
    initialValues: isLogin
      ? { email: "", password: "" }
      : { firstName: "", lastName: "", email: "", password: "", picture: "" },
    validationSchema: isLogin ? loginSchema : CombineRegisterSchema,
  });

  console.log(values);
  console.log(errors);

  return (
    <form onSubmit={handleSubmit}>
      <Container
        maxWidth={false}
        sx={{
          backgroundImage: `url(${Image})`,
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Container>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            
            
          >
            <Grid container justifyContent="center" display="flex">
              <CssBaseline />

              <Grid
                item
                xs={12}
                sm={8}
                md={5}
                component={Paper}
                elevation={6}
                square
                sx={{
                  height: "100%",
                  backgroundColor: "whitesmoke",
                  opacity: "0.9",
                  
                }}
                color="black"
              >
                <Box
                  sx={{
                    height: "100%",
                    
                    my: 10,
                    mx: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Stack direction="row" spacing={0} justifyContent="center">
                    <Typography style={{ color: "#B3005E" }} fontSize={40}>
                      Smash
                    </Typography>

                    <Typography style={{ color: "#060047" }} fontSize={40}>
                      Bruh
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={8} justifyContent="center">
                    <Button
                      startIcon={<LoginIcon />}
                      variant="text"
                      style={{
                        maxWidth: "200px",
                        maxHeight: "50px",
                        minWidth: "30px",
                        minHeight: "30px",
                      }}
                      onClick={() => {
                        setPageType("login");
                        resetForm();
                      }}
                      sx={{
                        height: 70,
                        color: "#B3005E",
                      }}
                    >
                      {isLogin ? (
                        <Typography
                          sx={{
                            color: "#B3005E",
                            textDecoration: "underline",
                            "&:hover": {
                              textDecoration: "underline black",
                            },
                          }}
                          display="inline"
                          style={{ color: "#B3005E" }}
                          fontSize={20}
                        >
                          Sign in
                        </Typography>
                      ) : (
                        <Typography
                          sx={{
                            color: "#B3005E",

                            "&:hover": {
                              textDecoration: "underline black",
                            },
                          }}
                          display="inline"
                          style={{ color: "#B3005E" }}
                          fontSize={20}
                        >
                          Sign in
                        </Typography>
                      )}
                    </Button>

                    <Button
                      startIcon={<AppRegistrationTwoToneIcon />}
                      variant="text"
                      style={{
                        maxWidth: "200px",
                        maxHeight: "50px",
                        minWidth: "30px",
                        minHeight: "30px",
                      }}
                      onClick={() => {
                        setPageType("register");
                        resetForm();
                      }}
                      sx={{
                        height: 70,
                        color: "#B3005E",
                        "&:hover": {
                          backgroundColor: "whitesmoke",
                          color: "black",
                        },
                      }}
                    >
                      {isLogin ? (
                        <Typography
                          sx={{
                            color: "#B3005E",

                            "&:hover": {
                              textDecoration: "underline black",
                            },
                          }}
                          display="inline"
                          style={{ color: "#B3005E" }}
                          fontSize={20}
                        >
                          Registrate
                        </Typography>
                      ) : (
                        <Typography
                          sx={{
                            color: "#B3005E",
                            textDecoration: "underline",
                            "&:hover": {
                              textDecoration: "underline black",
                            },
                          }}
                          display="inline"
                          style={{ color: "#B3005E" }}
                          fontSize={20}
                        >
                          Registrate
                        </Typography>
                      )}
                    </Button>
                  </Stack>
                  <ThemeProvider theme={theme}>
                    {isRegister ? (
                      <Box sx={{ height: "327px" }}>
                        <Typography fontSize={18} color="#B3005E">
                          What is your name?
                        </Typography>
                        <TextField
                          label="First Name"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.firstName || ""}
                          name="firstName"
                          error={
                            Boolean(touched.firstName) &&
                            Boolean(errors.firstName)
                          }
                          helperText={touched.firstName && errors.firstName}
                          sx={{
                            boxShadow: "0 0 0 0 black",
                            transition: "all 0.3s ease-in-out",
                            "&:hover": {
                              transform: "translateY(-4px) translateX(-2px)",
                              boxShadow: "2px 5px 0 0 black",
                              backgroundColor: "whitesmoke",
                            },
                            "&:active": {
                              transform: "translateY(2px) translateX(1px)",
                              boxShadow: "0 0 0 0 black",
                            },
                          }}
                          margin="normal"
                          required
                          fullWidth
                        />

                        <TextField
                          label="Last Name"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.lastName || ""}
                          name="lastName"
                          error={
                            Boolean(touched.lastName) &&
                            Boolean(errors.lastName)
                          }
                          helperText={touched.lastName && errors.lastName}
                          sx={{
                            boxShadow: "0 0 0 0 black",
                            transition: "all 0.3s ease-in-out",
                            "&:hover": {
                              transform: "translateY(-4px) translateX(-2px)",
                              boxShadow: "2px 5px 0 0 black",
                              backgroundColor: "whitesmoke",
                            },
                            "&:active": {
                              transform: "translateY(2px) translateX(1px)",
                              boxShadow: "0 0 0 0 black",
                            },
                          }}
                          margin="normal"
                          required
                          fullWidth
                        />
                        
                      </Box>
                    ) : isLogin ? (
                      <Box>
                        <TextField
                          label="Email Address"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.email}
                          name="email"
                          error={
                            Boolean(touched.email) && Boolean(errors.email)
                          }
                          helperText={touched.email && errors.email}
                          sx={{
                            boxShadow: "0 0 0 0 black",
                            transition: "all 0.3s ease-in-out",
                            "&:hover": {
                              transform: "translateY(-4px) translateX(-2px)",
                              boxShadow: "2px 5px 0 0 black",
                              backgroundColor: "whitesmoke",
                            },
                            "&:active": {
                              transform: "translateY(2px) translateX(1px)",
                              boxShadow: "0 0 0 0 black",
                            },
                          }}
                          margin="normal"
                          required
                          fullWidth
                        />
                        <TextField
                          label="Password"
                          type="password"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.password}
                          name="password"
                          error={
                            Boolean(touched.password) &&
                            Boolean(errors.password)
                          }
                          helperText={touched.password && errors.password}
                          sx={{
                            boxShadow: "0 0 0 0 black",
                            transition: "all 0.3s ease-in-out",
                            "&:hover": {
                              transform: "translateY(-4px) translateX(-2px)",
                              boxShadow: "2px 5px 0 0 black",
                              backgroundColor: "whitesmoke",
                            },
                            "&:active": {
                              transform: "translateY(2px) translateX(1px)",
                              boxShadow: "0 0 0 0 black",
                            },
                          }}
                          margin="normal"
                          required
                          fullWidth
                        />

                        <FormControlLabel
                          control={
                            <Checkbox value="remember" color="primary" />
                          }
                          label="Remember me"
                        />
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          sx={{
                            backgroundColor: "#B3005E",
                            color: "black",
                            borderRadius: "40em",
                            fontSize: "17px",
                            fontWeight: 600,
                            padding: "1em 2em",
                            cursor: "pointer",

                            border: "1px solid black",
                            boxShadow: "0 0 0 0 black",
                            transition: "all 0.3s ease-in-out",
                            "&:hover": {
                              transform: "translateY(-4px) translateX(-2px)",
                              boxShadow: "2px 5px 0 0 black",
                              backgroundColor: "#E90064",
                            },
                            "&:active": {
                              transform: "translateY(2px) translateX(1px)",
                              boxShadow: "0 0 0 0 black",
                            },
                          }}
                        >
                          <Typography
                            style={{ color: "whitesmoke" }}
                            fontSize={15}
                          >
                            Sign in
                          </Typography>
                        </Button>
                        <FlexBetween sx={{ marginTop: "30px" }}>
                          <Button
                            variant="outlined"
                            startIcon={<GoogleIcon />}
                            onClick={google}
                            sx={{
                              boxShadow: "0 0 0 0 black",
                              transition: "all 0.3s ease-in-out",
                              "&:hover": {
                                transform: "translateY(-4px) translateX(-2px)",
                                boxShadow: "2px 5px 0 0 black",
                                backgroundColor: "whitesmoke",
                              },
                              "&:active": {
                                transform: "translateY(2px) translateX(1px)",
                                boxShadow: "0 0 0 0 black",
                              },
                            }}
                          >
                            GOOGLE
                          </Button>
                          <Button
                            variant="outlined"
                            startIcon={<FacebookIcon />}
                            onClick={facebook}
                            sx={{
                              boxShadow: "0 0 0 0 black",
                              transition: "all 0.3s ease-in-out",
                              "&:hover": {
                                transform: "translateY(-4px) translateX(-2px)",
                                boxShadow: "2px 5px 0 0 black",
                                backgroundColor: "whitesmoke",
                              },
                              "&:active": {
                                transform: "translateY(2px) translateX(1px)",
                                boxShadow: "0 0 0 0 black",
                              },
                            }}
                          >
                            FACEBOOK
                          </Button>
                          <Button
                            variant="outlined"
                            startIcon={<GitHubIcon />}
                            onClick={github}
                            sx={{
                              boxShadow: "0 0 0 0 black",
                              transition: "all 0.3s ease-in-out",
                              "&:hover": {
                                transform: "translateY(-4px) translateX(-2px)",
                                boxShadow: "2px 5px 0 0 black",
                                backgroundColor: "whitesmoke",
                              },
                              "&:active": {
                                transform: "translateY(2px) translateX(1px)",
                                boxShadow: "0 0 0 0 black",
                              },
                            }}
                          >
                            GITHUB
                          </Button>
                        </FlexBetween>
                      </Box>
                    ) : picRegister ? (
                      <Box
                        maxWidth="100%"
                        width="100%"
                        px={2}
                        sx={{ height: "327px" }}
                      >
                        <Typography fontSize={18} color="#B3005E">
                          Add your profile picture
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "23.3vh",
                            marginTop: "16px",
                          }}
                        >
                          <Box
                            gridColumn="span 4"
                            border={`1px solid #B3005E`}
                            borderRadius="5px"
                            sx={{
                              width: "180px",
                              height: "180px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",

                              boxShadow: "0 0 0 0 black",
                              transition: "all 0.3s ease-in-out",
                              "&:hover": {
                                transform: "translateY(-4px) translateX(-2px)",
                                boxShadow: "2px 5px 0 0 black",
                                backgroundColor: "whitesmoke",
                              },
                              "&:active": {
                                transform: "translateY(2px) translateX(1px)",
                                boxShadow: "0 0 0 0 black",
                              },
                            }}
                          >
                            <Dropzone
                              acceptedFiles=".jpg,.jpeg,.png"
                              multiple={false}
                              onDrop={(acceptedFiles) =>
                                setFieldValue("picture", acceptedFiles[0])
                              }
                            >
                              {({ getRootProps, getInputProps }) => (
                                <Box
                                  {...getRootProps()}
                                  border={`2px dashed #B3005E`}
                                  sx={{
                                    "&:hover": { cursor: "pointer" },
                                    width: "150px",
                                    height: "150px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <input {...getInputProps()} name="picture" />
                                  {!values.picture ? (
                                    <p>Add Picture Here</p>
                                  ) : (
                                    <FlexBetween>
                                      <Typography>
                                        {values.picture.name}
                                      </Typography>
                                      <ModeEditOutlinedIcon />
                                    </FlexBetween>
                                  )}
                                </Box>
                              )}
                            </Dropzone>
                          </Box>
                        </Box>
                        
                      </Box>
                    ) : (
                      <Box sx={{ height: "327px" }}>
                        <Typography fontSize={18} color="#B3005E">
                          Enter your email and password
                        </Typography>
                        <TextField
                          label="Email Address"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.email}
                          name="email"
                          error={
                            Boolean(touched.email) && Boolean(errors.email)
                          }
                          helperText={touched.email && errors.email}
                          sx={{
                            boxShadow: "0 0 0 0 black",
                            transition: "all 0.3s ease-in-out",
                            "&:hover": {
                              transform: "translateY(-4px) translateX(-2px)",
                              boxShadow: "2px 5px 0 0 black",
                              backgroundColor: "whitesmoke",
                            },
                            "&:active": {
                              transform: "translateY(2px) translateX(1px)",
                              boxShadow: "0 0 0 0 black",
                            },
                          }}
                          margin="normal"
                          required
                          fullWidth
                        />
                        <TextField
                          label="Password"
                          type="password"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.password}
                          name="password"
                          error={
                            Boolean(touched.password) &&
                            Boolean(errors.password)
                          }
                          helperText={touched.password && errors.password}
                          sx={{
                            boxShadow: "0 0 0 0 black",
                            transition: "all 0.3s ease-in-out",
                            "&:hover": {
                              transform: "translateY(-4px) translateX(-2px)",
                              boxShadow: "2px 5px 0 0 black",
                              backgroundColor: "whitesmoke",
                            },
                            "&:active": {
                              transform: "translateY(2px) translateX(1px)",
                              boxShadow: "0 0 0 0 black",
                            },
                          }}
                          margin="normal"
                          required
                          fullWidth
                        />
                        <Box display="flex" justifyContent={"flex-end"} >
                          
                          <Button
                            disabled={isSubmitting}
                            variant="text"
                            type="submit"
                            zIndex = "1000"
                            endIcon={<NavigateNextIcon />}
                            sx={{
                              height: 70,
                              color: "#B3005E",
                            }}
                          >
                            Finish registration
                          </Button>
                        </Box>
                      </Box>
                    )}

                    {isLogin ? null : (
                      
                     
<StyledTabBar>
  <Box id="tab-bar">
    <Box
      className={`tab ${isRegister ? "active" : ""}`}
      onClick={() => setPageType("register")}
    >
      <div>
        <BadgeOutlinedIcon />
      </div>
    </Box>
    <Box
      className={`tab ${picRegister ? "active" : ""}`}
      onClick={() => setPageType("picRegister")}
    >
      <div>
        <PhotoOutlinedIcon />
      </div>
    </Box>
    <Box
      className={`tab ${newAcc ? "active" : ""}`}
      onClick={() => setPageType("newAcc")}
    >
      <div>
        <AttachEmailOutlinedIcon />
      </div>
    </Box>
  </Box>
  {isRegister && (
    <NavigateNextIcon
      onClick={() => setPageType("picRegister")}
      sx={{
        position: "absolute",
        top: "50%",
        right: "-45px",
        transform: "translateY(-50%)",
      }}
    />
  )}
  {picRegister && (
    <>
      <NavigateBeforeIcon
        onClick={() => setPageType("register")}
        sx={{
          position: "absolute",
          top: "50%",
          left: "-45px",
          transform: "translateY(-50%)",
        }}
      />
      <NavigateNextIcon
        onClick={() => setPageType("newAcc")}
        sx={{
          position: "absolute",
          top: "50%",
          right: "-45px",
          transform: "translateY(-50%)",
        }}
      />
    </>
  )}
  {newAcc && (
    <NavigateBeforeIcon
      onClick={() => setPageType("picRegister")}
      sx={{
        position: "absolute",
        top: "50%",
        left: "-45px",
        transform: "translateY(-50%)",
      }}
    />
  )}
</StyledTabBar>
                    )}
                  </ThemeProvider>
                </Box>
              </Grid>
              <Grid
                item
                xs={false}
                sm={4}
                md={6}
                sx={{
                  backgroundImage: `url(${Card})`,
                  backgroundRepeat: "no-repeat",
                  backgroundColor: (t) =>
                    t.palette.mode === "light"
                      ? t.palette.grey[50]
                      : t.palette.grey[900],
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            </Grid>
          </Box>
        </Container>
      </Container>
    </form>
  );
};
export default LoginPage;
