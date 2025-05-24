import axios from 'axios';

const searchPlayer = async (playerName: String) => {
  try {
    const response = await axios.get(
      `https://api.tibiadata.com/v4/character/${playerName}`
    );

    console.log('log from searchPlayer', response.data);
    return response.data;
  } catch (err: any) {
    console.log('Error from search player', err.status);
  }
};

export default searchPlayer;
