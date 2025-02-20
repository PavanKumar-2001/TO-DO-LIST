const oracledb = require('oracledb');


const dbConfig = {
  user: "system", 
  password: "laku", 
  connectString: "127.0.0.1:1522/XE", 
};


async function getConnection() {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    console.log("Database connected successfully!");
    return connection;
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
}

module.exports = getConnection;
