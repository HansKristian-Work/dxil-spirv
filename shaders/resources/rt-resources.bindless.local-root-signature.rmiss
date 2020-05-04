Texture2D<float4> Tex[2] : register(t0);
Texture2D<float4> TexUnsized[] : register(t0, space1);

Texture2D<float4> TexSBT[] : register(t10, space15);

struct Payload
{
	float4 color;
	int index;
};

[shader("miss")]
void RayMiss(inout Payload payload)
{
	payload.color = Tex[payload.index & 1].Load(int3(0, 0, 0));
	payload.color += TexUnsized[payload.index].Load(int3(0, 0, 0));
	payload.color += TexSBT[payload.index].Load(int3(0, 0, 0));
}
