#!/bin/bash

PROFILE=Release

if [ ! -z $1 ]; then
	PROFILE=$1
fi

if [ ! -z $2 ]; then
	NPROC="--parallel $2"
fi

echo "Building DXC."
mkdir -p external/dxc-build
cd external/dxc-build
# CLANG_FORMAT_EXE=OFF avoids a broken build where it expects clang-format to produce exact results for some dumb reason.
cmake ../DirectXShaderCompiler -DCMAKE_BUILD_TYPE=$PROFILE -C ../DirectXShaderCompiler/cmake/caches/PredefinedParams.cmake -G Ninja -DSPIRV_WERROR=OFF -DCLANG_FORMAT_EXE=OFF -DCMAKE_C_COMPILER=clang -DCMAKE_CXX_COMPILER=clang++
cmake --build . --config $PROFILE ${NPROC}

