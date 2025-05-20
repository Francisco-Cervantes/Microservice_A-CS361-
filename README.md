
# Communication Contract

# Requesting Data from Hotel Microservice
- To request information locally, the client can request information via a HTTP POST. The POST that will recieve the information is (http://localhost:3005/hotels). 
- To retireve information for a given area, the user can make a request via a string input. Such that the microservice can process and retrieve hotel information within that given area. 
- Example of Data Request: 

     
            const city = await user_prompt("Enter in a city: ");
            const response = await axios.post("http://localhost:3005/hotels", {
                /*passing in the user input as a string*/
                city
            });


# Client Receiving Data from Hotel Microservice
- The microservice will receieve the name of hotel and return name of the hotel, address, distance, and latitude/longitude postion. 
- Retrieving data from microservice:

            /*the user input a city, now we want to retrieve data and print*/
              const city = await user_prompt("Enter in a city: ");

              /*retrived information based on area */
              const response = await axios.post("http://localhost:3005/hotels", {
                    city
                });

                /*print it back to user provided the name,address, distance etc*/
               console.log("Hotels in the area: ", response.data)

# UML Sequence Diagram





![UML Diagram](UML-Sequence-Design.png)
