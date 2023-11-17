import React, { useEffect, useState } from "react";
import {
  Grid,
  InputAdornment,
  TextField,
  Autocomplete,
  FilledInput,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  FormGroup,
  Button,
  ButtonGroup,
} from "@mui/material";
import Search from "@mui/icons-material/Search";
import { getCABOApi } from "../../helpers/api";

export default function SearchBar(props: any) {
  const {
    searchBarValue,
    getSpeciesList,
    setSearchBarValue,
    searchButtonClicked,
  } = props;
  const [options, setOptions] = useState([]);
  useEffect(() => {
    getCABOApi("scientific_names_in_spectra/", {}, "get").then((res: any) => {
      if (res) {
        const names = res.map((r: any) => ({
          label: r.scientific_name,
          id: r.scientific_name,
        }));
        setOptions(names);
      }
    });
  }, []);
  return (
    <Grid container justifyContent="center">
      <Grid item xs={6}>
        <Tabs>
          <Tab label="Filter by: date" />
          <Tab label="location" />
          <Tab label="project" />
        </Tabs>
      </Grid>
      <Grid container justifyContent="center">
        <Grid item xs={12}>
          <ButtonGroup>
            <Button sx={{ cursor: "default" }}>
              <Search />
            </Button>
            <Autocomplete
              id="input-with-icon-textfield"
              placeholder="Enter species name"
              options={options}
              renderInput={(params) => (
                <TextField {...params} label="Species" />
              )}
              sx={{ width: "450px" }}
              value={searchBarValue}
              onChange={(e: any) =>
                setSearchBarValue(e.currentTarget.textContent)
              }
            />
            <Button onClick={searchButtonClicked}>Search</Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    </Grid>
  );
}
