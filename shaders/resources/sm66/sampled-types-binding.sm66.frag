Texture2D<float4> tex[] : register(t4, space0);
Buffer<float4> buf[1000] : register(t5, space1);
Texture1D<float4> tex1d : register(t6, space2);

float4 main(uint index : INDEX, float2 uv : UV) : SV_Target
{
	return tex[NonUniformResourceIndex(index)].Load(int3(uv, 0)) +
		buf[NonUniformResourceIndex(index + 1)][int(uv.x)] +
		tex1d.Load(int2(uv));
}
