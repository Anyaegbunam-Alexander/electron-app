#!/usr/bin/env bash

find ./server/ -name "*.js" -exec sh -c '
  for file do
    uglifyjs "$file" --compress --mangle -o "$file"
    echo "Minified: $file"
  done
' sh {} +

uglifyjs main.js --compress --mangle -o main.js
uglifyjs backgroundTask.js --compress --mangle -o backgroundTask.js