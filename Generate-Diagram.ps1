# ============================================================
#  Generate-Diagram.ps1 — Generador de diagramas profesionales
#  para plantillas n8n (estilo plano de ingenieria / HMI).
#
#  Uso:
#    .\Generate-Diagram.ps1 -Title "Titulo" -Subtitle "Subtitulo" `
#        -Category "IA / AI" `
#        -Nodes "Webhook|trigger","OpenAI|ai","Responder|action" `
#        -Output "ruta\diagrama.svg"
#
#  Tipos de nodo: trigger, ai, action, logic, data, comms, wait
# ============================================================
param(
    [Parameter(Mandatory=$true)][string]$Title,
    [string]$Subtitle = "",
    [string]$Category = "n8n workflow",
    [Parameter(Mandatory=$true)][string[]]$Nodes,
    [Parameter(Mandatory=$true)][string]$Output,
    [string]$Rev = "A"
)

function Esc([string]$s){ return [System.Security.SecurityElement]::Escape($s) }

# ---- Paleta profesional por tipo de nodo ----
$T = @{
  trigger = @{ g1="#332607"; g2="#1a1304"; stroke="#f59e0b"; icon="#fbbf24"; tag="TRIGGER"; path="M13 3 L5 13 H11 L10 21 L19 10 H13 Z" }
  ai      = @{ g1="#241a3d"; g2="#140e24"; stroke="#8b5cf6"; icon="#a78bfa"; tag="AI / ML";  path="M12 3 L14 9 L20 11 L14 13 L12 19 L10 13 L4 11 L10 9 Z" }
  action  = @{ g1="#0e2b22"; g2="#081812"; stroke="#10b981"; icon="#34d399"; tag="ACTION";  path="M5 13 L10 18 L20 6" }
  logic   = @{ g1="#0a2a33"; g2="#06181e"; stroke="#06b6d4"; icon="#22d3ee"; tag="LOGIC";   path="M12 3 L20 12 L12 21 L4 12 Z" }
  data    = @{ g1="#122murk".Replace("murk","a3d"); g2="#0b1528"; stroke="#3b82f6"; icon="#60a5fa"; tag="DATA"; path="M5 6 C5 4 19 4 19 6 V18 C19 20 5 20 5 18 Z M5 6 C5 8 19 8 19 6 M5 12 C5 14 19 14 19 12" }
  comms   = @{ g1="#2c1021"; g2="#1a0913"; stroke="#ec4899"; icon="#f472b6"; tag="COMMS";   path="M4 5 H20 V16 H11 L7 20 V16 H4 Z" }
  wait    = @{ g1="#1c232c"; g2="#11151b"; stroke="#94a3b8"; icon="#cbd5e1"; tag="WAIT";    path="M12 3 A9 9 0 1 0 12 21 A9 9 0 1 0 12 3 M12 7 V12 L15 14" }
}

# ---- Geometria ----
$nodeW=212; $nodeH=94; $gap=90; $padX=64
$headerH=98; $legendH=46; $titleH=72; $bottomPad=44
$count=$Nodes.Count
$flowW = $count*$nodeW + ($count-1)*$gap
$canvasW = [Math]::Max($padX*2 + $flowW, 760)
$nodesY  = $headerH + $legendH + 24
$canvasH = $nodesY + $nodeH + 56 + $titleH + $bottomPad
$flowStartX = ($canvasW - $flowW)/2

$sb = New-Object System.Text.StringBuilder
function L([string]$s){ [void]$sb.AppendLine($s) }

L '<?xml version="1.0" encoding="UTF-8"?>'
L ('<svg xmlns="http://www.w3.org/2000/svg" width="' + $canvasW + '" height="' + $canvasH + '" viewBox="0 0 ' + $canvasW + ' ' + $canvasH + '" font-family="''Segoe UI'', system-ui, -apple-system, sans-serif">')

# ---------------- DEFS ----------------
L '  <defs>'
L '    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">'
L '      <stop offset="0" stop-color="#0a1428"/><stop offset="0.5" stop-color="#0b1a33"/><stop offset="1" stop-color="#08111f"/>'
L '    </linearGradient>'
L '    <linearGradient id="hdr" x1="0" y1="0" x2="1" y2="0">'
L '      <stop offset="0" stop-color="#0e2038"/><stop offset="1" stop-color="#0a1728"/>'
L '    </linearGradient>'
foreach($k in $T.Keys){
  $c=$T[$k]
  L ('    <linearGradient id="grad-' + $k + '" x1="0" y1="0" x2="0" y2="1">')
  L ('      <stop offset="0" stop-color="' + $c.g1 + '"/><stop offset="1" stop-color="' + $c.g2 + '"/>')
  L '    </linearGradient>'
}
L '    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">'
L '      <feDropShadow dx="0" dy="7" stdDeviation="11" flood-color="#000000" flood-opacity="0.5"/>'
L '    </filter>'
L '    <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">'
L '      <feGaussianBlur stdDeviation="3.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>'
L '    </filter>'
L '    <marker id="arrow" markerWidth="11" markerHeight="11" refX="8.5" refY="4.5" orient="auto" markerUnits="userSpaceOnUse">'
L '      <path d="M0,0 L9,4.5 L0,9 L2.5,4.5 Z" fill="#3b82f6"/>'
L '    </marker>'
L '    <pattern id="grid" width="26" height="26" patternUnits="userSpaceOnUse">'
L '      <path d="M26 0 L0 0 0 26" fill="none" stroke="#16263f" stroke-width="1"/>'
L '    </pattern>'
L '  </defs>'

# ---------------- FONDO + MARCO TECNICO ----------------
L ('  <rect width="' + $canvasW + '" height="' + $canvasH + '" fill="url(#bg)"/>')
L ('  <rect width="' + $canvasW + '" height="' + $canvasH + '" fill="url(#grid)" opacity="0.5"/>')
$m=16
L ('  <rect x="' + $m + '" y="' + $m + '" width="' + ($canvasW-2*$m) + '" height="' + ($canvasH-2*$m) + '" fill="none" stroke="#1e3a5f" stroke-width="1.5" rx="6"/>')
# marcas de esquina
$cl=14
foreach($corner in @(@($m,$m,1,1), @(($canvasW-$m),$m,-1,1), @($m,($canvasH-$m),1,-1), @(($canvasW-$m),($canvasH-$m),-1,-1))){
  $cx=$corner[0]; $cy=$corner[1]; $dx=$corner[2]; $dy=$corner[3]
  L ('  <path d="M' + $cx + ' ' + ($cy+$dy*$cl) + ' L' + $cx + ' ' + $cy + ' L' + ($cx+$dx*$cl) + ' ' + $cy + '" fill="none" stroke="#3b82f6" stroke-width="2"/>')
}

# ---------------- CABECERA ----------------
L ('  <rect x="' + $m + '" y="' + $m + '" width="' + ($canvasW-2*$m) + '" height="' + ($headerH-24) + '" fill="url(#hdr)" rx="6"/>')
L ('  <rect x="' + $m + '" y="' + ($headerH-26) + '" width="' + ($canvasW-2*$m) + '" height="2" fill="#3b82f6" opacity="0.7"/>')
# logo hexagonal
$lx=$padX; $ly=44
L ('  <g transform="translate(' + $lx + ',' + $ly + ')">')
L '    <path d="M16 0 L30 8 L30 24 L16 32 L2 24 L2 8 Z" fill="none" stroke="#3b82f6" stroke-width="2"/>'
L '    <path d="M16 7 L24 12 L24 20 L16 25 L8 20 L8 12 Z" fill="#3b82f6" opacity="0.18"/>'
L '    <circle cx="16" cy="16" r="3.5" fill="#22d3ee"/>'
L '  </g>'
L ('  <text x="' + ($lx+44) + '" y="' + ($ly+10) + '" fill="#f1f5f9" font-size="23" font-weight="700">' + (Esc $Title) + '</text>')
if($Subtitle){ L ('  <text x="' + ($lx+44) + '" y="' + ($ly+30) + '" fill="#7d93b8" font-size="13">' + (Esc $Subtitle) + '</text>') }
L ('  <text x="' + ($canvasW-$padX) + '" y="' + ($ly+4) + '" fill="#3b82f6" font-size="12" font-weight="700" text-anchor="end" letter-spacing="2">n8n WORKFLOW</text>')
L ('  <text x="' + ($canvasW-$padX) + '" y="' + ($ly+22) + '" fill="#5a729a" font-size="11" text-anchor="end" letter-spacing="1">AUTOMATION TEMPLATE</text>')

# ---------------- LEYENDA ----------------
$usedTypes = @()
foreach($n in $Nodes){ $p=$n.Split("|"); $ty=if($p.Count -gt 1){$p[1]}else{"action"}; if(-not $T.ContainsKey($ty)){$ty="action"}; if($usedTypes -notcontains $ty){ $usedTypes += $ty } }
$legY = $headerH + 14
$legX = $padX
L ('  <text x="' + $legX + '" y="' + ($legY+4) + '" fill="#5a729a" font-size="10" font-weight="700" letter-spacing="1.5">LEYENDA</text>')
$cx = $legX + 70
foreach($ty in $usedTypes){
  $c=$T[$ty]
  L ('  <rect x="' + $cx + '" y="' + ($legY-8) + '" width="14" height="14" rx="3" fill="url(#grad-' + $ty + ')" stroke="' + $c.stroke + '" stroke-width="1.5"/>')
  L ('  <text x="' + ($cx+20) + '" y="' + ($legY+4) + '" fill="#9fb3d1" font-size="11">' + $c.tag + '</text>')
  $cx += 20 + ($c.tag.Length * 7) + 26
}

# ---------------- NODOS + CONECTORES ----------------
$cy = $nodesY
$positions = @()
for($i=0;$i -lt $count;$i++){
  $x = $flowStartX + $i*($nodeW+$gap)
  $positions += ,@($x,$cy)
}
# conectores primero (detras de nodos)
for($i=0;$i -lt $count-1;$i++){
  $x1 = $positions[$i][0] + $nodeW
  $x2 = $positions[$i+1][0]
  $yy = $cy + $nodeH/2
  $mx = ($x1+$x2)/2
  L ('  <path d="M' + $x1 + ' ' + $yy + ' C' + $mx + ' ' + $yy + ' ' + $mx + ' ' + $yy + ' ' + ($x2-3) + ' ' + $yy + '" fill="none" stroke="#3b82f6" stroke-width="2.2" marker-end="url(#arrow)"/>')
  L ('  <circle cx="' + $x1 + '" cy="' + $yy + '" r="3.5" fill="#0a1428" stroke="#3b82f6" stroke-width="2"/>')
}
# nodos
for($i=0;$i -lt $count;$i++){
  $parts=$Nodes[$i].Split("|")
  $label=$parts[0]
  $ty=if($parts.Count -gt 1){$parts[1]}else{"action"}
  if(-not $T.ContainsKey($ty)){$ty="action"}
  $c=$T[$ty]
  $x=$positions[$i][0]; $y=$cy
  $panelW=58
  # tarjeta
  L ('  <g filter="url(#shadow)">')
  L ('    <rect x="' + $x + '" y="' + $y + '" width="' + $nodeW + '" height="' + $nodeH + '" rx="13" fill="url(#grad-' + $ty + ')" stroke="' + $c.stroke + '" stroke-width="1.8"/>')
  L '  </g>'
  # panel de icono
  L ('  <path d="M' + $x + ' ' + ($y+13) + ' Q' + $x + ' ' + $y + ' ' + ($x+13) + ' ' + $y + ' H' + ($x+$panelW) + ' V' + ($y+$nodeH) + ' H' + ($x+13) + ' Q' + $x + ' ' + ($y+$nodeH) + ' ' + $x + ' ' + ($y+$nodeH-13) + ' Z" fill="#000000" opacity="0.22"/>')
  L ('  <line x1="' + ($x+$panelW) + '" y1="' + ($y+10) + '" x2="' + ($x+$panelW) + '" y2="' + ($y+$nodeH-10) + '" stroke="' + $c.stroke + '" stroke-width="1" opacity="0.4"/>')
  # icono
  $ix = $x + ($panelW/2) - 13; $iy = $y + ($nodeH/2) - 13
  L ('  <g transform="translate(' + $ix + ',' + $iy + ')" fill="none" stroke="' + $c.icon + '" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)">')
  L ('    <path d="' + $c.path + '"/>')
  L '  </g>'
  # etiqueta de tipo
  L ('  <text x="' + ($x+$panelW+14) + '" y="' + ($y+26) + '" fill="' + $c.icon + '" font-size="10" font-weight="700" letter-spacing="1.5">' + $c.tag + '</text>')
  # nombre (con wrap)
  $maxChars=15
  $tx = $x+$panelW+14
  if($label.Length -gt $maxChars){
    # cortar en espacio cercano
    $cut=$label.LastIndexOf(' ', [Math]::Min($maxChars+3,$label.Length-1))
    if($cut -lt 6){ $cut=$maxChars }
    $l1=$label.Substring(0,$cut); $l2=$label.Substring($cut).Trim()
    L ('  <text x="' + $tx + '" y="' + ($y+52) + '" fill="#f1f5f9" font-size="14.5" font-weight="700">' + (Esc $l1) + '</text>')
    L ('  <text x="' + $tx + '" y="' + ($y+71) + '" fill="#f1f5f9" font-size="14.5" font-weight="700">' + (Esc $l2) + '</text>')
  } else {
    L ('  <text x="' + $tx + '" y="' + ($y+60) + '" fill="#f1f5f9" font-size="15" font-weight="700">' + (Esc $label) + '</text>')
  }
  # badge de paso
  L ('  <circle cx="' + ($x+$nodeW-2) + '" cy="' + ($y+2) + '" r="13" fill="#0a1428" stroke="' + $c.stroke + '" stroke-width="1.6"/>')
  L ('  <text x="' + ($x+$nodeW-2) + '" y="' + ($y+6) + '" fill="' + $c.icon + '" font-size="12" font-weight="700" text-anchor="middle">' + ($i+1) + '</text>')
}

# ---------------- BLOQUE DE TITULO (estilo plano) ----------------
$tbY = $canvasH - $bottomPad - $titleH
$tbX = $padX
$tbW = $canvasW - 2*$padX
$today = (Get-Date).ToString("yyyy-MM-dd")
L ('  <rect x="' + $tbX + '" y="' + $tbY + '" width="' + $tbW + '" height="' + $titleH + '" fill="#0b1a30" stroke="#1e3a5f" stroke-width="1.5" rx="4"/>')
# columnas: 42% | 20% | 18% | 20%
$c1=$tbX; $w1=[int]($tbW*0.42); $w2=[int]($tbW*0.20); $w3=[int]($tbW*0.18); $w4=$tbW-$w1-$w2-$w3
$xs=@($c1, ($c1+$w1), ($c1+$w1+$w2), ($c1+$w1+$w2+$w3))
foreach($xx in $xs[1..3]){ L ('  <line x1="' + $xx + '" y1="' + ($tbY+6) + '" x2="' + $xx + '" y2="' + ($tbY+$titleH-6) + '" stroke="#1e3a5f" stroke-width="1"/>') }
L ('  <line x1="' + $tbX + '" y1="' + ($tbY+26) + '" x2="' + ($tbX+$tbW) + '" y2="' + ($tbY+26) + '" stroke="#1e3a5f" stroke-width="1"/>')
# fila superior: TITULO (span todas)
L ('  <text x="' + ($tbX+12) + '" y="' + ($tbY+18) + '" fill="#5a729a" font-size="9" font-weight="700" letter-spacing="1.5">TITULO DEL FLUJO</text>')
L ('  <text x="' + ($tbX+120) + '" y="' + ($tbY+18) + '" fill="#cbd5e1" font-size="11" font-weight="600">' + (Esc $Title) + '</text>')
# fila inferior: 4 celdas
$ry=$tbY+44; $ly2=$tbY+60
$cellLbl=@("CATEGORIA","NODOS","REV","FECHA")
$cellVal=@($Category, ([string]$count), $Rev, $today)
for($j=0;$j -lt 4;$j++){
  L ('  <text x="' + ($xs[$j]+12) + '" y="' + $ry + '" fill="#5a729a" font-size="9" font-weight="700" letter-spacing="1.2">' + $cellLbl[$j] + '</text>')
  L ('  <text x="' + ($xs[$j]+12) + '" y="' + $ly2 + '" fill="#e2e8f0" font-size="12.5" font-weight="600">' + (Esc $cellVal[$j]) + '</text>')
}

L '</svg>'

$dir = Split-Path $Output -Parent
if($dir -and -not (Test-Path $dir)){ New-Item -ItemType Directory -Path $dir -Force | Out-Null }
[System.IO.File]::WriteAllText($Output, $sb.ToString(), [System.Text.UTF8Encoding]::new($false))
Write-Host ("OK  " + (Split-Path $Output -Leaf))