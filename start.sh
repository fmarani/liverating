#!/usr/bin/env bash

parallel --no-notice -u ::: "python api.py -p 5000" "cd js; npm run build-js"
