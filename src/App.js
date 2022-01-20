import logo from './logo.svg';
import './App.css';
import Card from '@mui/material/Card';
import { createTheme} from '@mui/material/styles';
import { Avatar, CardActions, CardContent, Divider } from '@mui/material';
import { deepOrange } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import { Typography, CardHeader } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import {Box} from '@mui/material';
import {Tabs, Tab} from '@mui/material';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import DateInfo from './DateInfo';
import Grid from '@material-ui/core/Grid';

function App() {

const [city, setCity] = useState(null);
const [value, setValue] = useState(0);
const [dates, setDates] = useState([])
const key = 'db89d335768a7658335905728b95f864';
const [descriptions, setDescriptions] = useState([]);

useEffect(() =>{
  fetch('/location')
    .then((response) =>{  return response.json();})
    .then((data) =>{
      setCity(data.city);
      fetch('https://api.openweathermap.org/data/2.5/forecast?q='+ data.city +'&appid='+ key +'&units=metric')
        .then((forecastResponse) =>{ return forecastResponse.json()})
        .then((forecastData) =>{

          let list = forecastData.list;
          let index = 0;
          let dateSet = [];
          for(let i = 0; i<5; i++)
          {

            let dateIdentifier = list[index].dt_txt.split(" ")[0];
            let dateInfo = new DateInfo(dateIdentifier);
            while(list[index].dt_txt.includes(dateInfo.dateText))
            {
              dateInfo.staggeredInfo.push(list[index]);
              index++;
            }
            dateSet.push(dateInfo);
          }

          setDates([...dateSet]);
          let infoSet = [];
          dateSet.forEach((date) => {infoSet.push({stats:date.stats, date:date.date.charAt(0)})});
          setDescriptions([...infoSet]);
        });

    });
},[]);


const handleChange = (event, newValue) => {
  setValue(newValue);
}


  function TabPanel(props)
  {
    const {children, value, index} = props;
    let dayString = "Day";
    let aveTemp = 0;
    let extraInfo = {};
    let icon = null;
    let description = "Description";
    if(dates.length > 0)
    {
      dayString = dates[index].date;
      aveTemp = dates[index].averageTemp;
      extraInfo = dates[index].stats.speed.toString();
      icon = dates[index].icon;
      description = dates[index].details;
      extraInfo = dates[index].stats;
    }
    return(
      <div
        role="tabpanel"
        visible={(value !== index).toString()}
        id={`tabpanel-${index}`}
      >
        {value === index && 
        <Box>
          <CardHeader avatar={
          <Avatar component="div" src={icon} sx={{
            bgcolor: deepOrange[500],
            width:80,
            height:80
          }}></Avatar>} 
          title={<Typography align="right" variant="h5">{city}</Typography>} subheader={<Typography align="right" variant="body1">{dayString}</Typography>} sx={{
            top:50
          }}>
          </CardHeader>

          <CardContent>
            <Typography align="right" variant="body2">{description}</Typography>
              <Typography variant="h2" sx={{ color:"white"}}>
                {aveTemp+"°"}
              </Typography>
          </CardContent>
        </Box>}
      </div>
    );
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  function a11yProps(index)
  {
    return{
      id: `simple-tab-${index}`,
      'aria-controls' : `simple-tabpanel-${index},`
    };
  }

  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const CustomCard = styled(Card)(()=>({
    raised:true,
    eleveation:10,
    maxWidth:800,
    minHeight:200,
    background: "linear-gradient(to right bottom, #329994, #315f78)"
  }));


  return (

    <Grid container spacing={10}
    alignItems="flex-start"
    justifyContent="center"
    style={{ minHeight: '100vh' }}>
      <Grid item xs={5}>
      <CustomCard>
      <TabPanel value={value} index={0}/>
      <TabPanel value={value} index={1}/>
      <TabPanel value={value} index={2}/>
      <Divider></Divider>
      <CardActions>
        <Tabs value={value} onChange={handleChange}>
          <Tab label={descriptions.length > 0 ? descriptions[0].date : "loading..."} {...a11yProps(0)}/>
          <Tab label={descriptions.length > 0 ? descriptions[1].date : "loading..."} {...a11yProps(1)}/>
          <Tab label={descriptions.length > 0 ? descriptions[2].date : "loading..."} {...a11yProps(2)}/>
        </Tabs>
        <IconButton onClick={handleExpandClick}sx={{
          transform: !expanded ? 'rotate(0deg)' : 'rotate(180deg)',
          marginLeft: 'auto',
        }}>
          <ExpandMoreIcon/>
        </IconButton>
      </CardActions>
        <Collapse in={expanded} unmountOnExit>
          <CardContent>
            <Divider/>
            <Typography paragraph>
              {descriptions.length > 0 ? "SPEED: "+descriptions[value].stats.speed+" km/h" : "Loading"}
            </Typography>
            <Typography paragraph>
              {descriptions.length > 0 ? "DEGREE: "+descriptions[value].stats.deg+"°" : "Loading"}
            </Typography>
            <Typography paragraph>
              {descriptions.length > 0 ? "GUST: "+descriptions[value].stats.gust+" m/s" : "Loading"}
            </Typography>
          </CardContent>
        </Collapse>
    </CustomCard>
  </Grid>
</Grid>
    
  );
}

export default App;

