# Deploy Partner Story Bot to GitHub Pages
# Prerequisites: GitHub CLI installed and authenticated (gh auth login)

$ErrorActionPreference = "Stop"
$gh = "C:\Program Files\GitHub CLI\gh.exe"

if (-not (Test-Path $gh)) {
    Write-Error "GitHub CLI not found. Install with: winget install GitHub.cli"
}

& $gh auth status
if ($LASTEXITCODE -ne 0) {
    Write-Host "Please sign in to GitHub first:"
    & $gh auth login --hostname github.com --git-protocol https --web
}

$repoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
Set-Location $repoRoot

$existing = git remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0) { $existing = $null }
if (-not $existing) {
    Write-Host "Creating public repo and pushing..."
    & $gh repo create partner-story-bot --public --source=. --remote=origin --push
} else {
    Write-Host "Pushing to existing remote..."
    git push -u origin main
}

Write-Host ""
Write-Host "Deployment started. After the GitHub Action finishes (~2 min), your POC will be live at:"
Write-Host "  https://<your-github-username>.github.io/partner-story-bot/"
Write-Host ""
Write-Host "Check workflow status:"
Write-Host "  gh run list --repo $(git remote get-url origin | ForEach-Object { $_ -replace '.*github.com[:/]', '' -replace '\.git$', '' })"
