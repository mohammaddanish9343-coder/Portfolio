#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Portfolio Deployment Helper');
console.log('==============================\n');

// Check if Vercel CLI is installed
try {
  execSync('vercel --version', { stdio: 'pipe' });
  console.log('✅ Vercel CLI is installed');
} catch (error) {
  console.log('❌ Vercel CLI not found. Installing...');
  execSync('npm install -g vercel', { stdio: 'inherit' });
  console.log('✅ Vercel CLI installed');
}

// Check if .env exists
if (!fs.existsSync('.env')) {
  console.log('❌ .env file not found. Please create it with your Supabase credentials.');
  process.exit(1);
}

console.log('📦 Deploying backend to Vercel...');
try {
  execSync('vercel --prod', { stdio: 'inherit' });
  console.log('✅ Backend deployed successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Copy your Vercel deployment URL');
  console.log('2. Update script.js and messages.html:');
  console.log('   Replace "https://your-backend-url.vercel.app/api" with your actual URL');
  console.log('3. Push changes to GitHub - frontend will auto-deploy to GitHub Pages');
} catch (error) {
  console.log('❌ Deployment failed. Please check your configuration.');
  process.exit(1);
}