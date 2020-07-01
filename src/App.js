import React, { useEffect, useState } from 'react';
import { BrowserRouter, NavLink, Switch, Route } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import SimpleGraph from './Components/SimpleGraph';
import ParamGraph from './Components/ParamGraph';
import CityForm from './Components/CityForm';

export default function App() {
  const useStyles = makeStyles(() => ({
    root: {
      flexDirection: 'row'
    },
    menuButton: {
      marginRight: 2,
    },
    title: {
      flexGrow: 1,
    },
  }));
  const classes = useStyles();

  return (
    <div className="App">
      <BrowserRouter>
        {/* <nav className={classes.root}>
          <AppBar position="static">
            <NavLink to="/"><Button color="white">Home</Button></NavLink>
            <NavLink to="/simple"><Button color="white">Simple Graph</Button></NavLink>
            <NavLink to="/params"><Button color="white">Parametric Model Graphs</Button></NavLink>
          </AppBar>
        </nav> */}
        <Switch>
          <Route exact path="/">
            {/* <Typography variant="h3">
              Click on any of the two options above to see the graphs
            </Typography> */}
            <CityForm />
          </Route>
          <Route path="/simple">
            <SimpleGraph />
          </Route>
          <Route path="/graph">
            <ParamGraph />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

