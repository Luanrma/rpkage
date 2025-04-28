const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    await prisma.user.upsert({
        data: [
            {
                name: 'Luan Teste 1',
                email: 'luan1@example.com',
                password: 'senha123',
                avatar: null,
                type: 'PLAYER',
                active: true,
            },
            {
                name: 'Luan Teste 2',
                email: 'luan2@example.com',
                password: 'senha123',
                avatar: null,
                type: 'MASTER',
                active: true,
            },
            {
                name: 'Luan Teste 3',
                email: 'luan3@example.com',
                password: 'senha123',
                avatar: null,
                type: 'PLAYER',
                active: true,
            },
            {
                name: 'Luan Teste 4',
                email: 'luan4@example.com',
                password: 'senha123',
                avatar: null,
                type: 'PLAYER',
                active: false,
            },
            {
                name: 'Luan Teste 5',
                email: 'luan5@example.com',
                password: 'senha123',
                avatar: null,
                type: 'MASTER',
                active: true,
            },
        ],
    });

    console.log('Seed realizado com sucesso!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
