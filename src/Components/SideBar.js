import React, { Fragment, useState, useEffect } from "react";
import { cloneDeep } from "lodash";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import CloseIcon from "@material-ui/icons/Close";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles({
  list: {
    width: 500,
  },
  fullList: {
    width: "auto",
  },
  cardRoot: {
    maxWidth: 500,
  },
  formRoot: {
    "& .MuiTextField-root": {
      margin: 3,
      width: "25ch",
    },
  },
  btnRoot: {
    "& > *": {
      margin: "4px",
    },
    marginTop: "25px",
  },
  icon: {
    margin: 1,
    fontSize: 32,
  },
  accordionRoot: {
    width: "100%",
  },
  accordionHeading: {
    fontSize: 15,
    fontWeight: "regular",
  },
});

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

const defaultScenario = {
  control: {
    testingCapacity: 1000,
    durationOfLockdown: 20,
    socialDistanceRatio: 0.5,
  },
};

export default function SideBar({ anchor, open, closefunc }) {
  const [formData, setformData] = useState(
    JSON.parse(localStorage.getItem("scendata")) || {
      numScenarios: 1,
      scenarios: [cloneDeep(defaultScenario)],
    }
  );

  const saveData = () => {
    localStorage.setItem("scendata", JSON.stringify(formData));
    //Might need to use Redux if complexity increases
  };

  const clearData = () => {
    localStorage.removeItem("scendata");
    setformData({
      numScenarios: 1,
      regions: [cloneDeep(defaultScenario)],
    });
  };
  const incScenario = () => {
    let num = formData.numScenarios + 1;
    let reg = [...formData.scenarios, cloneDeep(defaultScenario)];

    setformData({
      numScenarios: num,
      scenarios: reg,
    });
  };

  const delScenario = (idx) => {
    if (formData.numScenarios > idx) {
      let num = formData.numScenarios - 1;
      let reg = [];
      for (let i = 0; i < formData.numScenarios; i++) {
        if (i !== idx) {
          reg.push(formData.scenarios[i]);
        }
      }
      setformData({
        numScenarios: num,
        scenarios: reg,
      });
    }
  };

  const editField = (idx, group, key, val) => {
    let reg = cloneDeep(formData.regions);
    reg[Number(idx)][group][key] = Number(val);
    setformData({
      numScenarios: formData.numScenarios,
      regions: reg,
    });
  };

  const classes = useStyles();
  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === "top" || anchor === "bottom",
      })}
      role="presentation"
    >
      <Button onClick={closefunc}>
        <CloseIcon />
      </Button>
      <List>
        {formData.scenarios.map((elt, idx) => {
          let keys = Object.keys(elt);
          return (
            <ListItem key={idx}>
              <Card className={classes.cardRoot}>
                <CardHeader
                  avatar={
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        delScenario(idx);
                      }}
                    >
                      <DeleteIcon className={classes.icon} />
                    </Button>
                  }
                  title={"Scenario " + String(idx + 1)}
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
                <CardActions>
                  <Button
                    color="secondary"
                    onClick={() => {
                      document.getElementById(
                        "progress-" + String(idx)
                      ).style.display = "inline";
                    }}
                  >
                    Simulate
                    <CircularProgress
                      id={"progress-" + String(idx)}
                      style={{ display: "none", marginLeft: "10px" }}
                    />
                  </Button>
                </CardActions>
              </Card>
            </ListItem>
          );
        })}
      </List>
      <Divider />
      <Button
        onClick={() => {
          incScenario();
        }}
        style={{ backgroundColor: "orange", margin: "1rem" }}
      >
        Add new scenario
      </Button>
    </div>
  );

  return (
    <Fragment key="left">
      <Drawer anchor={anchor} open={open} onClose={closefunc}>
        {list("left")}
      </Drawer>
    </Fragment>
  );
}
