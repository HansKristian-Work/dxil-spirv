Texture2D<float4> T : register(t0);
SamplerState S : register(s0);

struct Out { float4 col : SV_Target; uint d : SV_Coverage; };

Out main(float2 uv : UV)
{
	Out o;
	o.col = T.Sample(S, uv);
	o.d = 3;
	return o;
}
