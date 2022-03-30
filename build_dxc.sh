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
cmake ../DirectXShaderCompiler -DCMAKE_BUILD_TYPE=$PROFILE -C ../DirectXShaderCompiler/cmake/caches/PredefinedParams.cmake -G Ninja -DSPIRV_WERROR=OFF
cmake --build . --config $PROFILE ${NPROC}

