import { useState } from "react";
import { Box, Grid } from "@mui/material";
import { Loader } from "./components/Loader";
import SearchBar from "./components/SearchBar";
import "./App.css";

function App() {
  const [isSearching, setIsSearching] = useState(false);
  return (
    <Box>
      <Grid container justifyContent="center">
        <Grid item xs={8} lg={6}>
          <img
            alt="CABO logo"
            src="CABO_color.png"
            className="main-logo"
            style={{ width: "100%", position: "relative" }}
          />
        </Grid>
      </Grid>
      <SearchBar />
      {isSearching && <Loader />}
    </Box>
  );
}

export default App;
