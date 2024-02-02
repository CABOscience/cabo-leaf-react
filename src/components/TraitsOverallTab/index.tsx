import React, { useState, useEffect } from "react";
import { Box, Typography, Grid } from "@mui/material";
import TraitDensity from "../TraitDensity";
import { t } from "../../helpers/translations";

const TraitsOverallTab = (props) => {
  const { traitsThisCat, traitSelection, indexCat, thisCat, type } = props;
  const [comp, setComp] = useState(<></>);
  useEffect(() => {
    setComp(
      <Grid
        container
        className="app-body row traits"
        sx={{ overflowY: "scroll" }}
      >
        {Object.entries(traitsThisCat).map(([name, thisTrait], index) => (
          <Grid item xs={type === "overall" ? 6 : 12}>
            <Grid container>
              <Grid item>
                <Typography>
                  <div dangerouslySetInnerHTML={{ __html: t(name) }} />
                </Typography>
              </Grid>
              <Grid>
                <TraitDensity
                  key={`${type}-${name}`}
                  traitVal={thisTrait}
                  indexCat={indexCat}
                  traitType={thisCat}
                  traitSelection={traitSelection}
                  trait={name}
                  searchSpecies={props.searchSpecies}
                  type={type}
                />
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>
    );
  }, [traitsThisCat, traitSelection]);

  return <>{comp}</>;
};

export default TraitsOverallTab;
