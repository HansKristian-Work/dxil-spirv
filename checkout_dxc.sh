#!/bin/bash

DXC_REV=ea53cb53ba1ce62bf5bbc139ec65aeba40251526

if [ -d external/DirectXShaderCompiler ]; then
	echo "Updating DirectXShaderCompiler to revision $DXC_REV."
	cd external/DirectXShaderCompiler
	git fetch origin
	git checkout $DXC_REV
	git submodule update --init
else
	echo "Cloning DirectXShaderCompiler revision $DXC_REV."
	mkdir -p external
	cd external
	git clone https://github.com/Microsoft/DirectXShaderCompiler.git
	cd DirectXShaderCompiler
	git checkout $DXC_REV
	git submodule update --init
fi

