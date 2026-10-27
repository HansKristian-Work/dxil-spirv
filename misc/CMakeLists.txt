include(FindPkgConfig)

add_library(fuzz-emitter STATIC fuzz_emitter.hpp fuzz_emitter.cpp)
target_link_libraries(fuzz-emitter PUBLIC dxil-converter dxil-utils dxil-debug SPIRV-Tools-static)

pkg_check_modules(VULKAN REQUIRED IMPORTED_TARGET vulkan)
add_executable(structurize-test structurize_test.cpp)
target_link_libraries(structurize-test PRIVATE fuzz-emitter dxil-converter SPIRV-Tools-static spirv-cross-c dxil-debug dxil-utils cli-parser PkgConfig::VULKAN)
target_compile_options(structurize-test PRIVATE ${DXIL_SPV_CXX_FLAGS})

if (DXIL_SPV_FUZZ_CLI)
    add_granite_offline_tool(structurize-fuzzer fuzzer.cpp)
    target_link_libraries(structurize-fuzzer PRIVATE fuzz-emitter)
endif()
