import React, { useState, useEffect } from "react";
import { Box, Typography, Grid } from "@mui/material";
import TraitDensity from "../TraitDensity";
import { t } from "../../helpers/translations";

const TraitsOverallTab = (props) => {
  const { traitsThisCat } = props;
  const [comp, setComp] = useState(<></>);
  useEffect(() => {
    setComp(
      <Grid container className="app-body row traits">
        {Object.entries(traitsThisCat).map(([name, thisTrait], index) => (
          <Grid item xs={6}>
            <Grid container>
              <Grid item>
                <Typography>
                  <div dangerouslySetInnerHTML={{ __html: t(name) }} />
                </Typography>
              </Grid>
              <Grid>
                <TraitDensity
                  key={`overall-"${name}`}
                  traitVal={thisTrait}
                  indexCat={props.indexCat}
                  traitType={props.thisCat}
                  traitSelection={props.traitSelection}
                  trait={name}
                  searchSpecies={props.searchSpecies}
                  type="overall"
                />
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>
    );
  }, [traitsThisCat]);

  return <>{comp}</>;
};

export default TraitsOverallTab;
