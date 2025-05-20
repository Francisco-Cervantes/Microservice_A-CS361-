const axios = require("axios");
const { resolve } = require("path");
const readline = require("readline");

/*creating a prompt to get user input; either city or lat/lng coord*/
function user_prompt(query) {
  const user_answer = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });


  return new Promise(resolve => user_answer.question(query, ans => {
    user_answer.close();
    resolve(ans)
  }))

}

async function hotel_report() {
  try {
    const city = await user_prompt("Enter in a city: ");

    const response = await axios.post("http://localhost:3005/hotels", {
      city
    });

    console.log("Hotels in the area: ", response.data)
   
  } catch (error) {
   console.error("Did not work: ", error.message);
 }
}

hotel_report()
