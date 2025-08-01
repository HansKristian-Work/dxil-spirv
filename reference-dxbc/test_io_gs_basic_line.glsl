GLSL:
#version 460
layout(lines) in;
layout(max_vertices = 2, line_strip) out;

out float gl_ClipDistance[2];

layout(location = 2) in vec2 TEXCOORD[2];
layout(location = 3) in vec3 NORMAL[2];
layout(location = 2) out vec2 TEXCOORD_1;
layout(location = 3) out vec3 NORMAL_1;

void main()
{
    uint _32 = 0u;
    for (;;)
    {
        gl_Position.x = gl_in[_32].gl_Position.x;
        gl_Position.y = gl_in[_32].gl_Position.y;
        gl_Position.z = gl_in[_32].gl_Position.z;
        gl_Position.w = gl_in[_32].gl_Position.w;
        NORMAL_1.x = NORMAL[_32].x;
        NORMAL_1.y = NORMAL[_32].y;
        NORMAL_1.z = NORMAL[_32].z;
        gl_ClipDistance[0u] = gl_in[_32].gl_ClipDistance[0u];
        gl_ClipDistance[1u] = gl_in[_32].gl_ClipDistance[1u];
        TEXCOORD_1.x = TEXCOORD[_32].x;
        TEXCOORD_1.y = TEXCOORD[_32].y;
        EmitVertex();
        uint _34 = _32 + 1u;
        if (_34 < 2u)
        {
            _32 = _34;
            continue;
        }
        else
        {
            break;
        }
    }
    EndPrimitive();
}


