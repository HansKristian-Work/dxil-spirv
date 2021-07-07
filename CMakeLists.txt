#
# Copyright 2019-2021 Hans-Kristian Arntzen for Valve Corporation
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
project(dxil-spirv LANGUAGES CXX C)

add_library(dxil-debug STATIC debug/logging.hpp debug/logging.cpp)
target_include_directories(dxil-debug PUBLIC ${CMAKE_CURRENT_SOURCE_DIR}/debug)
set_target_properties(dxil-debug PROPERTIES POSITION_INDEPENDENT_CODE ON)

option(DXIL_SPIRV_CLI "Enable CLI support." ON)
option(DXIL_SPIRV_NATIVE_LLVM "Enable native LLVM support." OFF)

include(GNUInstallDirs)

if (CMAKE_COMPILER_IS_GNUCXX OR (${CMAKE_CXX_COMPILER_ID} MATCHES "Clang"))
    set(DXIL_SPV_CXX_FLAGS -Wall -Wextra -Wno-missing-field-initializers -Wno-empty-body -ffast-math -Wno-unused-parameter -fno-exceptions -fvisibility=hidden)
elseif (MSVC)
    set(DXIL_SPV_CXX_FLAGS /D_CRT_SECURE_NO_WARNINGS /wd4996 /wd4244 /wd4267 /wd4244 /wd4309 /wd4005 /MP /DNOMINMAX)
endif()

add_library(dxil-utils STATIC util/thread_local_allocator.hpp util/thread_local_allocator.cpp)
target_include_directories(dxil-utils PUBLIC ${CMAKE_CURRENT_SOURCE_DIR}/util)
target_compile_options(dxil-utils PRIVATE ${DXIL_SPV_CXX_FLAGS})
set_target_properties(dxil-utils PROPERTIES POSITION_INDEPENDENT_CODE ON)

add_subdirectory(third_party EXCLUDE_FROM_ALL)
add_subdirectory(bc EXCLUDE_FROM_ALL)
add_subdirectory(external EXCLUDE_FROM_ALL)

add_library(spirv-module STATIC
        ir.hpp ir.cpp
        descriptor_qa.cpp descriptor_qa.hpp
        spirv_module.hpp spirv_module.cpp)
set_target_properties(spirv-module PROPERTIES POSITION_INDEPENDENT_CODE ON)
target_include_directories(spirv-module PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})
target_link_libraries(spirv-module PUBLIC glslang-spirv-builder dxil-spirv-headers)
target_link_libraries(spirv-module PRIVATE dxil-utils dxil-debug)
target_compile_options(spirv-module PRIVATE ${DXIL_SPV_CXX_FLAGS})

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
        opcodes/dxil/dxil_ray_tracing.hpp opcodes/dxil/dxil_ray_tracing.cpp
        opcodes/opcodes_llvm_builtins.hpp opcodes/opcodes_llvm_builtins.cpp
        opcodes/opcodes_dxil_builtins.hpp opcodes/opcodes_dxil_builtins.cpp)
set_target_properties(dxil-converter PROPERTIES POSITION_INDEPENDENT_CODE ON)
target_include_directories(dxil-converter PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})
target_compile_options(dxil-converter PRIVATE ${DXIL_SPV_CXX_FLAGS})
target_link_libraries(dxil-converter PRIVATE dxil-debug external::llvm dxil-utils)

target_link_libraries(dxil-converter PUBLIC spirv-module)

add_library(dxil-spirv-c-shared SHARED dxil_spirv_c.h dxil_spirv_c.cpp)
target_include_directories(dxil-spirv-c-shared
        PUBLIC
        $<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}>
        $<INSTALL_INTERFACE:${CMAKE_INSTALL_INCLUDEDIR}/dxil-spirv>)
target_link_libraries(dxil-spirv-c-shared PRIVATE dxil-debug dxil-converter external::llvm dxil-utils)

target_compile_options(dxil-spirv-c-shared PRIVATE ${DXIL_SPV_CXX_FLAGS})
target_compile_definitions(dxil-spirv-c-shared PRIVATE DXIL_SPV_EXPORT_SYMBOLS)
set_target_properties(dxil-spirv-c-shared PROPERTIES PUBLIC_HEADERS dxil_spirv_c.h)

# If we're linking in full LLVM statically, ensure we don't export all LLVM symbols.
if (NOT MSVC AND DXIL_SPIRV_NATIVE_LLVM)
    set_target_properties(dxil-spirv-c-shared PROPERTIES LINK_FLAGS "-Wl,--version-script ${CMAKE_CURRENT_SOURCE_DIR}/link.T")
endif()

add_library(dxil-spirv-c-static STATIC dxil_spirv_c.h dxil_spirv_c.cpp)
target_include_directories(dxil-spirv-c-static
        PUBLIC
        $<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}>
        $<INSTALL_INTERFACE:${CMAKE_INSTALL_INCLUDEDIR}/dxil-spirv>)
target_link_libraries(dxil-spirv-c-static PRIVATE dxil-debug dxil-converter external::llvm dxil-utils)

target_compile_options(dxil-spirv-c-static PRIVATE ${DXIL_SPV_CXX_FLAGS})
set_target_properties(dxil-spirv-c-static PROPERTIES PUBLIC_HEADERS dxil_spirv_c.h)
set_target_properties(dxil-spirv-c-static PROPERTIES POSITION_INDEPENDENT_CODE ON)

if (DXIL_SPIRV_CLI)
    add_library(cli-parser STATIC
            third_party/cli_parser/cli_parser.hpp
            third_party/cli_parser/cli_parser.cpp)
    target_include_directories(cli-parser PUBLIC ${CMAKE_CURRENT_SOURCE_DIR}/third_party/cli_parser)
    target_link_libraries(cli-parser PUBLIC dxil-debug)
    target_compile_options(cli-parser PRIVATE ${DXIL_SPV_CXX_FLAGS})

    add_executable(dxil-spirv dxil_spirv.cpp)
    add_executable(dxil-extract dxil_extract.cpp)
    target_link_libraries(dxil-spirv PRIVATE dxil-spirv-c-shared cli-parser SPIRV-Tools-static spirv-cross-c dxil-debug)
    target_compile_options(dxil-spirv PRIVATE ${DXIL_SPV_CXX_FLAGS})
    target_link_libraries(dxil-extract PRIVATE dxil-spirv-c-shared cli-parser external::llvm)
    target_compile_options(dxil-extract PRIVATE ${DXIL_SPV_CXX_FLAGS})
endif()

set(DXIL_SPV_VERSION_MAJOR 2)
set(DXIL_SPV_VERSION_MINOR 8)
set(DXIL_SPV_VERSION_PATCH 0)
set(DXIL_SPV_VERSION ${DXIL_SPV_VERSION_MAJOR}.${DXIL_SPV_VERSION_MINOR}.${DXIL_SPV_VERSION_PATCH})
set_target_properties(dxil-spirv-c-shared PROPERTIES
        VERSION ${DXIL_SPV_VERSION}
        SOVERSION ${DXIL_SPV_VERSION_MAJOR})

set(DXIL_SPV_INSTALL_LIB_DIR ${CMAKE_INSTALL_PREFIX}/${CMAKE_INSTALL_LIBDIR})
set(DXIL_SPV_INSTALL_INC_DIR ${CMAKE_INSTALL_PREFIX}/${CMAKE_INSTALL_INCLUDEDIR}/dxil-spirv)
configure_file(${CMAKE_CURRENT_SOURCE_DIR}/pkg-config/dxil-spirv-c-shared.pc.in
               ${CMAKE_CURRENT_BINARY_DIR}/dxil-spirv-c-shared.pc @ONLY)
install(FILES ${CMAKE_CURRENT_BINARY_DIR}/dxil-spirv-c-shared.pc DESTINATION ${CMAKE_INSTALL_PREFIX}/${CMAKE_INSTALL_DATAROOTDIR}/pkgconfig)

if (DXIL_SPIRV_CLI)
    install(TARGETS dxil-spirv RUNTIME DESTINATION ${CMAKE_INSTALL_BINDIR})
    install(TARGETS dxil-extract RUNTIME DESTINATION ${CMAKE_INSTALL_BINDIR})
endif()
install(FILES ${CMAKE_CURRENT_SOURCE_DIR}/dxil_spirv_c.h DESTINATION ${CMAKE_INSTALL_INCLUDEDIR}/dxil-spirv)
install(TARGETS dxil-spirv-c-shared
        EXPORT dxil_spirv_c_sharedConfig
        RUNTIME DESTINATION ${CMAKE_INSTALL_BINDIR}
        LIBRARY DESTINATION ${CMAKE_INSTALL_LIBDIR}
        ARCHIVE DESTINATION ${CMAKE_INSTALL_LIBDIR}
        PUBLIC_HEADER DESTINATION ${CMAKE_INSTALL_INCLUDEDIR}/dxil-spirv)
install(EXPORT dxil_spirv_c_sharedConfig DESTINATION ${CMAKE_INSTALL_DATAROOTDIR}/dxil_spirv_c_shared/cmake)

option(DXIL_SPV_MISC_CLI "Enable misc CLI apps." OFF)

if (DXIL_SPV_MISC_CLI)
    add_executable(structurize-test misc/structurize_test.cpp)
    target_link_libraries(structurize-test PRIVATE dxil-converter SPIRV-Tools-static spirv-cross-c dxil-debug dxil-utils)
    target_compile_options(structurize-test PRIVATE ${DXIL_SPV_CXX_FLAGS})
endif()
