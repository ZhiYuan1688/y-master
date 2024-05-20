async function test(){
    const url = 'https://www.googleapis.com/youtube/v3/videos?part=contentDetails%2Csnippet%2Cstatistics&id=Y-kwlvhR7Z0&key=AIzaSyDrCl2nN6bH-i-_wS_HRHGD5Y8arhuSko4';
const options = {method: 'GET'};

try {
  const response = await fetch(url, options);
  const data = await response.json();
  console.log(data);
} catch (error) {
  console.error(error);
}
}

test()