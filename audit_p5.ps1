$base = "C:\Users\babas\Downloads\projet_calcul-\projet_calcul-\BackEnd"

Write-Host "=== CostEngineService ==="
$svcPath = "$base\app\Services\CostEngineService.php"
Write-Host "CostEngineService.php exists: $(Test-Path $svcPath)"
if (Test-Path $svcPath) {
    $c = Get-Content $svcPath -Raw
    Write-Host "  calculerCoutUnitaire:      $($c -match 'calculerCoutUnitaire')"
    Write-Host "  calculerCoutLot:           $($c -match 'calculerCoutLot')"
    Write-Host "  calculerPricing:           $($c -match 'calculerPricing')"
    Write-Host "  calculerMatieres:          $($c -match 'calculerMatieres')"
    Write-Host "  calculerMod:               $($c -match 'calculerMod')"
    Write-Host "  calculerPackaging:         $($c -match 'calculerPackaging')"
    Write-Host "  calculerChargesIndirectes: $($c -match 'calculerChargesIndirectes')"
    Write-Host "  convertirFrequenceEnMois:  $($c -match 'convertirFrequenceEnMois')"
    Write-Host "  calculerBasesGlobales:     $($c -match 'calculerBasesGlobales')"
    Write-Host "  repartition volume:        $($c -match 'volume')"
    Write-Host "  repartition quantite:      $($c -match 'quantite')"
    Write-Host "  repartition temps_machine: $($c -match 'temps_machine')"
}

Write-Host ""
Write-Host "=== CostEngineController ==="
$ctrlPath = "$base\app\Http\Controllers\CostEngineController.php"
Write-Host "CostEngineController.php exists: $(Test-Path $ctrlPath)"
if (Test-Path $ctrlPath) {
    $c2 = Get-Content $ctrlPath -Raw
    Write-Host "  coutUnitaire:  $($c2 -match 'coutUnitaire')"
    Write-Host "  coutLot:       $($c2 -match 'coutLot')"
    Write-Host "  coutBatch:     $($c2 -match 'coutBatch')"
    Write-Host "  tableau:       $($c2 -match 'tableau')"
    Write-Host "  simulerCout:   $($c2 -match 'simulerCout')"
    Write-Host "  pricing:       $($c2 -match 'pricing')"
}

Write-Host ""
Write-Host "=== Routes API ==="
$api = Get-Content "$base\routes\api.php" -Raw
Write-Host "  cout-produits:  $($api -match 'cout-produits')"
Write-Host "  cout-unitaire:  $($api -match 'cout-unitaire')"
Write-Host "  cout-lot:       $($api -match 'cout-lot')"
Write-Host "  simuler-cout:   $($api -match 'simuler-cout')"
Write-Host "  cout-batch:     $($api -match 'cout-batch')"
Write-Host "  pricing route:  $($api -match 'pricing')"

Write-Host ""
Write-Host "=== Tests ==="
$testPath = "$base\tests\Unit\CostEngineServiceTest.php"
Write-Host "CostEngineServiceTest.php exists: $(Test-Path $testPath)"
if (Test-Path $testPath) {
    $t = Get-Content $testPath -Raw
    Write-Host "  test matiere:             $($t -match 'matiere|Matiere')"
    Write-Host "  test MOD:                 $($t -match 'mod|Mod|MOD')"
    Write-Host "  test packaging:           $($t -match 'packaging|Packaging')"
    Write-Host "  test charges indirectes:  $($t -match 'indirectes|Indirectes')"
    Write-Host "  test repartition:         $($t -match 'repartition|quantite|volume|temps_machine')"
    Write-Host "  test scenarios:           $($t -match 'scenario|Scenario')"
    Write-Host "  lines in file:            $((Get-Content $testPath).Count)"
}

Write-Host ""
Write-Host "=== Frontend CoutProduit ==="
$fe = "C:\Users\babas\Downloads\projet_calcul-\projet_calcul-\frontend\src"
Write-Host "CoutProduitList.jsx:  $(Test-Path $fe\CoutProduit\CoutProduitList.jsx)"
Write-Host "SimulationPage.jsx:   $(Test-Path $fe\Simulation\SimulationPage.jsx)"
Write-Host "PricingMargesPage.jsx: $(Test-Path $fe\Pricing\PricingMargesPage.jsx)"
