#!/bin/bash

LLVM_REV=2c4ca6832fa6b306ee6a

if [ -z $PROTOCOL ]; then
	PROTOCOL=git
fi

echo "Using protocol \"$PROTOCOL\" for checking out repositories. If this is problematic, try PROTOCOL=https $0."

if [ -d external/llvm ]; then
	echo "Updating LLVM to revision $LLVM_REV."
	cd external/llvm
	git fetch origin
	git checkout $LLVM_REV
else
	echo "Cloning LLVM revision $LLVM_REV."
	mkdir -p external
	cd external
	git clone $PROTOCOL://github.com/llvm-mirror/llvm.git
	cd llvm
	git checkout $LLVM_REV
fi

