#
# Copyright 2019 Hans-Kristian Arntzen for Valve Corporation
#
# This library is free software; you can redistribute it and/or
# modify it under the terms of the GNU Lesser General Public
# License as published by the Free Software Foundation; either
# version 2.1 of the License, or (at your option) any later version.
#
# This library is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
# Lesser General Public License for more details.
#
# You should have received a copy of the GNU Lesser General Public
# License along with this library; if not, write to the Free Software
# Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301, USA
#

cmake_minimum_required(VERSION 3.5)
set(CMAKE_CXX_STANDARD 14)
set(CMAKE_C_STANDARD 99)
project(DXIL2SPIRV LANGUAGES CXX C)

find_package(LLVM REQUIRED CONFIG)
message(STATUS "Found LLVM ${LLVM_PACKAGE_VERSION}")
message(STATUS "Using LLVMConfig.cmake in: ${LLVM_DIR}")

if (CMAKE_COMPILER_IS_GNUCXX OR (${CMAKE_CXX_COMPILER_ID} MATCHES "Clang"))
    set(DXIL2SPIRV_CXX_FLAGS -Wall -Wextra -Wno-missing-field-initializers -Wno-empty-body -ffast-math -Wno-unused-parameter)
elseif (MSVC)
    set(DXIL2SPIRV_CXX_FLAGS /D_CRT_SECURE_NO_WARNINGS /wd4267 /wd4244 /wd4309 /wd4005 /MP /DNOMINMAX)
endif()

add_subdirectory(third_party/spirv-headers EXCLUDE_FROM_ALL)
set(SPIRV-Headers_SOURCE_DIR "${CMAKE_CURRENT_SOURCE_DIR}/third_party/spirv-headers" CACHE STRING "SPIRV-Headers path" FORCE)
add_subdirectory(third_party/SPIRV-Tools EXCLUDE_FROM_ALL)
add_subdirectory(third_party/SPIRV-Cross EXCLUDE_FROM_ALL)

add_library(spirv-builder STATIC
        third_party/glslang-spirv/spvIR.h
        third_party/glslang-spirv/Logger.cpp
        third_party/glslang-spirv/Logger.h
        third_party/glslang-spirv/InReadableOrder.cpp
        third_party/glslang-spirv/SpvBuilder.h
        third_party/glslang-spirv/SpvBuilder.cpp)
set_target_properties(spirv-builder PROPERTIES POSITION_INDEPENDENT_CODE ON)

target_include_directories(spirv-builder PUBLIC
        ${CMAKE_CURRENT_SOURCE_DIR}/third_party/spirv-headers/include/spirv/unified1
        ${CMAKE_CURRENT_SOURCE_DIR}/third_party/glslang-spirv)

add_library(spirv-module STATIC
        ir.hpp ir.cpp
        spirv_module.hpp spirv_module.cpp)
set_target_properties(spirv-module PROPERTIES POSITION_INDEPENDENT_CODE ON)
target_include_directories(spirv-module PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})
target_link_libraries(spirv-module PUBLIC spirv-builder)
target_compile_options(spirv-module PRIVATE ${DXIL2SPIRV_CXX_FLAGS})

add_library(dxil-debug INTERFACE)
target_include_directories(dxil-debug INTERFACE ${CMAKE_CURRENT_SOURCE_DIR}/debug)

add_library(cli-parser STATIC
        third_party/cli_parser/cli_parser.hpp
        third_party/cli_parser/cli_parser.cpp)
target_include_directories(cli-parser PUBLIC ${CMAKE_CURRENT_SOURCE_DIR}/third_party/cli_parser)
target_link_libraries(cli-parser PUBLIC dxil-debug)
target_compile_options(cli-parser PRIVATE ${DXIL2SPIRV_CXX_FLAGS})

add_library(dxil-converter STATIC
        memory_stream.hpp memory_stream.cpp
        llvm_bitcode_parser.hpp llvm_bitcode_parser.cpp
        dxil.hpp
        dxil_converter.hpp dxil_converter.cpp
        cfg_structurizer.hpp cfg_structurizer.cpp
        node_pool.hpp node_pool.cpp
        node.hpp node.cpp
        dxil_parser.hpp dxil_parser.cpp
        scratch_pool.hpp
        opcodes/converter_impl.hpp
        opcodes/opcodes.hpp
        opcodes/dxil/dxil_common.hpp opcodes/dxil/dxil_common.cpp
        opcodes/dxil/dxil_resources.hpp opcodes/dxil/dxil_resources.cpp
        opcodes/dxil/dxil_compute.hpp opcodes/dxil/dxil_compute.cpp
        opcodes/dxil/dxil_arithmetic.hpp opcodes/dxil/dxil_arithmetic.cpp
        opcodes/dxil/dxil_pixel_ops.hpp opcodes/dxil/dxil_pixel_ops.cpp
        opcodes/dxil/dxil_geometry.hpp opcodes/dxil/dxil_geometry.cpp
        opcodes/dxil/dxil_tessellation.hpp opcodes/dxil/dxil_tessellation.cpp
        opcodes/dxil/dxil_waveops.hpp opcodes/dxil/dxil_waveops.cpp
        opcodes/dxil/dxil_sampling.hpp opcodes/dxil/dxil_sampling.cpp
        opcodes/dxil/dxil_buffer.hpp opcodes/dxil/dxil_buffer.cpp
        opcodes/opcodes_llvm_builtins.hpp opcodes/opcodes_llvm_builtins.cpp
        opcodes/opcodes_dxil_builtins.hpp opcodes/opcodes_dxil_builtins.cpp)
set_target_properties(dxil-converter PROPERTIES POSITION_INDEPENDENT_CODE ON)
target_include_directories(dxil-converter PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})
target_link_libraries(dxil-converter PRIVATE dxil-debug)


llvm_map_components_to_libnames(llvm_libs Core Support IRReader)
target_link_libraries(dxil-converter PRIVATE ${llvm_libs})
target_link_libraries(dxil-converter PUBLIC spirv-module)

add_library(dxil-converter-c-shared SHARED
        dxil_spirv_c.h dxil_spirv_c.cpp)
target_include_directories(dxil-converter-c-shared PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})
target_link_libraries(dxil-converter-c-shared PRIVATE dxil-debug SPIRV-Tools dxil-converter)

if (NOT MSVC)
    set_target_properties(dxil-converter-c-shared PROPERTIES LINK_FLAGS "-Wl,--version-script ${CMAKE_CURRENT_SOURCE_DIR}/link.T")
endif()

add_executable(dxil-spirv dxil_spirv.cpp)
target_link_libraries(dxil-spirv PRIVATE dxil-converter cli-parser SPIRV-Tools spirv-cross-glsl dxil-debug)
target_compile_options(dxil-spirv PRIVATE ${DXIL2SPIRV_CXX_FLAGS})

add_executable(structurize-test structurize_test.cpp)
target_link_libraries(structurize-test PRIVATE dxil-converter SPIRV-Tools spirv-cross-glsl dxil-debug)
target_compile_options(structurize-test PRIVATE ${DXIL2SPIRV_CXX_FLAGS})

