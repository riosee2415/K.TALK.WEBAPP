const isNanCheck = (value) => {
  const _value = Number(value);

  return isNaN(_value);
};

module.exports = isNanCheck;
