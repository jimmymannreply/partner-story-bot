targetScope = 'subscription'

@minLength(1)
@maxLength(64)
param environmentName string

@minLength(1)
param location string = 'eastus2'

param webServiceName string = 'web'

var abbrs = loadJsonContent('./abbreviations.json')
var tags = { 'azd-env-name': environmentName }

resource rg 'Microsoft.Resources/resourceGroups@2022-09-01' = {
  name: 'rg-${environmentName}'
  location: location
  tags: tags
}

module web 'app/staticwebapp.bicep' = {
  name: 'web-deployment'
  scope: rg
  params: {
    name: '${abbrs.webStaticSites}${environmentName}'
    location: location
    tags: tags
  }
}

output WEB_URI string = web.outputs.uri
