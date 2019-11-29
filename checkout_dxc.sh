#!/bin/bash

DXC_REV=d0e9147ab86c8cb29a5fd81bd758e44d440c332c

if [ -z $PROTOCOL ]; then
	PROTOCOL=git
fi

echo "Using protocol \"$PROTOCOL\" for checking out repositories. If this is problematic, try PROTOCOL=https $0."

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
	git clone $PROTOCOL://github.com/Microsoft/DirectXShaderCompiler.git
	cd DirectXShaderCompiler
	git checkout $DXC_REV
	git submodule update --init
fi

