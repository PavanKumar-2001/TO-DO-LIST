const getConnection = require('./dbConfig'); 

async function testDatabaseConnection() {
  try {
    const connection = await getConnection(); 

    await connection.close();
    console.log('Test: Database connection successful!');
  } catch (error) {
    console.error('Test: Database connection failed:', error);
  }
}

testDatabaseConnection();
