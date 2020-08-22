$CRED_LOCATION = "C:\Users\$Env:UserName\Documents\Temporary\approveman-credentials"

Write-Output "Use $CRED_LOCATION to download credentials."

If (Test-Path $CRED_LOCATION -PathType Container) {
  Write-Output "$CRED_LOCATION exist. Remove before downloading."
  Remove-Item "$CRED_LOCATION" -Recurse -Force
}

git clone https://${GITHUB_TOKEN}@github.com/tianhaoz95/approveman-credentials.git $CRED_LOCATION

& $CRED_LOCATION\set_environment_variables.ps1
