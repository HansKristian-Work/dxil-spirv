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
cmake ../DirectXShaderCompiler -DCMAKE_BUILD_TYPE=$PROFILE -DCMAKE_INSTALL_PREFIX=output $(cat ../DirectXShaderCompiler/utils/cmake-predefined-config-params) -G Ninja -DSPIRV_WERROR=OFF
cmake --build . --config $PROFILE --target install ${NPROC}

