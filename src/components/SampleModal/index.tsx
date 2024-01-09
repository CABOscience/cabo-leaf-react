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
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import _ from "lodash";

const SampleModal = (props) => {
  const { clickedSample, openSampleModal, setOpenSampleModal, plants } = props;
  const [selectedSample, setSelectedSample] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [sampleOptions, setSampleOptions] = useState(<></>);
  const [images, setImages] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
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
    return () => {
      ignore = true;
    };
  }, [clickedSample, plants]);

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
          height: "85vh",
          margin: "auto",
        }}
        spacing={1}
      >
        <Grid item>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
          >
            <Tab key={0} label={t("info_sheet")}></Tab>
            <Tab key={1} label={t("spectra")}></Tab>
            <Tab key={2} label={t("traits")}></Tab>
          </Tabs>
        </Grid>
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <FormControl sx={{ m: 1, minWidth: 80, marginTop: 3 }}>
            <InputLabel id="leaf-sample-select">{t("sample_date")}</InputLabel>
            <Select
              labelId="leaf-sample-select"
              id="leaf-sample-select-id"
              value={selectedSample}
              label={t("sample_date")}
              autoWidth
              variant="outlined"
              onChange={(e, value: any) => setSelectedSample(value)}
            >
              {sampleOptions}
            </Select>
          </FormControl>
        </Grid>
        {activeTab === 0 && (
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Box sx={{ maxWidth: 400, flexGrow: 1, margin: "auto" }}>
              <Box
                component="img"
                sx={{
                  height: "100%",
                  maxHeight: 900,
                  maxWidth: 400,
                  margin: "auto",
                  position: "relative",
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
        {activeTable === 1 && (
          <LeafSampleSpectra leafSampleIds={leafSampleIds} />
        )}
      </Grid>
    </Modal>
  );
};

export default SampleModal;
