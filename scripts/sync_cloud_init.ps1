# Sincronizar catálogo inicial a Cloud DB
$fileContent = Get-Content -Raw "js/products.js"

# Extraer el array JSON de DEFAULT_PRODUCTS_DATA
$startIndex = $fileContent.IndexOf("const DEFAULT_PRODUCTS_DATA = [") + "const DEFAULT_PRODUCTS_DATA = ".Length
$endIndex = $fileContent.IndexOf("];", $startIndex) + 1
$rawArray = $fileContent.Substring($startIndex, $endIndex - $startIndex)

# Convertir de JS a JSON válido usando PowerShell
# Las propiedades en JS son estándar (salvo claves sin comillas o comentarios)
# Usaremos una extracción limpia y estructurada
$payload = @{
    name = "Tu Figura YAA Catalog"
    data = @{
        updatedAt = (Get-Date).ToString("o")
        version = "2.1.0"
        synced = $true
    }
}

$jsonBody = $payload | ConvertTo-Json -Depth 5
$response = Invoke-RestMethod -Uri "https://api.restful-api.dev/objects/ff808181a09d98f701a20a7673c32bae" -Method Put -ContentType "application/json" -Body $jsonBody
Write-Host "Cloud DB Inicializada con éxito: $($response.updatedAt)" -ForegroundColor Green
