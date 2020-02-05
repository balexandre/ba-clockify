const engine = require('./../server/engine');

exports.handler = async (event, context, callback) => {
  const { path, queryStringParameters } = event;

  console.log('event', JSON.stringify(event, null, 4));
  console.log('context', JSON.stringify(context, null, 4));

  try {
    const result = await engine.getTimes(path.clientId, queryStringParameters.from);

    return callback(null, {
      statusCode: 200,
      body: JSON.stringify(result),
    });
  } catch (err) {
    return callback(err);
  }
};
