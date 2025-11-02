import dotenv from 'dotenv';
import mongoose from 'mongoose';
import * as crypto from 'crypto';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Simple hash function (in production, use bcrypt)
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

const AdminSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  role: String,
  createdAt: Date,
});

async function setupAdmin() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

    // Admin credentials
    const adminCredentials = {
      username: 'coderush_admin',
      password: hashPassword('CodeRush2025@Admin'),
      email: 'admin@coderush.lk',
      role: 'admin',
      createdAt: new Date(),
    };

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: adminCredentials.username });

    if (existingAdmin) {
      console.log('⚠️  Admin already exists. Updating password...');
      await Admin.updateOne(
        { username: adminCredentials.username },
        { password: adminCredentials.password }
      );
      console.log('✅ Admin password updated');
    } else {
      await Admin.create(adminCredentials);
      console.log('✅ Admin created successfully');
    }

    console.log('\n📋 ADMIN CREDENTIALS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Username: coderush_admin');
    console.log('Password: CodeRush2025@Admin');
    console.log('Email: admin@coderush.lk');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  IMPORTANT: Change the password after first login!');
    console.log('🔗 Admin Login: http://localhost:3000/admin/login\n');

    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');
  } catch (error) {
    console.error('❌ Error setting up admin:', error);
    process.exit(1);
  }
}

setupAdmin();
