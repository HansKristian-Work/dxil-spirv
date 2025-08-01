GLSL:
#version 460
layout(lines_adjacency) in;
layout(max_vertices = 4, line_strip) out;

out float gl_ClipDistance[2];

layout(location = 2) in vec2 TEXCOORD[4];
layout(location = 3) in vec3 NORMAL[4];
layout(location = 2) out vec2 TEXCOORD_1;
layout(location = 3) out vec3 NORMAL_1;

void main()
{
    uint _33 = 0u;
    for (;;)
    {
        gl_Position.x = gl_in[_33].gl_Position.x;
        gl_Position.y = gl_in[_33].gl_Position.y;
        gl_Position.z = gl_in[_33].gl_Position.z;
        gl_Position.w = gl_in[_33].gl_Position.w;
        NORMAL_1.x = NORMAL[_33].x;
        NORMAL_1.y = NORMAL[_33].y;
        NORMAL_1.z = NORMAL[_33].z;
        gl_ClipDistance[0u] = gl_in[_33].gl_ClipDistance[0u];
        gl_ClipDistance[1u] = gl_in[_33].gl_ClipDistance[1u];
        TEXCOORD_1.x = TEXCOORD[_33].x;
        TEXCOORD_1.y = TEXCOORD[_33].y;
        EmitVertex();
        uint _35 = _33 + 1u;
        if (_35 < 4u)
        {
            _33 = _35;
            continue;
        }
        else
        {
            break;
        }
    }
    EndPrimitive();
}


