SamplerState Samp : register(s3);
SamplerState SampArray[64] : register(s4);
SamplerState SampBindless[] : register(s100);

Texture2D<float4> Tex : register(t0);

cbuffer BUFFER : register(b0)
{
	uint index;
};

float4 main(float2 uv : UV, nointerpolation uint dynamic_index : INDEX) : SV_Target
{
	float4 result = Tex.Sample(Samp, uv);
	result += Tex.Sample(SampArray[1], uv);
	result += Tex.Sample(SampArray[index], uv);
	result += Tex.Sample(SampBindless[NonUniformResourceIndex(dynamic_index)], uv);
	return result;
}
