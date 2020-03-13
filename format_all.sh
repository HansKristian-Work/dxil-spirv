#!/bin/bash

for file in *.{cpp,hpp} debug/*.hpp opcodes/*.{cpp,hpp} opcodes/dxil/*.{cpp,hpp} bc/*.{cpp,hpp}
do
    echo "Formatting file: $file ..."
    clang-format -style=file -i $file
done
