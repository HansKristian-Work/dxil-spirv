#!/bin/bash

DXC_REV=cce6fe0f43ca539627fab03395a96c7167b02ac9

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

