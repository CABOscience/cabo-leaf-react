import React, { useEffect, useState, useRef } from "react";
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
  Button,
  ButtonGroup,
  Chip,
  Avatar,
  Box,
  Modal,
} from "@mui/material";
import {
  CustomButtonCABO,
  CustomAutocomplete,
  CustomPaper,
} from "../../styles/customMUI";
import Search from "@mui/icons-material/Search";
import { getCABOApi } from "../../helpers/api";
import ParkIcon from "@mui/icons-material/Park";
import { colors } from "../../helpers/constants";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import "dayjs/locale/en-ca";
import dayjs from "dayjs";

export default function SearchBar(props: any) {
  const {
    searchBarValue,
    getSpeciesList,
    setSearchBarValue,
    searchButtonClicked,
    searchStartDate,
    setSearchStartDate,
    searchEndDate,
    setSearchEndDate,
    spFreq,
  } = props;
  const [options, setOptions] = useState([{ label: "", id: "" }]);
  const [speciesFreq, setSpeciesFreq] = useState({});
  const [tab, setTab] = useState(false);
  const [openDateModal, setOpenDateModal] = useState<any>(false);
  const dateRef: any = useRef(null);

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

  const resetDates = () => {
    setSearchStartDate("");
    setSearchEndDate("");
  };

  const clickTab = (t: any) => {
    setTab(t);
    switch (t) {
      case 1:
        setOpenDateModal(true);
    }
  };
  return (
    <>
      <Grid container justifyContent="center">
        <Grid item xs={6}>
          <Tabs value={tab}>
            <Tab
              value={1}
              label="Filter by: date"
              onClick={() => clickTab(1)}
            />
            <Tab value={2} label="location" onClick={() => clickTab(2)} />
            <Tab value={3} label="project" onClick={() => clickTab(3)} />
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
                      sx={{
                        backgroundColor: `${colors[index]}`,
                        color: "white",
                      }}
                      avatar={
                        <Avatar
                          sx={{
                            backgroundColor: "white",
                            padding: "0px 4px",
                            fontWeight: "bold",
                          }}
                        >
                          {spFreq[option.label] ? (
                            spFreq[option.label]
                          ) : (
                            <ParkIcon />
                          )}
                        </Avatar>
                      }
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
      <Modal
        ref={dateRef}
        open={openDateModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "40px",
        }}
      >
        <Grid
          container
          sx={{ width: "400px", backgroundColor: "white" }}
          spacing={3}
        >
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale={"en-ca"}
          >
            <Grid item>
              <DatePicker
                label="Start Date"
                value={dayjs(searchStartDate, "YYYY-MM-DD")}
                onChange={(value: any) => {
                  setSearchStartDate(value.format("YYYY-MM-DD"));
                }}
                slotProps={{ field: { clearable: true } }}
                sx={{
                  ".MuiDateCalendar-root": {
                    backgroundColor: "white !important",
                  },
                }}
              />
            </Grid>
            <Grid item sx={{ backgroundColor: "white" }}>
              <DatePicker
                label="End Date"
                value={dayjs(searchEndDate, "YYYY-MM-DD")}
                onChange={(value: any) => {
                  setSearchEndDate(value.format("YYYY-MM-DD"));
                }}
                slotProps={{ field: { clearable: true } }}
                sx={{
                  ".MuiDateCalendar-root": {
                    backgroundColor: "white !important",
                  },
                }}
              />
            </Grid>
            <Grid item sx={{ marginBottom: "30px" }}>
              <Button
                onClick={() => {
                  setOpenDateModal(false);
                }}
              >
                OK
              </Button>
            </Grid>
          </LocalizationProvider>
        </Grid>
      </Modal>
    </>
  );
}
