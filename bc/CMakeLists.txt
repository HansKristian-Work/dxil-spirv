add_library(bc STATIC
        dxil_bytecode.cpp dxil_bytecode.h
        llvm_bitreader.h llvm_decoder.cpp
        llvm_decoder.h)
target_include_directories(bc PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})