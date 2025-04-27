import { registerAs } from '@nestjs/config';

export interface DatabaseConfig {
    type: 'mysql' | 'mariadb';
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
}

export const defaultDatabaseConfig: DatabaseConfig = {
    type: 'mysql',
    host: 'lama_mysql',
    port: 3306,
    username: 'root',
    password: '',
    database: 'lamalamadb',
};

export default registerAs(
    'database',
    (): DatabaseConfig => ({
        type: 'mysql',
        host: process.env.MYSQL_HOST || 'lama_mysql',
        port: parseInt(process.env.MYSQL_PORT || '3306', 10),
        username: process.env.MYSQL_USERNAME || 'root',
        password: process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_DATABASE || 'lamalamadb',
    }),
);
