Texture2D<float4> T : register(t0);
SamplerState S : register(s0);
RWTexture2D<float4> U : register(u0);

float4 main(float2 uv : UV) : SV_Target
{
	if (uv.x < 0.0)
		U[int2(uv)] = 2.0.xxxx;
	return T.Sample(S, uv);
}
