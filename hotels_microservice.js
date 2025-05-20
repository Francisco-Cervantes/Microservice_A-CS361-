/*using this to test, can remove is issues arise */
const fetch = require('node-fetch');
/*end of testing modules */
const express = require("express");
const cors = require("cors");
const axios = require("axios"); 
const app = express();

app.use(express.json());
app.use(cors());

/*function  for returning the lat and lng coordinates for a given location*/
const getCityCoordinates = async(city) => {
  try {
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`);
    const geoData = await geoRes.json();

    if (geoData.results && geoData.results.length > 0) {
        const {latitude, longitude} = geoData.results[0];
        return {latitude, longitude};
    } else {
      throw new Error(`Coordinates for "${city}" not found.`);
    }
  } catch(error) {
    console.error("Error fetching coordinates:", error);
    throw new Error (`Failed to fetch coordinates for "${city}"`);
  }
};

/*function for entering the city and grabbing hotel info*/
app.post("/hotels", async(req, res) => {
  const {city, latitude, longitude} = req.body;
  console.log("Microservice recieved:", {city}, {latitude}, {latitude});


  try{
    /*if the city is found */
    if (city) {
      const {latitude, longitude} = await getCityCoordinates(city);
      console.log("in (if city)", latitude, longitude)
      const foursquareRes = await axios.get("https://api.foursquare.com/v3/places/search",{
        headers: {
          Authorization : "fsq3uDkptSDSbHS+pVTqTZBvfjl9Zx3Ak/xlUXC9v8rAeAU=",
        },
        params: {
          ll: `${latitude},${longitude}`,
          radius: 10000,
          categories: "19014",
          limit: 20,
        },
      });

      res.json({city, places: hotels_process(foursquareRes) });
    } else if (latitude && longitude) {
      console.log("in (if lat/lon", latitude, longitude)
        const foursquareRes = await axios.get("https://api.foursquare.com/v3/places/search", {
          headers: {
          Authorization : "fsq3uDkptSDSbHS+pVTqTZBvfjl9Zx3Ak/xlUXC9v8rAeAU=",
        },
        params: {
          ll: `${latitude}, ${longitude}`,
          radius: 10000,
          categories: "19014",
          limit: 20,
        },
      });
      res.json({city, places: hotels_process(foursquareRes) });
    } else {
      return res.status(400).json({error: "City for Latitude/Longitude is required! "});
    }
  } catch (error) {
    console.error("Error fetching hotels:", error.message);
    res.status(500).json({error: "Failed to fetch hotels"});
  }

});



/*function for processing and returning hotel information for a given area */
const hotels_process = (foursquareRes) => {
  const hotels = foursquareRes.data.results.map((hotel) => ({
    name: hotel.name,
    address: hotel.location?.formatted_address || "",
    categories: hotel.categories?.map((c) => c.name) || [],
    distance: hotel.distance,
    lat: hotel.geocodes?.main?.latitude,
    lng: hotel.geocodes?.main?.longitude,
  }));

  return hotels
}

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

/*using 3005 for the hotels port*/
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`places microservice running on port ${PORT}`);
});

