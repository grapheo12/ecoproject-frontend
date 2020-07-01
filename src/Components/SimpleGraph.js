import React, { useEffect, useState } from 'react';
import {LineChart, XAxis, YAxis, Legend, Tooltip, CartesianGrid, Line} from 'recharts';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import Slider from '@material-ui/core/Slider';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';


const useStyles = makeStyles({
  root: {
    width: 300
  },
  formControl: {
    margin: 2,
    minWidth: 120,
    maxWidth: 300
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  chip: {
    margin: 2
  },
  noLabel: {
    marginTop: 3
  }
});

export default function SimpleGraph({ history }) {
  const backend_url = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
  var [data, dataSetter] = useState([{dum: 1, my: 2}]);
  var [range, rangeSetter] = useState([25, 70]);
  var [maxDay, maxDaySetter] = useState(200);
  var [plots, plotSetter] = useState([]);
  var [colorChart, colorSetter] = useState({dum: '#000000', my: '#ffffff'});
  const classes = useStyles();
  useEffect(() => {
    axios.get(`${backend_url}/all?start=${range[0]}&end=${range[1]}`)
      .then(({ data }) => {
        dataSetter(() => (data));
        Object.keys(data[0]).forEach((elt) => {
          colorChart[elt] = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16)});
          console.log(colorChart);
        });
      })
      .catch((err) => {
        console.log(err);
      });

    axios.get(`${backend_url}/numdays`)
      .then(({data}) => {
        console.log(data)
        maxDaySetter(() => (Number(data.numDays)));

      })
      .catch((err) => {
        console.log(err);
      })
  }, []);

  function rangeChanger(event, newValue){
    console.log(newValue);
    rangeSetter(() => (newValue));
    axios.get(`${backend_url}/all?start=${range[0]}&end=${range[1]}`)
      .then(({ data }) => {
        dataSetter(() => (data));
        console.log(Object.keys(data[0]));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className="SimpleGraph">
      <LineChart
        data = {data}
        width = {600}
        height = {400}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3.3" />
        <Tooltip />
        <XAxis dataKey="day" label="Day" type="number" domain={['dataMin', 'dataMax']} />
        <YAxis />
        <Legend />
        {
          plots.map((plt) => (
            <Line type="monotone" dataKey={plt} stroke={(() => {console.log(colorChart[plt]); return colorChart[plt];})()} dot={{r: 1}} />
          ))
        }
      </LineChart>

      <div className={classes.root}>
        <Typography gutterBottom>
          Date Range:
        </Typography>

        <Slider
          value={range}
          onChange={rangeChanger}
          valueLabelDisplay="auto"
          aria-labelledby="range-slider"
          max={maxDay}

        />

      </div>

      <div>
        <FormControl className={classes.formControl}>
          <InputLabel>Plots</InputLabel>
          <Select
            labelId="plots-label"
            multiple
            input={<Input />}
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
              <MenuItem key={k} value={k} className={classes.chip}>{k}</MenuItem>
            ))}

          </Select>
        </FormControl>
      </div>
    </div>
  );
}
