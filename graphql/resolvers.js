const { Case } = require("../models/case");

module.exports = {
  cases: async () => {
    try {
      const cases = await Case.find();
      return cases;
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  },
};
