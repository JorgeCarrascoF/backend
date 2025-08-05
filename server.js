require('dotenv').config();
const app = require('./app');
require('./connections/db'); // Tu conexión existente

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📘 Documentación Swagger disponible en: http://localhost:${PORT}/api-docs`);
});