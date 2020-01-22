# dxil-spirv

This project aims to provide translation of DXIL (SM 6.x) shaders to SPIR-V which can be used in the vkd3d project,
which implements D3D12 on top of Vulkan.

## Building

### Dependencies

LLVM is currently required to be installed. DXIL is straight up LLVM IR in disguise.
dxil-spirv has been tested against LLVM 9, but almost any LLVM version after 3.7 is expected to work.

Also check out submodules first with `git submodule update --init`.

### Build

Standard CMake build.

```
mkdir build
cd build
cmake .. -DCMAKE_BUILD_TYPE=Release
make
make install
```

## Linking against dxil-spirv

Only the C API is installed and is expected to be kept ABI/API stable when it releases.

### pkg-config

```
pkg-config dxil-spirv-c-shared --cflags --libs
```

### CMake module

Something like:

```
find_package(dxil_spirv_c_shared)
if (dxil_spirv_c_shared_FOUND)
	message("Found dxil-spirv! Enabling DXIL support.")
	target_link_libraries(vkd3d-shader PRIVATE dxil-spirv-c-shared)
	target_compile_definitions(vkd3d-shader PRIVATE HAVE_DXIL_SPV)
	target_sources(vkd3d-shader PRIVATE vkd3d/libs/vkd3d-shader/dxil.c)
else()
	message("Did not find DXIL2SPIRV :( Disabling DXIL support.")
endif()
```

## License

dxil-spirv is currently licensed as LGPLv2, to match vkd3d.

```
/*
 * Copyright 2019-2020 Hans-Kristian Arntzen for Valve Corporation
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301, USA
 */
```
