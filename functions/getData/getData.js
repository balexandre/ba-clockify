const engine = require('./../utilities/engine');

exports.handler = async (event, context, callback) => {
  const { path, queryStringParameters } = event;

  console.log('event', JSON.stringify(event, null, 4));
  console.log('context', JSON.stringify(context, null, 4));

  try {
    const { client, from: date } = queryStringParameters;
    const result = await engine.getTimes(client, date);

    return callback(null, {
      statusCode: 200,
      body: JSON.stringify(result),
    });
  } catch (err) {
    return callback(err);
  }
};
