import React from "react";
import { useState } from "react";
import { cloneDeep } from "lodash";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import { withRouter } from "react-router-dom";

const useStyles = makeStyles(() => ({
  formRoot: {
    "& .MuiTextField-root": {
      margin: 3,
      width: "25ch",
    },
  },
  btnRoot: {
    "& > *": {
      margin: "8px",
    },
    marginTop: "25px",
  },
  icon: {
    margin: 1,
    fontSize: 32,
  },
  accordionRoot: {
    width: "100%",
    marginBottom: "1rem",
  },
  accordionHeading: {
    fontSize: 15,
    fontWeight: "regular",
  },
  cardRoot: {
    maxWidth: 1000,
  },
}));

function keyToFieldName(key) {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, function (str) {
    return str.toUpperCase();
  });
}

/* Change this object to add new fields
    Structure:
        Label:
            inputFieldName: defaultValue
 */

const defaultRegion = {
  basic: {
    totalSimulatedDays: 100,
  },
  basicPopulation: {
    populationTotal: 100000,
    populationDensity: 200,
    familySize: 5,
    familySizeVar: 1,
  },
  populationDistribution: {
    l18: 0.381,
    l25: 0.126,
    l60: 0.346,
    l80: 0.075,
    l150: 0.08,
  },
  transportation: {
    expectedPeopleAtAirport: 4,
    varianceOfPeopleAtAirport: 1,
    expectedPeopleAtRailwayStation: 60,
    varianceOfPeopleAtRailwayStation: 10,
    numberOfLocalTransport: 1,
    expectedPeopleAtLocalTransport: 1,
  },
  transactionModel: {
    probabilityOfPurchase: 0.5,
    minimumGroceryRequirements: 19,
  },
};

function CityForm({ history }) {
  const [formData, setformData] = useState(
    JSON.parse(localStorage.getItem("data")) || {
      numRegions: 1,
      regions: [cloneDeep(defaultRegion)],
    }
  );

  const saveData = () => {
    localStorage.setItem("data", JSON.stringify(formData));
    //Might need to use Redux if complexity increases
    history.push("/graph");
  };

  const clearData = () => {
    localStorage.removeItem("data");
    setformData({
      numRegions: 1,
      regions: [cloneDeep(defaultRegion)],
    });
  };
  const incRegion = () => {
    let num = formData.numRegions + 1;
    let reg = [...formData.regions, cloneDeep(defaultRegion)];

    setformData({
      numRegions: num,
      regions: reg,
    });
  };

  const delRegion = (idx) => {
    if (formData.numRegions > idx) {
      let num = formData.numRegions - 1;
      let reg = [];
      for (let i = 0; i < formData.numRegions; i++) {
        if (i !== idx) {
          reg.push(formData.regions[i]);
        }
      }
      setformData({
        numRegions: num,
        regions: reg,
      });
    }
  };

  const editField = (idx, group, key, val) => {
    let reg = cloneDeep(formData.regions);
    reg[Number(idx)][group][key] = Number(val);
    setformData({
      numRegions: formData.numRegions,
      regions: reg,
    });
  };

  const classes = useStyles();

  return (
    <div className="mainform">
      <div className="formarray">
        {formData.regions.map((elt, idx) => {
          let keys = Object.keys(elt);
          return (
            <Card className={classes.cardRoot}>
              <CardHeader
                avatar={
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      delRegion(idx);
                    }}
                  >
                    <DeleteIcon className={classes.icon} />
                  </Button>
                }
                title={"Region " + String(idx + 1)}
              />
              <CardContent>
                <form className={classes.formRoot}>
                  {keys.map((e) => {
                    let data = elt[e];
                    let dataKeys = Object.keys(data);
                    return (
                      <div className={classes.accordionRoot}>
                        <Accordion>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={e + String(idx) + "-content"}
                            id={e + String(idx) + "-header"}
                          >
                            <Typography className={classes.accordionHeading}>
                              {keyToFieldName(e) + " Parameters"}
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            {dataKeys.map((d) => (
                              <TextField
                                label={keyToFieldName(d)}
                                defaultValue={data[d]}
                                type="number"
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                onChange={(event) => {
                                  editField(
                                    idx,
                                    e,
                                    d,
                                    event.currentTarget.valueAsNumber
                                  );
                                }}
                              />
                            ))}
                          </AccordionDetails>
                        </Accordion>
                      </div>
                    );
                  })}
                </form>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <div className={classes.btnRoot}>
        <Button
          variant="contained"
          onClick={() => {
            incRegion();
          }}
          style={{ backgroundColor: "orange" }}
        >
          Add New Region
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            saveData();
          }}
          style={{ backgroundColor: "green" }}
        >
          Save and Continue
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            clearData();
          }}
        >
          Clear Data
        </Button>
      </div>
    </div>
  );
}

export default withRouter(CityForm);
