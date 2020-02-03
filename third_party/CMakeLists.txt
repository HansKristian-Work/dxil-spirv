add_subdirectory(spirv-headers EXCLUDE_FROM_ALL)
set(SPIRV-Headers_SOURCE_DIR "${CMAKE_CURRENT_SOURCE_DIR}/spirv-headers" CACHE STRING "SPIRV-Headers path" FORCE)

add_library(dxil-spirv-headers INTERFACE)
target_include_directories(dxil-spirv-headers INTERFACE
        ${CMAKE_CURRENT_SOURCE_DIR}/spirv-headers/include/spirv/unified1)

if (DXIL_SPIRV_CLI)
    add_subdirectory(SPIRV-Tools EXCLUDE_FROM_ALL)
    add_subdirectory(SPIRV-Cross EXCLUDE_FROM_ALL)
endif()

add_library(glslang-spirv-builder STATIC
        glslang-spirv/spvIR.h
        glslang-spirv/Logger.cpp
        glslang-spirv/Logger.h
        glslang-spirv/InReadableOrder.cpp
        glslang-spirv/SpvBuilder.h
        glslang-spirv/SpvBuilder.cpp)
set_target_properties(glslang-spirv-builder PROPERTIES POSITION_INDEPENDENT_CODE ON)

target_include_directories(glslang-spirv-builder PUBLIC
        ${CMAKE_CURRENT_SOURCE_DIR}/glslang-spirv)
target_link_libraries(glslang-spirv-builder PUBLIC dxil-spirv-headers)

message(STATUS "Building LLVM from submodule.")

# Disable everything we can.
set(LLVM_TARGETS_TO_BUILD "" CACHE INTERNAL "")
set(LLVM_BUILD_RUNTIME OFF)
set(LLVM_BUILD_TOOLS OFF)
set(LLVM_INCLUDE_BENCHMARKS OFF)
set(LLVM_INCLUDE_DOCS OFF)
set(LLVM_INCLUDE_EXAMPLES OFF)
set(LLVM_INCLUDE_TESTS OFF)
set(LLVM_INCLUDE_TOOLS OFF)
set(LLVM_INCLUDE_UTILS OFF)
set(LLVM_ENABLE_OCAMLDOC OFF)
set(LLVM_ENABLE_BINDINGS OFF)
set(LLVM_ENABLE_THREADS OFF)
set(LLVM_ENABLE_LIBPFM OFF)
set(LLVM_ENABLE_TERMINFO OFF)
set(LLVM_ENABLE_WARNINGS OFF)
set(LLVM_ENABLE_PEDANTIC OFF)
set(LLVM_POLLY_LINK_INTO_TOOLS OFF)
set(LLVM_POLLY_BUILD OFF)
set(WITH_POLLY OFF)
set(LLVM_ENABLE_Z3_SOLVER OFF)

# Need to build out-of-tree.
add_subdirectory(${CMAKE_CURRENT_SOURCE_DIR}/llvm ${CMAKE_CURRENT_BINARY_DIR}/llvm_build EXCLUDE_FROM_ALL)

set(LLVM_DIR "${CMAKE_CURRENT_BINARY_DIR}/llvm_build/lib/cmake/llvm/")

find_package(LLVM CONFIG)
if (NOT LLVM_FOUND)
	message(FATAL_ERROR "Could not build LLVM from the submodule. Run `git submodule update --init` first.")
endif()

llvm_map_components_to_libnames(third_party_llvm_libs Core IRReader Support)
add_library(third_party_llvm INTERFACE)
target_link_libraries(third_party_llvm INTERFACE ${third_party_llvm_libs})
target_include_directories(third_party_llvm INTERFACE ${LLVM_INCLUDE_DIRS})
target_compile_definitions(third_party_llvm INTERFACE ${LLVM_DEFINITIONS})
add_library(third_party::llvm ALIAS third_party_llvm)
