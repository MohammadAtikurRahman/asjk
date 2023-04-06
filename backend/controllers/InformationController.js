const fs = require("fs");
const csv = require("csv-parser");
const axios = require("axios");
const stringSimilarity = require("string-similarity");
const talisman = require("talisman/metrics/jaro-winkler");

// let dataArray = [];
// fs.createReadStream("idiya.csv")
//   .pipe(csv())
//   .on("data", (data) => {
//     dataArray.push(data);
//   })
//   .on("end", () => {
//     processData(dataArray);
//   });

// const processData = (data) => {
//    console.log(data);
// };




const API_ENDPOINT = 'https://baatighar.com/openai_chatgpt/products/dataset';
const API_KEY = 'wO8oenVz5Qbg9GNqGel2OcBNbbA';
const headers = [
  'name',
  'aziz',
  'ctg',
  'dhk',
  'syl',
  'bb',
  'ecom',
  'id',
  'reference',
  'price',
  'website_price',
  'discount_percent'
];

const dataArray = [];

axios.get(API_ENDPOINT, {
  headers: {
    'X-Authorization': API_KEY
  },
  responseType: 'stream'
})
  .then(response => {
    response.data.pipe(csv())
      .on('data', (row) => {
        const newRow = {};
        for (let i = 0; i < headers.length; i++) {
          newRow[headers[i]] = row[headers[i]] || '';
        }
        dataArray.push(newRow);
      })
      .on('end', () => {
        // console.log(dataArray);
      });
  })
  .catch(error => {
    console.error(error);
  });


  

async function getInformation(req, res) {
  let message = req.body.message;

  message = message.replace(
    /\b(aziz|azej|ajez|ajij|azz|\b(super\s*(market|store|center)|market\s*super)\b|as(?=.*\bsuper\s*(market|store|center))|ae(?=.*\bsuper\s*(market|store|center))|aj(?=.*\bsuper\s*(market|store|center))|ai(?=.*\bsuper\s*(market|store|center)))\b/gi,
    "aziz"
  );
  
  


  message = message.replace(
    /bangla\s*bazar|banglabazar|bangla\s*baza*r*|b\s*bazar|\bbangla\b|b\s*baza*r*/gi,
    "bb"
  );
  message = message.replace(/BB|bb/gi, "bb");
  message = message.replace(/\bdhk\b|\bdhaka\b/gi, "dhk");
  message = message.replace(
    /\bdh(?:aka|aka\s*city|aka\s*metropolitan)?\b|\bdhk\b|\bdacca\b|\bdekha\b|\bdhoka\b|\bdakka\b|\bdhokka\b|\bdhakka\b|\bdaccka\b|\bdhak\b|\bdhacca\b/gi,
    "dhk"
  );
  message = message.replace(/\bpric(es|ed|ing)?\b/gi, "price");
  message = message.replace(
    /\bpr[ic][ie]?[sz]?(\s*[ck]ost)?(\s*[ck]o[st])?(\s*p)?/gi,
    "price"
  );
  message = message.replace(
    /\bctg\b|\bchittagong\b|\bchittagng\b| \bchttogm\b|\bchittgong\b|\bchittagram\b|\bchattogram\b|\bchittagrom\b|\bchattagam\b|\bchattagrm\b|\bchattaram\b|\bchattagm\b|\bchittagorm\b|\bchattagong\b|\bchattagram\b|\bchatga\b|\bchatg\b|\bchtg\b|\bctgcity\b|\bctgcitycorp\b|\bctgcorp\b|\bctgport\b|\bchittagongport\b|\bctgcitycorporation\b|\bchittagongcity\b|\bchittagongcitycorp\b/gi,
    "ctg"
  );
  message = message.replace(
    /\bsyl(?!(het|khet))\b|\bsylhet\b|\bsyhle\b|\bsyleh\b|\bsileta\b|\bsiletta\b|\bsailet\b|\bsaillet\b|\bsyleth\b|\bsyhlet\b|\bsyhleth\b|\bsyle\b|\bsyhleth\b|\bsyllet\b|\bsailette\b|\bsylette\b/gi,
    "syl"
  );
  message = message.replace(
    /\be\s*c\s*o\s*m\s*(m\s*e\s*r\s*c\s*e\s*)?(?!\s*[^\s]*?log)/gi,
    "ecommerce"
  );

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
   
   
    const stringSimilarity = require("string-similarity");
    const talisman = require("talisman/metrics/jaro-winkler");
    
    function containsNonLatin(str) {
      return /[^\u0000-\u007F]/.test(str);
    }
    
    function getRatingsAndThreshold(message, dataArray) {
      message = message.replace(/pricece/gi, "").trim();
      message = message.replace(/aziz/gi, "").trim();
      message = message.replace(/dhk/gi, "").trim();
      message = message.replace(/ctg/gi, "").trim();
      message = message.replace(/syl/gi, "").trim();
      message = message.replace(/bb/gi, "").trim();
      message = message.replace(/ecommerce/gi, "").trim();




       console.log("checking",message);

      const messageLowerCase = message.toLowerCase();
      const useTalisman = containsNonLatin(message);
    
      if (useTalisman) {
        const ratings = dataArray.map((d) => ({
          rating: talisman(messageLowerCase, d.name.toLowerCase()),
          item: d,
        }));
        return { ratings, threshold: 0.75 }; // Adjust this value for the talisman threshold
      } else {
        const matches = stringSimilarity.findBestMatch(
          messageLowerCase,
          dataArray.map((d) => d.name.toLowerCase())
        );
        const ratings = matches.ratings.map((rating, index) => ({
          rating: rating.rating,
          item: dataArray[index],
        }));
        return { ratings, threshold: 0.4 }; // Adjust this value for the string-similarity threshold
      }
    }





    
    
    const { ratings, threshold } = getRatingsAndThreshold(message, dataArray);
    
    const matchedItems2 = ratings
      .filter((r) => r.rating > threshold)
      .sort((a, b) => b.rating - a.rating)
      .map((r) => r.item);
    
    if (matchedItems2.length === 0) {
      console.log("No match found");
    } else {
      console.log("Results:");
      matchedItems2.forEach((item) => console.log(item));
    }
    

    console.log("beyond the everything",matchedItems2)

    const queries2 = properties.filter((p) => message.includes(p.name));

    console.log("queerrr",queries2)

    if (matchedItems2.length > 0 ) {
      if(queries2.length === 0) {

        let botResponse = "";
        matchedItems2.forEach((item) => {
          botResponse += `\n\n${item.name} is available in Dhaka ${item.dhk}, Aziz Super Market ${item.aziz}, Chittagong ${item.ctg}, Sylhet ${item.syl}, Bangla Bazar ${item.bb}, Ecommerce ${item.ecom}.`;
    
        });
    
        res.json({
          botResponse: botResponse,
        });
        return;
      }
    }


    if (queries2.some(query => query.name === 'price')) {

      let botResponse = "";
      matchedItems2.forEach((item) => {
        botResponse += `\n\n${item.name} Price: ${item.price} .`;
  
      });
  
      res.json({
        botResponse: botResponse,
      });
      return;

    } 
    


    if (queries2.some(query => query.name === 'aziz')) {

      let botResponse = "";
      matchedItems2.forEach((item) => {
        botResponse += `\n\n${item.name} is available in  Aziz Super Market ${item.aziz} .`;
  
      });
  
      res.json({
        botResponse: botResponse,
      });
      return;

    } 
    


    if (queries2.some(query => query.name === 'dhk')) {

      let botResponse = "";
      matchedItems2.forEach((item) => {
        botResponse += `\n\n${item.name} is available in Dhaka ${item.dhk} .`;
  
      });
  
      res.json({
        botResponse: botResponse,
      });
      return;

    } 
    

    if (queries2.some(query => query.name === 'syl')) {

      let botResponse = "";
      matchedItems2.forEach((item) => {
        botResponse += `\n\n${item.name} is available in Sylhet ${item.syl} .`;
  
      });
  
      res.json({
        botResponse: botResponse,
      });
      return;

    } 
    if (queries2.some(query => query.name === 'ctg')) {

      let botResponse = "";
      matchedItems2.forEach((item) => {
        botResponse += `\n\n${item.name} is available in Chittagong ${item.ctg} .`;
  
      });
  
      res.json({
        botResponse: botResponse,
      });
      return;

    } 
    
    if (queries2.some(query => query.name === 'bb')) {

      let botResponse = "";
      matchedItems2.forEach((item) => {
        botResponse += `\n\n${item.name} is available in Bangla Bazar ${item.ctg} .`;
  
      });
  
      res.json({
        botResponse: botResponse,
      });
      return;

    } 

    if (queries2.some(query => query.name === 'ecom')) {

      let botResponse = "";
      matchedItems2.forEach((item) => {
        botResponse += `\n\n${item.name} is available in Ecommerce ${item.ctg} .`;
  
      });
  
      res.json({
        botResponse: botResponse,
      });
      return;

    } 






    // const matches = stringSimilarity.findBestMatch(
    //   message,
    //   dataArray.map((d) => d.name)
    // );
    // let matchedItems = [];
    // if (matches.bestMatch.rating > 0.3) {
    //   const matchedItem = dataArray[matches.bestMatchIndex];
    //   matchedItems.push(matchedItem);
    // } else {
    //   console.log("No match found");
    // }
    // // console.log("matched item:", matchedItems[0]);
    // const itemName = matchedItems[0];
    // // console.log("ok version", itemName);








    // if (!itemName) {
    //   try {
    //     const API_KEY = process.env.OPENAI_API_KEY;
    //     const response = await axios({
    //       method: "post",
    //       url: "https://api.openai.com/v1/engines/text-davinci-003/completions",
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${API_KEY}`,
    //       },
    //       data: {
    //         prompt: message,
    //         max_tokens: 100,
    //         n: 1,
    //         stop: "",
    //         temperature: 0.5,
    //       },
    //     });

    //     return res.json({ botResponse: "\n" + response.data.choices[0].text });
    //   } catch (error) {
    //     return res
    //       .status(500)
    //       .send({ error: "Could not generate text completion" });
    //   }
    // }

    // const queries = properties.filter((p) => message.includes(p.name));




    // console.log("matching queries", queries);

    // const replacements = {
    //   dhk: "Dhaka",
    //   syl: "Sylhet",
    //   bb: "Bangla Bazar",
    //   aziz: "Aziz Super Market",
    //   ecom: "Ecommerce",
    //   ctg: "Chittagong",
    // };

    // const result = queries
    //   .map((q) => {
    //     const data = dataArray.find((d) => d.name === itemName.name);
    //     if (!data || !data[q.property]) {
    //       return null;
    //     }

    //     return { [q.name]: data[q.property] };
    //   })
    //   .filter((r) => r !== null);
    // if (result.length === 0) {
    //   return res.status(400).json({ error: "No matching data found" });
    // }

    // const response = result.reduce((prev, curr) => {
    //   return prev + ` ${Object.keys(curr)[0]}: ${curr[Object.keys(curr)[0]]} `;
    // }, "");




    // let modifiedResponse = response;
    // for (const [key, value] of Object.entries(replacements)) {
    //   modifiedResponse = modifiedResponse.replace(key, value);
    // }
    // let responseText = modifiedResponse.replace(/:/g, "").replace(/(\d)\s/g, "$1.");

    // if (responseText.includes("price")) {
    //   // If response contains a price, don't display "is available"
    //   return res.json({
    //     botResponse: `\n\n${itemName.name}${responseText.replace("price", "Price")}`,
    //   });
    // } 
    
    // else {
    //   // If response doesn't contain a price, display "is available"
    //   return res.json({
    //     botResponse: `\n\n${itemName.name} is available in ${responseText}`,
    //   });
    // }
    





  }
}

module.exports = {
  getInformation,
};
