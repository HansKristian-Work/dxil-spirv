GLSL:
#version 460
#ifdef GL_ARB_fragment_shader_interlock
#extension GL_ARB_fragment_shader_interlock : enable
#define SPIRV_Cross_beginInvocationInterlock() beginInvocationInterlockARB()
#define SPIRV_Cross_endInvocationInterlock() endInvocationInterlockARB()
#elif defined(GL_INTEL_fragment_shader_ordering)
#extension GL_INTEL_fragment_shader_ordering : enable
#define SPIRV_Cross_beginInvocationInterlock() beginFragmentShaderOrderingINTEL()
#define SPIRV_Cross_endInvocationInterlock()
#endif
#if defined(GL_ARB_fragment_shader_interlock)
layout(pixel_interlock_ordered) in;
#elif !defined(GL_INTEL_fragment_shader_ordering)
#error Fragment Shader Interlock/Ordering extension missing!
#endif

layout(set = 0, binding = 0, r32f) uniform image2D _8;

void main()
{
    uint _18 = uint(int(gl_FragCoord.y));
    uint _22 = uint(int(gl_FragCoord.x));
    SPIRV_Cross_beginInvocationInterlock();
    vec4 _25 = imageLoad(_8, ivec2(uvec2(_22, _18)));
    float _28 = _25.x;
    vec4 _32 = vec4(_28, _25.yzw);
    _32.x = _28 * 2.0;
    imageStore(_8, ivec2(uvec2(_22, _18)), vec4(_32));
    SPIRV_Cross_endInvocationInterlock();
}


