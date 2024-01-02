#!/usr/bin/env bash

find ./server/ -name "*.js" -exec sh -c '
  for file do
    uglifyjs "$file" --compress --mangle -o "${file%.js}.min.js"
    echo "Minified: $file"
  done
' sh {} +
