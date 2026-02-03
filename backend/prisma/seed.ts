import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// Helpers
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomDecimal(min: number, max: number): Prisma.Decimal {
  return new Prisma.Decimal((Math.random() * (max - min) + min).toFixed(2));
}

function generateCPF(): string {
  const random = () => Math.floor(Math.random() * 9);
  const n = Array(9).fill(0).map(random);

  // Calculate verification digits
  let d1 = n.reduce((acc, val, idx) => acc + val * (10 - idx), 0) % 11;
  d1 = d1 < 2 ? 0 : 11 - d1;

  let d2 = [...n, d1].reduce((acc, val, idx) => acc + val * (11 - idx), 0) % 11;
  d2 = d2 < 2 ? 0 : 11 - d2;

  return `${n.slice(0, 3).join('')}${n.slice(3, 6).join('')}${n.slice(6, 9).join('')}${d1}${d2}`;
}

function generateCNPJ(): string {
  const random = () => Math.floor(Math.random() * 9);
  const n = Array(8).fill(0).map(random);
  n.push(0, 0, 0, 1); // Branch number

  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  let d1 = n.reduce((acc, val, idx) => acc + val * weights1[idx], 0) % 11;
  d1 = d1 < 2 ? 0 : 11 - d1;

  let d2 = [...n, d1].reduce((acc, val, idx) => acc + val * weights2[idx], 0) % 11;
  d2 = d2 < 2 ? 0 : 11 - d2;

  return `${n.slice(0, 2).join('')}${n.slice(2, 5).join('')}${n.slice(5, 8).join('')}${n.slice(8, 12).join('')}${d1}${d2}`;
}

// Data
const nomes = [
  'João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa', 'Carlos Ferreira',
  'Lucia Almeida', 'Roberto Souza', 'Fernanda Lima', 'Paulo Rodrigues', 'Camila Martins',
  'Ricardo Gomes', 'Juliana Ribeiro', 'Marcos Carvalho', 'Patricia Mendes', 'André Barbosa',
  'Beatriz Pereira', 'Felipe Nascimento', 'Vanessa Araújo', 'Thiago Moreira', 'Daniela Cardoso',
];

const integradores = [
  { nome: 'Solar Energy Brasil', cnpj: generateCNPJ() },
  { nome: 'Green Power Solutions', cnpj: generateCNPJ() },
  { nome: 'Energia Limpa Ltda', cnpj: generateCNPJ() },
  { nome: 'Sol Nascente Energia', cnpj: generateCNPJ() },
  { nome: 'EcoWatt Sistemas', cnpj: generateCNPJ() },
];

const origens = ['Loja Física', 'E-commerce', 'Televendas', 'Parceiro', 'Indicação'];

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.parcela.deleteMany();
  await prisma.contrato.deleteMany();
  await prisma.cliente.deleteMany();

  console.log('📦 Creating clients and contracts...');

  for (let i = 0; i < 50; i++) {
    const cliente = await prisma.cliente.create({
      data: {
        nome: nomes[Math.floor(Math.random() * nomes.length)] + ` ${i + 1}`,
        cpfCnpj: generateCPF(),
        email: `cliente${i + 1}@email.com`,
        telefone: `119${Math.floor(10000000 + Math.random() * 90000000)}`,
        endereco: {
          logradouro: `Rua Exemplo ${i + 1}`,
          numero: `${Math.floor(Math.random() * 1000)}`,
          bairro: 'Centro',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: `0${Math.floor(1000000 + Math.random() * 9000000)}`,
        },
      },
    });

    // Create 1-3 contracts per client
    const numContracts = Math.floor(Math.random() * 3) + 1;

    for (let j = 0; j < numContracts; j++) {
      const integrador = integradores[Math.floor(Math.random() * integradores.length)];
      const numParcelas = [12, 24, 36, 48, 60][Math.floor(Math.random() * 5)];
      const valorTotal = randomDecimal(5000, 100000);
      const valorEntrada = randomDecimal(500, Number(valorTotal) * 0.2);
      const valorParcela = new Prisma.Decimal(
        ((Number(valorTotal) - Number(valorEntrada)) / numParcelas).toFixed(2)
      );
      const dataContratacao = randomDate(new Date('2022-01-01'), new Date('2024-06-01'));

      const contrato = await prisma.contrato.create({
        data: {
          clienteId: cliente.id,
          integrador: integrador.nome,
          integradorCnpj: integrador.cnpj,
          origemContrato: origens[Math.floor(Math.random() * origens.length)],
          dataContratacao,
          valorTotal,
          valorEntrada,
          quantidadeParcelas: numParcelas,
          taxaJuros: randomDecimal(0.5, 2.5),
          status: 'ativo',
        },
      });

      // Create installments
      const parcelas: Prisma.ParcelaCreateManyInput[] = [];
      const today = new Date();

      for (let k = 0; k < numParcelas; k++) {
        const dataVencimento = new Date(dataContratacao);
        dataVencimento.setMonth(dataVencimento.getMonth() + k + 1);

        const isOverdue = dataVencimento < today;
        const isPaid = isOverdue ? Math.random() > 0.4 : Math.random() > 0.9; // 60% chance of being paid if overdue

        let status: string;
        let dataPagamento: Date | null = null;
        let valorPago: Prisma.Decimal | null = null;

        if (isPaid) {
          status = 'paga';
          dataPagamento = new Date(dataVencimento);
          dataPagamento.setDate(dataPagamento.getDate() + Math.floor(Math.random() * 5));
          valorPago = valorParcela;
        } else if (isOverdue) {
          status = 'em_atraso';
        } else {
          status = 'a_vencer';
        }

        // Add late fee for overdue unpaid installments
        const diasAtraso = isOverdue && !isPaid
          ? Math.floor((today.getTime() - dataVencimento.getTime()) / (1000 * 60 * 60 * 24))
          : 0;
        const multa = diasAtraso > 0 ? Number(valorParcela) * 0.02 : 0;
        const juros = diasAtraso > 0 ? Number(valorParcela) * 0.01 * Math.floor(diasAtraso / 30) : 0;
        const valorAtualizado = new Prisma.Decimal(
          (Number(valorParcela) + multa + juros).toFixed(2)
        );

        parcelas.push({
          contratoId: contrato.id,
          numero: k + 1,
          dataVencimento,
          dataPagamento,
          valorOriginal: valorParcela,
          valorAtualizado,
          valorPago,
          status,
        });
      }

      await prisma.parcela.createMany({
        data: parcelas,
      });
    }
  }

  const clienteCount = await prisma.cliente.count();
  const contratoCount = await prisma.contrato.count();
  const parcelaCount = await prisma.parcela.count();
  const parcelasEmAtraso = await prisma.parcela.count({ where: { status: 'em_atraso' } });

  console.log(`✅ Seed completed!`);
  console.log(`   - ${clienteCount} clients`);
  console.log(`   - ${contratoCount} contracts`);
  console.log(`   - ${parcelaCount} installments (${parcelasEmAtraso} overdue)`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
