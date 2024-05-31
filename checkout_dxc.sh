#!/bin/bash

DXC_REV=fd7e54bcd527daeb0e400c200aab4f66730525e6

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

