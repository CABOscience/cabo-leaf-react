import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Tabs,
  Tab,
  Typography,
  Grid,
  Grow,
} from "@mui/material";
import TraitsOverallTab from "../TraitsOverallTab";
import { getAllTraits } from "../../helpers/api";
import { traitsTable } from "../../helpers/constants";
import { t } from "../../helpers/translations";
import {
  CustomButtonCABO,
  CustomAutocomplete,
  CustomPaper,
} from "../../styles/customMUI";
import { theme } from "../../styles/theme";
import _ from "lodash";

const TraitsOverall = (props) => {
  const traitsCatO = {
    leaf_area_and_water_samples: {},
    icp_leaf_element_concentrations: {},
    c_n_leaf_concentrations: {},
    carbon_fractions_bags: {},
    pigments_extracts: {},
  };
  const { searchSpectraIDs, searchSpecies, type } = props;
  const [activeTrait, setActiveTrait] = useState<number>(0);
  const [traitSelection, setTraitSelection] = useState<number>(0);
  const [traitsCat, setTraitsCat] = useState(traitsCatO);

  useEffect(() => {
    let ignore = false;
    setTraitSelection(0);
    if (searchSpectraIDs) {
      const ids = searchSpectraIDs.map((s) => s.sample_id);
      getAllTraits(ids).then((vals) => {
        if (vals && !ignore) {
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
      });
    }
    return () => {
      ignore = true;
    };
  }, [searchSpectraIDs]);

  useEffect(() => {
    let tC = { ...traitsCatO };
    _.mapKeys(traitSelection, (valueType, keyType) => {
      _.mapKeys(valueType, (value, key) => {
        if (!isNaN(value)) {
          tC[traitsTable[key]][key] = true;
        }
      });
    });
    setTraitsCat(tC);
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
    <Grid
      container
      justifyContent="center"
      sx={{
        display: "block",
        paddingLeft: "0px",
        margin: type === "overall" ? "75px 0 0 0" : "2px 5px 5px 5px",
      }}
    >
      {type === "overall" && (
        <Grid
          item
          xs={12}
          sx={{
            color: "white",
            height: "35px",
            backgroundColor: theme.palette.primary.main,
            width: "100%",
          }}
        >
          <Typography
            sx={{ fontWeight: "bold", height: "35px", lineHeight: 2.5 }}
          >
            {t("traits")}
          </Typography>
        </Grid>
      )}
      <Grid item sx={{ height: "90%", overflowY: "scroll" }}>
        <Grid container>
          <Grid item xs={3}>
            <Tabs
              value={activeTrait}
              onChange={(_, newValue) => setActiveTrait(newValue)}
              orientation="vertical"
              variant="scrollable"
              textColor="primary"
              indicatorColor="primary"
              sx={{ width: "100%" }}
            >
              {Object.keys(traitsCat).map((thisCat, indexCat) => (
                <Tab
                  key={indexCat}
                  label={t(thisCat)}
                  disabled={hasTraitsCat(thisCat)}
                />
              ))}
            </Tabs>
          </Grid>
          <Grid item xs={9} sx={{ overflowY: "scroll" }} className="traits-tab">
            <Grid container>
              {Object.keys(traitsCat).map((thisCat, indexCat) => {
                if (Object.keys(traitsCat[thisCat]).length > 0) {
                  return (
                    <Grid
                      item
                      xs={12}
                      key={indexCat}
                      hidden={activeTrait !== indexCat}
                      sx={{ overflowY: "scroll" }}
                    >
                      <CardContent sx={{ overflowY: "scroll" }}>
                        <TraitsOverallTab
                          key={`${type}-${indexCat}`}
                          traitCat={thisCat}
                          traitsThisCat={traitsCat[thisCat]}
                          indexCat={indexCat}
                          traitSelection={traitSelection}
                          searchSpecies={searchSpecies}
                          type={type}
                        />
                      </CardContent>
                    </Grid>
                  );
                }
                return <></>;
              })}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default TraitsOverall;
