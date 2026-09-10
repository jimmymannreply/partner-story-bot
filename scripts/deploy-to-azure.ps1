# Deploy Partner Story Bot to Azure Static Web Apps (public stakeholder demo)
# Prerequisites: Azure CLI (az) and GitHub CLI (gh), both authenticated

$ErrorActionPreference = "Stop"
$gh = "C:\Program Files\GitHub CLI\gh.exe"
$repoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
Set-Location $repoRoot

if (-not (Get-Command az -ErrorAction SilentlyContinue)) {
    Write-Error "Azure CLI not found. Install: winget install -e --id Microsoft.AzureCLI"
}

& $gh auth status
if ($LASTEXITCODE -ne 0) {
    & $gh auth login --hostname github.com --git-protocol https --web
}

az account show | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Sign in to Azure:"
    az login
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Azure login failed. If you see AADSTS53003, use a compliant device/VPN or ask IT to allow Azure CLI."
    }
}

$envName = "partnerstory"
$rg = "rg-$envName"
$appName = "stapp-$envName"
$location = "eastus2"
$repoUrl = "https://github.com/jimmymannreply/partner-story-bot"

Write-Host "Creating resource group $rg in $location..."
az group create --name $rg --location $location --output none

Write-Host "Creating Static Web App (Free tier, public)..."
az staticwebapp create `
    --name $appName `
    --resource-group $rg `
    --location $location `
    --sku Free `
    --source $repoUrl `
    --branch main `
    --app-location "/" `
    --output-location "dist" `
    --login-with-github

$hostname = az staticwebapp show --name $appName --resource-group $rg --query "defaultHostname" -o tsv
if ($LASTEXITCODE -ne 0 -or -not $hostname) {
    Write-Error "Static Web App was not created. Check Azure login and permissions."
}

$token = az staticwebapp secrets list --name $appName --resource-group $rg --query "properties.apiKey" -o tsv
if ($LASTEXITCODE -ne 0 -or -not $token) {
    Write-Error "Could not retrieve deployment token."
}

Write-Host ""
Write-Host "Setting GitHub secret for CI/CD..."
& $gh secret set AZURE_STATIC_WEB_APPS_API_TOKEN --body $token

Write-Host ""
Write-Host "Live URL: https://$hostname"
Write-Host "No user licenses required - public anonymous access."
