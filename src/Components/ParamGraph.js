import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import SideBar from "./SideBar";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {
  LineChart,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
  CartesianGrid,
  Line,
} from "recharts";
import Input from "@material-ui/core/Input";
import Checkbox from "@material-ui/core/Checkbox";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Chip from "@material-ui/core/Chip";
import MenuItem from "@material-ui/core/MenuItem";
import Slider from "@material-ui/core/Slider";
import axios from "axios";
import { render } from "@testing-library/react";
import "./style.css";

const useStyles = makeStyles(() => ({
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
    cardRoot: {
      maxWidth: 1000,
    },
    root: {
      width: 300,
    },
    formControl: {
      margin: 2,
      minWidth: 120,
      maxWidth: 300,
    },
    chips: {
      display: "flex",
      flexWrap: "wrap",
    },
    chip: {
      margin: 2,
    },
    noLabel: {
      marginTop: 3,
    },
  },
}));
var pass = 0;
function ParamGraph({ history }) {
  const [sidebarState, setSidebarState] = useState(true);
  const [plots, plotSetter] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [colorChart, colorSetter] = useState({ a: "#000000", z: "#ffffff" });
  const backend_url =
    process.env.REACT_APP_BACKEND_URL || "http://ecoprojectkgp.herokuapp.com/";
  const [data, dataSetter] = useState([{ a: 1, z: 2 }]);
  const [range, rangeSetter] = useState([25, 70]);
  const [maxDay, maxDaySetter] = useState(200);
  const [show, showgraph] = useState(false);
  const classes = useStyles();
  const basicList = {
    cumulativeTrueCases: "Cumulative True Cases",
    free: "Total Free Infected",
    quarantined: "Total Quarantined",
    isolated: "Total Isolated",
    hospitalized: "Total Hospitalised",
    icu: "Total in ICU",
    recoveries: "Total Recoveries",
    deaths: "Total Deaths",
    roughRepoNumber: "Rough Repo Number",
    loss_Died: "Economic Loss due to Death",
    loss_Infected: "Economic Loss due to Infection",
    loss_idle: "Idle Economic Loss",
    loss_Total_today: "Economic Loss per Day",
    loss_Total: "Total Economic Loss",
  };

  const [list, setList] = useState({});

  pass++;
  if (pass === 2) {
    axios
      .get(`${backend_url}/all?start=${range[0]}&end=${range[1]}`)
      .then(({ data }) => {
        // dataSetter(() => (data));
        // setGraphData(() => (data));
        Object.keys(data[0]).forEach((elt) => {
          colorChart[elt] = "#000000".replace(/0/g, function () {
            return (~~(Math.random() * 16)).toString(16);
          });
          console.log(colorChart);
        });
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(`${backend_url}/numdays`)
      .then(({ data }) => {
        console.log(data);
        maxDaySetter(() => Number(data.numDays));
      })
      .catch((err) => {
        console.log(err);
      });
  }
  //   });

  const toggleDrawer = () => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    if (sidebarState === true) setSidebarState(false);
    else setSidebarState(true);
  };

  const createSpace = () => {
    function rangeChanger(event, newValue) {
      console.log(newValue);
      rangeSetter(() => newValue);
      axios
        .get(`${backend_url}/all?start=${range[0]}&end=${range[1]}`)
        .then(({ data }) => {
          dataSetter(() => data);
          setGraphData(() => data);
          console.log(Object.keys(data[0]));
        })
        .catch((err) => {
          console.log(err);
        });
    }
    let datax = JSON.parse(localStorage.getItem("data"));
    return (
      <div>
        <div
          style={{
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div>
            <Typography gutterBottom>Date Range:</Typography>

            <Slider
              value={range}
              onChange={rangeChanger}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              max={maxDay}
              style={{ width: "12rem", color: "brown" }}
            />
          </div>
        </div>
        <div
          style={{
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FormControl className={classes.formControl}>
            <InputLabel style={{ color: "white" }}>Plots</InputLabel>
            <Select
              labelId={"plots-label"}
              multiple
              input={<Input />}
              menuColor="white"
              value={plots}
              onChange={(event) => {
                console.log(event.target.value);
                plotSetter(event.target.value);
              }}
              renderValue={(selected) => (
                <div className={classes.chips}>
                  {selected.map((val) => (
                    <Chip key={val} label={val} className={classes.chip} />
                  ))}
                </div>
              )}
            >
              {Object.keys(data[0]).map((k) => (
                <MenuItem key={k} value={k} className={classes.chip}>
                  {k}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div
          style={{
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div>
            <Checkbox
              onClick={() => showgraph(!show)}
              style={{ color: "white" }}
            />
            <label>Show all graphs seperately</label>
          </div>
        </div>
        <div className={classes.accordionRoot}>
          {datax.regions.map((elt, idx) => (
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={"graph-" + String(idx) + "-content"}
                id={"graph-" + String(idx) + "-header"}
              >
                <Typography className={classes.accordionHeading}>
                  Region {idx + 1}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {!show && (
                  <div>
                    <LineChart
                      data={graphData.filter(
                        (elt) => elt.day <= range[1] && elt.day >= range[0]
                      )}
                      width={600}
                      height={400}
                      margin={{
                        top: 10,
                        right: 10,
                        left: 10,
                        bottom: 10,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3.3" />
                      <Tooltip />
                      <XAxis
                        dataKey="day"
                        label="Day"
                        type="number"
                        domain={range}
                      />
                      <YAxis />
                      <Legend />
                      {plots.map((plt) => (
                        <Line
                          type="monotone"
                          dataKey={plt}
                          stroke={(() => {
                            console.log(colorChart[plt]);
                            return colorChart[plt];
                          })()}
                          dot={{ r: 1 }}
                        />
                      ))}
                    </LineChart>
                  </div>
                )}
                {show && (
                  <div>
                    {plots.map((plt) => (
                      <div>
                        <h2>{list[plt]}</h2>
                        <LineChart
                          data={graphData.filter(
                            (elt) => elt.day <= range[1] && elt.day >= range[0]
                          )}
                          width={600}
                          height={400}
                          margin={{
                            top: 10,
                            right: 10,
                            left: 10,
                            bottom: 10,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3.3" />
                          <Tooltip />
                          <XAxis
                            dataKey="day"
                            label="Day"
                            type="number"
                            domain={range}
                          />
                          <YAxis />
                          <Legend style={{ display: "none" }} />
                          {
                            <Line
                              type="monotone"
                              dataKey={plt}
                              stroke={(() => {
                                console.log(colorChart[plt]);
                                return colorChart[plt];
                              })()}
                              dot={{ r: 1 }}
                            />
                          }
                        </LineChart>
                      </div>
                    ))}
                  </div>
                )}
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </div>
    );
  };

  const composeData = (str, callback) => {
    let newdata = JSON.parse(localStorage.getItem(str));
    let newnewdata = [];
    for (let i = 0; i < newdata.data.length; i++) {
      let obj = {};
      console.log(Object.keys(newdata.data[i]));
      Object.keys(newdata.data[i]).forEach((key) => {
        if (key !== "day") obj[String(key + "_" + str)] = newdata.data[i][key];
        else obj[key] = newdata.data[i][key];
      });
      newnewdata.push(obj);
    }
    let cpList = cloneDeep(list);
    let newlist = {};
    for (let key in Object.keys(basicList)) {
      newlist[key + str] = basicList[key];
    }
    setList({
      ...cpList,
      ...newlist,
    });

    let gdt = cloneDeep(graphData);
    if (gdt.length === 0) {
      console.log("0 length");
      dataSetter(newnewdata);
      setGraphData(newnewdata);
    } else {
      for (let i = 0; i < gdt.length; i++) {
        gdt[i] = {
          ...gdt[i],
          ...newnewdata[i],
        };
      }
      dataSetter(gdt);
      setGraphData(gdt);
    }

    maxDaySetter(newnewdata.length);

    callback();

    return (
      <div>
        <SideBar
          anchor={"Scenario Controls"}
          open={sidebarState}
          closefunc={toggleDrawer()}
          composer={composeData}
        />
        <Button variant="contained" onClick={toggleDrawer()}>
          Change Scenarios
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            history.push("/");
            pass = 0;
          }}
        >
          Back to Region Settings
        </Button>
        {createSpace()}
      </div>
    );
  };
  return (
    <div>
      <SideBar
        anchor={"Scenario Controls"}
        open={sidebarState}
        closefunc={toggleDrawer()}
      />
      <Button
        variant="contained"
        onClick={toggleDrawer()}
        style={{
          margin: "0.6rem",
          backgroundColor: "rgb(95,158,160)",
          color: "white",
          borderRadius: 20,
        }}
      >
        Change Scenarios
      </Button>
      <Button
        variant="contained"
        onClick={() => {
          history.push("/");
          pass = 0;
        }}
        style={{
          margin: "0.6rem",
          backgroundColor: "rgb(95,158,160)",
          color: "white",
          borderRadius: 20,
        }}
      >
        Back to Region Settings
      </Button>
      {createSpace()}
    </div>
  );
}

export default withRouter(ParamGraph);
