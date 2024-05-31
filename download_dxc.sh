#!/bin/bash

URL=https://github.com/microsoft/DirectXShaderCompiler/releases/download/v1.8.2405/linux_dxc_2024_05_24.x86_64.tar.gz

cd external
mkdir dxc-build && cd dxc-build
wget $URL || exit 1

tar xfv linux_dxc_2024_05_24.x86_64.tar.gz
