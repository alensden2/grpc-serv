const express = require('express');
const app = express();
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const protoFile = path.join(__dirname, 'hello.proto');
const packageDefinition = protoLoader.loadSync(protoFile, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const helloProto = grpc.loadPackageDefinition(packageDefinition).hello;

const client = new helloProto.HelloService('localhost:50051', grpc.credentials.createInsecure());

app.get('/hello/:name', (req, res) => {
  const name = req.params.name;

  client.SayHello({ name }, (error, response) => {
    if (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
      return;
    }

    res.send(response.message);
  });
});

app.listen(3000, () => {
  console.log('Express server running at http://localhost:3000');
});
