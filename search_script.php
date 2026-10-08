<?php
$dir = new RecursiveDirectoryIterator('.');
$ite = new RecursiveIteratorIterator($dir);
foreach ($ite as $file) {
    if ($file->isFile()) {
        if (strpos($file->getPathname(), '.git') !== false || strpos($file->getPathname(), 'node_modules') !== false || strpos($file->getPathname(), 'vendor') !== false) {
            continue;
        }
        $content = file_get_contents($file->getPathname());
        if (stripos($content, 'blocklynewpage') !== false || stripos($content, 'blockly_new_page') !== false) {
            echo $file->getPathname() . PHP_EOL;
        }
    }
}
