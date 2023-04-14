import Grid from "@mui/material/Grid";
import React from "react";
import './../../assets/css/App.css';

/**
 * NoPage Component 
 * (404)
 */
const NoPage = () => {
    return (
        <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
        >
                <div className="App-header">
                    <p>Not found!!</p>
                </div>
        </Grid>
    );
};

export default NoPage;