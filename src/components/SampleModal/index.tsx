import React, { useState, useEffect } from "react";
import {
  Paper,
  Tabs,
  Tab,
  Typography,
  InputLabel,
  Select,
  FormControl,
  MenuItem,
  Grid,
  Box,
  Modal,
  MobileStepper,
  Button,
  Table,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import { getAllTraits } from "../../helpers/api";
import { traitsTable } from "../../helpers/constants";
import { t } from "../../helpers/translations";
import {
  CustomButtonCABO,
  CustomAutocomplete,
  CustomPaper,
} from "../../styles/customMUI";
import { theme } from "../../styles/theme";
import LeafSampleSpectra from "./leafSampleSpectra";
import TraitsOverall from "../TraitsOverall";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import _ from "lodash";

const SampleModal = (props) => {
  const {
    clickedSample,
    openSampleModal,
    setOpenSampleModal,
    plants,
    searchSpecies,
    traitSelection,
    setTraitSelection,
  } = props;
  const [selectedSample, setSelectedSample] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [sampleOptions, setSampleOptions] = useState(<></>);
  const [images, setImages] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [plantInfo, setPlantInfo]: any = useState({});
  const maxSteps = images.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  useEffect(() => {
    let ignore = false;
    if (plants && plants.length > 0 && clickedSample) {
      const thisPlant = plants.filter((f) => clickedSample === f.plant_id);
      if (thisPlant.length > 0) {
        var plantPhotos: any = [];
        if (thisPlant[0].plant_photos !== null) {
          var pf = thisPlant[0].plant_photos.split(",");
          pf.map((p) => {
            plantPhotos.push(
              "https://data.caboscience.org/photos/plants/" + p + ".jpg"
            );
          });
        }
        if (thisPlant[0].close_up_photos !== null) {
          pf = thisPlant[0].close_up_photos.split(",");
          pf.map((p) => {
            plantPhotos.push(
              "https://data.caboscience.org/photos/plants/" + p + ".jpg"
            );
          });
        }
        setPlantInfo({
          dateFirstObserved: thisPlant[0].date_first_observed,
          siteId: thisPlant[0].site_id,
          plantId: thisPlant[0].plant_id,
          numberOfSample: thisPlant[0].bulk_leaf_samples.length,
        });
        setImages(plantPhotos);
        if (thisPlant[0].bulk_leaf_samples?.length > 0) {
          setSampleOptions(
            thisPlant[0].bulk_leaf_samples.map((p) => (
              <MenuItem value={p.sample_id}>{p.date_sampled}</MenuItem>
            ))
          );
          setSelectedSample(thisPlant[0].bulk_leaf_samples[0].sample_id);
        }
      }
    }
    return () => {
      ignore = true;
    };
  }, [clickedSample, plants]);

  useEffect(() => {
    //leafSampleIds;
  }, [activeTab, clickedSample]);

  return (
    <Modal
      open={openSampleModal}
      onClose={() => {
        setOpenSampleModal(false);
        setActiveStep(0);
      }}
      sx={{
        margin: "40px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Grid
        container
        sx={{
          background: "white",
          maxWidth: "800px",
          width: "60vw",
          height: "95%",
          margin: "auto",
          overflowY: "scroll",
        }}
        spacing={0}
      >
        <Grid item>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
          >
            <Tab key={0} label={t("info_sheet")}></Tab>
            <Tab key={1} label="Photos"></Tab>
            <Tab key={2} label={t("spectra")}></Tab>
            <Tab key={3} label={t("traits")}></Tab>
          </Tabs>
        </Grid>
        <Grid item xs={12} sx={{ textAlign: "center", height: "100%" }}>
          <Grid container sx={{ textAlign: "center", height: "60px" }}>
            <Grid item xs={12}>
              <FormControl
                sx={{ m: 1, minWidth: 80, marginTop: 1 }}
                size="small"
              >
                <InputLabel id="leaf-sample-select">
                  {t("sample_date")}
                </InputLabel>
                <Select
                  labelId="leaf-sample-select"
                  id="leaf-sample-select-id"
                  value={selectedSample}
                  label={t("sample_date")}
                  autoWidth
                  variant="outlined"
                  onChange={(e, value: any) => setSelectedSample(value)}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        padding: 0,
                        background: "white",
                      },
                    },
                  }}
                >
                  {sampleOptions}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          {activeTab === 0 && (
            <Grid container xs={12} sx={{ justifyContent: "center" }}>
              <Grid item>
                {Object.keys(plantInfo).length > 0 && (
                  <TableContainer sx={{ margin: "auto" }}>
                    <Table>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          {t("site_id")}
                        </TableCell>
                        <TableCell>{plantInfo.siteId}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          {t("plant_id")}
                        </TableCell>
                        <TableCell>{plantInfo.plantId}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          {t("first_observed")}
                        </TableCell>
                        <TableCell>{plantInfo.dateFirstObserved}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          {t("number_of_samples")}
                        </TableCell>
                        <TableCell>{plantInfo.numberOfSample}</TableCell>
                      </TableRow>
                    </Table>
                  </TableContainer>
                )}
              </Grid>
            </Grid>
          )}
          {activeTab === 1 && (
            <Grid container xs={12} sx={{ textAlign: "center" }}>
              <Box sx={{ maxWidth: 400, flexGrow: 1, margin: "auto" }}>
                <Box
                  component="img"
                  sx={{
                    maxHeight: 900,
                    maxWidth: 400,
                    margin: "auto",
                    position: "relative",
                    height: "60vh",
                  }}
                  alt="Plant photo"
                  src={images[activeStep]}
                />
                <MobileStepper
                  steps={maxSteps}
                  position="static"
                  activeStep={activeStep}
                  nextButton={
                    <Button
                      size="small"
                      onClick={handleNext}
                      disabled={activeStep === maxSteps - 1}
                    >
                      Next
                      <KeyboardArrowRight />
                    </Button>
                  }
                  backButton={
                    <Button
                      size="small"
                      onClick={handleBack}
                      disabled={activeStep === 0}
                    >
                      <KeyboardArrowLeft />
                      Back
                    </Button>
                  }
                />
              </Box>
            </Grid>
          )}
          {activeTab === 2 && (
            <LeafSampleSpectra selectedSample={selectedSample} />
          )}
          {activeTab === 3 && (
            <TraitsOverall
              key="traitsSample"
              searchSpectraIDs={[{ sample_id: selectedSample }]}
              searchSpecies={searchSpecies}
              type="sample"
              traitSelection={traitSelection}
              setTraitSelection={setTraitSelection}
            />
          )}
        </Grid>
      </Grid>
    </Modal>
  );
};

export default SampleModal;
