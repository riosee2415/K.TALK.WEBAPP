const generateUUID = () => {
  const MAX_LENGTH = 6;

  let loopCnt = 0;
  let UUID = "";

  while (loopCnt < MAX_LENGTH) {
    const randomNumber = Math.floor(Math.random() * 10);

    UUID += String(randomNumber);

    loopCnt++;
  }

  return UUID;
};

module.exports = generateUUID;
