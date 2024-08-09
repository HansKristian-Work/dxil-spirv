project('dxil-spirv', ['cpp'], version : '0.0', meson_version : '>= 0.49', default_options : ['b_ndebug=if-release'])

dxil_spirv_compiler      = meson.get_compiler('cpp')
dxil_spirv_cpp_std       = 'c++14'
dxil_spirv_warning_level = '2' # Equivelant of -Wall -Wextra

add_project_arguments('-DAMD_EXTENSIONS',          language : 'cpp')
add_project_arguments('-DHAVE_LLVMBC',             language : 'cpp')
add_project_arguments('-DNOMINMAX',                language : 'cpp')

dxil_spirv_include_dirs = include_directories([
  'bc',
  'debug',
  'util',
  'third_party/bc-decoder',
  'third_party/glslang-spirv',
  'third_party/spirv-headers/include/spirv/unified1',
])

add_project_arguments(dxil_spirv_compiler.get_supported_arguments([
    '-Wno-missing-field-initializers',
    '-Wno-empty-body',
    '-Wno-unused-parameter',
    '-fno-exceptions',
    '-fvisibility=hidden',
    '/wd4267',   # Narrowing conversions
    '/wd4244',   # Narrowing conversions
    '/wd4996']), # Secure no warnings
  language : 'cpp')

dxil_spirv_src = [
  # dxil-spirv-c
  'dxil_spirv_c.cpp',

  # bc-decoder
  'third_party/bc-decoder/llvm_decoder.cpp',

  # glslang-spirv-builder
  'third_party/glslang-spirv/Logger.cpp',
  'third_party/glslang-spirv/InReadableOrder.cpp',
  'third_party/glslang-spirv/SpvBuilder.cpp',

  # llvm-bc
  'bc/value.cpp',
  'bc/instruction.cpp',
  'bc/function.cpp',
  'bc/context.cpp',
  'bc/type.cpp',
  'bc/module.cpp',
  'bc/metadata.cpp',
  'bc/disassembler.cpp',

  # spirv-module
  'spirv_module.cpp',
  'descriptor_qa.cpp',

  # dxil-converter
  'memory_stream.cpp',
  'llvm_bitcode_parser.cpp',

  'dxil_converter.cpp',
  'cfg_structurizer.cpp',
  'node_pool.cpp',
  'node.cpp',
  'dxil_parser.cpp',

  'opcodes/dxil/dxil_common.cpp',
  'opcodes/dxil/dxil_resources.cpp',
  'opcodes/dxil/dxil_compute.cpp',
  'opcodes/dxil/dxil_arithmetic.cpp',
  'opcodes/dxil/dxil_pixel_ops.cpp',
  'opcodes/dxil/dxil_geometry.cpp',
  'opcodes/dxil/dxil_tessellation.cpp',
  'opcodes/dxil/dxil_waveops.cpp',
  'opcodes/dxil/dxil_sampling.cpp',
  'opcodes/dxil/dxil_buffer.cpp',
  'opcodes/dxil/dxil_ray_tracing.cpp',
  'opcodes/dxil/dxil_mesh.cpp',
  'opcodes/opcodes_llvm_builtins.cpp',
  'opcodes/opcodes_dxil_builtins.cpp',

  # dxil-utils
  'util/thread_local_allocator.cpp',

  # debug
  'debug/logging.cpp',
]

dxil_spirv_lib = static_library('dxil-spirv', dxil_spirv_src,
  include_directories : dxil_spirv_include_dirs,
  override_options    : [
    'cpp_std='       + dxil_spirv_cpp_std,
    'warning_level=' + dxil_spirv_warning_level
  ])

dxil_spirv_dep = declare_dependency(
  include_directories : include_directories('.'),
  link_with           : [ dxil_spirv_lib ])
