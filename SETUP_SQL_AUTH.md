# Setting Up SQL Server Authentication

The `mssql` package with the default `tedious` driver doesn't support Windows Authentication well. For this demo, we'll use SQL Server Authentication instead.

## Steps to Set Up SQL Server Authentication:

1. **Open SQL Server Management Studio**
   - Connect to your server: `DESKTOP-9897340`

2. **Enable SQL Server Authentication (if not already enabled)**
   - Right-click on your server → Properties
   - Go to "Security" page
   - Select "SQL Server and Windows Authentication mode"
   - Click OK
   - Restart SQL Server service if prompted

3. **Create a SQL Server Login**
   - In Object Explorer, expand: Security → Logins
   - Right-click "Logins" → New Login
   - Login name: `sqluser` (or any name you prefer)
   - Select "SQL Server authentication"
   - Enter a password (e.g., `Test123!`)
   - Uncheck "Enforce password policy" (for demo purposes)
   - Click OK

4. **Grant Database Access**
   - In the new login properties, go to "User Mapping"
   - Check the box for `TestDB` database
   - In "Database role membership", check `db_owner` (for demo purposes)
   - Click OK

5. **Update the API Route**
   - Open `app/api/query/route.ts`
   - Uncomment and update the user and password fields:
   ```typescript
   user: 'sqluser',
   password: 'Test123!',
   ```

## Alternative: Try Windows Authentication with msnodesqlv8

If you want to try Windows Authentication, the `msnodesqlv8` package is installed but may have compatibility issues with Next.js. You can try modifying the config to use it, but SQL Authentication is more reliable for this demo.

