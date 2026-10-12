<?php
declare(strict_types=1);

$portfolioDirectory = 'C:/Users/ericka/OneDrive - stcbauan.edu.ph/Desktop/ito na talaga guys';
$files = [
    'index.html' => 'text/html; charset=utf-8',
    'about.html' => 'text/html; charset=utf-8',
    'service.html' => 'text/html; charset=utf-8',
    'contact.html' => 'text/html; charset=utf-8',
    'style.css' => 'text/css; charset=utf-8',
    'script.js' => 'application/javascript; charset=utf-8',
    'main.png' => 'image/png',
];

$file = $_GET['file'] ?? 'index.html';
if (!is_string($file) || !isset($files[$file])) {
    http_response_code(404);
    exit('Portfolio file not found.');
}

$path = $portfolioDirectory . '/' . $file;
if (!is_file($path) || !is_readable($path)) {
    http_response_code(404);
    exit('Portfolio file is unavailable.');
}

$content = file_get_contents($path);
if ($content === false) {
    http_response_code(500);
    exit('Unable to read portfolio file.');
}

if (str_ends_with($file, '.html')) {
    $content = preg_replace_callback(
        '/\b(href|src)="((?:index|about|service|contact)\.html|style\.css|script\.js|main\.png)"/i',
        static function (array $matches): string {
            $attribute = $matches[1];
            $asset = $matches[2];
            return $attribute . '="portfolio.php?file=' . rawurlencode($asset) . '"';
        },
        $content
    ) ?? $content;

    $content = str_replace(
        'href="#service.html"',
        'href="portfolio.php?file=service.html"',
        $content
    );
    $content = str_replace(
        'href="#contact.html"',
        'href="portfolio.php?file=contact.html"',
        $content
    );
}

header('Content-Type: ' . $files[$file]);
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
echo $content;
