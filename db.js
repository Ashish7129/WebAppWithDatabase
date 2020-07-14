const mysql = require("mysql2");
const Client = require("ssh2").Client;
const sshClient = new Client();
const dbServer = {
  host: "database-1.cuzbywwn3za7.ap-south-1.rds.amazonaws.com",
  port: 3306,
  user: "admin",
  password: "nimda1234",
  database: "TestDatabase",
};
const tunnelConfig = {
  host: "13.232.111.33",
  port: 22,
  username: "ec2-user",
  privateKey: require("fs").readFileSync("./NAGP.pem"),
};
const forwardConfig = {
  srcHost: "127.0.0.1",
  srcPort: 3306,
  dstHost: dbServer.host,
  dstPort: dbServer.port,
};
const SSHConnection = new Promise((resolve, reject) => {
  sshClient
    .on("ready", () => {
      sshClient.forwardOut(
        forwardConfig.srcHost,
        forwardConfig.srcPort,
        forwardConfig.dstHost,
        forwardConfig.dstPort,
        (err, stream) => {
          if (err) reject(err);
          const updatedDbServer = {
            ...dbServer,
            stream,
          };
          const connection = mysql.createConnection(updatedDbServer);
          connection.connect((error) => {
            if (error) {
              reject(error);
              console.log("failed to connect the database");
            }
            resolve(connection);
            console.log("Connection Established");
          });
        }
      );
    })
    .connect(tunnelConfig);
});

module.exports = SSHConnection;
