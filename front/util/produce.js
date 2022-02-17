import produce, { enableES5 } from "immer";

const Produce = (...args) => {
  enableES5();
  return produce(...args);
};

export default Produce;
