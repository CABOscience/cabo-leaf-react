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
  Chip,
  Paper,
} from "@mui/material";
import {
  CustomButtonCABO,
  CustomAutocomplete,
  CustomPaper,
} from "../../styles/customMUI";
import Search from "@mui/icons-material/Search";
import { getCABOApi } from "../../helpers/api";
import { colors } from "../../helpers/constants";

export default function SearchBar(props: any) {
  const {
    searchBarValue,
    getSpeciesList,
    setSearchBarValue,
    searchButtonClicked,
  } = props;
  const [options, setOptions] = useState([{ label: "", id: "" }]);
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
        <Tabs value={false}>
          <Tab value={1} label="Filter by: date" />
          <Tab value={2} label="location" />
          <Tab value={3} label="project" />
        </Tabs>
      </Grid>
      <Grid container justifyContent="center">
        <Grid item xs={12}>
          <ButtonGroup>
            <CustomButtonCABO sx={{ cursor: "default" }}>
              <Search />
            </CustomButtonCABO>
            <CustomAutocomplete
              multiple
              id="size-small-filled-multi"
              size="small"
              options={options}
              getOptionLabel={(option: any) => option.label}
              sx={{ width: "650px" }}
              value={searchBarValue}
              PaperComponent={CustomPaper}
              onChange={(e: any, value: any) => setSearchBarValue(value)}
              renderTags={(value, getTagProps) =>
                value.map((option: any, index) => (
                  <Chip
                    variant="outlined"
                    label={option.label}
                    size="small"
                    sx={{ backgroundColor: `${colors[index]}`, color: "white" }}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="filled"
                  label="Species"
                  placeholder={
                    searchBarValue.length === 0 ? "Enter species name" : ""
                  }
                />
              )}
            />
            {false && (
              <CustomButtonCABO onClick={searchButtonClicked}>
                Search
              </CustomButtonCABO>
            )}
          </ButtonGroup>
        </Grid>
      </Grid>
    </Grid>
  );
}
