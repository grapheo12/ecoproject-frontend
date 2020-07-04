import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import SideBar from './SideBar';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {LineChart, XAxis, YAxis, Legend, Tooltip, CartesianGrid, Line} from 'recharts';

const useStyles = makeStyles(() => ({
    formRoot: {
      '& .MuiTextField-root': {
        margin: 3,
        width: '25ch',
      },
    },
    btnRoot: {
        '& > *': {
            margin: '4px',
        },
        marginTop: '25px',
    },
    icon: {
        margin: 1,
        fontSize: 32
    },
    accordionRoot: {
        width: '100%'
    },
    accordionHeading: {
        fontSize: 15,
        fontWeight: 'regular' 
    },
    cardRoot: {
        maxWidth: 1000
    },
}));

function ParamGraph({ history }) {
    const [sidebarState, setSidebarState] = useState(true);
    const [plots, plotSetter] = useState([]);
    const [graphData, setGraphData] = useState([]);
    const [colorChart, colorSetter] = useState({a: '#000000', z: '#ffffff'});
    const toggleDrawer = () => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
          return;
        }
        
        if (sidebarState === true)
            setSidebarState(false);
        else
            setSidebarState(true);
    };

    const classes = useStyles();

    const createSpace = () => {
        let data = JSON.parse(localStorage.getItem("data"));
        return (
            <div className={classes.accordionRoot}>
                {
                    data.regions.map((elt, idx) => (
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls={"graph-" + String(idx) + "-content"}
                                id={"graph-" + String(idx) + "-header"}
                            >
                                <Typography className={classes.accordionHeading}>Region {idx + 1}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <LineChart
                                    data = {graphData}
                                    width = {600}
                                    height = {400}
                                    margin={{
                                    top: 10, right: 10, left: 10, bottom: 10,
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
                            </AccordionDetails>
                        </Accordion>
                    ))
                }
            </div>
        );
    }
    return (
        <div>
            <SideBar anchor={"Scenario Controls"} open={sidebarState} closefunc={toggleDrawer()} />
            <Button variant="contained" onClick={toggleDrawer()}>Change Scenarios</Button>
            <Button variant="contained" onClick={() => {history.push("/")}}>Back to Region Settings</Button>
            {
                createSpace()
            }
        </div>
    )
}

export default withRouter(ParamGraph);