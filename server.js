const jsonServer = require('json-server');
const fs = require('fs');
const path = require('path');

const server = jsonServer.create();

const dbFile = path.join(__dirname, 'db.json');
const originalDbFile = path.join(__dirname, 'db-original.json');

const router = jsonServer.router(dbFile);
const middlewares = jsonServer.defaults();

const PORT = process.env.PORT || 3000;

/**
 * Restaura o db.json usando o banco original
 */
function resetDatabase() {
  try {
    const originalData = JSON.parse(
      fs.readFileSync(originalDbFile, 'utf-8')
    );

    fs.writeFileSync(
      dbFile,
      JSON.stringify(originalData, null, 2),
      'utf-8'
    );

    router.db.setState(originalData);

    console.log('🔄 Banco restaurado para o estado original');
  } catch (error) {
    console.error('❌ Erro ao restaurar banco:', error);
    process.exit(1);
  }
}

// Middlewares
server.use(middlewares);

// Restaurar ANTES de começar a receber requisições
resetDatabase();

// Aceitar todos os métodos
server.use(router);

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`✅ JSON Server rodando na porta ${PORT}`);
});
