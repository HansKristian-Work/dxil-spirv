RWStructuredBuffer<float4> Tex[] : register(u0, space0);

float4 main(nointerpolation uint index : INDEX) : SV_Target
{
	return Tex[index][index];
}
