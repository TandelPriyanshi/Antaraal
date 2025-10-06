import { AppDataSource } from './src/data-source.js';
import { Users } from './src/entities/user.entity.js';

async function checkUsers() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected');

    const userRepository = AppDataSource.getRepository(Users);
    const users = await userRepository.find();
    console.log('Users in database:', users.length);
    users.forEach(user => {
      console.log('User:', user.email, 'Verified:', user.isEmailVerified, 'Username:', user.username);
    });

    await AppDataSource.destroy();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkUsers();
