import { useState, useEffect } from "react";
import { Box, Grid } from "@mui/material";
import { Loader } from "./components/Loader";
import SearchBar from "./components/SearchBar";
import "./App.css";

function App() {
  const [isSearching, setIsSearching] = useState(false);
  const [searchProjects, setSearchProjects] = useState([]);
  const [searchBarValue, setSearchBarValue] = useState("");
  const [searchDates, setSearchDates] = useState(false);
  const [searchSpectraIDs, setSearchSpectraIDs] = useState([]);

  return (
    <Box>
      <Grid container sx={{ maxHeight: "600px" }} justifyContent="center">
        <Grid item xs={8} lg={6}>
          <img
            alt="CABO logo"
            src="CABO_color.png"
            className="main-logo"
            style={{ width: "100%", position: "relative" }}
          />
        </Grid>
      </Grid>
      <SearchBar {...{ setSearchBarValue, searchBarValue }} />
      {isSearching && <Loader />}
    </Box>
  );
}

export default App;
