#!/usr/bin/env bash

find ./server/ -name "*.js" -exec sh -c '
  for file do
    uglifyjs "$file" --compress --mangle -o "$file"
    echo "Minified: $file"
  done
' sh {} +
