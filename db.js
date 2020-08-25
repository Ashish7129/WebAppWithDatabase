const mysql = require("mysql2");
const Client = require("ssh2").Client;
const sshClient = new Client();
const dbServer = {
  host: "XXXXXXX",
  port: 3306,
  user: "XXXXX",
  password: "XXXXXX",
  database: "XXXXXXX",
};
const tunnelConfig = {
  host: "XXXXXX",
  port: XXX,
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
