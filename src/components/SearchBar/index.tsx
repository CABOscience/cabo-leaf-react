import React, { useEffect, useState, useRef } from "react";
import {
  Grid,
  InputAdornment,
  TextField,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tabs,
  Tab,
  Select,
  MenuItem,
  Switch,
  Button,
  ButtonGroup,
  Chip,
  Avatar,
  Typography,
  Container,
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
import CheckIcon from "@mui/icons-material/Check";
import { colors } from "../../helpers/constants";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import "dayjs/locale/en-ca";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { MapContainer, TileLayer, FeatureGroup, useMap } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "/node_modules/leaflet/dist/leaflet.css";
import "/node_modules/leaflet-draw/dist/leaflet.draw.css";
import { t } from "../../helpers/translations";

dayjs.extend(customParseFormat);

export default function SearchBar(props: any) {
  const {
    searchBarValue,
    setSearchBarValue,
    searchButtonClicked,
    searchStartDate,
    setSearchStartDate,
    searchEndDate,
    setSearchEndDate,
    projectsSelected,
    setProjectsSelected,
    spFreq,
  } = props;
  const [options, setOptions] = useState([{ label: "", id: "" }]);
  const [speciesFreq, setSpeciesFreq] = useState({});
  const [tab, setTab] = useState(false);
  const [openDateModal, setOpenDateModal] = useState<any>(false);
  const [openMapModal, setOpenMapModal] = useState<any>(false);
  const [openProjectsModal, setOpenProjectsModal] = useState<any>(false);
  const dateRef: any = useRef(null);
  const modalMapRef: any = useRef(null);
  const mapRef = useRef();
  const projectsRef = useRef();

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

  const clickTab = (t: any) => {
    setTab(t);
    switch (t) {
      case 1:
        setOpenDateModal(true);
        break;
      case 2:
        setOpenMapModal(true);
        break;
      case 3:
        setOpenProjectsModal(true);
        break;
    }
  };

  const mapReady = () => {
    const map = mapRef.current;
    if (map) {
    }
  };

  const ProjectsModal = (props) => {
    const [projList, setProjList] = useState<any>([]);
    useEffect(() => {
      if (projectsSelected.length === 0) {
        getCABOApi("projects/", {}, "get").then((res: any) => {
          let p = {};
          res.map((m) => (p[m.project] = true));
          setProjectsSelected(p);
        });
      }
    }, []);

    const handleProjectToggle = (event) => {
      setProjectsSelected({
        ...projectsSelected,
        [event.target.name]: event.target.checked,
      });
    };

    return (
      <>
        {Object.keys(projectsSelected).length > 0 &&
          Object.keys(projectsSelected).map((p: string) => {
            return (
              <ListItem
                key={p}
                sx={{ paddingTop: 0, paddingBottom: 0, margin: 0 }}
              >
                <ListItemIcon>
                  <Switch
                    edge="start"
                    onChange={handleProjectToggle}
                    tabIndex={-1}
                    disableRipple
                    checked={projectsSelected[p]}
                    name={p}
                    size="small"
                  />
                </ListItemIcon>
                <ListItemText
                  sx={{
                    "& .MuiTypography-root": { fontSize: "0.8rem !important" },
                  }}
                >
                  {p}
                </ListItemText>
              </ListItem>
            );
          })}
      </>
    );
  };

  const MyTileLayer = () => {
    const map = useMap();

    useEffect(() => {
      if (typeof window !== "undefined") {
        map.invalidateSize(false);
      }
    }, [map]);

    return (
      <Container>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FeatureGroup>
          <EditControl
            position="topright"
            /*onEdited={}
        onCreated={}
        onDeleted={}*/
            draw={{
              rectangle: false,
              circle: true,
              polyline: false,
              polygon: true,
              marker: false,
              circlemarker: false,
            }}
          />
        </FeatureGroup>
      </Container>
    );
  };

  return (
    <>
      <Grid container justifyContent="center">
        <Grid item xs={6}>
          <Tabs value={tab}>
            <Tab
              value={1}
              label={t(`filter_by_date`)}
              onClick={() => clickTab(1)}
              icon={
                searchStartDate !== "" || searchEndDate !== "" ? (
                  <CheckIcon />
                ) : (
                  <></>
                )
              }
              iconPosition="end"
            />
            <Tab value={2} label={t("geography")} onClick={() => clickTab(2)} />
            <Tab
              value={3}
              label={t("project")}
              onClick={() => clickTab(3)}
              icon={
                Object.keys(projectsSelected).length > 0 ? <CheckIcon /> : <></>
              }
              iconPosition="end"
            />
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
                          {spFreq[option.label] ? spFreq[option.label] : 0}
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
                    label={t("species")}
                    placeholder={
                      searchBarValue.length === 0 ? t("enter_species_name") : ""
                    }
                  />
                )}
              />
              <CustomButtonCABO onClick={searchButtonClicked}>
                Search
              </CustomButtonCABO>
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
          <Grid item>
            <Typography>{t("select_the_date_range")}</Typography>
          </Grid>
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale={"en-ca"}
          >
            <Grid item>
              <DatePicker
                label="Start Date"
                value={dayjs(searchStartDate)}
                defaultValue={dayjs(searchStartDate)}
                onChange={(value: any) => {
                  setSearchStartDate(value.format("YYYY-MM-DD"));
                }}
                slotProps={{
                  field: {
                    clearable: true,
                    onClear: () => setSearchStartDate(""),
                  },
                }}
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
                value={dayjs(searchEndDate)}
                defaultValue={dayjs(searchEndDate)}
                onChange={(value: any) => {
                  setSearchEndDate(value.format("YYYY-MM-DD"));
                }}
                slotProps={{
                  field: {
                    clearable: true,
                    onClear: () => setSearchEndDate(""),
                  },
                }}
                sx={{
                  ".MuiDateCalendar-root": {
                    backgroundColor: "white !important",
                  },
                }}
              />
            </Grid>
            <Grid item sx={{ marginBottom: "30px" }}>
              <CustomButtonCABO
                onClick={() => {
                  setOpenDateModal(false);
                }}
              >
                OK
              </CustomButtonCABO>
            </Grid>
          </LocalizationProvider>
        </Grid>
      </Modal>
      <Modal
        ref={modalMapRef}
        open={openMapModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          margin: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <>
          <Container
            sx={{
              width: "90vw",
              height: "90vh",
              background: "white",
              ".leaflet-container": {
                width: "100%",
                height: "90%",
                marginTop: "30px",
              },
            }}
          >
            <MapContainer
              center={[45.5, -73.5]}
              zoom={10}
              scrollWheelZoom={false}
              sx={{ width: "100%", height: "100%", position: "relative" }}
            >
              <MyTileLayer />
            </MapContainer>
            <CustomButtonCABO
              onClick={() => setOpenMapModal(false)}
              sx={{ float: "right" }}
            >
              OK
            </CustomButtonCABO>
          </Container>
        </>
      </Modal>
      <Modal
        ref={projectsRef}
        open={openProjectsModal}
        onClose={() => setOpenProjectsModal(false)}
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
          <Grid item xs={12}>
            <List>
              <ProjectsModal projectsSelected={projectsSelected} />
            </List>
          </Grid>
          <Grid item xs={12} sx={{ marginBottom: "30px" }}>
            <CustomButtonCABO
              onClick={() => {
                setOpenProjectsModal(false);
              }}
            >
              OK
            </CustomButtonCABO>
          </Grid>
        </Grid>
      </Modal>
    </>
  );
}
