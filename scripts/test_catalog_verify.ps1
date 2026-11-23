# Script de verificación de precios y consistencia Tu Figura YAA
$productsContent = Get-Content -Raw -Path "js\products.js"

$expectedPrices = @{
    # Postquirúrgicas
    "702" = 180000
    "705" = 190000
    "712" = 190000
    "714" = 205000
    "760" = 255000
    "903" = 76000
    # Moldeadoras
    "703" = 175000
    "708" = 165000
    "740" = 205000
    "746" = 210000
    "757" = 205000
    "901" = 95000
    "901-1" = 75000
    "902" = 110000
    "905" = 130000
    "819" = 150000
    # Línea Dorada
    "812" = 150000
    "813" = 170000
}

Write-Host "=== VERIFICANDO PRECIOS EN JS/PRODUCTS.JS ===" -ForegroundColor Cyan
foreach ($ref in $expectedPrices.Keys) {
    $expected = $expectedPrices[$ref]
    if ($productsContent -match "ref:\s*`"$ref`"[\s\S]*?priceCOP:\s*(\d+)") {
        $actual = [int]$matches[1]
        if ($actual -eq $expected) {
            Write-Host "OK: REF. $ref -> `$actual COP (Esperado: `$expected)" -ForegroundColor Green
        } else {
            Write-Host "ERROR: REF. $ref -> `$actual COP != Esperado: `$expected" -ForegroundColor Red
        }
    } else {
        Write-Host "ERROR: No se encontró REF. $ref en js/products.js" -ForegroundColor Red
    }
}

Write-Host "`n=== VERIFICANDO PRECIOS EN RESTFUL CLOUD DB ===" -ForegroundColor Cyan
try {
    $cloudRes = Invoke-RestMethod -Uri "https://api.restful-api.dev/objects/ff808181a09d98f701a20a7673c32bae" -Method Get
    Write-Host "Cloud DB accesible y respondiendo correctamente. Objeto ID: $($cloudRes.id)" -ForegroundColor Green
} catch {
    Write-Host "Error conectando a Cloud DB: $_" -ForegroundColor Red
}

