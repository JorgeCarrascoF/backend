const { ChatOllama } = require('@langchain/ollama');
const llm = new ChatOllama({
  model: "llama3.1:latest",
  temperature: 0,
  maxRetries: 2,
});

/**
 * @swagger
 * /suggestion:
 *   post:
 *     summary: Saludar a una persona
 *     tags: [Saludos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: jonathan
 *     responses:
 *       200:
 *         description: Saludo generado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: hola jonathan
 *       400:
 *         description: Datos inválidos
 */
const saludar = (req, res) => {
    const { name } = req.body;
    res.json({ mensaje: `hola ${name}` });
  };

/**
 * @swagger
 * /completion:
 *   post:
 *     summary: Generar respuesta usando un modelo de Ollama
 *     tags: [Ollama]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - prompt
 *             properties:
 *               prompt:
 *                 type: string
 *                 example: "Escribe un poema corto sobre la lluvia"
 *     responses:
 *       200:
 *         description: Respuesta generada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 prompt:
 *                   type: string
 *                   example: "Escribe un poema corto sobre la lluvia"
 *                 respuesta:
 *                   type: string
 *                   example: "La lluvia susurra versos suaves en el tejado..."
 *       400:
 *         description: El campo 'prompt' es requerido
 *       500:
 *         description: Error interno del servidor
 */
const getCompletion = async (req, res) => {
    try {
      const { prompt } = req.body;
  
      if (!prompt) {
        return res.status(400).json({ error: "El campo 'prompt' es requerido" });
      }
  
      const completion = await llm.invoke(prompt);
  
      res.json({
        prompt,
        respuesta: completion,
      });
    } catch (error) {
      console.error("Error al obtener respuesta de Ollama:", error);
      res.status(500).json({ error: "Error en el servidor" });
    }
};

module.exports = { saludar, getCompletion};