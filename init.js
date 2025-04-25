// This script is meant to be run in a build step or locally to set up the database

const { execSync } = require("child_process")

function runCommand(command) {
  try {
    execSync(command, { stdio: "inherit" })
  } catch (error) {
    console.error(`Failed to execute ${command}:`, error)
    process.exit(1)
  }
}

console.log("🔄 Running database migrations...")
runCommand("npx prisma migrate dev --name init")

console.log("🌱 Seeding database...")
runCommand('npx ts-node --compiler-options "{"module":"CommonJS"}" prisma/seed.ts')

console.log("✅ Database initialization complete!")
