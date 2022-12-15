import pg from 'pg'
const Pool = pg.Pool

global.db = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'learn',
    password: '729638145',
    port: 5432,
})