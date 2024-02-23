import { useState, useEffect } from "react";
import SearchBar2 from "./Searchbar2";
import NavbarCover from "../../assets/image/navbarCover3.png";

import {
    AppBar,
    Box,
    Button,
    Badge,
    Container,
    Divider,
    IconButton,
    Link,
    Menu,
    MenuItem,
    Typography,
    useTheme,
    Tooltip,
    Toolbar,
} from "@mui/material";
import { styled } from '@mui/material/styles'
import {
    AccessibleForward,
    AccountCircle,
    FormatListBulleted,
    Help,
    Home,
    Logout,
    Movie,
    Notifications,
    Settings,
    Tv,
} from "@mui/icons-material";
import MenuIcon from '@mui/icons-material/Menu';
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "../../states";
import { useNavigate } from "react-router-dom";
import FlexBetween from "../../components/FlexBetween";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

import SearchBar from "./SearchBar";

import IconListComponent from "./IconListComponent";

const Avatar = ({ image, size = '100%' }) => {
    return (
      <img
        style={{ objectFit: 'cover', borderRadius: '50%' }}
        width={size}
        height={size}
        src={image}
      />
    )
  }

  const UserImage = styled(Box)({
    
    height: '60px',
    width: '60px',
    borderRadius: '50%',
    
    backgroundColor: 'red',
    
    border: '2px solid white'
    
  })

const Navbar = ({ currentPage }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);

    const [notificationNumber, setNotificationNumber] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorElNav, setAnchorElNav] = useState(null);
    const open = Boolean(anchorEl);
    const [imageUrl, setImageUrl] = useState('')

    useEffect(() => {
        fetchImage()
    }, [])

    const fetchImage = async () => {
        try {
            const response = await fetch(`${VITE_BASE_URL}/profile/${user._id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",
            })

            if (response.ok) {
                const blob = await response.blob()
                const url = URL.createObjectURL(blob)
                setImageUrl(url)
            } else {
                console.log('Error fetching image')
            }
        } catch (error) {
            console.log('Error fetching image:', error)
        }
    }

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const redirectAccount = () => {
        navigate("/profile/" + user._id);
    };
    const redirectHelp = () => {
        window.location.href = "https://gitlab.com/galvdat/vgu_tinyprojects/pe2023/vgupe2023_team5";
    };
    const redirectAdmin = () => {
        navigate("/admin");
    };
    const handleLogout = () => {
        dispatch(setLogout());
        navigate("/")
    };
    const theme = useTheme();
   

    const fullName = user ? `${user.firstName} ${user.lastName}` : "undefined";
    const firstName = user ? `${user.firstName}` : "undefined";
    const email = user ? `${user.email}` : "undefined";
    const pages = ['Home', 'Feature Movies', 'TV Shows', 'My List'];
    return (
        <AppBar sx={{
            top: "0",
            zIndex: "100",
            backgroundColor: "#060047",
            backgroundImage: `url(${NavbarCover})`,
            height: "120px",
            width: "100%",
            backgroundSize: "cover",
            backgroundPosition: "center",
            position:"sticky",
        }}>
            <Container maxWidth="xl" sx={{ marginTop: "15px" }} >
                <Toolbar disableGutters>

                    <Box sx={{ marginLeft: "-10px", display: {xs: 'none', md: 'flex'}}}>
                        <IconListComponent currentPage={currentPage} />
                    </Box>
                    <Box sx={{ flexGrow: 0, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton size="large" onClick={handleOpenNavMenu}>
                            <MenuIcon sx={{ color: 'white' }} />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            <SearchBar />
                            {pages.map((page) => (
                                <MenuItem sx={{ backgroundColor: '#e90064' , "&:hover" : {backgroundColor: '#060047'}}} key={`link-${page}`} onClick={handleCloseNavMenu}>
                                    <Link href={`/${page}`} sx={{ textDecoration: 'none', color: 'white', fontSize: '1rem', py: '0.5rem', fontWeight: 'bold' }}>{page}</Link>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'center' }}>
                        <Box
                            component="img"
                            right="0"
                            bottom="0"
                            height="4rem"
                            zIndex="10"
                           
                            sx={{
                                display: { xs: 'flex', md: 'none' },
                                mr: 0,
                                cursor: 'pointer',
                                '&hover': {
                                    opacity: 0.5,
                                }
                            }}
                            onClick={() => {
                                window.location.href = "/Home";
                            }}
                        />
                    </Box>
                    <Box right={"150px"} position={"absolute"} sx={{ display: {xs: 'none', md: 'flex'}}}>
                        <SearchBar></SearchBar>
                    </Box>
                    <Box gap="1rem" sx={{ display: "flex", marginLeft: 'auto' }} >
                        <Box sx={{ flexGrow: 0, margin: "0.5rem" }}>
                            <Tooltip title={firstName}>
                                <IconButton onClick={handleClick}>
                                    <Badge
                                        color="error"
                                        badgeContent={notificationNumber}
                                        overlap="circular"
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        max={99}
                                    >
                                        <UserImage>
                                        <Avatar image={imageUrl}></Avatar>
                                        </UserImage>
                                    </Badge>
                                </IconButton>
                            </Tooltip>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                sx={{
                                    width: 'auto',
                                    mt: '45px'
                                }}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={open}
                                onClose={handleClose}
                            >
                                <Typography
                                    variant="h5"
                                    sx={{
                                        padding: "1rem 1rem 0",
                                        textAlign: "center",
                                        fontWeight: 'bold'
                                    }}
                                >
                                    <strong>{fullName}</strong>
                                </Typography>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        padding: "0.5rem 0",
                                        textAlign: "center",

                                    }}>{email}</Typography>
                                <Box sx={{
                                    display: 'flex'
                                }}>
                                    <Button onClick={redirectAccount}
                                        sx={{
                                            border: "2px solid black",
                                            borderRadius: '10px',
                                            margin: '1rem',
                                            backgroundColor: 'gray',
                                            width: '100%',
                                            '&:hover': {
                                                backgroundColor: 'dimgrey'
                                            }
                                        }}>
                                        <Typography sx={{
                                            color: 'white',
                                            flexGrow: 1,
                                            textTransform: 'none'
                                        }}>Manage <strong> Bruher </strong> Account</Typography>
                                    </Button>
                                </Box>                                
                                <Divider />
                                <MenuItem onClick={redirectHelp}>
                                    <Help />
                                    <Typography padding="0.25rem 1rem">Help</Typography>
                                </MenuItem>
                                {user.isAdmin ? (
                                    <MenuItem onClick={redirectAdmin}>
                                        <AdminPanelSettingsIcon></AdminPanelSettingsIcon>
                                    <Typography padding="0.25rem 1rem">Admin</Typography>
                                </MenuItem>
                                ) : (
                                    <div></div>
                                )}
                                <Divider />
                                <MenuItem onClick={handleLogout}>
                                    <Logout />
                                    <Typography padding="0.25rem 1rem">Logout</Typography>
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;
