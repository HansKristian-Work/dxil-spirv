add_library(bc STATIC
        dxil_bytecode.cpp dxil_bytecode.h
        llvm_bitreader.h llvm_decoder.cpp
        llvm_decoder.h)
target_include_directories(bc PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})

add_library(llvm-bc STATIC
        module_containers.hpp
        module.hpp module.cpp)
target_compile_options(llvm-bc PRIVATE ${DXIL_SPV_CXX_FLAGS})
target_link_libraries(llvm-bc PRIVATE bc dxil-debug)
