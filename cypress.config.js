const { defineConfig } = require('cypress')
const oracledb = require('oracledb')
require('dotenv').config()

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Load environment variables from .env file
      const envConfig = process.env

      config.env = {
        ...config.env,
        ...envConfig,
      }

      // Implement node event listeners here
      on('task', {
        async runQuery(query) {
          let connection

          // Establish a connection to OracleDB and send query, send error if connection or query fails.
          try {
            connection = await oracledb.getConnection(config.env.oracleDB)

            // Execute the query and return its result.
            const result = await connection.execute(query)
            return result.rows
          } catch (err) {
            throw new Error(err)
          } finally {
            // Close the connection after successfully executing the query
            if (connection) {
              await connection.close()
            }
          }
        },
      })

      return config
    },
    baseUrl: process.env.BASE_URL,
  },
})
