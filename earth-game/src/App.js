import React, {Component} from 'react';
import axios from 'axios';
import { Map, GoogleApiWrapper, Marker, Circle} from 'google-maps-react';
import mapStyles from './mapStyles.json';
import cities from './cities.json';
import './App.css';

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return Math.round(d);
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

class MapContainer extends Component {
 
  constructor(props) {

    var item = cities[Math.floor(Math.random() * cities.length)];
    super(props);
    this.state = {
      circle: false,
      markers: [],
      cityArr: cities.slice(),
      city: item,
      msg: `Can you find ${item.MGLSDE_L_4}?`
    };
    this.onClick = this.onClick.bind(this);
  }

  
  getHint = () => {
    this.setState(previousState => {
      return {
        circle: true
      };
    });
  }

  getLocation = () => {
    var item = this.state.cityArr[Math.floor(Math.random() * this.state.cityArr.length)];
    this.setState(previousState => {
      return {
        circle: false,
        markers: [],
        city: item,
        msg: `Can you find ${item.MGLSDE_L_4}?`
      };
    });
  }

  onClick(t, map, coord) {
    const { latLng } = coord;
    const lat = latLng.lat();
    const lng = latLng.lng();

    this.setState(previousState => {
      return {
        markers: [
          {
            position: { lat, lng }
          }
        ]
      };
    });
    const dist = getDistanceFromLatLonInKm(lat, lng, this.state.city.Y, this.state.city.X);
    if (dist < 5){
      this.setState(previousState => {
        return {
          msg: 'Well done!!'
        };
    });
  } else {
    this.setState(previousState => {
      return {
        msg: `You are ${dist} km from ${this.state.city.MGLSDE_L_4}`
      };
  });
  }
  }

render() {
    
    return (
      <div id = "map">
      <h1>{this.state.msg}
      <button id = "nextBtn" onClick={this.getLocation}>next location</button>
      <button id = "getHintBtn" onClick={this.getHint}>Hint!</button>
      </h1>
        <Map
          google={this.props.google}
          className={"map"}
          zoom={7}
          onClick={this.onClick}
          styles={mapStyles}
          zoomControl = {false}
          initialCenter={
            {
              lat: 31.882738,
              lng: 34.974029
            }
          }
          >
            {this.state.circle && <Circle
        radius={30000}
        center={{lat: this.state.city.Y + (Math.random() * 2 - 1) * 0.3 ,lng: this.state.city.X + (Math.random() * 2 - 1) * 0.3}}
        strokeColor='transparent'
        strokeOpacity={100}
        strokeWeight={5}
        fillColor='red'
        fillOpacity={0.4}
        onClick={() => this.setState(previousState => {
          return {
            circle: false
          };
      })}
      />}
            {this.state.markers.map((marker, index) => (
            <Marker
              key={index}
              title={marker.title}
              name={marker.name}
              position={marker.position}
            />
          ))}
        </Map>
    </div>
    );}
}

export default GoogleApiWrapper({
  apiKey: "Enter you key"

})(MapContainer);
