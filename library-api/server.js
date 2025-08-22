const app = require("./src/app"); 
 
const PORT = process.env.PORT || 3000; 
 
app.listen(PORT, () => { 
  console.log(`������� REST API Server is running on port ${PORT}`); 
  console.log(`������������ Book Management API`); 
  console.log(`�� Base URL: http://localhost:${PORT}`); 
  console.log(`������ Documentation: http://localhost:${PORT}/api-docs`); 
  console.log(`���� Health Check: http://localhost:${PORT}/health`); 
});