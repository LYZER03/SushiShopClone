import mongoose from 'mongoose';
import { config } from '../config/config';
import User, { UserRole } from '../models/User';
import { logger } from './logger';

/**
 * Script pour créer un utilisateur de test dans la base de données
 * Cet utilisateur pourra être utilisé pour les tests d'authentification
 */
const createTestUser = async (): Promise<void> => {
  try {
    // Se connecter à MongoDB si nécessaire
    if (mongoose.connection.readyState !== 1) {
      logger.info('Connexion à MongoDB...');
      await mongoose.connect(config.mongoUri);
      logger.info('Connecté à MongoDB');
    }

    // Informations de l'utilisateur de test
    const testUserData = {
      email: 'user@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      role: UserRole.CUSTOMER,
      isActive: true,
      isEmailVerified: true
    };

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email: testUserData.email });
    
    if (existingUser) {
      logger.info(`L'utilisateur de test avec l'email ${testUserData.email} existe déjà`);
      logger.info('Vous pouvez vous connecter avec ces identifiants:');
      logger.info(`Email: ${testUserData.email}`);
      logger.info(`Mot de passe: ${testUserData.password}`);
    } else {
      // Créer un nouvel utilisateur
      const user = new User(testUserData);
      await user.save();
      
      logger.info(`Utilisateur de test créé avec succès: ${user.email}`);
      logger.info('Vous pouvez vous connecter avec ces identifiants:');
      logger.info(`Email: ${testUserData.email}`);
      logger.info(`Mot de passe: ${testUserData.password}`);
    }
  } catch (error) {
    logger.error(`Erreur lors de la création de l'utilisateur de test: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  } finally {
    // Ne pas fermer la connexion si elle est utilisée par d'autres processus
    if (require.main === module) {
      await mongoose.connection.close();
      logger.info('Connexion MongoDB fermée');
    }
  }
};

// Exécuter la fonction si le script est exécuté directement
if (require.main === module) {
  createTestUser()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { createTestUser };
