import * as React from "react";
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

export default function SearchBar() {
  return (
    <Grid container justifyContent="center">
      <Grid item xs={6}>
        <Tabs>
          <Tab label="Search by Species" />
          <Tab
            label={
              <FormControl variant="standard" sx={{ width: 20 }}>
                <Select value="Species1">
                  <MenuItem>Species 1</MenuItem>
                </Select>
              </FormControl>
            }
          ></Tab>
          <Tab label="Filter by: date" />
          <Tab label="location" />
          <Tab label="project" />
        </Tabs>
      </Grid>
      <Grid container justifyContent="center">
        <Grid item xs={12}>
          <ButtonGroup>
            <Button>
              <Search />
            </Button>
            <Autocomplete
              id="input-with-icon-textfield"
              placeholder="Enter species name"
              options={{}}
              renderInput={(params) => (
                <TextField {...params} label="Species" />
              )}
              sx={{ width: "450px" }}
            />
            <Button>Search</Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    </Grid>
  );
}
