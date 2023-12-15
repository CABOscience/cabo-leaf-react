import React from "react";
import { Box, Typography } from "@mui/material";
import TraitDensity from "../TraitDensity";
import { t } from "../../helpers/translations";

const TraitsOverallTab = (props) => {
  return (
    <div className="app-body row traits">
      <Box>
        {Object.entries(props.traitsThisCat).map(([name, thisTrait], index) => (
          <Box>
            <Box>
              <Typography>{name}</Typography>
            </Box>
            <Box>
              <TraitDensity
                key={`overall-"${name}`}
                traitVal={thisTrait}
                indexCat={props.indexCat}
                traitType={props.thisCat}
                traitSelection={props.traitSelection}
                trait={thisTrait}
                type="overall"
              />
            </Box>
          </Box>
        ))}
      </Box>
    </div>
  );
};

export default TraitsOverallTab;
