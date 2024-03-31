
import React, { useState, useContext } from "react";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import '../styles/menu.css';
import DensitySmallIcon from '@mui/icons-material/DensitySmall';
import { SessionContext } from "../contexts/SessionContext";
import { Link } from 'react-router-dom';

const ConditionalLinkListItem = ({ condition, route, pageName }) => {
    if (condition) {
        return (
            <ListItem>
                <ListItemButton>
                    <Link to={route}>
                        <ListItemText
                            primary={pageName}
                            primaryTypographyProps={{ style: { fontSize: '24px' } }}
                        />
                    </Link>
                </ListItemButton>
            </ListItem>
        );
    } else {
        return (
            <ListItem>
                <ListItemButton>
                    <ListItemText
                        primary={pageName}
                        primaryTypographyProps={{ style: { fontSize: '24px' } }}
                    />
                </ListItemButton>
            </ListItem>
        );
    }
};

export default function TemporaryDrawer() {
    const [open, setOpen] = React.useState(false);
    const { session } = useContext(SessionContext);
    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const DrawerList = (
        <Box sx={{ width: 500 }} role="presentation" onClick={toggleDrawer(false)}>
            <List>
                <ListItem>
                    <ListItemButton>
                        <Link to="/">
                            <ListItemText
                                primary="Home"
                                primaryTypographyProps={{ style: { fontSize: '24px' } }}
                            />
                        </Link>
                    </ListItemButton>
                </ListItem>

                <ConditionalLinkListItem
                    condition={session.loggedIn}
                    route="/upload"
                    pageName="Upload Data"
                />

                <ListItem>
                    <ListItemButton>
                        <Link to="/explore">
                            <ListItemText
                                primary="Explore Data"
                                primaryTypographyProps={{ style: { fontSize: '24px' } }}
                            />
                        </Link>
                    </ListItemButton>
                </ListItem>

                <ListItem>
                    <ListItemButton>
                        <Link to="/login">
                            <ListItemText
                                primary="Log In"
                                primaryTypographyProps={{ style: { fontSize: '24px' } }}
                            />
                        </Link>
                    </ListItemButton>
                </ListItem>

            </List>
        </Box>
    );

    return (
        <div>
            <Button onClick={toggleDrawer(true)}><DensitySmallIcon /></Button>
            <Drawer open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>
        </div>
    );
}