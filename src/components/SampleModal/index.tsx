import React, { useState, useEffect } from "react";
import {
  Paper,
  Tabs,
  Tab,
  Typography,
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
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import _ from "lodash";

const SampleModal = (props) => {
  const { clickedSample, openSampleModal, setOpenSampleModal, plants } = props;
  const [activeTrait, setActiveTrait] = useState<number>(0);
  const [activeStep, setActiveStep] = useState(0);
  const [images, setImages] = useState([]);
  const maxSteps = images.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  useEffect(() => {
    let ignore = false;
    if (plants && plants.length > 0) {
      const thisPlant = plants.filter((f) => {
        clickedSample.includes(f.sample_id);
      });
      if (thisPlant[0].plant_photos !== null) {
        var plantPhotos: any = [];
        var pf = thisPlant[0].plant_photos.split(",");
        pf.map((p) => {
          plantPhotos.push(
            "https://data.caboscience.org/photos/plants/" + p + ".jpg"
          );
        });
        if (thisPlant[0].close_up_photos !== null) {
          pf = thisPlant[0].close_up_photos.split(",");
          pf.map((p) => {
            plantPhotos.push(
              "https://data.caboscience.org/photos/plants/" + p + ".jpg"
            );
          });
        }
        setImages(plantPhotos);
      }
    }
    return () => {
      ignore = true;
    };
  }, [clickedSample, plants]);

  return (
    <Modal
      open={openSampleModal}
      onClose={() => setOpenSampleModal(false)}
      sx={{
        margin: "40px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Grid
        container
        sx={{ background: "white", maxWidth: "800px", width: "60vw" }}
      >
        <Grid item>
          <Tabs value={0}>
            <Tab key={0} label={t("info_sheet")}></Tab>
            <Tab key={1} label={t("spectra")}></Tab>
            <Tab key={2} label={t("traits")}></Tab>
          </Tabs>
        </Grid>
        <Grid item>
          <Box sx={{ maxWidth: 400, flexGrow: 1 }}>
            <Paper
              square
              elevation={0}
              sx={{
                display: "flex",
                alignItems: "center",
                height: 50,
                pl: 2,
                bgcolor: "background.default",
              }}
            >
              <Typography>{images[activeStep]}</Typography>
            </Paper>
            <Box sx={{ height: 255, maxWidth: 400, width: "100%", p: 2 }}>
              {images[activeStep]}
            </Box>
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
      </Grid>
    </Modal>
  );
};

export default SampleModal;
