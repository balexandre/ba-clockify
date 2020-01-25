/* eslint-disable no-console */

exports.log = message => console.log(message);

exports.error = (err, extraData) => {
  console.log(`ERR: ${err.message} -> ${JSON.stringify(extraData)}`);
};
