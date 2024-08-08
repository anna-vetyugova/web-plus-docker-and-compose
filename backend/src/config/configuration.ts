export default () => ({
  server: {
    port: parseInt(process.env.PORT, 10) || 4000,
  },
  database: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    username: process.env.POSTGRES_USER || 'student',
    password: process.env.POSTGRES_PASSWORD || 'student',
    name: process.env.POSTGRES_DB || 'kupipodariday',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'super_secret',
    ttl: process.env.JWT_TTL || '30000s',
  },
});
