

function containsNonLatinText(text) {
    return /[^\u0000-\u007F]/.test(text);
  }
  
  function computeRatingsAndThreshold(query, itemsArray) {
    const queryLowerCase = query.toLowerCase();
    const isNonLatin = containsNonLatinText(query);
  
    if (isNonLatin) {
      const itemRatings = itemsArray.map((item) => ({
        rating: talisman(queryLowerCase, item.name.toLowerCase()),
        matchedItem: item,
      }));
      return { itemRatings, ratingThreshold: 0.755 };
    } else {
      const similarityMatches = stringSimilarity.findBestMatch(
        queryLowerCase,
        itemsArray.map((item) => item.name.toLowerCase())
      );
      const itemRatings = similarityMatches.ratings.map((rating, index) => ({
        rating: rating.rating,
        matchedItem: itemsArray[index],
      }));
      return { itemRatings, ratingThreshold: 0.4 };
    }
  }
  
  const { itemRatings, ratingThreshold } = computeRatingsAndThreshold(message, dataArray);
  
  const matchedItems = itemRatings
    .filter((itemRating) => itemRating.rating > ratingThreshold)
    .sort((itemA, itemB) => itemB.rating - itemA.rating)
    .map((itemRating) => itemRating.matchedItem);
  
  if (matchedItems.length === 0) {
    console.log("No match found");
  } else {
    console.log("Results for next step:");
    matchedItems.forEach((item) => console.log(item));
  }
  
  