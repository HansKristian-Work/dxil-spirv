Texture3D<float4> tex[] : register(t1);
SamplerState samp[] : register(s4);

float4 main(uint index : INDEX, float3 uv : UV) : SV_Target
{
	return tex[index].Sample(samp[index], uv);
}
