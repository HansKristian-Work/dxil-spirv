Texture2D<float4> T : register(t0);
SamplerState S : register(s0);

float4 main(float2 uv : UV) : SV_Target
{
	return T.Sample(S, uv);
}
