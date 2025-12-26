import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function testMongoDB() {
    try {
        console.log('🧪 Testing MongoDB Connection...\n');

        if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('your-username')) {
            console.log('❌ MongoDB URI not configured!');
            console.log('📝 Please update MONGODB_URI in server/.env');
            console.log('📖 See MONGODB_SETUP.md for instructions\n');
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGODB_URI);

        console.log('✅ MongoDB Connected Successfully!');
        console.log('📊 Database:', mongoose.connection.name);
        console.log('🌐 Host:', mongoose.connection.host);
        console.log('\n🎉 Database is ready to use!\n');

        await mongoose.connection.close();
        process.exit(0);

    } catch (error) {
        console.error('❌ MongoDB Connection Error:');
        console.error(error.message);
        console.log('\n📖 Check MONGODB_SETUP.md for troubleshooting\n');
        process.exit(1);
    }
}

testMongoDB();
