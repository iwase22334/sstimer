#!/bin/bash -e
(cd src-tauri;  cargo.exe about generate -o ../src/modules/resource/THIRD-PARTY-NOTICES-cargo.txt about.hbs)
yarn licenses generate-disclaimer | tee src/modules/resource/THIRD-PARTY-NOTICES-yarn.txt
