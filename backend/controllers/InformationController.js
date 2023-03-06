const fs = require("fs");
const csv = require("csv-parser");
const axios = require("axios");
const stringSimilarity = require('string-similarity');

let dataArray = [];
fs.createReadStream("idiya.csv")
  .pipe(csv())
  .on("data", (data) => {
    dataArray.push(data);
  })
  .on("end", () => {
    processData(dataArray);
  });

const processData = (data) => {
  // console.log(data);
};






async function getInformation(req, res) {
  // function levenshteinDistance(s1, s2) {
  //   // Create a 2D array to store the Levenshtein distances
  //   const distances = [];
  
  //   // Initialize the first row and column with incremental values
  //   for (let i = 0; i <= s1.length; i++) {
  //     distances[i] = [i];
  //   }
  //   for (let j = 0; j <= s2.length; j++) {
  //     distances[0][j] = j;
  //   }
  
  //   // Compute the Levenshtein distances
  //   for (let i = 1; i <= s1.length; i++) {
  //     for (let j = 1; j <= s2.length; j++) {
  //       const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
  //       distances[i][j] = Math.min(
  //         distances[i - 1][j] + 1, // Deletion
  //         distances[i][j - 1] + 1, // Insertion
  //         distances[i - 1][j - 1] + cost // Substitution
  //       );
  //     }
  //   }
  
  //   // Return the Levenshtein distance between the two strings
  //   return distances[s1.length][s2.length];
  // }
  
  // function replaceSimilarStrings(message, target, replacement) {
  //   // Split the input message into an array of words
  //   const words = message.split(" ");
  
  //   // Loop through each word and replace it if it is similar to the target
  //   for (let i = 0; i < words.length; i++) {
  //     const distance = levenshteinDistance(words[i], target);
  //     if (distance <= 2) { // Replace any word within a Levenshtein distance of 2 from the target
  //       words[i] = replacement;
  //     }
  //   }
  
  //   // Join the words back into a single string and return it
  //   return words.join(" ");
  // }
  
  // let message = req.body.message;
  // message = replaceSimilarStrings(message, "aziz", "aziz","azizsupermarket","aziz super marker");
  // message = replaceSimilarStrings(message, "ctg", "ctg","");
  
  // message = message.replace(/aza|ajij|azizsupermarket|ajej/gi, "aziz");
  // message = message.replace(/ctgg|chattagram|ctgee/gi, "ctg");

  function levenshteinDistance(s1, s2) {
    // Create a 2D array to store the Levenshtein distances
    const distances = [];
  
    // Initialize the first row and column with incremental values
    for (let i = 0; i <= s1.length; i++) {
      distances[i] = [i];
    }
    for (let j = 0; j <= s2.length; j++) {
      distances[0][j] = j;
    }
  
    // Compute the Levenshtein distances
    for (let i = 1; i <= s1.length; i++) {
      for (let j = 1; j <= s2.length; j++) {
        const cost = s1[i - 1].toLowerCase() === s2[j - 1].toLowerCase() ? 0 : 1;
        distances[i][j] = Math.min(
          distances[i - 1][j] + 1, // Deletion
          distances[i][j - 1] + 1, // Insertion
          distances[i - 1][j - 1] + cost // Substitution
        );
      }
    }
  
    // Return the Levenshtein distance between the two strings
    return distances[s1.length][s2.length];
  }
  
  function replaceSimilarStrings(message, target, replacement) {
    // Split the input message into an array of words
    const words = message.split(" ");
  
    // Loop through each word and replace it if it is similar to the target
    for (let i = 0; i < words.length; i++) {
      const distance = levenshteinDistance(words[i].toLowerCase(), target.toLowerCase());
      if (distance <= 2) { // Replace any word within a Levenshtein distance of 2 from the target
        words[i] = replacement;
      }
    }
  
    // Join the words back into a single string and return it
    return words.join(" ");
  }
  
  let message = req.body.message;
  message = replaceSimilarStrings(message, "aziz", "aziz","azizsupermarket", "ajijsupermarket","aziz super market","azizsuper market","aziz supermarket","ajij super market","ajijsuper market","ajiij supermarket","ajij","ajej","azez");
  message = replaceSimilarStrings(message, "ctg", "ctg","chattagram","chittagong","chittagonj","chottogram","chattagram","chattogram");
  message = replaceSimilarStrings(message, "dhk", "dhk","dhaka");
  message = replaceSimilarStrings(message, "syl", "syl","sylhet");
  message = replaceSimilarStrings(message, "price", "price");
  message = replaceSimilarStrings(message, "ecom", "ecom","ecommerce");
   message = message.replace(/bb|bB|BB|Bb|bangla bazar|banglabazar|Bangla Bazar|BANGLA BAZAR/gi, "bb");



  const properties = [
    { name: "name", property: "name" },
    { name: "aziz", property: "aziz" },
    { name: "ctg", property: "ctg" },
    { name: "dhk", property: "dhk" },
    { name: "syl", property: "syl" },
    { name: "bb", property: "bb" },
    { name: "ecom", property: "ecom" },
    { name: "price", property: "price" },


  ];

  for (const prop of properties) {
   
   

    const matches2 = stringSimilarity.findBestMatch(message, dataArray.map(d => d.name)  );
    let matchedItems2 = []; 
    if (matches2.bestMatch.rating > 0.3) {
      const matchedItem2 = dataArray[matches2.bestMatchIndex];
      matchedItems2.push(matchedItem2);
    } else {
      console.log('No match found');
    }
    console.log("matched item:", matchedItems2[0]);    
    const matchingData2 = matchedItems2[0];    
    console.log("ok version 2",matchingData2)

    // const matchingData2 = dataArray.find((d) => d.name === message || message.includes("stock") || message.includes("available"));

    console.log("matching data 2",matchingData2)



    


    const matchingData3 = dataArray.find((d) => d.sku === message);


    const queries2 = properties.filter((p) => message.includes(p.name) );


    console.log("matching queries 2",queries2);



    if (matchingData2) {
             if(queries2.length === 0){
      res.json({
        botResponse: `\n\n${matchingData2.name} is available in Dhaka : ${matchingData2.dhk} Aziz Super Market  : ${matchingData2.aziz}  Chittagong : ${matchingData2.ctg} Sylhet  : ${matchingData2.syl}  Bangla Bazar  : ${matchingData2.bb}   Ecommerce  : ${matchingData2.ecom} `,
      });
      return;
       }
    } 
    
    
    else if (matchingData3) {
      res.json({
        botResponse: `\n\n${matchingData3.name} of : ${matchingData3.description}
          }`,
      });
      return;
    } 
    

   



    const matches = stringSimilarity.findBestMatch(message, dataArray.map(d => d.name)  );
    let matchedItems = []; 
    if (matches.bestMatch.rating > 0.3) {
      const matchedItem = dataArray[matches.bestMatchIndex];
      matchedItems.push(matchedItem);
    } else {
      console.log('No match found');
    }
    console.log("matched item:", matchedItems[0]);    
    const itemName = matchedItems[0];    
    console.log("ok version",itemName)





    if (!itemName) {
      try {
        const API_KEY = process.env.OPENAI_API_KEY;
        const response = await axios({
          method: "post",
          url: "https://api.openai.com/v1/engines/text-davinci-003/completions",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
          data: {
            prompt: message,
            max_tokens: 100,
            n: 1,
            stop: "",
            temperature: 0.5,
          },
        });
        return res.json({ botResponse: "\n" + response.data.choices[0].text });
      } catch (error) {
        return res
          .status(500)
          .send({ error: "Could not generate text completion" });
      }
    }





























    



 



    const queries = properties.filter((p) => message.includes(p.name) );


    console.log("matching queries",queries);









    const result = queries
      .map((q) => {
        const data = dataArray.find((d) => d.name === itemName.name);
        if (!data || !data[q.property]) {
          return null;
        }

        return { [q.name]: data[q.property] };
      })
      .filter((r) => r !== null);
    if (result.length === 0) {
      return res.status(400).json({ error: "No matching data found" });
    }

    const response = result.reduce((prev, curr) => {
      return prev + ` ${Object.keys(curr)[0]}: ${curr[Object.keys(curr)[0]]} `;
    }, "");

    return res.json({ botResponse: `\n\n`+ "  "+ itemName.name+" " + response });
  }
}

module.exports = {
  getInformation,
};
