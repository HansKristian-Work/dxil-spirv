Texture2D<float4> Tex : register(t0);
SamplerState Samp : register(s0, space1);

float4 main(float2 uv : UV) : SV_Target
{
	float4 res = Tex.Sample(Samp, uv);
	res += Tex.Sample(Samp, uv + 0.1);
	return res;
}
