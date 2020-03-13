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

