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

function sayHello(call, callback) {
  const name = call.request.name;
  const message = `Hello, ${name}!`;

  callback(null, { message });
}

const server = new grpc.Server();
server.addService(helloProto.HelloService.service, { sayHello });
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error(err);
    return;
  }
  server.start();
  console.log('gRPC server running at http://localhost:50051');
});
