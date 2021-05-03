#!/bin/bash

# Commit before GatherCmp regression
DXC_REV=19360a8fa63ee29925f59328c261c1c920402bfd

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

