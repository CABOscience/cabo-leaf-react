import React, { useState, useEffect } from "react";
import { Card, CardContent, Tabs, Tab, Typography } from "@mui/material";
import TraitsOverallTab from "../TraitsOverallTab";
import { getAllTraits } from "../../helpers/api";
import { traitsTable } from "../../helpers/constants";
import { t } from "../../helpers/translations";
import _ from "lodash";

const TraitsOverall = (props) => {
  const { searchSpectraIDs, searchSpecies, showOverallTraits } = props;
  const [activeTrait, setActiveTrait] = useState<number>(0);
  const [traitSelection, setTraitSelection] = useState<number>(0);
  const [traitsCat, setTraitsCat] = useState({
    leaf_area_and_water_samples: {},
    icp_leaf_element_concentrations: {},
    c_n_leaf_concentrations: {},
    carbon_fractions_bags: {},
    pigments_extracts: {},
  });

  useEffect(() => {
    if (searchSpectraIDs) {
      getAllTraits(searchSpectraIDs).then((vals) => {
        if (vals) {
          var traits = Object.keys(traitsTable);
          traits.push("scientific_name");
          const data = _.pickBy(
            vals.map((i) => {
              return _.pickBy(
                _.pick(
                  _.mapValues(i, (j) => {
                    if (j !== null && !isNaN(parseFloat(j))) {
                      return parseFloat(j).toFixed(4);
                    } else {
                      return j;
                    }
                  }),
                  traits
                ),
                (k) => {
                  return k !== null;
                }
              );
            }),
            (l) => {
              return searchSpecies.indexOf(l.scientific_name) !== -1;
            }
          );
          setTraitSelection(data);
        }
        //setTraitsTable(data);
      });
    }
  }, [searchSpectraIDs]);

  useEffect(() => {
    _.mapValues(traitSelection, (sample) => {
      _.mapKeys(sample, (value, key) => {
        if (!isNaN(value)) {
          setTraitsCat((prevState) => ({
            ...prevState,
            [sample]: true, /// WRONG!!! FIX HERE
          }));
        }
      });
    });
  }, [traitSelection]);

  const hasTraitsCat = (cat: string): boolean => {
    return Object.keys(traitsCat[cat]).length === 0;
    // return true;
  };

  /*  const downloadPlantTraits = (sampleId: string): void => {
    props.store.commit("download_plant_traits_csv", sampleId);
  };*/

  const traitsColors = (index: number): string => {
    return props.store.state.basicColors[index];
  };

  return (
    <Card hidden={!showOverallTraits} sx={{ backgroundColor: "white" }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {t("traits")}
        </Typography>
        <Tabs
          value={activeTrait}
          onChange={(_, newValue) => setActiveTrait(newValue)}
          orientation="vertical"
          variant="scrollable"
          textColor="primary"
          indicatorColor="primary"
        >
          {Object.keys(traitsCat).map((thisCat, indexCat) => (
            <Tab
              key={indexCat}
              label={t(thisCat)}
              disabled={!hasTraitsCat(thisCat)}
            />
          ))}
        </Tabs>
        {Object.keys(traitsCat).map((thisCat, indexCat) => (
          <div key={indexCat} hidden={activeTrait !== indexCat}>
            <CardContent>
              <TraitsOverallTab
                key={indexCat}
                traitCat={thisCat}
                traitsThisCat={traitsCat[thisCat]}
                indexCat={indexCat}
                traitSelection={traitSelection}
              />
            </CardContent>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TraitsOverall;
