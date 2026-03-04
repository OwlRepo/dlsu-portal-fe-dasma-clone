# DLSU Portal - Windows Server Deployment

Quick reference guide for deploying the DLSU Portal application on Windows Server.

## Quick Start

1. **Prepare Environment Variables**
   - Create `.env` file in project root with required variables
   - See `DEPLOYMENT_GUIDE.md` for details

2. **Run Deployment**
   - Right-click `deploy.bat` → **Run as administrator**
   - Wait for completion (10-20 minutes)

3. **Configure Startup** (Optional)
   - Run `setup-pm2-startup.bat` as administrator
   - Follow the instructions shown

4. **Verify Deployment**
   - Run `status.bat` to check application status
   - Access application at `http://localhost:3000`

## Build Options

- **Skip lint during build** (emergency only): Run `deploy.bat skip-lint` or set `SKIP_LINT_BUILD=1` before running. Disables ESLint and TypeScript checks during build. Fix lint errors before the next release.

## Available Scripts

| Script | Purpose |
|--------|---------|
| `deploy.bat` | Main deployment script - installs everything |
| `stop.bat` | Stop the application |
| `restart.bat` | Restart the application |
| `status.bat` | Check application status |
| `logs.bat` | View application logs |
| `setup-pm2-startup.bat` | Configure Windows startup |

## Documentation

For detailed instructions, troubleshooting, and maintenance, see **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)**.

## Requirements

- Windows Server 2016 or later
- Administrator privileges
- Internet connection (for initial setup)
- Port 3000 available (or configure custom port)

## Support

If you encounter issues:
1. Check `DEPLOYMENT_GUIDE.md` → Troubleshooting section
2. Review application logs: `logs.bat`
3. Check PM2 status: `status.bat`

