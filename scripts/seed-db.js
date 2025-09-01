// scripts/seed-db.js
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function seedDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('Iniciando seed de la base de datos...');

    // Clear existing data (optional - comment out if you want to keep existing data)
    // await client.query('TRUNCATE TABLE order_items, orders, products, categories, users, payments RESTART IDENTITY CASCADE');

    // Insert categories
    console.log('Insertando categorías...');
    const categories = [
      { name: 'Panadería', description: 'Panes y productos de panadería sin gluten' },
      { name: 'Pastelería', description: 'Tortas, galletas y dulces sin gluten' },
      { name: 'Pastas', description: 'Fideos y pastas frescas sin gluten' },
      { name: 'Harinas', description: 'Harinas y mezclas sin gluten' },
      { name: 'Snacks', description: 'Aperitivos y snacks sin gluten' },
      { name: 'Congelados', description: 'Productos congelados listos para cocinar' },
      { name: 'Bebidas', description: 'Bebidas y jugos sin gluten' },
      { name: 'Lácteos', description: 'Productos lácteos aptos para celíacos' }
    ];

    for (const category of categories) {
      await client.query(
        'INSERT INTO categories (name, description) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING',
        [category.name, category.description]
      );
    }

    // Insert sample products
    console.log('Insertando productos de muestra...');
    const products = [
      {
        name: 'Pan Integral Sin Gluten',
        description: 'Pan integral elaborado con harinas sin gluten, perfecto para el desayuno y merienda.',
        category: 'Panadería',
        price: 890,
        varieties: JSON.stringify(['500g', '750g']),
        images: JSON.stringify(['https://via.placeholder.com/300x300?text=Pan+Integral'])
      },
      {
        name: 'Facturas Surtidas',
        description: 'Deliciosas facturas variadas sin gluten: medialunas, vigilantes, bolas de fraile.',
        category: 'Panadería',
        price: 1200,
        varieties: JSON.stringify(['Docena', 'Media docena']),
        images: JSON.stringify(['https://via.placeholder.com/300x300?text=Facturas'])
      },
      {
        name: 'Torta de Chocolate',
        description: 'Exquisita torta de chocolate sin gluten, perfecta para ocasiones especiales.',
        category: 'Pastelería',
        price: 2500,
        varieties: JSON.stringify(['Mediana (8 porciones)', 'Grande (12 porciones)']),
        images: JSON.stringify(['https://via.placeholder.com/300x300?text=Torta+Chocolate'])
      },
      {
        name: 'Galletas de Vainilla',
        description: 'Galletas crujientes de vainilla sin gluten, ideales para acompañar el té.',
        category: 'Pastelería',
        price: 650,
        varieties: JSON.stringify(['250g', '500g']),
        images: JSON.stringify(['https://via.placeholder.com/300x300?text=Galletas'])
      },
      {
        name: 'Fideos Penne',
        description: 'Pasta penne sin gluten elaborada con harina de arroz y maíz.',
        category: 'Pastas',
        price: 580,
        varieties: JSON.stringify(['500g']),
        images: JSON.stringify(['https://via.placeholder.com/300x300?text=Fideos+Penne'])
      },
      {
        name: 'Ravioles de Ricota',
        description: 'Ravioles frescos rellenos de ricota y espinaca, sin gluten.',
        category: 'Pastas',
        price: 980,
        varieties: JSON.stringify(['Bandeja 500g', 'Bandeja 750g']),
        images: JSON.stringify(['https://via.placeholder.com/300x300?text=Ravioles'])
      },
      {
        name: 'Harina Premezcla',
        description: 'Mezcla de harinas sin gluten perfecta para panificados caseros.',
        category: 'Harinas',
        price: 450,
        varieties: JSON.stringify(['500g', '1kg']),
        images: JSON.stringify(['https://via.placeholder.com/300x300?text=Harina'])
      },
      {
        name: 'Alfajores de Dulce de Leche',
        description: 'Alfajores artesanales rellenos de dulce de leche, sin gluten.',
        category: 'Snacks',
        price: 150,
        varieties: JSON.stringify(['Unidad', 'Caja x6']),
        images: JSON.stringify(['https://via.placeholder.com/300x300?text=Alfajores'])
      },
      {
        name: 'Empanadas Congeladas',
        description: 'Empanadas congeladas variadas: carne, pollo, jamón y queso.',
        category: 'Congelados',
        price: 180,
        varieties: JSON.stringify(['Carne', 'Pollo', 'Jamón y Queso', 'Verdura']),
        images: JSON.stringify(['https://via.placeholder.com/300x300?text=Empanadas'])
      },
      {
        name: 'Cerveza Sin Gluten',
        description: 'Cerveza artesanal sin gluten, refrescante y sabrosa.',
        category: 'Bebidas',
        price: 380,
        varieties: JSON.stringify(['Botella 473ml']),
        images: JSON.stringify(['https://via.placeholder.com/300x300?text=Cerveza'])
      }
    ];

    for (const product of products) {
      await client.query(
        'INSERT INTO products (name, description, category, price, varieties, images) VALUES ($1, $2, $3, $4, $5, $6)',
        [product.name, product.description, product.category, product.price, product.varieties, product.images]
      );
    }

    // Insert sample admin user
    console.log('Creando usuario administrador...');
    const adminEmail = 'admin@glutenfreestore.com';
    const adminPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await client.query(
      'INSERT INTO users (full_name, email, phone, address, password_hash, is_admin) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (email) DO NOTHING',
      ['Administrador', adminEmail, '+54 11 1234-5678', 'Av. Principal 123, CABA', hashedPassword, true]
    );

    // Insert sample regular user
    console.log('Creando usuario de prueba...');
    const userEmail = 'usuario@ejemplo.com';
    const userPassword = 'usuario123';
    const hashedUserPassword = await bcrypt.hash(userPassword, 10);

    await client.query(
      'INSERT INTO users (full_name, email, phone, address, password_hash, is_admin) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (email) DO NOTHING',
      ['Usuario Test', userEmail, '+54 11 8765-4321', 'Calle Falsa 123, CABA', hashedUserPassword, false]
    );

    console.log('✅ Seed completado exitosamente!');
    console.log('\n📋 Datos de acceso:');
    console.log('👨‍💼 Admin: admin@glutenfreestore.com / admin123');
    console.log('👤 Usuario: usuario@ejemplo.com / usuario123');
    console.log('\n🛍️ Se insertaron 10 productos de muestra en 8 categorías');
    
  } catch (error) {
    console.error('❌ Error en seed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seed de base de datos completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en seed de base de datos:', error);
      process.exit(1);
    });
}

module.exports = seedDatabase;