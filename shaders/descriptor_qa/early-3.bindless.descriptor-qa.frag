Texture2D<float4> T : register(t0);
SamplerState S : register(s0);

struct Out { float4 col : SV_Target; float d : SV_Depth; };

Out main(float2 uv : UV)
{
	Out o;
	o.col = T.Sample(S, uv);
	o.d = 0.5;
	return o;
}
